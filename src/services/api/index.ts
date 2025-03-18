
import { supabase } from '@/integrations/supabase/client';

// This file previously created an axios instance
// Now we're using Supabase directly in each service
// We still export some utility functions

export const handleError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.code === 'PGRST301' || error.code === 'UNAUTHORIZED') {
    // Handle unauthorized access
    localStorage.removeItem('sb-token');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
};

export const addAuthHeader = () => {
  const token = localStorage.getItem('sb-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Common query builder for pagination
export const buildPaginatedQuery = (query: any, page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
};

// Utility to check connection
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('regions').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
};
