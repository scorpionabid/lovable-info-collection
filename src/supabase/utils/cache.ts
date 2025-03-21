
/**
 * Supabase sorğuları üçün keşləmə mexanizmi
 */
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { CACHE_CONFIG } from '../config';
import { logger } from '@/utils/logger';

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
      logger.info(`Offline mode: Using cached data for ${cacheKey}`);
      return cachedResult;
    }
    throw new Error('Offline mode: No cached data available');
  }

  try {
    // Keşdən oxuma cəhdi
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      logger.debug(`Cache hit for ${cacheKey}`);
      return cachedResult;
    }

    // Keşdə yoxdursa, sorğu yerinə yetirilir
    logger.debug(`Cache miss for ${cacheKey}, fetching...`);
    const { data, error } = await queryFn();
    if (error) throw error;

    // Nəticəni keşə saxla
    setCachedResult(cacheKey, data, ttl);
    return data as T;
  } catch (error) {
    logger.error(`Error fetching or caching data for ${cacheKey}:`, error);
    
    // Xəta halında belə keşdən oxuma cəhdi
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      logger.info(`Using stale cache for ${cacheKey} after error`);
      return cachedResult;
    }
    
    throw error;
  }
}

// Keşi təmizləmək
export const clearCache = (): void => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(CACHE_CONFIG.storagePrefix)
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    logger.info('Cache cleared');
  }
};

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
    logger.error('Error reading from cache:', error);
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
    logger.error('Error writing to cache:', error);
  }
}
