
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { supabase, withRetry } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/supabase';
import { logger } from '@/utils/logger';

/**
 * Supabase ilə React Query inteqrasiyası
 * @param key - sorğu keş açarı
 * @param queryFn - sorğu funksiyası
 * @param options - React Query seçimləri
 */
export function useSupabaseQuery<TData = unknown, TError = any>(
  key: string | string[],
  queryFn: () => Promise<{ data: TData | null; error: any }>,
  options?: Omit<UseQueryOptions<TData, TError, TData, string[]>, 'queryKey' | 'queryFn'>
) {
  const queryClient = useQueryClient();
  const queryKey = Array.isArray(key) ? key : [key];
  
  return useQuery<TData, TError, TData, string[]>({
    queryKey,
    queryFn: async () => {
      try {
        const start = performance.now();
        const { data, error } = await withRetry(queryFn);
        const duration = performance.now() - start;
        
        // Performance metrikini yaz
        logger.debug(`Query executed: ${queryKey.join('/')}`, { duration });
        
        if (error) {
          throw handleSupabaseError(error, `Query ${queryKey.join('/')} failed`);
        }
        
        return data as TData;
      } catch (error) {
        logger.error(`Query error for ${queryKey.join('/')}:`, error);
        throw error;
      }
    },
    // Cache və refetch davranışlarını müəyyən etmək
    ...options
  });
}

// Supabase tərəfindən idarə olunan müəyyən cədvəlləri dinləmək üçün hook
export function useRealtimeSubscription(
  table: string,
  filter?: { column: string; value: string },
  callback?: (payload: any) => void
) {
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null;
    
    try {
      // Realtime subscription yaratmaq
      const channel = supabase.channel(`table-changes-${table}`);
      
      let event = channel
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table
        }, (payload) => {
          logger.debug(`Realtime event for ${table}:`, payload);
          
          // Callback funksiyasını çağırmaq
          if (callback) {
            callback(payload);
          }
          
          // Dəyişikliklərə əsasən keşi invalidasiya etmək
          queryClient.invalidateQueries({ queryKey: [table] });
        });
      
      // Filter varsa, əlavə etmək
      if (filter) {
        event = channel.on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter: `${filter.column}=eq.${filter.value}`
        }, (payload) => {
          logger.debug(`Realtime event for ${table}:${filter.column}=${filter.value}`, payload);
          
          // Callback funksiyasını çağırmaq
          if (callback) {
            callback(payload);
          }
          
          // Dəyişikliklərə əsasən keşi invalidasiya etmək
          queryClient.invalidateQueries({ queryKey: [table, filter.value] });
        });
      }
      
      // Subscribe etmək
      subscription = event.subscribe((status) => {
        logger.debug(`Realtime subscription status for ${table}:`, status);
      });
      
    } catch (error) {
      logger.error(`Error setting up realtime subscription for ${table}:`, error);
    }
    
    // Cleanup
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
          logger.debug(`Unsubscribed from ${table}`);
        } catch (error) {
          logger.error(`Error unsubscribing from ${table}:`, error);
        }
      }
    };
  }, [table, filter, callback, queryClient]);
}
