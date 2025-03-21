
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useSupabaseQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, string[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}
