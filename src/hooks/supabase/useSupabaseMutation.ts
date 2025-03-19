/**
 * Universal Supabase mutasiya hook-u
 * Data yazmaq, yeniləmək və silmək üçün ümumi hook
 */

import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase, withRetry, handleSupabaseError } from "@/lib/supabase";
import { logger } from "@/utils/logger";
import { useToast } from "@/hooks/use-toast";

export type MutationOperation = 'insert' | 'update' | 'upsert' | 'delete';

export interface MutationOptions<TData, TVariables> {
  // Əsas seçimlər
  queryKey: readonly unknown[];
  operation: MutationOperation;
  
  // Toast bildirişləri
  successToast?: string;
  errorToast?: string;
  
  // Əməliyyat tamamlandıqdan sonra yeniləmək üçün əlavə query açarları
  invalidateQueryKeys?: readonly unknown[][];
  
  // TanStack Mutation seçimləri
  mutationOptions?: Omit<
    UseMutationOptions<TData, Error, TVariables, unknown>,
    'mutationFn' | 'onSuccess' | 'onError'
  >;
  
  // Uğurlu və xəta halları üçün callback funksiyaları
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export type SupabaseMutationFn<TData, TVariables> = (
  client: SupabaseClient,
  variables: TVariables,
  operation: MutationOperation
) => Promise<{ data: TData | null; error: any }>;

/**
 * Universal Supabase mutasiya hook-u
 * @param tableName Əməliyyat aparılan cədvəlin adı
 * @param mutationFn Mutasiyanı icra edən funksiya
 * @param options Mutasiya seçimləri
 */
export function useSupabaseMutation<TData, TVariables = unknown>(
  tableName: string,
  mutationFn: SupabaseMutationFn<TData, TVariables>,
  options: MutationOptions<TData, TVariables>
) {
  const {
    queryKey,
    operation,
    successToast,
    errorToast,
    invalidateQueryKeys = [],
    mutationOptions = {},
    onSuccess,
    onError
  } = options;
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation<TData, Error, TVariables, unknown>({
    mutationFn: async (variables: TVariables) => {
      logger.info(`[useSupabaseMutation] Əməliyyat başlayır: ${operation} ${tableName}`, {
        operation,
        variables
      });
      
      try {
        // withRetry ilə əməliyyatı icra et (xəta halında təkrar cəhd etmək üçün)
        const result = await withRetry(() => 
          mutationFn(supabase, variables, operation)
        );
        
        // Xətanın idarə edilməsi
        if (result.error) {
          logger.error(`[useSupabaseMutation] Xəta: ${operation} ${tableName}`, {
            error: result.error,
            variables
          });
          throw handleSupabaseError(result.error);
        }
        
        return result.data as TData;
      } catch (error) {
        logger.error(`[useSupabaseMutation] İstisna: ${operation} ${tableName}`, {
          error,
          variables
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      // Əməliyyat uğurlu olduqda əsas queryKey və əlavə açarları yenilə
      queryClient.invalidateQueries({ queryKey });
      
      // Əlavə açarları da yenilə
      invalidateQueryKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      
      // Uğur haqqında bildiriş göstər (əgər təyin edilibsə)
      if (successToast) {
        toast({
          title: "Uğurlu əməliyyat",
          description: successToast,
          variant: "default"
        });
      }
      
      // Custom callback funksiyasını çağır (əgər təyin edilibsə)
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      // Xəta haqqında bildiriş göstər (əgər təyin edilibsə)
      if (errorToast) {
        toast({
          title: "Xəta baş verdi",
          description: errorToast || error.message,
          variant: "destructive"
        });
      }
      
      // Custom callback funksiyasını çağır (əgər təyin edilibsə)
      if (onError) {
        onError(error);
      }
    },
    ...mutationOptions
  });
}

/**
 * Yeni data əlavə etmək üçün hazır mutasiya funksiyası
 */
export function createInsertMutation<TData>() {
  return async (
    client: SupabaseClient,
    data: Partial<TData>,
    operation: MutationOperation
  ): Promise<{ data: TData | null; error: any }> => {
    // Hazırda sadəcə əlavə etmə əməliyyatını dəstəkləyir
    if (operation !== 'insert') {
      logger.warn(`[createInsertMutation] Yalnız 'insert' əməliyyatını dəstəkləyir, verilən: ${operation}`);
    }
    
    return client
      .from(operation === 'delete' ? String(data) : String(data))
      .insert(data)
      .select()
      .single();
  };
}

/**
 * Mövcud datanı yeniləmək üçün hazır mutasiya funksiyası
 */
export function createUpdateMutation<TData>(tableName: string) {
  return async (
    client: SupabaseClient,
    { id, ...data }: Partial<TData> & { id: string },
    operation: MutationOperation
  ): Promise<{ data: TData | null; error: any }> => {
    if (operation === 'insert') {
      return client
        .from(tableName)
        .insert(data)
        .select()
        .single();
    }
    
    if (operation === 'update') {
      return client
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
    }
    
    if (operation === 'upsert') {
      return client
        .from(tableName)
        .upsert({ id, ...data, updated_at: new Date().toISOString() })
        .select()
        .single();
    }
    
    if (operation === 'delete') {
      return client
        .from(tableName)
        .delete()
        .eq('id', id)
        .select()
        .single();
    }
    
    throw new Error(`Naməlum əməliyyat: ${operation}`);
  };
}
