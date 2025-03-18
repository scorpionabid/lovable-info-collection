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
        // Sorğunu performans monitorinqi ilə icra edirik
        return await performanceMonitor.measure(
          `query:${queryName}`,
          async () => {
            return await originalQueryFn(context);
          },
          {
            queryKey: options.queryKey,
          }
        );
      } catch (error) {
        // Xətanı loqa yazırıq
        logger.error(`Error in query ${queryName}`, { error });
        throw error;
      }
    };
  }
  
  // Sorğu tamamlandıqda və ya xəta baş verdikdə loqa yazmaq üçün
  // React Query-nin callback funksiyalarını əhatə edə bilmərik,
  // çünki bu funksiyalar UseQueryOptions tipində mövcud deyil.
  // Bunun əvəzinə, sorğunun nəticəsini izləmək üçün useEffect istifadə edəcəyik
  // Bu, SectorsOverview komponentində artıq mövcuddur.
  
  // Standart useQuery funksiyasını çağırırıq
  return useQuery<TQueryFnData, TError, TData, TQueryKey>(options);
}
