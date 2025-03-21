
/**
 * Keşləmə mexanizmi Supabase sorğuları üçün
 */
import { logger } from '@/utils/logger';

// Cache configuration
export const CACHE_CONFIG = {
  DEFAULT_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  MAX_CACHE_ITEMS: 100,
  OFFLINE_STORAGE_KEY: 'supabase_offline_cache',
  ENABLED: true
};

// In-memory cache
const cache: Record<string, { data: any; timestamp: number; expiry: number }> = {};
let isOffline = false;

// Listen for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
    logger.info('Şəbəkə bağlantısı bərpa edildi, keş rejimi deaktivləşdirildi');
  });
  
  window.addEventListener('offline', () => {
    isOffline = true;
    logger.warn('Şəbəkə bağlantısı itirildi, keş rejimi aktivləşdirildi');
  });
  
  // Set initial offline state
  isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
}

// Get offline mode status
export const isOfflineMode = (): boolean => {
  return isOffline;
};

// Check if error is a network error
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check error message for network-related keywords
  if (typeof error.message === 'string') {
    const networkKeywords = ['network', 'internet', 'offline', 'connection', 'timeout', 'failed to fetch'];
    return networkKeywords.some(keyword => error.message.toLowerCase().includes(keyword));
  }
  
  // Check Supabase error codes
  if (error.code) {
    return ['PGRST301', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error.code);
  }
  
  return false;
};

// Store data in cache
export const cacheData = <T>(key: string, data: T, expiryMs: number = CACHE_CONFIG.DEFAULT_CACHE_TIME): void => {
  // Trim cache if it gets too large
  const cacheKeys = Object.keys(cache);
  if (cacheKeys.length > CACHE_CONFIG.MAX_CACHE_ITEMS) {
    // Remove oldest item
    let oldestKey = cacheKeys[0];
    let oldestTime = cache[oldestKey].timestamp;
    
    cacheKeys.forEach(k => {
      if (cache[k].timestamp < oldestTime) {
        oldestKey = k;
        oldestTime = cache[k].timestamp;
      }
    });
    
    delete cache[oldestKey];
  }
  
  // Store in cache
  cache[key] = {
    data,
    timestamp: Date.now(),
    expiry: expiryMs
  };
  
  // Also persist to localStorage for offline use
  try {
    const storageData = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiryMs
    };
    localStorage.setItem(`${CACHE_CONFIG.OFFLINE_STORAGE_KEY}_${key}`, JSON.stringify(storageData));
  } catch (error) {
    logger.warn('LocalStorage-də keş saxlanılması zamanı xəta', error);
  }
};

// Retrieve data from cache
export const getCachedData = <T>(key: string): T | null => {
  // Check memory cache first
  const cachedItem = cache[key];
  
  if (cachedItem) {
    const isExpired = (Date.now() - cachedItem.timestamp) > cachedItem.expiry;
    
    if (!isExpired) {
      return cachedItem.data as T;
    } else {
      // Remove expired item
      delete cache[key];
    }
  }
  
  // If not in memory or expired, try localStorage
  try {
    const storageKey = `${CACHE_CONFIG.OFFLINE_STORAGE_KEY}_${key}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (storedData) {
      const parsed = JSON.parse(storedData);
      
      // Check if expired
      if (parsed.expiry > Date.now()) {
        // Load back into memory cache
        cache[key] = {
          data: parsed.data,
          timestamp: parsed.timestamp,
          expiry: parsed.expiry - parsed.timestamp
        };
        return parsed.data as T;
      } else {
        // Remove expired item
        localStorage.removeItem(storageKey);
      }
    }
  } catch (error) {
    logger.warn('LocalStorage-dən keş oxunması zamanı xəta', error);
  }
  
  return null;
};

// Clear all cache
export const clearCache = (): void => {
  // Clear memory cache
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
  
  // Clear localStorage cache
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_CONFIG.OFFLINE_STORAGE_KEY)) {
        localStorage.removeItem(key);
      }
    });
    
    logger.info('Keş təmizləndi');
  } catch (error) {
    logger.warn('LocalStorage-dən keşin təmizlənməsi zamanı xəta', error);
  }
};

// Query with cache helper
export const queryWithCache = async <T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  cacheTime: number = CACHE_CONFIG.DEFAULT_CACHE_TIME
): Promise<T> => {
  // Check if caching is enabled
  if (!CACHE_CONFIG.ENABLED) {
    return await queryFn();
  }
  
  // Try to get from cache first
  const cachedData = getCachedData<T>(cacheKey);
  
  if (cachedData !== null) {
    logger.debug(`Keşdən məlumat alındı: ${cacheKey}`);
    return cachedData;
  }
  
  try {
    // Execute query
    const result = await queryFn();
    
    // Cache the result
    cacheData(cacheKey, result, cacheTime);
    
    return result;
  } catch (error) {
    // If we're offline and the query fails, try to get from cache as fallback
    if (isOffline || isNetworkError(error)) {
      const offlineData = getCachedData<T>(cacheKey);
      
      if (offlineData !== null) {
        logger.warn(`Şəbəkə xətası, köhnə keşlənmiş məlumat istifadə edilir: ${cacheKey}`);
        return offlineData;
      }
    }
    
    throw error;
  }
};
