
/**
 * Supabase sorğuları üçün köməkçi funksiyalar
 * Bu modul səhifələndirmə, filtirləmə və ümumi query yaradılması üçün funksiyalar təmin edir
 */
import { supabase } from './index';
import { Database } from '@/types/supabase';

// Define a simplified PostgrestBuilder interface to avoid importing directly
interface PostgrestFilterBuilder {
  select: (columns: string) => PostgrestFilterBuilder;
  from: (table: string) => PostgrestFilterBuilder;
  eq: (column: string, value: any) => PostgrestFilterBuilder;
  neq: (column: string, value: any) => PostgrestFilterBuilder;
  gt: (column: string, value: any) => PostgrestFilterBuilder;
  lt: (column: string, value: any) => PostgrestFilterBuilder;
  gte: (column: string, value: any) => PostgrestFilterBuilder;
  lte: (column: string, value: any) => PostgrestFilterBuilder;
  like: (column: string, value: string) => PostgrestFilterBuilder;
  ilike: (column: string, value: string) => PostgrestFilterBuilder;
  is: (column: string, value: any) => PostgrestFilterBuilder;
  in: (column: string, values: any[]) => PostgrestFilterBuilder;
  order: (column: string, options?: { ascending?: boolean }) => PostgrestFilterBuilder;
  range: (from: number, to: number) => PostgrestFilterBuilder;
  limit: (count: number) => PostgrestFilterBuilder;
  single: () => Promise<any>;
  maybeSingle: () => Promise<any>;
  then: (callback: (result: any) => void) => Promise<any>;
}

/**
 * Səhifələnmiş sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param page Səhifə nömrəsi
 * @param pageSize Səhifə ölçüsü
 * @returns Səhifələnmiş sorğu
 */
export function createPaginatedQuery(
  query: any,
  page: number,
  pageSize: number
): any {
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
export function createSortedQuery(
  query: any,
  orderBy: string,
  ascending: boolean = true
): any {
  return query.order(orderBy, { ascending });
}

/**
 * Filtlərlənmiş sorğu yaradan funksiya
 * @param query İlkin PostgrestFilterBuilder
 * @param filters Filtrlər obyekti
 * @returns Filtrlənmiş sorğu
 */
export function createFilteredQuery(
  query: any,
  filters: Record<string, any>
): any {
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
export function createFilteredAndSortedQuery(
  query: any,
  filters: Record<string, any>,
  orderBy: string,
  ascending: boolean = true
): any {
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
export function createCompleteQuery(
  query: any,
  filters: Record<string, any>,
  orderBy: string,
  ascending: boolean = true,
  page: number,
  pageSize: number
): any {
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
    const countResult = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
      
    const { count, error: countError } = countResult;
    
    if (countError) throw countError;
    
    // Əsas data sorğusu
    const dataQuery = supabase.from(tableName).select(select);
    
    // Apply filters
    const filteredQuery = createFilteredQuery(dataQuery, filters);
    
    // Apply sorting
    const sortedQuery = createSortedQuery(filteredQuery, orderBy, ascending);
    
    // Apply pagination
    const paginatedQuery = createPaginatedQuery(sortedQuery, page, pageSize);
    
    // Execute query
    const { data, error: dataError } = await paginatedQuery;
    
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
