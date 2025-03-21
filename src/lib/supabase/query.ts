
/**
 * Supabase sorğuları üçün köməkçi funksiyalar
 * Bu modul səhifələndirmə, filtirləmə və ümumi query yaradılması üçün funksiyalar təmin edir
 */
import { supabase } from './index';
import { PostgrestFilterBuilder } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

/**
 * Səhifələnmiş sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param page Səhifə nömrəsi
 * @param pageSize Səhifə ölçüsü
 * @returns Səhifələnmiş sorğu
 */
export function createPaginatedQuery<T = any>(
  query: PostgrestFilterBuilder<Database, T, any>,
  page: number,
  pageSize: number
): PostgrestFilterBuilder<Database, T, any> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
}

/**
 * Sıralanmış sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param orderBy Sıralama sütunu
 * @param ascending Artan sıralama üçün true
 * @returns Sıralanmış sorğu
 */
export function createSortedQuery<T = any>(
  query: PostgrestFilterBuilder<Database, T, any>,
  orderBy: string,
  ascending: boolean = true
): PostgrestFilterBuilder<Database, T, any> {
  return query.order(orderBy, { ascending });
}

/**
 * Filtlərlənmiş sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param filters Filtrlər obyekti
 * @returns Filtrlənmiş sorğu
 */
export function createFilteredQuery<T = any>(
  query: PostgrestFilterBuilder<Database, T, any>,
  filters: Record<string, any>
): PostgrestFilterBuilder<Database, T, any> {
  let result = query;

  // Filtr obyektini gəz və hər bir filtri tətbiq et
  for (const [key, value] of Object.entries(filters)) {
    // Boş dəyərləri keç
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Söz axtatışı üçün xüsusi hallar (% işarələri ilə)
    if (typeof value === 'string' && value.startsWith('%') && value.endsWith('%')) {
      result = result.ilike(key, value);
      continue;
    }

    // Normal bərabərlik şərtləri
    result = result.eq(key, value);
  }

  return result;
}

/**
 * Həm filtlərlənmiş, həm də sıralanmış sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param filters Filtrlər obyekti
 * @param orderBy Sıralama sütunu
 * @param ascending Artan sıralama üçün true
 * @returns Filtrlənmiş və sıralanmış sorğu
 */
export function createFilteredAndSortedQuery<T = any>(
  query: PostgrestFilterBuilder<Database, T, any>,
  filters: Record<string, any>,
  orderBy: string,
  ascending: boolean = true
): PostgrestFilterBuilder<Database, T, any> {
  const filteredQuery = createFilteredQuery(query, filters);
  return createSortedQuery(filteredQuery, orderBy, ascending);
}

/**
 * Həm filtlərlənmiş, həm sıralanmış, həm də səhifələnmiş sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param filters Filtrlər obyekti
 * @param orderBy Sıralama sütunu
 * @param ascending Artan sıralama üçün true
 * @param page Səhifə nömrəsi
 * @param pageSize Səhifə ölçüsü
 * @returns Tam konfiqurasiya edilmiş sorğu
 */
export function createCompleteQuery<T = any>(
  query: PostgrestFilterBuilder<Database, T, any>,
  filters: Record<string, any>,
  orderBy: string,
  ascending: boolean = true,
  page: number,
  pageSize: number
): PostgrestFilterBuilder<Database, T, any> {
  const filteredAndSortedQuery = createFilteredAndSortedQuery(
    query,
    filters,
    orderBy,
    ascending
  );
  return createPaginatedQuery(filteredAndSortedQuery, page, pageSize);
}

/**
 * Həm count həm də data-nı bir dəfəyə əldə etmək üçün 
 * @param tableName Cədvəl adı
 * @param select Seçim sorğusu ("*" və ya spesifik sütunlar)
 * @param filters Filtrlər obyekti (optional)
 * @param orderBy Sıralama sütunu (optional)
 * @param ascending Artan sıralama üçün true (optional)
 * @param page Səhifə nömrəsi (optional)
 * @param pageSize Səhifə ölçüsü (optional)
 * @returns Səhifələnmiş data və ümumi count
 */
export async function getPaginatedData<T = any>(
  tableName: string,
  select: string = '*',
  filters: Record<string, any> = {},
  orderBy: string = 'created_at',
  ascending: boolean = false,
  page: number = 1,
  pageSize: number = 10
): Promise<{ data: T[]; count: number; error: any }> {
  try {
    // Ümumi sayı əldə et
    const countQuery = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    // Filtrlərə bax
    const filteredCountQuery = createFilteredQuery(countQuery, filters);
    const { count, error: countError } = await filteredCountQuery;
    
    if (countError) throw countError;
    
    // Əsas data sorğusu
    const dataQuery = supabase.from(tableName).select(select);
    
    // Kompleks sorğunu tətbiq et
    const completeQuery = createCompleteQuery(
      dataQuery,
      filters,
      orderBy,
      ascending,
      page,
      pageSize
    );
    
    const { data, error: dataError } = await completeQuery;
    
    if (dataError) throw dataError;
    
    return {
      data: data as T[],
      count: count || 0,
      error: null
    };
  } catch (error) {
    console.error(`Error fetching paginated data from ${tableName}:`, error);
    return {
      data: [] as T[],
      count: 0,
      error
    };
  }
}
