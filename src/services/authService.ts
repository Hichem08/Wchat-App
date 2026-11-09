/**
 * @file authService.ts
 * Future Backend Integration: Supabase Authentication
 * Ready for Supabase Auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`, `supabase.auth.signOut`)
 */

import { User } from '../types';

export interface AuthResponse {
  user: User | null;
  token?: string;
  error?: string;
}

export const authService = {
  async signUp(email: string, password: string, metadata: { fullName: string; phone: string; matricule?: string }): Promise<AuthResponse> {
    // TODO: Connect with `supabase.auth.signUp({ email, password, options: { data: metadata } })`
    console.log('[authService] signUp mock called with:', email, metadata);
    return {
      user: {
        id: 'user_' + Date.now(),
        name: metadata.fullName,
        email,
        phone: metadata.phone,
        matricule: metadata.matricule,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isOnline: true,
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  async logIn(emailOrPhone: string, _password?: string): Promise<AuthResponse> {
    // TODO: Connect with `supabase.auth.signInWithPassword(...)`
    console.log('[authService] logIn mock called with:', emailOrPhone);
    return {
      user: {
        id: 'user_current',
        name: 'Hichem Bendali',
        email: emailOrPhone.includes('@') ? emailOrPhone : 'hichembendali08@gmail.com',
        phone: !emailOrPhone.includes('@') ? emailOrPhone : '+33 6 12 34 56 78',
        matricule: '2025005',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isOnline: true,
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  async logOut(): Promise<void> {
    // TODO: Connect with `supabase.auth.signOut()`
    console.log('[authService] logOut mock called');
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    // TODO: Connect with `supabase.auth.resetPasswordForEmail(email)`
    console.log('[authService] resetPassword called for:', email);
    return { success: true, message: 'Password reset link sent' };
  },
};
