
/**
 * Supabase sorğuları üçün keşləmə mexanizmi
 */
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Keş konfiqurasiyası
export const CACHE_CONFIG = {
  enabled: true,
  defaultTTL: 5 * 60 * 1000, // 5 dəqiqə
  storagePrefix: 'infoline_',
  longTermTTL: 24 * 60 * 60 * 1000, // 1 gün
  persistToLocalStorage: true
};

// Offline rejim idarəetməsi üçün 
export const isOfflineMode = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

// Funksiyanın nəticəsini keşə saxlayan wrapper
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
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      console.log(`Offline mode: Using cached data for ${cacheKey}`);
      return cachedResult;
    }
    throw new Error('Offline mode: No cached data available');
  }

  try {
    // Keşdən oxuma cəhdi
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      console.log(`Cache hit for ${cacheKey}`);
      return cachedResult;
    }

    // Keşdə yoxdursa, sorğu yerinə yetirilir
    console.log(`Cache miss for ${cacheKey}, fetching...`);
    const { data, error } = await queryFn();
    if (error) throw error;

    // Nəticəni keşə saxla
    setCachedResult(cacheKey, data, ttl);
    return data as T;
  } catch (error) {
    console.error(`Error fetching or caching data for ${cacheKey}:`, error);
    
    // Xəta halında belə keşdən oxuma cəhdi
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      console.log(`Using stale cache for ${cacheKey} after error`);
      return cachedResult;
    }
    
    throw error;
  }
}

// Təkrar cəhd mexanizmi
export async function withRetry<T>(
  queryFn: () => Promise<{ data: T; error: any }>,
  maxRetries: number = 2,
  initialDelay: number = 1000
): Promise<T> {
  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await queryFn();
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Exponential backoff
      }
    }
  }

  throw lastError;
}

// Supabase bağlantısını yoxlamaq
export async function checkConnection(): Promise<boolean> {
  return true; // Implement real connectivity check if needed
}

// Keşdən nəticəni almaq
function getCachedResult<T>(key: string): T | null {
  try {
    const cacheKey = `${CACHE_CONFIG.storagePrefix}${key}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (!cachedData) return null;
    
    const { value, expiry } = JSON.parse(cachedData);
    
    if (expiry && expiry < Date.now()) {
      // Keş vaxtı bitib, sil və null qaytar
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return value as T;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
}

// Nəticəni keşə saxlamaq
function setCachedResult<T>(key: string, value: T, ttl: number): void {
  try {
    const cacheKey = `${CACHE_CONFIG.storagePrefix}${key}`;
    const data = {
      value,
      expiry: Date.now() + ttl
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}
