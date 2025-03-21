
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';

interface MutationOptions<TData, TError, TVariables, TContext> 
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: string[];
}

export function useMutateSupabase<TData, TVariables, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, Error, TVariables, TContext> = {}
) {
  const queryClient = useQueryClient();
  const {
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = 'Əməliyyat uğurla tamamlandı',
    errorMessage = 'Əməliyyat zamanı xəta baş verdi',
    invalidateQueries = [],
    ...restOptions
  } = options;

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      // Invalidate queries if specified
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach(query => {
          queryClient.invalidateQueries({ queryKey: Array.isArray(query) ? query : [query] });
        });
      }
      
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (showErrorToast) {
        toast.error(error.message || errorMessage);
      }
      
      if (options.onError) {
        options.onError(error, variables, context);
      }
    },
    ...restOptions
  });
}
