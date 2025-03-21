
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

export function useSupabaseQuery<T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, PostgrestError, T, string[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, PostgrestError> {
  return useQuery<T, PostgrestError, T, string[]>({
    queryKey: key,
    queryFn,
    ...options,
  });
}
