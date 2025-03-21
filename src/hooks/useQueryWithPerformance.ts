/**
 * Adapter hook: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu hook köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase/hooks/useSupabaseQuery istifadə edin.
 */
import { useSupabaseQuery } from '@/lib/supabase/hooks/useSupabaseQuery';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { performanceMonitor } from '@/utils/performanceMonitor';

export function useQueryWithPerformance<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends unknown[] = unknown[]
>(
  queryName: string,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  // Orijinal useQuery-ni istifadə edirik, amma performans ölçmələri əlavə edirik
  return useQuery({
    ...options,
    queryFn: async (context) => {
      const originalQueryFn = options.queryFn;
      if (!originalQueryFn) throw new Error('queryFn is required');
      
      return await performanceMonitor.measure(
        `query:${queryName}`,
        async () => {
          return await originalQueryFn(context);
        },
        {
          queryKey: options.queryKey,
        }
      );
    }
  });
}

export default useQueryWithPerformance;
