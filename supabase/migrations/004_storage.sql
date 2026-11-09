-- ==========================================================
-- Migration 004: Supabase Storage Buckets and Security Policies
-- ==========================================================

-- 1. INSERT STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('avatars', 'avatars', true),
    ('chat-files', 'chat-files', true),
    ('chat-images', 'chat-images', true),
    ('chat-audio', 'chat-audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. STORAGE POLICIES
-- Anyone authenticated can view avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Users can upload their own avatar
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Chat media viewing
CREATE POLICY "Chat images are accessible by authenticated users"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id IN ('chat-images', 'chat-files', 'chat-audio'));

-- Chat media upload
CREATE POLICY "Authenticated users can upload chat media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('chat-images', 'chat-files', 'chat-audio'));
