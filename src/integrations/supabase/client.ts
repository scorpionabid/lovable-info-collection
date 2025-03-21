
/**
 * Supabase client və köməkçi funksiyalar
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  handleSupabaseError,
  isOfflineMode,
  queryWithCache,
  withRetry,
  checkConnection,
  CACHE_CONFIG
} from '@/lib/supabase'; 

// Mərkəzi supabase müştərisi
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'infoLine' }
  }
});

// Utility functions
export { 
  handleSupabaseError,
  isOfflineMode,
  queryWithCache,
  withRetry,
  checkConnection,
  CACHE_CONFIG
};

export default supabase;
