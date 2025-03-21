
/**
 * Supabase client və köməkçi funksiyalar
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  handleSupabaseError,
  checkConnection
} from '@/lib/supabase'; 

// Import cache utilities from their proper location
import { 
  isOfflineMode,
  queryWithCache,
  withRetry,
  CACHE_CONFIG 
} from '@/lib/supabase/cache';

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

// Export helper functions for query building
export const buildPaginatedQuery = (query: any, page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
};

export const buildSortedQuery = (query: any, field: string, ascending: boolean = true) => {
  return query.order(field, { ascending });
};

export const buildFilteredQuery = (query: any, filters: Record<string, any>) => {
  let result = query;
  
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    if (typeof value === 'string' && value.startsWith('%') && value.endsWith('%')) {
      result = result.ilike(key, value);
    } else {
      result = result.eq(key, value);
    }
  }
  
  return result;
};

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
