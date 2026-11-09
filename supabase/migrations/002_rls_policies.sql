-- ==========================================================
-- Migration 002: Row Level Security (RLS) Policies
-- ==========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------
-- Any authenticated user can search and view profiles
CREATE POLICY "Public profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------
-- FRIENDSHIPS POLICIES
-- ----------------------------------------------------------
-- Users can view friendships they are part of
CREATE POLICY "Users can view their own friendships"
ON public.friendships FOR SELECT
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can send friend requests as requester
CREATE POLICY "Users can create friend requests"
ON public.friendships FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requester_id);

-- Receiver can accept/reject/block; requester can cancel
CREATE POLICY "Users can update their friendships"
ON public.friendships FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id)
WITH CHECK (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Users can delete a friendship (unfriend/cancel request)
CREATE POLICY "Users can delete their friendships"
ON public.friendships FOR DELETE
TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- ----------------------------------------------------------
-- CHATS & CHAT MEMBERS POLICIES
-- ----------------------------------------------------------
-- Helper function to check if user is in a chat
CREATE OR REPLACE FUNCTION public.is_chat_member(chat_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.chat_members
    WHERE chat_id = chat_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users can view chats they are members of
CREATE POLICY "Users can view chats they belong to"
ON public.chats FOR SELECT
TO authenticated
USING (public.is_chat_member(id, auth.uid()));

-- Authenticated users can create chats
CREATE POLICY "Users can create chats"
ON public.chats FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Chat members can view member lists
CREATE POLICY "Chat members can view other members in same chat"
ON public.chat_members FOR SELECT
TO authenticated
USING (public.is_chat_member(chat_id, auth.uid()));

-- Authenticated users can join/add members
CREATE POLICY "Users can add chat members"
ON public.chat_members FOR INSERT
TO authenticated
WITH CHECK (
    -- User joining self OR creator/admin adding members
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.chats WHERE id = chat_id AND created_by = auth.uid()
    ) OR
    EXISTS (
        SELECT 1 FROM public.chat_members WHERE chat_id = chat_id AND user_id = auth.uid() AND role = 'admin'
    )
);

-- ----------------------------------------------------------
-- MESSAGES POLICIES
-- ----------------------------------------------------------
-- Members can view messages of their chat that have not expired
CREATE POLICY "Chat members can view valid messages"
ON public.messages FOR SELECT
TO authenticated
USING (
    public.is_chat_member(chat_id, auth.uid()) AND
    (expires_at IS NULL OR expires_at > NOW()) AND
    deleted_at IS NULL
);

-- Chat members can insert messages as themselves
CREATE POLICY "Chat members can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
    public.is_chat_member(chat_id, auth.uid()) AND
    sender_id = auth.uid()
);

-- Users can soft delete their own messages
CREATE POLICY "Users can delete their own messages"
ON public.messages FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- ----------------------------------------------------------
-- MESSAGE READS POLICIES
-- ----------------------------------------------------------
CREATE POLICY "Users can view read receipts for their chats"
ON public.message_reads FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.messages m
        WHERE m.id = message_id AND public.is_chat_member(m.chat_id, auth.uid())
    )
);

CREATE POLICY "Users can insert their own read receipts"
ON public.message_reads FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ----------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ----------------------------------------------------------
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ----------------------------------------------------------
-- CALLS POLICIES
-- ----------------------------------------------------------
CREATE POLICY "Participants can view their calls"
ON public.calls FOR SELECT
TO authenticated
USING (caller_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can initiate calls as caller"
ON public.calls FOR INSERT
TO authenticated
WITH CHECK (caller_id = auth.uid());

CREATE POLICY "Participants can update call status"
ON public.calls FOR UPDATE
TO authenticated
USING (caller_id = auth.uid() OR receiver_id = auth.uid())
WITH CHECK (caller_id = auth.uid() OR receiver_id = auth.uid());
