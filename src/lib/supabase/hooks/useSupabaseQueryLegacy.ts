
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useLogger } from './useLogger';

interface UseSupabaseQueryProps<T> {
  queryFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
  successMessage?: string;
  loggerName?: string;
}

export function useSupabaseQuery<T>({
  queryFn,
  onSuccess,
  onError,
  errorMessage = 'Məlumatlar yüklənərkən xəta baş verdi',
  successMessage,
  loggerName = 'supabaseQuery'
}: UseSupabaseQueryProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const logger = useLogger(loggerName);

  const execute = async (): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Executing Supabase query');
      const result = await queryFn();
      
      setData(result);
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      logger.info('Supabase query successful', { hasData: !!result });
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      logger.error('Supabase query failed', { error: error.message });
      toast.error(errorMessage || error.message);
      
      if (onError) {
        onError(error);
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async (): Promise<T | null> => {
    return execute();
  };

  const invalidateAndRefetch = async (): Promise<T | null> => {
    // Invalidate any related cache before refetching
    await queryClient.invalidateQueries();
    return execute();
  };

  return {
    data,
    error,
    isLoading,
    execute,
    refetch,
    invalidateAndRefetch
  };
}
