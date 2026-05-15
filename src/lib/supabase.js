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

export const supabaseConfigError = supabaseUrl && !isValidHttpUrl(supabaseUrl)
  ? 'VITE_SUPABASE_URL must be a valid http(s) URL.'
  : null;

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
