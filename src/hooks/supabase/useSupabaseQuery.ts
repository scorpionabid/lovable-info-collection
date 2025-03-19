/**
 * Universal Supabase sorğu hook-u
 * TanStack Query ilə Supabase sorğularını asanlaşdırmaq üçün ümumi hook
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { queryWithCache, handleSupabaseError, supabase } from "@/lib/supabase";
import { logger } from "@/utils/logger";

export interface QueryOptions<TData> {
  // Sorğu və keşləmə üçün seçimlər
  queryKey: readonly unknown[];
  staleTime?: number;
  gcTime?: number; // Əvvəlki cacheTime əvəzinə
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number | false;
  useCache?: boolean;
  cacheTime?: number;
  
  // Supabase spesifik seçimlər
  select?: string;
  filters?: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' };
  pagination?: { page: number; pageSize: number };
  
  // TanStack Query seçimləri
  queryOptions?: Omit<UseQueryOptions<TData, Error, TData, readonly unknown[]>, 'queryKey' | 'queryFn'>;
}

export type SupabaseQueryFn<TData> = (
  client: SupabaseClient,
  options: Omit<QueryOptions<TData>, 'queryKey' | 'queryOptions'>
) => Promise<{ data: TData | null; error: any }>;

/**
 * Universal Supabase sorğu hook-u
 * @param tableName Sorğulanan cədvəlin adı
 * @param queryFn Supabase sorğusunu icra edən funksiya
 * @param options Sorğu seçimləri
 */
export function useSupabaseQuery<TData>(
  tableName: string,
  queryFn: SupabaseQueryFn<TData>,
  options: QueryOptions<TData>
) {
  const {
    queryKey,
    staleTime = 5 * 60 * 1000, // 5 dəqiqə
    gcTime = 10 * 60 * 1000, // 10 dəqiqə
    enabled = true,
    refetchOnWindowFocus = import.meta.env.PROD, // Yalnız produksiya mühitində
    refetchInterval = false,
    useCache = true,
    cacheTime = 5 * 60 * 1000, // 5 dəqiqə
    queryOptions = {},
    ...supabaseOptions
  } = options;
  
  return useQuery<TData, Error, TData, readonly unknown[]>({
    queryKey,
    queryFn: async () => {
      logger.info(`[useSupabaseQuery] Sorğu icra olunur: ${tableName}`, {
        queryKey,
        options: supabaseOptions
      });
      
      try {
        let result;
        
        // Keşləmə aktiv olduqda
        if (useCache) {
          result = await queryWithCache<TData>(
            tableName,
            () => queryFn(supabase, supabaseOptions),
            cacheTime
          );
        } else {
          // Keşləmə olmadan birbaşa sorğu
          result = await queryFn(supabase, supabaseOptions);
        }
        
        // Xətanın idarə edilməsi
        if (result.error) {
          logger.error(`[useSupabaseQuery] Xəta: ${tableName}`, {
            error: result.error,
            queryKey
          });
          throw handleSupabaseError(result.error);
        }
        
        return result.data as TData;
      } catch (error) {
        logger.error(`[useSupabaseQuery] İstisna: ${tableName}`, {
          error,
          queryKey
        });
        throw error;
      }
    },
    staleTime,
    gcTime,
    enabled,
    refetchOnWindowFocus,
    refetchInterval,
    ...queryOptions
  });
}

/**
 * Cədvəldən bütün məlumatları əldə etmək üçün hazır sorğu funksiyası
 */
export function createSelectQuery<TData>(tableName: string) {
  return async (
    client: SupabaseClient,
    options: Omit<QueryOptions<TData>, 'queryKey' | 'queryOptions'>
  ): Promise<{ data: TData[] | null; error: any }> => {
    const { select = '*', filters, sort, pagination } = options;
    
    try {
      // Əsas sorğunu yarat
      let query = client.from(tableName).select(select, { count: 'exact' });
      
      // Filtrlər tətbiq et
      if (filters && Object.keys(filters).length > 0) {
        query = applyFilters(query, filters);
      }
      
      // Sıralama tətbiq et
      if (sort) {
        query = query.order(sort.column, { ascending: sort.direction === 'asc' });
      }
      
      // Səhifələmə tətbiq et
      if (pagination) {
        const { page, pageSize } = pagination;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }
      
      // Sorğunu icra et
      const { data, error, count } = await query;
      
      // Əlavə məlumatla nəticəni qaytar (səhifələmə və say üçün)
      return {
        data: data ? { data, count: count || 0 } as unknown as TData[] : null,
        error
      };
    } catch (error) {
      logger.error(`[createSelectQuery] Error in ${tableName} query:`, error);
      return { data: null, error };
    }
  };
}

/**
 * Filtrlər tətbiq etmək üçün köməkçi funksiya
 */
function applyFilters<T>(
  query: PostgrestFilterBuilder<any, any, any>,
  filters: Record<string, any>
): PostgrestFilterBuilder<any, any, any> {
  let filteredQuery = query;
  
  Object.entries(filters).forEach(([key, value]) => {
    // Boş və ya undefined dəyərlərə görə filtr tətbiq etmə
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Filter növünə görə uyğun operatoru seç
    if (typeof value === 'string') {
      // Axtarış sorğuları üçün ilike istifadə et
      if (key === 'searchQuery' || key.includes('name') || key.includes('title') || key.includes('description')) {
        filteredQuery = filteredQuery.ilike(key.replace('searchQuery', 'name'), `%${value}%`);
      } else if (key.startsWith('exact_')) {
        // Dəqiq uyğunluq üçün
        filteredQuery = filteredQuery.eq(key.replace('exact_', ''), value);
      } else {
        filteredQuery = filteredQuery.ilike(key, `%${value}%`);
      }
    } else if (Array.isArray(value)) {
      // Massiv dəyərləri üçün in operatoru istifadə et
      filteredQuery = filteredQuery.in(key, value);
    } else if (typeof value === 'object' && value !== null) {
      // Tarix aralığı üçün
      if ('from' in value && value.from) {
        filteredQuery = filteredQuery.gte(key, value.from);
      }
      if ('to' in value && value.to) {
        filteredQuery = filteredQuery.lte(key, value.to);
      }
    } else {
      // Digər dəyərlər üçün bərabərlik
      filteredQuery = filteredQuery.eq(key, value);
    }
  });
  
  return filteredQuery;
}
