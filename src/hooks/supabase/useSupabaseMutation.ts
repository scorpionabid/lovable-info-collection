
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export function useSupabaseMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>
) {
  return useMutation({
    mutationFn,
    ...options,
  });
}
