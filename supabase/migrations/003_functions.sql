-- ==========================================================
-- Migration 003: Functions and Triggers
-- ==========================================================

-- 1. AUTOMATIC PROFILE CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_full_name TEXT;
    v_matricule TEXT;
    v_phone TEXT;
    v_username TEXT;
BEGIN
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    v_matricule := NEW.raw_user_meta_data->>'matricule';
    v_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone');
    v_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 4));

    INSERT INTO public.profiles (
        id,
        full_name,
        username,
        email,
        phone,
        matricule,
        avatar_url,
        bio,
        language,
        is_online,
        last_seen,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        v_full_name,
        v_username,
        NEW.email,
        v_phone,
        v_matricule,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
        'Living the future with Wchat 💜',
        'en',
        true,
        NOW(),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. 24-HOUR MESSAGE CLEANUP FUNCTION
CREATE OR REPLACE FUNCTION public.cleanup_expired_messages()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.messages
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNCTION TO GET OR CREATE PRIVATE CHAT WITHOUT DUPLICATES
CREATE OR REPLACE FUNCTION public.get_or_create_private_chat(other_user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_current_user UUID := auth.uid();
    v_chat_id UUID;
BEGIN
    IF v_current_user IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Look for existing private chat between these two users
    SELECT c.id INTO v_chat_id
    FROM public.chats c
    JOIN public.chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id = v_current_user
    JOIN public.chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id = other_user_id
    WHERE c.type = 'private'
    LIMIT 1;

    -- If not found, create new private chat
    IF v_chat_id IS NULL THEN
        INSERT INTO public.chats (type, created_by)
        VALUES ('private', v_current_user)
        RETURNING id INTO v_chat_id;

        INSERT INTO public.chat_members (chat_id, user_id, role)
        VALUES 
            (v_chat_id, v_current_user, 'member'),
            (v_chat_id, other_user_id, 'member');
    END IF;

    RETURN v_chat_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
