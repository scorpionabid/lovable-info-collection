
/**
 * Supabase sorğularını keşləmək üçün utilit
 */
import { logger } from '@/utils/logger';

// Cache konfiqurasiyası
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 dəqiqə 
  KEY_PREFIX: 'supabase_cache_',
  ENABLED: true
};

// Keş açarı yaratmaq
const createCacheKey = (prefix: string, key: string | string[]): string => {
  const keyStr = Array.isArray(key) ? key.join(':') : key;
  return `${CACHE_CONFIG.KEY_PREFIX}${prefix}_${keyStr}`;
};

// Əsas keş utiliti
class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  // Keşdən bir dəyəri əldə etmək
  get<T>(key: string): T | null {
    if (!CACHE_CONFIG.ENABLED) return null;
    
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Vaxtın keçib keçmədiyini yoxlayın
    const now = Date.now();
    if (now - item.timestamp > CACHE_CONFIG.DEFAULT_TTL) {
      this.delete(key);
      return null;
    }
    
    return item.data as T;
  }
  
  // Keşdə bir dəyəri təyin etmək
  set<T>(key: string, data: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    if (!CACHE_CONFIG.ENABLED) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Avtomatik təmizləmək üçün
    setTimeout(() => {
      this.delete(key);
    }, ttl);
  }
  
  // Keşdən bir dəyəri silmək
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  // Bütün keşi təmizləmək
  clear(): void {
    this.cache.clear();
  }
  
  // Tam və ya prefiks ilə təmizləmək
  clearByPrefix(prefix: string): void {
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        this.delete(key);
      }
    });
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Offline status
let _isOfflineMode = false;

// Offline statusunu əldə etmək
export const isOfflineMode = (): boolean => _isOfflineMode;

// Offline statusunu təyin etmək
export const setOfflineMode = (isOffline: boolean): void => {
  _isOfflineMode = isOffline;
  logger.info(`Connection status: ${isOffline ? 'Offline' : 'Online'}`);
};

// Şəbəkə xətasını yoxlamaq
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  return (
    (error.message && typeof error.message === 'string' && (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('connection')
    )) ||
    (error.code && [
      'PGRST301',
      'ECONNREFUSED',
      'ETIMEDOUT',
      'ERR_NETWORK'
    ].includes(error.code))
  );
};

// Keşləmə ilə sorğu etmək
export const queryWithCache = async <T>(
  prefix: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  ttl: number = CACHE_CONFIG.DEFAULT_TTL
): Promise<{ data: T | null; error: any }> => {
  const cacheKey = createCacheKey(prefix, Math.random().toString());
  
  // Əvvəlcə keşdən yoxlayın
  const cachedData = cacheManager.get<{ data: T | null; error: any }>(cacheKey);
  if (cachedData) {
    logger.debug(`Cache hit for ${cacheKey}`);
    return cachedData;
  }
  
  try {
    // Offline rejimində keşdə yoxdursa xəta
    if (isOfflineMode()) {
      return { 
        data: null, 
        error: { message: 'Device is offline and data is not in cache' } 
      };
    }
    
    // Real-time sorğu edin
    const result = await queryFn();
    
    // Keşdə saxlayın
    if (!result.error) {
      cacheManager.set(cacheKey, result, ttl);
    }
    
    return result;
  } catch (error) {
    // Şəbəkə xətası olduqda offline rejimə keçin
    if (isNetworkError(error)) {
      setOfflineMode(true);
    }
    
    logger.error(`Query error for ${prefix}:`, error);
    return { data: null, error };
  }
};

// Bütün keşi təmizləmək
export const clearCache = (): void => {
  cacheManager.clear();
  logger.info('Cache cleared');
};

// Prefix ilə keşi təmizləmək
export const clearCacheByPrefix = (prefix: string): void => {
  cacheManager.clearByPrefix(createCacheKey('', prefix));
  logger.info(`Cache cleared by prefix: ${prefix}`);
};
