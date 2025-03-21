
/**
 * Supabase sorğularını keşləmək üçün təchizat
 */
import { CACHE_CONFIG as config } from './config';

// Keş sadə obyekt
type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

const cache: Record<string, CacheEntry<any>> = {};

// Offline rejim məntiqi
let isOffline = false;

// Şəbəkə vəziyyətini izləmək
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
    console.log('Şəbəkə bağlantısı bərpa edildi');
  });
  
  window.addEventListener('offline', () => {
    isOffline = true;
    console.log('Şəbəkə bağlantısı itirildi, offline rejimə keçildi');
  });
  
  // İlkin şəbəkə vəziyyətini yoxla
  isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * Offline rejim vəziyyətini əldə etmək
 */
export const isOfflineMode = (): boolean => {
  return isOffline;
};

/**
 * Şəbəkə xətası olub-olmadığını yoxla
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // TypeError və DOMException xətaları adətən şəbəkə xətalarıdır
  if (error instanceof TypeError || error instanceof DOMException) {
    return true;
  }
  
  // Xəta mesajına görə şəbəkə xətasını təyin etmək
  if (error.message) {
    const netErrorPhrases = ['network', 'internet', 'fetch', 'connection', 'offline', 'timeout'];
    return netErrorPhrases.some(phrase => error.message.toLowerCase().includes(phrase));
  }
  
  // Error koduna görə şəbəkə xətasını təyin etmək
  if (error.code) {
    const netErrorCodes = ['NETWORK_ERROR', 'ETIMEDOUT', 'ECONNREFUSED', 'ECONNRESET'];
    return netErrorCodes.includes(error.code);
  }
  
  // HTTP status 5xx server xətalarıdır
  // HTTP status 4xx (özellikle 408, 429) şəbəkə ilə əlaqəli ola bilər
  if (error.status) {
    return error.status >= 500 || error.status === 408 || error.status === 429;
  }
  
  return false;
};

/**
 * Keşi təmizləmək
 */
export const clearCache = (): void => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
  
  // Saxlama mühitindən keşi təmizləmək
  if (config.persistToLocalStorage && typeof localStorage !== 'undefined') {
    // Yalnız infoline_ prefiksli elementləri silmək
    Object.keys(localStorage)
      .filter(key => key.startsWith(config.storagePrefix))
      .forEach(key => localStorage.removeItem(key));
  }
  
  console.log('Keş təmizləndi');
};

/**
 * Keş açarı yaratmaq
 */
const createCacheKey = (key: string): string => {
  return `${config.storagePrefix}${key}`;
};

/**
 * Keşdən dəyər əldə etmək
 */
const getFromCache = <T>(key: string): T | null => {
  const cacheKey = createCacheKey(key);
  const entry = cache[cacheKey];
  
  // Keşdə yoxdursa
  if (!entry) {
    // Local Storage'dan almağa cəhd et
    if (config.persistToLocalStorage && typeof localStorage !== 'undefined') {
      try {
        const storedItem = localStorage.getItem(cacheKey);
        
        if (storedItem) {
          const parsed = JSON.parse(storedItem) as CacheEntry<T>;
          
          // Əgər keşin vaxtı bitməyibsə
          if (parsed.expiresAt > Date.now()) {
            // Yaddaşdakı keşə qaytar
            cache[cacheKey] = parsed;
            return parsed.data;
          } else {
            // Vaxtı bitmiş keşi sil
            localStorage.removeItem(cacheKey);
          }
        }
      } catch (error) {
        console.error('Keş oxuma xətası:', error);
      }
    }
    
    return null;
  }
  
  // Vaxtı bitmiş keşi yoxla
  if (entry.expiresAt < Date.now()) {
    delete cache[cacheKey];
    return null;
  }
  
  return entry.data;
};

/**
 * Keşə dəyər əlavə etmək
 */
const saveToCache = <T>(key: string, data: T, ttl: number = config.defaultTTL): void => {
  if (!config.enabled) return;
  
  const cacheKey = createCacheKey(key);
  const timestamp = Date.now();
  const expiresAt = timestamp + ttl;
  
  // Yaddaşdakı keşə qaydet
  cache[cacheKey] = {
    data,
    timestamp,
    expiresAt
  };
  
  // Local Storage'a qaydet
  if (config.persistToLocalStorage && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp,
        expiresAt
      }));
    } catch (error) {
      console.error('Keş yazma xətası:', error);
      // Əgər yerli saxlama dolubsa, ən köhnə keş elementlərini təmizləməyə çalış
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        clearOldCacheItems();
      }
    }
  }
};

/**
 * Köhnə keş elementlərini təmizləmək (localStorage dolduqda)
 */
const clearOldCacheItems = (): void => {
  if (typeof localStorage === 'undefined') return;
  
  try {
    // Bütün keş açarlarını tapın
    const cacheKeys = Object.keys(localStorage)
      .filter(key => key.startsWith(config.storagePrefix));
    
    // Keş elementlərini tarix sırasına düzün
    const sortedCacheItems = cacheKeys
      .map(key => {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          return { key, timestamp: item.timestamp || 0 };
        } catch (e) {
          return { key, timestamp: 0 };
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp);
    
    // Ən köhnə 20% elementləri sil
    const itemsToRemove = Math.max(1, Math.floor(sortedCacheItems.length * 0.2));
    
    sortedCacheItems.slice(0, itemsToRemove).forEach(({ key }) => {
      localStorage.removeItem(key);
    });
    
    console.log(`${itemsToRemove} köhnə keş elementi təmizləndi`);
  } catch (error) {
    console.error('Köhnə keş təmizləmə xətası:', error);
  }
};

/**
 * Sorğunu keşləmək
 * @param key Keş açarı
 * @param queryFn Əsas sorğu funksiyası
 * @param ttl Keş müddəti (millisaniyə)
 */
export const queryWithCache = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = config.defaultTTL
): Promise<T> => {
  // Keş aktiv deyilsə
  if (!config.enabled) {
    return queryFn();
  }
  
  // Keşdən yoxla
  const cachedData = getFromCache<T>(key);
  if (cachedData !== null) {
    return cachedData;
  }
  
  // Keşdə yoxdursa - sorğunu icra et
  try {
    const data = await queryFn();
    
    // Keşə qaydet
    saveToCache<T>(key, data, ttl);
    
    return data;
  } catch (error) {
    // Şəbəkə xətası baş verərsə və keşlənmiş data varsa
    if (isNetworkError(error)) {
      const staleData = getFromCache<T>(`stale_${key}`);
      if (staleData !== null) {
        console.warn('Şəbəkə xətası səbəbindən köhnə keşlənmiş data istifadə edilir');
        return staleData;
      }
    }
    
    throw error;
  }
};

// Konfiqurasiyanı ixrac et
export { config as CACHE_CONFIG };
