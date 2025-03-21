
/**
 * Supabase cache implementation for optimizing queries
 */
import { supabase } from './index';

// Cache configuration
export const CACHE_CONFIG = {
  enabled: true,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  storagePrefix: 'infoline_',
  longTermTTL: 24 * 60 * 60 * 1000, // 1 day
  persistToLocalStorage: true
};

// Store for in-memory cache
const memoryCache: Record<string, { data: any; expiry: number }> = {};

// Check if running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Check if offline mode is enabled
export function isOfflineMode(): boolean {
  if (!isBrowser) return false;
  return localStorage.getItem('offline_mode') === 'true';
}

// Enable/disable offline mode
export function setOfflineMode(enabled: boolean): void {
  if (!isBrowser) return;
  localStorage.setItem('offline_mode', enabled ? 'true' : 'false');
}

// Generate a cache key from query parameters
export function generateCacheKey(table: string, params?: Record<string, any>): string {
  const paramsStr = params ? JSON.stringify(params) : '';
  return `${CACHE_CONFIG.storagePrefix}${table}:${paramsStr}`;
}

// Store data in cache
export function storeInCache(key: string, data: any, ttl = CACHE_CONFIG.defaultTTL): void {
  if (!CACHE_CONFIG.enabled) return;

  const expiry = Date.now() + ttl;
  memoryCache[key] = { data, expiry };

  // Optionally persist to localStorage
  if (CACHE_CONFIG.persistToLocalStorage && isBrowser) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          data,
          expiry
        })
      );
    } catch (error) {
      console.warn('Failed to store cache in localStorage:', error);
    }
  }
}

// Retrieve data from cache
export function getFromCache(key: string): { data: any; fresh: boolean } | null {
  if (!CACHE_CONFIG.enabled) return null;

  // Try memory cache first
  const memoryItem = memoryCache[key];
  if (memoryItem && memoryItem.expiry > Date.now()) {
    return { data: memoryItem.data, fresh: true };
  }

  // Try localStorage if memory cache failed
  if (CACHE_CONFIG.persistToLocalStorage && isBrowser) {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (parsed.expiry > Date.now()) {
          // Refresh memory cache
          memoryCache[key] = parsed;
          return { data: parsed.data, fresh: true };
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve cache from localStorage:', error);
    }
  }

  // Look for stale data for offline mode
  if (isOfflineMode()) {
    // Try memory first
    if (memoryItem) {
      return { data: memoryItem.data, fresh: false };
    }

    // Try localStorage
    if (CACHE_CONFIG.persistToLocalStorage && isBrowser) {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          return { data: parsed.data, fresh: false };
        }
      } catch (error) {
        console.warn('Failed to retrieve stale cache from localStorage:', error);
      }
    }
  }

  return null;
}

// Clear cache items
export function clearCache(prefix?: string): void {
  // Clear memory cache
  if (prefix) {
    Object.keys(memoryCache).forEach(key => {
      if (key.startsWith(prefix)) {
        delete memoryCache[key];
      }
    });
  } else {
    Object.keys(memoryCache).forEach(key => {
      delete memoryCache[key];
    });
  }

  // Clear localStorage cache
  if (CACHE_CONFIG.persistToLocalStorage && isBrowser) {
    try {
      if (prefix) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_CONFIG.storagePrefix)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to clear cache from localStorage:', error);
    }
  }
}

// Query with cache support
export async function queryWithCache<T = any>(
  table: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  cacheTTL = CACHE_CONFIG.defaultTTL
): Promise<{ data: T | null; error: any }> {
  const cacheKey = generateCacheKey(table);
  
  // Try to get from cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return { data: cached.data, error: null };
  }
  
  // Run actual query if no cache or cache expired
  try {
    const result = await queryFn();
    
    // Cache successful results
    if (!result.error && result.data !== null) {
      storeInCache(cacheKey, result.data, cacheTTL);
    }
    
    return result;
  } catch (error) {
    return { data: null, error };
  }
}

// Check connection status
export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('regions').select('id').limit(1);
    return !error;
  } catch (e) {
    return false;
  }
}

// Retry function with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  retryDelay = 1000,
  offlineQueueable = true
): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      // If offline and function is queueable, store for later
      if (isOfflineMode() && offlineQueueable) {
        // In a real implementation, this would store the operation in a queue
        // For now, just throw an error
        throw new Error("Operation cannot be performed while offline");
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retries - 1)));
    }
  }
}

// Export for use in baseService
export { CACHE_CONFIG };
