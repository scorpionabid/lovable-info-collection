
/**
 * Supabase keşləmə utilləri
 */
import { supabase } from './client';
import { logger } from '@/utils/logger';

// Keşləmə parametrləri
export const CACHE_CONFIG = {
  ttl: 5 * 60 * 1000, // 5 dəqiqə
  maxSize: 100, // Maksimum keş elementi
  prefix: 'supabase_cache_',
};

// Keş məlumatları üçün interfeys
interface CacheItem<T> {
  timestamp: number;
  expiry: number;
  data: T;
}

// Keş məlumatlarının saxlanması üçün obyekt
const memoryCache: Map<string, CacheItem<any>> = new Map();

// Əsas keşləmə funksiyası
export const queryWithCache = async <T>(
  key: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  ttl: number = CACHE_CONFIG.ttl
): Promise<{ data: T | null; error: any }> => {
  // Keş açarını yaratmaq
  const cacheKey = `${CACHE_CONFIG.prefix}${key}`;
  
  try {
    // Yaddaşda keşlənmiş məlumatı yoxla
    const cachedItem = memoryCache.get(cacheKey);
    
    // Keşdə varsa və vaxtı keçməyibsə, keşdən ver
    if (cachedItem && cachedItem.expiry > Date.now()) {
      logger.debug('Cache hit:', cacheKey);
      return { data: cachedItem.data, error: null };
    }
    
    // Keşdə yoxdursa və ya vaxtı keçibsə, yeni sorğu et
    logger.debug('Cache miss, fetching data:', cacheKey);
    const result = await queryFn();
    
    // Xəta varsa keşləmə
    if (result.error) {
      logger.error('Error fetching data for cache:', result.error);
      return result;
    }
    
    // Uğurlu nəticəni keşlə
    if (result.data) {
      const cacheItem: CacheItem<T> = {
        timestamp: Date.now(),
        expiry: Date.now() + ttl,
        data: result.data,
      };
      
      // Yaddaşda saxla
      memoryCache.set(cacheKey, cacheItem);
      
      // Keşin ölçüsünü yoxla və lazım gələrsə təmizlə
      if (memoryCache.size > CACHE_CONFIG.maxSize) {
        const oldestKey = [...memoryCache.entries()]
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
        memoryCache.delete(oldestKey);
      }
    }
    
    return result;
  } catch (error) {
    logger.error('Cache operation error:', error);
    // Keş xətası baş verdikdə birbaşa sorğu et
    return await queryFn();
  }
};

// Keşin təmizlənməsi
export const clearCache = (prefix?: string): void => {
  if (prefix) {
    // Müəyyən prefikslə başlayan keşləri təmizlə
    const keys = [...memoryCache.keys()].filter(key => key.startsWith(prefix));
    keys.forEach(key => memoryCache.delete(key));
    logger.info(`Cache cleared with prefix: ${prefix}, ${keys.length} items removed`);
  } else {
    // Bütün keşi təmizlə
    memoryCache.clear();
    logger.info('Complete cache cleared');
  }
  
  // Təmizləmə hadisəsini yay
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('supabase-cache-clear', { 
      detail: { prefix } 
    }));
  }
};

// Xüsusi keşləri təmizləmək
export const invalidateCache = (key: string): void => {
  const cacheKey = `${CACHE_CONFIG.prefix}${key}`;
  memoryCache.delete(cacheKey);
  logger.info(`Cache invalidated: ${cacheKey}`);
};

// Müəyyən patternə uyğun keşləri təmizləmək
export const invalidateCachePattern = (pattern: string): void => {
  const regex = new RegExp(pattern);
  const keys = [...memoryCache.keys()].filter(key => regex.test(key));
  keys.forEach(key => memoryCache.delete(key));
  logger.info(`Cache pattern invalidated: ${pattern}, ${keys.length} items removed`);
};

// Vaxtı keçmiş bütün keşləri təmizləmək
export const cleanExpiredCache = (): void => {
  const now = Date.now();
  let removedCount = 0;
  
  [...memoryCache.entries()].forEach(([key, item]) => {
    if (item.expiry < now) {
      memoryCache.delete(key);
      removedCount++;
    }
  });
  
  if (removedCount > 0) {
    logger.info(`Removed ${removedCount} expired cache items`);
  }
};

// Keşin statistikasını almaq
export const getCacheStats = () => {
  const now = Date.now();
  const total = memoryCache.size;
  let expired = 0;
  
  [...memoryCache.values()].forEach(item => {
    if (item.expiry < now) expired++;
  });
  
  return {
    total,
    expired,
    active: total - expired,
    maxSize: CACHE_CONFIG.maxSize,
    ttl: CACHE_CONFIG.ttl,
  };
};
