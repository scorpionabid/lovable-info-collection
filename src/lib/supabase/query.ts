/**
 * Supabase sorğu köməkçiləri
 */
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { supabase } from './client';
import { queryWithCache } from './cache';
import { logger } from '@/utils/logger';
import { TABLES, validateTableName, TableNames } from './types-util';

// Sorğu parametrləri tipi
export interface QueryOptions {
  filters?: Record<string, any>;
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
  select?: string;
  useCache?: boolean;
  cacheTime?: number;
  cacheKey?: string;
}

/**
 * Sadə sorğu yaratmaq üçün funksiya
 */
export const createQuery = <T>(
  tableName: TableNames,
  options: QueryOptions = {}
) => {
  const {
    select = '*',
    useCache = true,
    cacheTime,
    cacheKey
  } = options;

  // Validate table name to ensure type safety
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  let query = supabase.from(tableName).select(select);
  
  // Filter, sort və pagination əlavə et
  query = applyFilters(query, options.filters);
  query = applySort(query, options.sort);
  query = applyPagination(query, options.pagination);

  // Keşləmə istifadə ediləcəksə
  if (useCache) {
    // Keş açarını yaratmaq
    const generatedCacheKey = cacheKey || `${tableName}_${JSON.stringify({
      select,
      filters: options.filters,
      sort: options.sort,
      pagination: options.pagination
    })}`;

    return queryWithCache(
      generatedCacheKey,
      async () => await query,
      cacheTime
    );
  }

  // Keşsiz sorğu
  return query;
};

/**
 * Filter əlavə etmək üçün köməkçi funksiya
 */
export const applyFilters = <T>(
  query: PostgrestFilterBuilder<any, any, any>,
  filters?: Record<string, any>
): PostgrestFilterBuilder<any, any, any> => {
  if (!filters) return query;

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // Array isə "in" operatoru istifadə et
    if (Array.isArray(value)) {
      query = query.in(key, value);
      return;
    }

    // Obyekt isə operator və dəyər var
    if (typeof value === 'object' && !Array.isArray(value)) {
      const { operator, value: opValue } = value as {
        operator: string;
        value: any;
      };

      if (opValue === undefined || opValue === null) return;

      switch (operator) {
        case 'eq':
          query = query.eq(key, opValue);
          break;
        case 'neq':
          query = query.neq(key, opValue);
          break;
        case 'gt':
          query = query.gt(key, opValue);
          break;
        case 'gte':
          query = query.gte(key, opValue);
          break;
        case 'lt':
          query = query.lt(key, opValue);
          break;
        case 'lte':
          query = query.lte(key, opValue);
          break;
        case 'like':
          query = query.like(key, `%${opValue}%`);
          break;
        case 'ilike':
          query = query.ilike(key, `%${opValue}%`);
          break;
        case 'in':
          query = query.in(key, Array.isArray(opValue) ? opValue : [opValue]);
          break;
        case 'is':
          query = query.is(key, opValue);
          break;
        default:
          logger.warn(`Bilinməyən operator: ${operator}`);
      }
      return;
    }

    // Sadə dəyər isə equality operator istifadə et
    query = query.eq(key, value);
  });

  return query;
};

/**
 * Sıralama əlavə etmək üçün köməkçi funksiya
 */
export const applySort = <T>(
  query: PostgrestFilterBuilder<any, any, any>,
  sort?: { column: string; direction: 'asc' | 'desc' }
): PostgrestFilterBuilder<any, any, any> => {
  if (!sort || !sort.column) return query;
  return query.order(sort.column, {
    ascending: sort.direction === 'asc'
  });
};

/**
 * Səhifələmə əlavə etmək üçün köməkçi funksiya
 */
export const applyPagination = <T>(
  query: PostgrestFilterBuilder<any, any, any>,
  pagination?: { page: number; pageSize: number }
): PostgrestFilterBuilder<any, any, any> => {
  if (!pagination || !pagination.page || !pagination.pageSize) return query;

  const from = (pagination.page - 1) * pagination.pageSize;
  const to = from + pagination.pageSize - 1;

  return query.range(from, to);
};

