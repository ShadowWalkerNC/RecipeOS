import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Deep-link redirect URI used when sending magic links
// Resolves to recipeos://auth/callback on device, http://localhost:8081 in web mode
export const authRedirectUri = Platform.OS === 'web'
  ? `${supabaseUrl.replace('supabase.co', 'vercel.app')}/auth/callback`
  : makeRedirectUri({ scheme: 'recipeos', path: 'auth/callback' });

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: Platform.OS !== 'web' ? AsyncStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
