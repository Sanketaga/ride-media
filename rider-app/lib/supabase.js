import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// NEVER hardcode keys — use EXPO_PUBLIC_ env (public anon only)
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('Missing EXPO_PUBLIC_SUPABASE_URL / ANON_KEY — copy .env.example to .env');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: {
      getItem: (key) => SecureStore.getItemAsync(key),
      setItem: (key, value) => SecureStore.setItemAsync(key, value),
      removeItem: (key) => SecureStore.deleteItemAsync(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
