
import { useQuery, UseQueryOptions, UseQueryResult, QueryFunction } from '@tanstack/react-query';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { useLogger } from './useLogger';

/**
 * Performans monitorinqi ilə genişləndirilmiş useQuery hook
 * Bu hook standart React Query useQuery funksiyasını əhatə edir və performans ölçmələri əlavə edir
 * 
 * @param queryName - Sorğunun adı (performans ölçməsi üçün)
 * @param options - Standart React Query parametrləri
 * @returns UseQueryResult - Standart React Query nəticəsi
 */
export function useQueryWithPerformance<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends unknown[] = unknown[]
>(
  queryName: string,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): UseQueryResult<TData, TError> {
  const logger = useLogger('useQueryWithPerformance');
  
  // Orijinal queryFn funksiyasını saxlayırıq
  const originalQueryFn = options.queryFn as QueryFunction<TQueryFnData, TQueryKey>;
  
  // Əgər queryFn təyin olunubsa, onu performans monitorinqi ilə əhatə edirik
  if (originalQueryFn) {
    options.queryFn = async (context) => {
      try {
        // Add timeout protection for queries
        const result = await Promise.race([
          performanceMonitor.measure(
            `query:${queryName}`,
            async () => {
              return await originalQueryFn(context);
            },
            {
              queryKey: options.queryKey,
            }
          ),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`Query '${queryName}' timeout (30s)`)), 30000);
          })
        ]);
        
        return result;
      } catch (error) {
        // Xətanı loqa yazırıq
        logger.error(`Error in query ${queryName}`, { error });
        throw error;
      }
    };
  }
  
  // Apply some reasonable defaults if not specified
  if (options.retry === undefined) {
    options.retry = 1;
  }
  
  if (options.refetchOnWindowFocus === undefined) {
    options.refetchOnWindowFocus = false;
  }
  
  if (options.staleTime === undefined) {
    options.staleTime = 5 * 60 * 1000; // 5 minutes
  }
  
  // Standart useQuery funksiyasını çağırırıq
  return useQuery<TQueryFnData, TError, TData, TQueryKey>(options);
}
