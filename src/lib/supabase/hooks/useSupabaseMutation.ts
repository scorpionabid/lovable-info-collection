
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';

export function useSupabaseMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, PostgrestError, TVariables>, 'mutationFn'>
): UseMutationResult<TData, PostgrestError, TVariables> {
  return useMutation<TData, PostgrestError, TVariables>({
    mutationFn,
    ...options,
  });
}
