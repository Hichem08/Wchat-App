/**
 * @file userService.ts
 * Future Backend Integration: Supabase profiles table
 */

import { User } from '../types';

export const userService = {
  async searchUsers(query: string, searchBy: 'all' | 'matricule' | 'phone' = 'all'): Promise<User[]> {
    console.log('[userService] searchUsers mock:', { query, searchBy });
    return [];
  },

  async syncPhoneContacts(phoneNumbers: string[]): Promise<User[]> {
    console.log('[userService] syncPhoneContacts mock:', phoneNumbers.length);
    return [];
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    console.log('[userService] updateProfile mock:', userId, updates);
    return null;
  },
};
