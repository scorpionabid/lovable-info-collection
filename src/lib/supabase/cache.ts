/**
 * Supabase sorğuları üçün keşləmə sistemi
 */
import { logger } from '@/utils/logger';
import { CACHE_CONFIG, isOfflineMode } from './client';

interface CacheItem {
  data: any;
  timestamp: number;
}

// Keşləmə üçün Map
const queryCache = new Map<string, CacheItem>();

// Keş limitini izlə və ehtiyac olduqda təmizlə
window.addEventListener('supabase-cache-clear', () => {
  queryCache.clear();
});

/**
 * Keş açarı yaratmaq üçün
 * @param tableName Sorğulanan cədvəlin adı
 * @param query Sorğu parametrləri və ya funksiya
 */
export const createCacheKey = (tableName: string, query: any): string => {
  try {
    // Sorğu parametrlərini string-ə çevir
    const queryParams = typeof query === 'function' 
      ? query.toString().replace(/\s+/g, '') 
      : JSON.stringify(query || {});
    
    return `${tableName}:${queryParams}`;
  } catch (error) {
    logger.warn('Keş açarı yaradılarkən xəta', { error, tableName });
    return `${tableName}:${Date.now()}`;
  }
};

/**
 * Keşdən məlumat əldə etmək
 * @param key Keş açarı
 */
export const getFromCache = <T>(key: string): T | null => {
  const item = queryCache.get(key);
  
  if (!item) return null;
  
  // Keş vaxtı keçibsə, null qaytar
  if (Date.now() - item.timestamp > CACHE_CONFIG.ttl) {
    queryCache.delete(key);
    return null;
  }
  
  return item.data as T;
};

/**
 * Keşə məlumat əlavə etmək
 * @param key Keş açarı
 * @param data Saxlanılacaq data
 */
export const addToCache = <T>(key: string, data: T): void => {
  // Keş ölçüsü limitini aşıbsa, ən köhnə elementi sil
  if (queryCache.size >= CACHE_CONFIG.maxSize) {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    queryCache.forEach((item, itemKey) => {
      if (item.timestamp < oldestTime) {
        oldestTime = item.timestamp;
        oldestKey = itemKey;
      }
    });
    
    if (oldestKey) {
      queryCache.delete(oldestKey);
    }
  }
  
  queryCache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  logger.debug('Məlumat keşə əlavə edildi', { key });
};

/**
 * Keşləmə ilə sorğu yerinə yetirmək
 * @param tableName Sorğulanan cədvəlin adı
 * @param queryFn Supabase sorğusunu icra edən funksiya
 * @param cacheTime Keş vaxtı (millisaniyə ilə)
 */
export const queryWithCache = async <T>(
  tableName: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  cacheTime: number = CACHE_CONFIG.ttl
): Promise<{ data: T | null; error: any }> => {
  // Offline rejim yoxlaması
  if (isOfflineMode()) {
    // Keşdən məlumat əldə etməyə çalış
    const cacheKey = createCacheKey(tableName, queryFn.toString());
    const cachedData = getFromCache<T>(cacheKey);
    
    if (cachedData) {
      logger.info('Offline rejim: Məlumat keşdən əldə edildi', { table: tableName });
      return { data: cachedData, error: null };
    }
    
    logger.warn('Offline rejim: Məlumat keşdə tapılmadı', { table: tableName });
    return { data: null, error: { message: 'Offline mode, no cached data available' } };
  }
  
  try {
    // Keşdən məlumat əldə etməyə çalış
    const cacheKey = createCacheKey(tableName, queryFn.toString());
    const cachedData = getFromCache<T>(cacheKey);
    
    if (cachedData) {
      logger.info('Məlumat keşdən əldə edildi', { table: tableName });
      
      // Keş tapıldı, amma arxa planda yenilənmə üçün sorğunu yenidən icra et
      setTimeout(async () => {
        try {
          const result = await queryFn();
          if (!result.error && result.data) {
            addToCache(cacheKey, result.data);
            logger.debug('Keş arxa planda yeniləndi', { table: tableName });
          }
        } catch (error) {
          logger.debug('Arxa plan keş yeniləməsi xətası', { table: tableName, error });
        }
      }, 500);
      
      return { data: cachedData, error: null };
    }
    
    // Keşdə yoxdursa, sorğunu yerinə yetir
    const result = await queryFn();
    
    // Uğurlu nəticəni keşə əlavə et
    if (!result.error && result.data) {
      addToCache(cacheKey, result.data);
      logger.info('Məlumat keşə əlavə edildi', { table: tableName });
    }
    
    return result;
  } catch (error) {
    logger.error('Keşləmə ilə sorğu xətası', { table: tableName, error });
    return { data: null, error };
  }
};
