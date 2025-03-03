
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T | null>;
}

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        toast({
          title: 'Error',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, toast]
  );

  return { data, loading, error, execute };
}
