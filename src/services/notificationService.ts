import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface WchatNotification {
  id: string;
  type: 'message' | 'friend_request' | 'friend_accepted' | 'group_invite' | 'call';
  title: string;
  body: string;
  data?: any;
  createdAt: number;
}

export const notificationService = {
  async registerPushToken(token: string) {
    console.log('[NotificationService] Registering push token:', token);
    if (!isSupabaseConfigured()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Store in profiles metadata or dedicated push_tokens table
      await supabase.from('profiles').update({
        bio: `Push token active`,
      }).eq('id', user.id);
    } catch (err: any) {
      console.warn('[NotificationService Error]:', err.message);
    }
  },

  async getNotifications(userId: string): Promise<WchatNotification[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error || !data) return [];

      return data.map((n: any) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        data: n.data,
        createdAt: new Date(n.created_at).getTime(),
      }));
    } catch {
      return [];
    }
  },
};
