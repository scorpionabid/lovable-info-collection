
/**
 * Keşləmə sistemi
 */
import { logger } from '@/utils/logger';

export interface CacheOptions {
  ttl?: number; // Milliseconds
  cacheKey?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 dəqiqə
  STORAGE_KEY_PREFIX: 'infoline_cache_',
  MAX_CACHE_SIZE: 100, // Max entries
  CLEANUP_INTERVAL: 10 * 60 * 1000, // 10 dəqiqə
};

// In-memory cache
const memoryCache = new Map<string, CacheEntry<any>>();

// Generate a cache key
export const generateCacheKey = (
  key: string, 
  params?: Record<string, any>
): string => {
  if (!params) return key;
  
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((obj, k) => {
      obj[k] = params[k];
      return obj;
    }, {} as Record<string, any>);
  
  return `${key}_${JSON.stringify(sortedParams)}`;
};

// Set item in cache
export const setCacheItem = <T>(
  key: string,
  data: T,
  options: CacheOptions = {}
): void => {
  const ttl = options.ttl || CACHE_CONFIG.DEFAULT_TTL;
  const now = Date.now();
  
  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    expiry: now + ttl
  };
  
  try {
    // Set in memory cache
    memoryCache.set(key, entry);
    
    // Also persist in localStorage when possible
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`,
        JSON.stringify(entry)
      );
    }
  } catch (error) {
    logger.warn('Cache set error:', error);
  }
};

// Get item from cache
export const getCacheItem = <T>(key: string): T | null => {
  try {
    // First check memory cache
    if (memoryCache.has(key)) {
      const entry = memoryCache.get(key) as CacheEntry<T>;
      
      // Check if expired
      if (entry.expiry > Date.now()) {
        return entry.data;
      }
      
      // Expired, remove from cache
      memoryCache.delete(key);
    }
    
    // Then check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`);
      
      if (stored) {
        const entry = JSON.parse(stored) as CacheEntry<T>;
        
        // Check if expired
        if (entry.expiry > Date.now()) {
          // Sync to memory cache
          memoryCache.set(key, entry);
          return entry.data;
        }
        
        // Expired, remove from localStorage
        localStorage.removeItem(`${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`);
      }
    }
    
    return null;
  } catch (error) {
    logger.warn('Cache get error:', error);
    return null;
  }
};

// Remove item from cache
export const removeCacheItem = (key: string): void => {
  try {
    memoryCache.delete(key);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${CACHE_CONFIG.STORAGE_KEY_PREFIX}${key}`);
    }
  } catch (error) {
    logger.warn('Cache remove error:', error);
  }
};

// Clear all cache
export const clearCache = (): void => {
  try {
    memoryCache.clear();
    
    if (typeof window !== 'undefined') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_CONFIG.STORAGE_KEY_PREFIX)) {
          keys.push(key);
        }
      }
      
      keys.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    logger.warn('Cache clear error:', error);
  }
};

// Check if network is available
export const isOfflineMode = (): boolean => {
  if (typeof navigator !== 'undefined') {
    return !navigator.onLine;
  }
  return false;
};

// Helper to check if an error is a network error
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Check common network error messages
  const errorMessage = error.message?.toLowerCase() || '';
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('cors') ||
    errorMessage.includes('timeout') ||
    (typeof error.status === 'number' && error.status === 0) ||
    (typeof navigator !== 'undefined' && !navigator.onLine)
  );
};

// Query with cache wrapper function
export const queryWithCache = async <T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> => {
  // First check cache
  const cached = getCacheItem<T>(cacheKey);
  
  if (cached) {
    logger.debug(`Cache hit for key: ${cacheKey}`);
    return cached;
  }
  
  logger.debug(`Cache miss for key: ${cacheKey}`);
  
  // Not in cache, perform query
  if (isOfflineMode()) {
    logger.warn('Attempting to fetch data while offline');
    throw new Error('Offline mode active, cannot fetch new data');
  }
  
  try {
    const result = await queryFn();
    
    // Store in cache
    setCacheItem<T>(cacheKey, result, { ttl });
    
    return result;
  } catch (error) {
    logger.error(`Query error for key ${cacheKey}:`, error);
    throw error;
  }
};

// Clean up expired cache entries
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    
    // Clean memory cache
    for (const [key, entry] of memoryCache.entries()) {
      if (entry.expiry < now) {
        memoryCache.delete(key);
      }
    }
    
    // Clean localStorage cache
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_CONFIG.STORAGE_KEY_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const entry = JSON.parse(stored) as CacheEntry<any>;
            if (entry.expiry < now) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      logger.warn('Cache cleanup error:', error);
    }
  }, CACHE_CONFIG.CLEANUP_INTERVAL);
}
