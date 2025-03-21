
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/config';

// Create a single supabase client for application
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Re-export withRetry, queryWithCache, and isOfflineMode from lib/supabase
export { withRetry, queryWithCache, isOfflineMode, checkConnection } from '@/lib/supabase';

// Helper functions for building queries
export function buildPaginatedQuery(query: any, page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
}

export function buildSortedQuery(query: any, sortField: string, sortDirection: 'asc' | 'desc') {
  return query.order(sortField, { ascending: sortDirection === 'asc' });
}

export function buildFilteredQuery(query: any, filters: Record<string, any>) {
  let filteredQuery = query;
  
  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'string' && value.startsWith('%') && value.endsWith('%')) {
        filteredQuery = filteredQuery.ilike(key, value);
      } else {
        filteredQuery = filteredQuery.eq(key, value);
      }
    }
  });
  
  return filteredQuery;
}

// Helper for creating paginated responses
export async function createPaginatedQuery<T>(
  query: any,
  countQuery: any,
  page: number,
  pageSize: number
): Promise<{ data: T[]; count: number; error: any }> {
  try {
    // Get count first
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      return { data: [], count: 0, error: countError };
    }
    
    // Get data with pagination
    const paginatedQuery = buildPaginatedQuery(query, page, pageSize);
    const { data, error } = await paginatedQuery;
    
    return {
      data: data || [],
      count: count || 0,
      error
    };
  } catch (error) {
    console.error('Error in paginated query:', error);
    return { data: [], count: 0, error };
  }
}

export default supabase;
