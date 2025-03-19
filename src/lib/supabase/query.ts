/**
 * Supabase sorğuları üçün köməkçi funksiyalar
 */
import { logger } from '@/utils/logger';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { isNetworkError, handleSupabaseError } from './client';

// handleSupabaseError funksiya client.ts-dən export edilir

/**
 * Səhifələmə üçün köməkçi funksiya
 * @param query Supabase sorğusu
 * @param pagination Səhifələmə parametrləri
 */
export const buildPaginatedQuery = (
  query: PostgrestFilterBuilder<any, any, any>, 
  pagination: { page: number, pageSize: number }
): PostgrestFilterBuilder<any, any, any> => {
  const { page, pageSize } = pagination;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
};

/**
 * Sıralama üçün köməkçi funksiya
 * @param query Supabase sorğusu
 * @param sort Sıralama parametrləri
 */
export const buildSortedQuery = (
  query: PostgrestFilterBuilder<any, any, any>, 
  sort: { column: string, direction: 'asc' | 'desc' }
): PostgrestFilterBuilder<any, any, any> => {
  const { column, direction } = sort;
  return query.order(column, { ascending: direction === 'asc' });
};

/**
 * Filtrlər üçün köməkçi funksiya
 * @param query Supabase sorğusu
 * @param filters Filtr parametrləri
 * @param filterMap Xüsusi filtr funksiyaları
 */
export const buildFilteredQuery = (
  query: PostgrestFilterBuilder<any, any, any>, 
  filters: Record<string, any>, 
  filterMap?: Record<string, (q: PostgrestFilterBuilder<any, any, any>, value: any) => PostgrestFilterBuilder<any, any, any>>
): PostgrestFilterBuilder<any, any, any> => {
  // Filtr yoxdursa, sorğunu olduğu kimi qaytar
  if (!filters || Object.keys(filters).length === 0) {
    return query;
  }

  let filteredQuery = query;
  
  // Hər filtri tətbiq et
  Object.entries(filters).forEach(([key, value]) => {
    // Boş dəyərləri keç
    if (value === null || value === undefined || value === '') {
      return;
    }
    
    // Xüsusi filtr funksiyası varsa, onu istifadə et
    if (filterMap && filterMap[key]) {
      filteredQuery = filterMap[key](filteredQuery, value);
      return;
    }
    
    // Filtr növünə görə uyğun operatoru seç
    if (typeof value === 'string') {
      // Axtarış sorğuları üçün ilike istifadə et
      if (key === 'searchQuery' || key.includes('name') || key.includes('title') || key.includes('description')) {
        filteredQuery = filteredQuery.ilike(key.replace('searchQuery', 'name'), `%${value}%`);
      } else if (key.startsWith('exact_')) {
        // Dəqiq uyğunluq üçün
        filteredQuery = filteredQuery.eq(key.replace('exact_', ''), value);
      } else if (value.includes('%')) {
        // Dəyər özü '%' simvolunu saxlayırsa, ilike istifadə et
        filteredQuery = filteredQuery.ilike(key, value);
      } else {
        filteredQuery = filteredQuery.eq(key, value);
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
};

// handleSupabaseError funksiya client.ts-dən export edilir
export { handleSupabaseError };
