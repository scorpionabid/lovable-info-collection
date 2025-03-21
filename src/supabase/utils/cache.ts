/**
 * Supabase sorğuları üçün keşləmə mexanizmi
 */
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { logInfo, logError, logDebug } from './logger';
import { isOfflineMode, checkConnection } from './errorHandling';
import { CACHE_CONFIG } from '../config';

// Keş girişi interfeysi
interface CacheEntry<T> {
  data: T;
  expiry: number;
  timestamp: number;
}

// Yaddaşda keş saxlamaq üçün
const memoryCache: Record<string, CacheEntry<any>> = {};

/**
 * Keşdən məlumatları əldə edir
 * @param key - Keş açarı
 * @returns Keşdən əldə edilən məlumat və ya null
 */
export const getFromCache = <T>(key: string): T | null => {
  if (!CACHE_CONFIG.enabled) return null;
  
  try {
    // Əvvəlcə yaddaşdakı keşi yoxla
    const cached = memoryCache[key];
    if (cached && cached.expiry > Date.now()) {
      logDebug(`Cache hit for ${key} (memory)`);
      return cached.data;
    }
    
    // Local storage-də yoxla
    if (CACHE_CONFIG.persistToLocalStorage && typeof localStorage !== 'undefined') {
      const storageKey = `${CACHE_CONFIG.storagePrefix}${key}`;
      const storedValue = localStorage.getItem(storageKey);
      
      if (storedValue) {
        const { data, expiry, timestamp } = JSON.parse(storedValue);
        if (expiry > Date.now()) {
          // Daha sürətli giriş üçün yaddaşa əlavə et
          memoryCache[key] = { data, expiry, timestamp };
          logDebug(`Cache hit for ${key} (localStorage)`);
          return data;
        } else {
          // Vaxtı keçmiş keşi təmizlə
          localStorage.removeItem(storageKey);
          logDebug(`Removed expired cache for ${key}`);
        }
      }
    }
  } catch (error) {
    logError(error, `Cache retrieval error for ${key}`);
  }
  
  return null;
};

/**
 * Məlumatları keşə saxlayır
 * @param key - Keş açarı
 * @param data - Saxlanacaq məlumat
 * @param ttl - Saxlama müddəti (millisaniyə ilə)
 */
export const setInCache = <T>(key: string, data: T, ttl?: number): void => {
  if (!CACHE_CONFIG.enabled) return;
  
  try {
    // Müddəti təyin et
    const cacheExpirationMs = ttl || CACHE_CONFIG.defaultTTL;
    const expiry = Date.now() + cacheExpirationMs;
    const timestamp = Date.now();
    
    // Yaddaşda saxla
    memoryCache[key] = { data, expiry, timestamp };
    
    // Local storage-də saxla
    if (CACHE_CONFIG.persistToLocalStorage && typeof localStorage !== 'undefined') {
      const storageKey = `${CACHE_CONFIG.storagePrefix}${key}`;
      localStorage.setItem(storageKey, JSON.stringify({ data, expiry, timestamp }));
      logDebug(`Cached ${key} (expires in ${Math.floor(cacheExpirationMs/1000)}s)`);
    }
  } catch (error) {
    logError(error, `Cache set error for ${key}`);
  }
};

/**
 * Konkret keş girişini silir
 * @param key - Silinəcək keş açarı
 */
export const invalidateCache = (key: string): void => {
  try {
    // Yaddaşdan sil
    delete memoryCache[key];
    
    // Local storage-dən sil
    if (CACHE_CONFIG.persistToLocalStorage && typeof localStorage !== 'undefined') {
      const storageKey = `${CACHE_CONFIG.storagePrefix}${key}`;
      localStorage.removeItem(storageKey);
      logDebug(`Invalidated cache for ${key}`);
    }
  } catch (error) {
    logError(error, `Cache invalidation error for ${key}`);
  }
};

/**
 * Bütün keş girişlərini və ya müəyyən bir tipə aid olanları silir
 * @param type - Silinəcək keş tipi (istəgə bağlı)
 */
export const clearAllCache = (type?: string): void => {
  try {
    // Yaddaşdakı keşi təmizlə
    if (type) {
      Object.keys(memoryCache).forEach(key => {
        if (key.startsWith(type)) {
          delete memoryCache[key];
        }
      });
      logDebug(`Cleared all ${type} cache entries from memory`);
    } else {
      Object.keys(memoryCache).forEach(key => {
        delete memoryCache[key];
      });
      logDebug('Cleared all cache entries from memory');
    }
    
    // LocalStorage keşini təmizlə
    if (typeof localStorage !== 'undefined') {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_CONFIG.storagePrefix)) {
          if (!type || key.includes(type)) {
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      if (type) {
        logDebug(`Cleared all ${type} cache entries from localStorage (${keysToRemove.length} items)`);
      } else {
        logDebug(`Cleared all cache entries from localStorage (${keysToRemove.length} items)`);
      }
    }
  } catch (error) {
    logError(error, 'Cache clear error');
  }
};

/**
 * Supabase sorğusunu keşləmək üçün wrapper funksiya
 * @param cacheKey - Keş açarı
 * @param queryFn - Supabase sorğu funksiyası
 * @param ttl - Keşin saxlanma müddəti
 * @returns Sorğu nəticəsi
 */
export async function queryWithCache<T>(
  cacheKey: string,
  queryFn: () => Promise<PostgrestSingleResponse<T>>,
  ttl: number = CACHE_CONFIG.defaultTTL
): Promise<T> {
  if (!CACHE_CONFIG.enabled) {
    const { data, error } = await queryFn();
    if (error) throw error;
    return data as T;
  }

  // Offline rejim yoxlaması
  if (isOfflineMode()) {
    const cachedResult = getFromCache<T>(cacheKey);
    if (cachedResult) {
      logInfo(`Offline mode: Using cached data for ${cacheKey}`);
      return cachedResult;
    }
    throw new Error('Offline mode: No cached data available');
  }

  try {
    // Keşdən oxuma cəhdi
    const cachedResult = getFromCache<T>(cacheKey);
    if (cachedResult) {
      // Arxa planda keşi yeniləmək üçün
      if (CACHE_CONFIG.staleWhileRevalidate) {
        setTimeout(async () => {
          try {
            const { data, error } = await queryFn();
            if (!error && data) {
              setInCache(cacheKey, data, ttl);
              logDebug(`Background cache refresh for ${cacheKey}`);
            }
          } catch (refreshError) {
            logError(refreshError, `Background refresh error for ${cacheKey}`);
          }
        }, 100);
      }
      return cachedResult;
    }

    // Keşdə yoxdursa, sorğu yerinə yetirilir
    const { data, error } = await queryFn();
    if (error) throw error;
    
    // Nəticəni keşə yaz
    if (data) {
      setInCache(cacheKey, data, ttl);
    }
    
    return data as T;
  } catch (error) {
    logError(error, `Query cache error for ${cacheKey}`);
    throw error;
  }
}

// Funksiyaları ixrac et
export const clearCache = clearAllCache; // Geriyə uyğunluq üçün alias

export default {
  getFromCache,
  setInCache,
  invalidateCache,
  clearAllCache,
  clearCache,
  queryWithCache
};
