/**
 * Baza Supabase servis - bütün digər servislər üçün əsas funksionallıq təmin edir
 */
import { supabase, withRetry, queryWithCache, isOfflineMode, checkConnection } from '@/lib/supabase';
import { logger } from '@/utils/logger';

// Sorğu parametrləri üçün tip
export interface QueryOptions {
  useCache?: boolean;
  offlineQueueable?: boolean;
  retries?: number;
  retryDelay?: number;
  cacheTime?: number;
}

// Standart sorğu parametrləri
const DEFAULT_QUERY_OPTIONS: QueryOptions = {
  useCache: true,
  offlineQueueable: true,
  retries: 2,
  retryDelay: 1000,
  cacheTime: 5 * 60 * 1000 // 5 dəqiqə
};

/**
 * Baza Supabase servis
 */
export class BaseSupabaseService {
  protected tableName: string;
  
  constructor(tableName: string) {
    this.tableName = tableName;
  }
  
  /**
   * Supabase müştərisini əldə et
   */
  protected getClient() {
    return supabase;
  }
  
  /**
   * Sorğu yerinə yetir (keşləmə və offline dəstəyi ilə)
   */
  protected async query<T = any>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    options: QueryOptions = {}
  ): Promise<{ data: T | null; error: any }> {
    // Parametrləri birləşdir
    const opts = { ...DEFAULT_QUERY_OPTIONS, ...options };
    
    try {
      // Offline rejim yoxlaması
      if (isOfflineMode() && !opts.useCache) {
        logger.warn(`${this.tableName}: Offline rejim, keşləmə olmadan sorğu yerinə yetirilə bilməz`);
        return { 
          data: null, 
          error: { message: 'Offline mode, cannot execute query without caching' } 
        };
      }
      
      // Keşləmə istifadə ediləcəksə
      if (opts.useCache) {
        return await queryWithCache<T>(
          this.tableName,
          () => withRetry(
            queryFn,
            opts.retries,
            opts.retryDelay,
            opts.offlineQueueable
          ),
          opts.cacheTime
        );
      }
      
      // Keşləmə olmadan sorğu
      return await withRetry(
        queryFn,
        opts.retries,
        opts.retryDelay,
        opts.offlineQueueable
      );
    } catch (error) {
      logger.error(`${this.tableName} sorğu xətası:`, error);
      return { data: null, error };
    }
  }
  
  /**
   * Əlaqə vəziyyətini yoxla
   */
  async checkConnection(): Promise<boolean> {
    return await checkConnection();
  }
  
  /**
   * Offline rejim vəziyyətini əldə et
   */
  isOffline(): boolean {
    return isOfflineMode();
  }
  
  /**
   * Bütün elementləri əldə et
   */
  async getAll<T = any>(
    columns = '*',
    options: QueryOptions = {}
  ): Promise<{ data: T[] | null; error: any }> {
    return this.query<T[]>(
      () => this.getClient()
        .from(this.tableName)
        .select(columns),
      options
    );
  }
  
  /**
   * ID ilə element əldə et
   */
  async getById<T = any>(
    id: string,
    columns = '*',
    options: QueryOptions = {}
  ): Promise<{ data: T | null; error: any }> {
    return this.query<T>(
      () => this.getClient()
        .from(this.tableName)
        .select(columns)
        .eq('id', id)
        .maybeSingle(),
      options
    );
  }
  
  /**
   * Yeni element yarat
   */
  async create<T = any>(
    data: any,
    options: QueryOptions = { useCache: false }
  ): Promise<{ data: T | null; error: any }> {
    return this.query<T>(
      () => this.getClient()
        .from(this.tableName)
        .insert(data)
        .select()
        .maybeSingle(),
      options
    );
  }
  
  /**
   * Elementi yenilə
   */
  async update<T = any>(
    id: string,
    data: any,
    options: QueryOptions = { useCache: false }
  ): Promise<{ data: T | null; error: any }> {
    return this.query<T>(
      () => this.getClient()
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .maybeSingle(),
      options
    );
  }
  
  /**
   * Elementi sil
   */
  async delete<T = any>(
    id: string,
    options: QueryOptions = { useCache: false }
  ): Promise<{ data: T | null; error: any }> {
    return this.query<T>(
      () => this.getClient()
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .select()
        .maybeSingle(),
      options
    );
  }
  
  /**
   * Şərt ilə elementləri əldə et
   */
  async getByCondition<T = any>(
    column: string,
    value: any,
    operator = 'eq',
    columns = '*',
    options: QueryOptions = {}
  ): Promise<{ data: T[] | null; error: any }> {
    return this.query<T[]>(
      () => {
        let query = this.getClient()
          .from(this.tableName)
          .select(columns);
        
        // Operatora görə sorğunu qur
        switch (operator) {
          case 'eq':
            query = query.eq(column, value);
            break;
          case 'neq':
            query = query.neq(column, value);
            break;
          case 'gt':
            query = query.gt(column, value);
            break;
          case 'gte':
            query = query.gte(column, value);
            break;
          case 'lt':
            query = query.lt(column, value);
            break;
          case 'lte':
            query = query.lte(column, value);
            break;
          case 'like':
            query = query.like(column, value);
            break;
          case 'ilike':
            query = query.ilike(column, value);
            break;
          case 'in':
            query = query.in(column, value);
            break;
          default:
            query = query.eq(column, value);
        }
        
        return query;
      },
      options
    );
  }
  
  /**
   * Səhifələnmiş sorğu
   */
  async getPaginated<T = any>(
    page: number,
    pageSize: number,
    columns = '*',
    options: QueryOptions = {}
  ): Promise<{ data: T[] | null; error: any; count: number | null }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    try {
      // Əvvəlcə ümumi sayı əldə et
      const countResult = await this.query<{ count: number }[]>(
        () => this.getClient()
          .from(this.tableName)
          .select('count', { count: 'exact', head: true }),
        options
      );
      
      // Sonra məlumatları əldə et
      const dataResult = await this.query<T[]>(
        () => this.getClient()
          .from(this.tableName)
          .select(columns)
          .range(from, to),
        options
      );
      
      return {
        data: dataResult.data,
        error: dataResult.error,
        count: countResult.data?.[0]?.count || null
      };
    } catch (error) {
      logger.error(`${this.tableName} səhifələnmiş sorğu xətası:`, error);
      return { data: null, error, count: null };
    }
  }
}

export default BaseSupabaseService;
