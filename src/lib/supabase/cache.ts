
/**
 * Keşləmə funksiyaları və konfiqurasiyası
 */
import { logger } from '@/utils/logger';

// Keş konfigurasyonu
export const CACHE_CONFIG = {
  defaultExpiry: 5 * 60 * 1000, // 5 dəqiqə
  storagePrefix: 'infoLine_cache_',
  offlineStorageKey: 'infoLine_offline_operations',
  maxCacheItems: 100,
  maxOfflineItems: 50
};

// Keş üçün məlumat strukturu
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Məlumatlar üçün lokal saxlama
const getFromStorage = <T>(key: string): CacheItem<T> | null => {
  try {
    const item = localStorage.getItem(`${CACHE_CONFIG.storagePrefix}${key}`);
    if (!item) return null;
    return JSON.parse(item);
  } catch (error) {
    logger.warn(`Lokal keşdən oxunarkən xəta: ${error}`);
    return null;
  }
};

const saveToStorage = <T>(key: string, data: T, expiryMs = CACHE_CONFIG.defaultExpiry): void => {
  try {
    const now = Date.now();
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + expiryMs
    };
    localStorage.setItem(
      `${CACHE_CONFIG.storagePrefix}${key}`, 
      JSON.stringify(cacheItem)
    );
  } catch (error) {
    logger.warn(`Lokal keşə yazarkən xəta: ${error}`);
  }
};

// Keşi idarə etmək üçün funksiyalar
export const isOfflineMode = (): boolean => {
  return !navigator.onLine;
};

export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  // İnternet bağlantısı xətalarını yoxlayın
  if (!navigator.onLine) return true;
  if (error.message && (
    error.message.includes('Failed to fetch') ||
    error.message.includes('NetworkError') ||
    error.message.includes('Network request failed') ||
    error.message.includes('Network Error')
  )) {
    return true;
  }
  // HTTP 5xx xətalarını yoxlayın
  if (error.status && error.status >= 500 && error.status < 600) {
    return true;
  }
  return false;
};

// Keşi təmizləmək üçün funksiya
export const clearCache = (pattern?: string): void => {
  try {
    const keys = Object.keys(localStorage);
    const prefix = CACHE_CONFIG.storagePrefix;
    
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        if (!pattern || key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      }
    });
    
    logger.info(`Keş təmizləndi. ${pattern || 'Bütün keş'}`);
  } catch (error) {
    logger.error(`Keş təmizlənməsi xətası: ${error}`);
  }
};

// Keşi istifadə edərək sorğu yerinə yetir
export const queryWithCache = async <T>(
  cacheKey: string,
  queryFn: () => Promise<{ data: T, error: any }>,
  cacheTimeMs: number = CACHE_CONFIG.defaultExpiry
): Promise<{ data: T, error: any }> => {
  // Offline və keş bağlı xüsusi nəzarət
  const offline = isOfflineMode();
  
  // Əvvəlcə keşdə yoxlayırıq
  const cachedItem = getFromStorage<T>(cacheKey);
  const now = Date.now();
  
  // Keş aktiv və müddəti bitməyibsə, keşdən qaytarırıq
  if (cachedItem && cachedItem.expiresAt > now) {
    logger.debug(`Keşdən məlumat alındı: ${cacheKey}`);
    return { data: cachedItem.data, error: null };
  }
  
  // Offline rejimdəyik, amma keş köhnədirsə
  if (offline && cachedItem) {
    logger.warn(`Offline rejim, köhnə keş istifadə edilir: ${cacheKey}`);
    return { data: cachedItem.data, error: null };
  }
  
  // Offline rejimdəyik və keş yoxdursa
  if (offline && !cachedItem) {
    logger.error(`Offline rejim, keş yoxdur: ${cacheKey}`);
    return { 
      data: null as unknown as T, 
      error: new Error('Offline rejim, keş yoxdur')
    };
  }
  
  try {
    // Sorğunu yerinə yetir
    const result = await queryFn();
    
    // Xəta yoxdursa, keşə məlumatı yaz
    if (!result.error && result.data) {
      saveToStorage(cacheKey, result.data, cacheTimeMs);
    }
    
    return result;
  } catch (error) {
    logger.error(`Sorğu xətası (${cacheKey}): ${error}`);
    
    // Şəbəkə xətasıdırsa və keş varsa, keşdən istifadə et
    if (isNetworkError(error) && cachedItem) {
      logger.warn(`Şəbəkə xətası, köhnə keş istifadə edilir: ${cacheKey}`);
      return { data: cachedItem.data, error: null };
    }
    
    return { 
      data: null as unknown as T, 
      error: error
    };
  }
};
