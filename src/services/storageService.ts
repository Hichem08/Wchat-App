import { supabase, isSupabaseConfigured } from './supabaseClient';

export type StorageBucket = 'avatars' | 'chat-images' | 'chat-files' | 'chat-audio';

export const storageService = {
  async uploadFile(
    bucket: StorageBucket,
    filePath: string,
    file: Blob | File | ArrayBuffer
  ): Promise<{ publicUrl: string | null; error: string | null }> {
    if (!isSupabaseConfigured()) {
      // Return local object URL for preview testing
      if (file instanceof Blob) {
        return { publicUrl: URL.createObjectURL(file), error: null };
      }
      return { publicUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', error: null };
    }

    try {
      const cleanPath = filePath.replace(/^\/+/, '');
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(cleanPath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error || !data) {
        return { publicUrl: null, error: error?.message || 'Upload failed' };
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { publicUrl: urlData.publicUrl, error: null };
    } catch (err: any) {
      return { publicUrl: null, error: err.message };
    }
  },

  async uploadAvatar(userId: string, imageBlob: Blob): Promise<string | null> {
    const ext = imageBlob.type === 'image/png' ? 'png' : 'jpg';
    const filePath = `${userId}/avatar_${Date.now()}.${ext}`;
    const { publicUrl } = await this.uploadFile('avatars', filePath, imageBlob);
    return publicUrl;
  },

  async uploadChatImage(chatId: string, imageBlob: Blob): Promise<string | null> {
    const filePath = `${chatId}/img_${Date.now()}.jpg`;
    const { publicUrl } = await this.uploadFile('chat-images', filePath, imageBlob);
    return publicUrl;
  },

  async uploadChatAudio(chatId: string, audioBlob: Blob): Promise<string | null> {
    const filePath = `${chatId}/voice_${Date.now()}.m4a`;
    const { publicUrl } = await this.uploadFile('chat-audio', filePath, audioBlob);
    return publicUrl;
  },
};
