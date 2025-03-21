
/**
 * Supabase keşləmə funksionallığı üçün köməkçi funksiyalar
 */
import { logger } from '@/utils/logger';
import { CACHE_CONFIG } from './config';

// Keş strukturu
interface CacheEntry<T> {
  timestamp: number;
  data: T;
  expiresAt: number;
}

// Keş xəritəsi - memory cache
const cache = new Map<string, CacheEntry<any>>();

// Offline rejimi yoxlama
export const isOfflineMode = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

// Şəbəkə xətası olub-olmadığını yoxla
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Xəta mesajında şəbəkə ilə əlaqəli açar sözlər
  const networkErrorKeywords = [
    'network', 'fetch', 'timeout', 'abort', 'connection', 
    'offline', 'internet', 'ECONNREFUSED', 'ETIMEDOUT'
  ];
  
  // Xəta mesajında şəbəkə açar sözlərini axtar
  if (error.message && typeof error.message === 'string') {
    return networkErrorKeywords.some(keyword => 
      error.message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  // Xəta kodunda şəbəkə ilə əlaqəli kodları yoxla
  if (error.code) {
    return ['PGRST301', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error.code);
  }
  
  return false;
};

/**
 * Keşi təmizləmək üçün funksiya
 */
export const clearCache = (): void => {
  cache.clear();
  logger.info(`Keş təmizləndi, ${cache.size} element silinmişdir`);
  
  // Local storage keşini təmizlə
  if (CACHE_CONFIG.persistToLocalStorage && typeof window !== 'undefined') {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_CONFIG.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
    logger.info('LocalStorage keşi təmizləndi');
  }
};

/**
 * Keşdən element əldə etmək üçün funksiya
 */
export const getCacheEntry = <T>(key: string): CacheEntry<T> | undefined => {
  // İlk olaraq memory keşdən yoxla
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  
  // Keş tapılmadıqda və LocalStorage saxlanması aktiv olduqda
  if (!entry && CACHE_CONFIG.persistToLocalStorage && typeof window !== 'undefined') {
    try {
      const localStorageKey = `${CACHE_CONFIG.storagePrefix}${key}`;
      const storedValue = localStorage.getItem(localStorageKey);
      
      if (storedValue) {
        const parsed = JSON.parse(storedValue) as CacheEntry<T>;
        
        // Vaxtı keçmədiyi halda keşə əlavə et və qaytar
        if (parsed.expiresAt > Date.now()) {
          cache.set(key, parsed);
          return parsed;
        } else {
          // Vaxtı keçmiş elementi sil
          localStorage.removeItem(localStorageKey);
        }
      }
    } catch (error) {
      logger.error(`LocalStorage keş xətası: ${error}`);
    }
  }
  
  return entry;
};

/**
 * Keşə element əlavə etmək üçün funksiya
 */
export const setCacheEntry = <T>(key: string, data: T, ttl: number = CACHE_CONFIG.defaultTTL): void => {
  const now = Date.now();
  const entry: CacheEntry<T> = {
    timestamp: now,
    data,
    expiresAt: now + ttl
  };
  
  // Memory keşə əlavə et
  cache.set(key, entry);
  
  // LocalStorage-ə əlavə et
  if (CACHE_CONFIG.persistToLocalStorage && typeof window !== 'undefined') {
    try {
      const localStorageKey = `${CACHE_CONFIG.storagePrefix}${key}`;
      localStorage.setItem(localStorageKey, JSON.stringify(entry));
    } catch (error) {
      logger.error(`LocalStorage keş yazma xətası: ${error}`);
    }
  }
};

/**
 * Keşdə elementin etibarlı olub-olmadığını yoxlamaq
 */
export const isCacheValid = <T>(entry: CacheEntry<T>): boolean => {
  return entry.expiresAt > Date.now();
};

/**
 * Sorğu nəticəsini keşləmək üçün əsas funksiya
 */
export const queryWithCache = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = CACHE_CONFIG.defaultTTL
): Promise<T> => {
  // Keş aktiv olmadığı halda birbaşa sorğu yerinə yetir
  if (!CACHE_CONFIG.enabled) {
    return await queryFn();
  }
  
  // Keşdən yoxla
  const cachedEntry = getCacheEntry<T>(key);
  
  // Etibarlı keş tapıldıqda qaytar
  if (cachedEntry && isCacheValid(cachedEntry)) {
    logger.debug(`Keşdən məlumat alındı: ${key}`);
    return cachedEntry.data;
  }
  
  // Keş tapılmadıqda və ya vaxtı keçdikdə sorğu yerinə yetir
  try {
    const result = await queryFn();
    
    // Keşə əlavə et
    setCacheEntry<T>(key, result, ttl);
    logger.debug(`Keşə əlavə edildi: ${key}`);
    
    return result;
  } catch (error) {
    // Xəta halında offline rejimdə keşdən köhnə məlumatı qaytar
    if (isOfflineMode() && cachedEntry) {
      logger.warn(`Offline rejim, köhnə keş məlumatı istifadə edilir: ${key}`);
      return cachedEntry.data;
    }
    
    // Əks halda xətanı qaytarmaq
    throw error;
  }
};
