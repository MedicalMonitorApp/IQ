import { createClient } from '@supabase/supabase-js';

// Default Supabase configuration parameters (can be configured via environment variables or settings)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xyzmedmonitor.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockKeyForTesting12345';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper check if Supabase is connected to a live custom instance
export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('xyzmedmonitor')
  );
};
