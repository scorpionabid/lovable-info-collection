
// Re-export from the actual client location
export * from '@/lib/supabase/client';
export { default } from '@/lib/supabase/client';

// Additional utilities required by other modules
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
  
  if (filters.search) {
    filteredQuery = filteredQuery.ilike('name', `%${filters.search}%`);
  }
  
  if (filters.region_id) {
    filteredQuery = filteredQuery.eq('region_id', filters.region_id);
  }
  
  if (filters.sector_id) {
    filteredQuery = filteredQuery.eq('sector_id', filters.sector_id);
  }
  
  if (filters.status && filters.status !== 'all') {
    filteredQuery = filteredQuery.eq('status', filters.status);
  }
  
  if (filters.archived !== undefined) {
    filteredQuery = filteredQuery.eq('archived', filters.archived);
  }
  
  return filteredQuery;
};

export const queryWithCache = async (key: string, queryFn: () => Promise<any>, ttlSeconds = 300) => {
  // Simple implementation for now
  return queryFn();
};

export const isOfflineMode = () => {
  return !navigator.onLine;
};

export const checkConnection = async (): Promise<boolean> => {
  try {
    if (!navigator.onLine) return false;
    
    // Try to fetch a small resource or ping your API
    const { data, error } = await fetch('/api/health-check')
      .then(res => res.json())
      .catch(() => ({ data: null, error: true }));
      
    return !error;
  } catch (err) {
    console.error('Connection check failed:', err);
    return false;
  }
};
