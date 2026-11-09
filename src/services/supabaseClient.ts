import { createClient } from '@supabase/supabase-js';

// Read from Expo public environment variables or Vite client env
const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://tpfdzrqlanumduiyxwmc.supabase.co';

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_oaIHKFoUsjPvHTBjILCa7Q_fpkHhaiY';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    !supabaseUrl.includes('your-supabase-project') &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey.includes('placeholder-anon-key')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
