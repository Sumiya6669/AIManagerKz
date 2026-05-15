import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function getSupabaseConfigError() {
  if (supabaseUrl && !isValidHttpUrl(supabaseUrl)) return 'VITE_SUPABASE_URL must be a valid http(s) URL.';
  if (supabaseAnonKey && /sb_secret|service_role|supabase_service/i.test(supabaseAnonKey)) {
    return 'VITE_SUPABASE_ANON_KEY must be a public anon/publishable key, not a secret/service-role key.';
  }
  return null;
}

export const supabaseConfigError = getSupabaseConfigError();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseConfigError);

function createSupabaseClient() {
  if (!isSupabaseConfigured) {
    if (supabaseConfigError) {
      console.warn('[Reserva Flow AI] Supabase configuration ignored', { supabaseConfigError });
    }
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.error('[Reserva Flow AI] Supabase client initialization failed', error);
    return null;
  }
}

export const supabase = createSupabaseClient();
