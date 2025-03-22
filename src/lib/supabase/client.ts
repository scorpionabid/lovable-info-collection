
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from '@/lib/supabase/config';
import type { Database } from '@/types/supabase';

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_CONFIG
);

// Error handling utility
export const handleSupabaseError = (error: any, context: string = 'Supabase operation'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Unknown Supabase error'
  );
  
  console.error(`${context} error:`, error);
  return formattedError;
};

// Retry mechanism
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  while (retries <= maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      const delay = 1000 * Math.pow(1.5, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Connection check utility
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

// Additional utilities that might be used
export const isOfflineMode = (): boolean => {
  return !navigator.onLine;
};

export const queryWithCache = async <T>(
  key: string, 
  queryFn: () => Promise<T>, 
  ttlSeconds = 300
): Promise<T> => {
  // Implement caching logic here if needed
  return queryFn();
};

export const buildPaginatedQuery = (query: any, pagination: { page: number; pageSize: number }) => {
  const { page, pageSize } = pagination;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  return query.range(from, to);
};

export const buildSortedQuery = (query: any, sort: { column?: string; direction?: 'asc' | 'desc' }) => {
  if (sort.column) {
    return query.order(sort.column, { ascending: sort.direction === 'asc' });
  }
  return query;
};

export const buildFilteredQuery = (query: any, filters: Record<string, any>) => {
  let filteredQuery = query;
  
  // Add common filter logic
  if (filters.search) {
    filteredQuery = filteredQuery.ilike('name', `%${filters.search}%`);
  }
  
  // Add other common filters
  
  return filteredQuery;
};

export default supabase;