/**
 * Səhifələnmiş sorğu yaratmaq üçün funksiya
 */
export const createPaginatedQuery = async <T>(
  tableName: TableNames,
  options: QueryOptions = {}
) => {
  const {
    select = '*',
    useCache = true,
    cacheTime,
    cacheKey
  } = options;

  // Validate table name to ensure type safety
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  try {
    // Ümumi sayı əldə etmək üçün sorğu
    const countQuery = supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    // Əsas sorğu
    let dataQuery = supabase.from(tableName).select(select);

    // Filter və sort əlavə et
    dataQuery = applyFilters(dataQuery, options.filters);
    dataQuery = applySort(dataQuery, options.sort);

    // Səhifələmə əlavə et
    if (options.pagination) {
      dataQuery = applyPagination(dataQuery, options.pagination);
    }

    // Keşləmə istifadə ediləcəksə
    if (useCache) {
      // Keş açarını yaratmaq
      const dataKey = cacheKey
        ? `${cacheKey}_data`
        : `${tableName}_data_${JSON.stringify({
            select,
            filters: options.filters,
            sort: options.sort,
            pagination: options.pagination
          })}`;

      const countKey = cacheKey
        ? `${cacheKey}_count`
        : `${tableName}_count_${JSON.stringify({
            filters: options.filters
          })}`;

      const [dataResult, countResult] = await Promise.all([
        queryWithCache(
          dataKey,
          async () => await dataQuery,
          cacheTime
        ),
        queryWithCache(
          countKey,
          async () => await countQuery,
          cacheTime
        )
      ]);

      // Make sure to handle the count correctly
      return {
        data: dataResult.data as T[],
        error: dataResult.error,
        count: countResult.count !== undefined ? countResult.count : 0
      };
    }

    // Keşsiz sorğu
    const [dataResult, countResult] = await Promise.all([
      dataQuery,
      countQuery
    ]);

    return {
      data: dataResult.data as T[],
      error: dataResult.error,
      count: countResult.count !== undefined ? countResult.count : 0
    };
  } catch (error) {
    console.error(`Error in createPaginatedQuery for ${tableName}:`, error);
    return {
      data: [] as T[],
      error,
      count: 0
    };
  }
};

/**
 * ID ilə bir element əldə etmək üçün funksiya
 */
export const getById = async <T>(
  tableName: TableNames,
  id: string,
  options: {
    select?: string;
    useCache?: boolean;
    cacheTime?: number;
  } = {}
) => {
  const { select = '*', useCache = true, cacheTime } = options;

  // Validate table name to ensure type safety
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  const query = supabase
    .from(tableName)
    .select(select)
    .eq('id', id)
    .maybeSingle();

  // Keşləmə istifadə ediləcəksə
  if (useCache) {
    return queryWithCache(
      `${tableName}_${id}_${select}`,
      async () => await query,
      cacheTime
    );
  }

  // Keşsiz sorğu
  return query;
};

/**
 * Yeni element yaratmaq üçün funksiya
 */
export const create = async <T>(
  tableName: TableNames,
  data: any,
  options: {
    select?: string;
  } = {}
) => {
  const { select = '*' } = options;

  // Validate table name to ensure type safety
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  return supabase
    .from(tableName)
    .insert(data)
    .select(select)
    .maybeSingle();
};

/**
 * Elementi yeniləmək üçün funksiya
 */
export const update = async <T>(
  tableName: TableNames,
  id: string,
  data: any,
  options: {
    select?: string;
  } = {}
) => {
  const { select = '*' } = options;

  // Validate table name to ensure type safety
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  return supabase
    .from(tableName)
    .update(data)
    .eq('id', id)
    .select(select)
    .maybeSingle();
};

/**
 * Elementi silmək üçün funksiya
 */
export const remove = async <T>(
  tableName: TableNames,
  id: string,
  options: {
    select?: string;
  } = {}
) => {
  const { select = '*' } = options;

  // Validate table name to ensure type safety
  if (!validateTableName(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  return supabase
    .from(tableName)
    .delete()
    .eq('id', id)
    .select(select)
    .maybeSingle();
};
