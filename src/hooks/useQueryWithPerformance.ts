
import { useQuery, QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useRef, useCallback, useEffect } from 'react';

type QueryFn<TData, TKey> = (context: {
  queryKey: TKey;
  signal: AbortSignal;
  meta: Record<string, unknown>;
}) => Promise<TData>;

export function useQueryWithPerformance<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: QueryFn<TQueryFnData, TQueryKey>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  // Store start time
  const startTimeRef = useRef<number | null>(null);
  
  // Function to log performance metrics
  const logPerformance = useCallback(async (duration: number, success: boolean) => {
    try {
      // You can implement performance logging here
      console.log(`Query ${queryKey.join(':')} took ${duration}ms (${success ? 'success' : 'error'})`);
      
      // Example: You could send metrics to a backend service
      // await fetch('/api/metrics', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     type: 'query',
      //     key: queryKey.join(':'),
      //     duration,
      //     success
      //   })
      // });
    } catch (error) {
      console.error('Failed to log performance metrics:', error);
    }
  }, [queryKey]);
  
  // Wrap the query function to measure performance
  const measuredQueryFn = useCallback(async (context: any) => {
    startTimeRef.current = performance.now();
    
    try {
      // Traditional function call approach that works with any function
      const result = await queryFn(context);
      const duration = performance.now() - (startTimeRef.current || 0);
      
      // Log performance for successful queries
      logPerformance(duration, true);
      
      return result;
    } catch (error) {
      const duration = performance.now() - (startTimeRef.current || 0);
      
      // Log performance for failed queries
      logPerformance(duration, false);
      
      throw error;
    }
  }, [queryFn, logPerformance]);
  
  return useQuery({
    queryKey,
    queryFn: measuredQueryFn,
    ...options
  });
}
