import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User } from '../types';

export const profileService = {
  async getProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.full_name,
        email: data.email,
        phone: data.phone,
        matricule: data.matricule,
        avatar: data.avatar_url,
        isOnline: data.is_online,
        statusText: data.bio,
        lastSeen: data.last_seen,
      };
    } catch {
      return null;
    }
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    if (!isSupabaseConfigured()) return true;

    try {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.matricule) dbUpdates.matricule = updates.matricule;
      if (updates.avatar) dbUpdates.avatar_url = updates.avatar;
      if (updates.statusText) dbUpdates.bio = updates.statusText;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId);

      return !error;
    } catch {
      return false;
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    if (!isSupabaseConfigured() || !query.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${query}%,matricule.ilike.%${query}%,phone.ilike.%${query}%`)
        .limit(20);

      if (error || !data) return [];

      return data.map((d: any) => ({
        id: d.id,
        name: d.full_name,
        email: d.email,
        phone: d.phone,
        matricule: d.matricule,
        avatar: d.avatar_url,
        isOnline: d.is_online,
        statusText: d.bio,
      }));
    } catch {
      return [];
    }
  },
};
