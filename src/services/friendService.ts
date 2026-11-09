import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User } from '../types';
import { MOCK_USERS } from '../constants/mockData';

export const friendService = {
  async getFriends(userId: string): Promise<{ friends: User[]; pending: any[] }> {
    if (!isSupabaseConfigured()) {
      return { friends: MOCK_USERS, pending: [] };
    }

    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          requester_id,
          receiver_id,
          requester:profiles!requester_id(*),
          receiver:profiles!receiver_id(*)
        `)
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

      if (error || !data) return { friends: MOCK_USERS, pending: [] };

      const friends: User[] = [];
      const pending: any[] = [];

      data.forEach((f: any) => {
        const isRequester = f.requester_id === userId;
        const other = isRequester ? f.receiver : f.requester;
        if (!other) return;

        const mapped: User = {
          id: other.id,
          name: other.full_name,
          email: other.email,
          phone: other.phone,
          matricule: other.matricule,
          avatar: other.avatar_url,
          isOnline: other.is_online,
          statusText: other.bio,
        };

        if (f.status === 'accepted') {
          friends.push(mapped);
        } else if (f.status === 'pending') {
          pending.push({ friendshipId: f.id, ...mapped, isIncoming: !isRequester });
        }
      });

      return { friends, pending };
    } catch {
      return { friends: MOCK_USERS, pending: [] };
    }
  },

  async sendFriendRequest(receiverId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase.from('friendships').insert({
        requester_id: user.id,
        receiver_id: receiverId,
        status: 'pending',
      });

      return !error;
    } catch {
      return false;
    }
  },

  async acceptFriendRequest(friendshipId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', friendshipId);

      return !error;
    } catch {
      return false;
    }
  },
};
