
import { useState } from 'react';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';

interface QueryOptions<T> extends Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

export function useQuerySupabase<T>(
  queryKey: string | string[],
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = 'Məlumatlar uğurla yükləndi',
    ...restOptions
  } = options;

  const query = useQuery<T, Error>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async () => {
      try {
        const result = await queryFn();
        if (showSuccessToast) {
          toast.success(successMessage);
        }
        return result;
      } catch (error) {
        if (showErrorToast) {
          toast.error((error as Error).message || 'Məlumatlar yüklənərkən xəta baş verdi');
        }
        throw error;
      }
    },
    ...restOptions
  });

  const refresh = async () => {
    try {
      setIsRefreshing(true);
      await query.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    ...query,
    isRefreshing,
    refresh
  };
}
