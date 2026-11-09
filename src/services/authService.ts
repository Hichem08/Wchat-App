import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User } from '../types';

export interface AuthResponse {
  user: User | null;
  token?: string;
  error?: string;
}

export const authService = {
  async signUp(
    email: string,
    password: string,
    metadata: { fullName: string; phone: string; matricule?: string }
  ): Promise<AuthResponse> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: metadata.fullName,
              phone: metadata.phone,
              matricule: metadata.matricule,
            },
          },
        });

        if (error) {
          return { user: null, error: error.message };
        }

        const authUser = data.user;
        const user: User = {
          id: authUser?.id || 'user_' + Date.now(),
          name: metadata.fullName,
          email,
          phone: metadata.phone,
          matricule: metadata.matricule,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          isOnline: true,
          statusText: 'Living the future with Wchat 💜',
        };

        return { user, token: data.session?.access_token };
      } catch (err: any) {
        return { user: null, error: err.message };
      }
    }

    // Local state fallback for immediate testing
    return {
      user: {
        id: 'user_' + Date.now(),
        name: metadata.fullName,
        email,
        phone: metadata.phone,
        matricule: metadata.matricule,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isOnline: true,
        statusText: 'Living the future with Wchat 💜',
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  async logIn(emailOrPhone: string, password?: string): Promise<AuthResponse> {
    if (isSupabaseConfigured() && emailOrPhone.includes('@') && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailOrPhone,
          password,
        });

        if (error) {
          return { user: null, error: error.message };
        }

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          name: profile?.full_name || data.user.user_metadata?.full_name || 'Hichem Bendali',
          email: data.user.email,
          phone: profile?.phone || '+33 6 12 34 56 78',
          matricule: profile?.matricule || '2025005',
          avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          isOnline: true,
          statusText: profile?.bio || 'Living the future with Wchat 💜',
        };

        return { user, token: data.session?.access_token };
      } catch (err: any) {
        return { user: null, error: err.message };
      }
    }

    // Local demo login fallback
    return {
      user: {
        id: 'user_current',
        name: 'Hichem Bendali',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'hichembendali08@gmail.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '+33 6 12 34 56 78',
        matricule: '2025005',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isOnline: true,
        statusText: 'Living the future with Wchat 💜',
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  async logOut(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },

  async getSession() {
    if (isSupabaseConfigured()) {
      return await supabase.auth.getSession();
    }
    return { data: { session: null }, error: null };
  },
};
