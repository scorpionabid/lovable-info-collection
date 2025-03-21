// Simple in-memory cache for API responses

const cacheConfig = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  regions: 10 * 60 * 1000,   // 10 minutes for regions
  sectors: 10 * 60 * 1000,   // 10 minutes for sectors
  schools: 5 * 60 * 1000,    // 5 minutes for schools
  users: 2 * 60 * 1000,      // 2 minutes for users
  roles: 30 * 60 * 1000,     // 30 minutes for roles
  enabled: true,             // Enable/disable cache globally
  storagePrefix: 'supabase_cache_'
};

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// In-memory cache store
const memoryCache: Record<string, CacheEntry<any>> = {};

/**
 * Gets data from cache if it exists and is not expired
 */
export const getFromCache = <T>(key: string): T | null => {
  if (!cacheConfig.enabled) return null;
  
  try {
    // Try memory cache first
    const cached = memoryCache[key];
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    // Try local storage as fallback
    const storageKey = `${cacheConfig.storagePrefix}${key}`;
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      const { data, expiry } = JSON.parse(storedValue);
      if (expiry > Date.now()) {
        // Add to memory cache for faster access next time
        memoryCache[key] = { data, expiry };
        return data;
      } else {
        // Clean up expired storage
        localStorage.removeItem(storageKey);
      }
    }
  } catch (error) {
    console.warn('Cache retrieval error:', error);
  }
  
  return null;
};

/**
 * Stores data in cache with appropriate TTL
 */
export const setInCache = <T>(key: string, data: T, type?: keyof typeof cacheConfig): void => {
  if (!cacheConfig.enabled) return;
  
  try {
    // Determine TTL based on data type
    const ttl = type && cacheConfig[type] ? cacheConfig[type] : cacheConfig.defaultTTL;
    const cacheExpirationMs = typeof ttl === 'number' ? ttl : 3600 * 1000;
    const expiry = Date.now() + cacheExpirationMs;
    
    // Store in memory cache
    memoryCache[key] = { data, expiry };
    
    // Store in local storage for persistence
    const storageKey = `${cacheConfig.storagePrefix}${key}`;
    localStorage.setItem(storageKey, JSON.stringify({ data, expiry }));
  } catch (error) {
    console.warn('Cache set error:', error);
  }
};

/**
 * Invalidates specific cache entry
 */
export const invalidateCache = (key: string): void => {
  try {
    // Remove from memory cache
    delete memoryCache[key];
    
    // Remove from local storage
    const storageKey = `${cacheConfig.storagePrefix}${key}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.warn('Cache invalidation error:', error);
  }
};

/**
 * Invalidates all cache entries or a specific type
 */
export const clearAllCache = (type?: string): void => {
  try {
    // Clear memory cache
    if (type) {
      Object.keys(memoryCache).forEach(key => {
        if (key.startsWith(type)) {
          delete memoryCache[key];
        }
      });
    } else {
      Object.keys(memoryCache).forEach(key => {
        delete memoryCache[key];
      });
    }
    
    // Clear localStorage cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(cacheConfig.storagePrefix)) {
        if (!type || key.includes(type)) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn('Cache clear error:', error);
  }
};

export default {
  getFromCache,
  setInCache,
  invalidateCache,
  clearAllCache
};
