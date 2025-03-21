
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Keş konfiqurasiyası
export const CACHE_CONFIG = {
  CACHE_EXPIRY_MS: 5 * 60 * 1000, // 5 dəqiqə
  CACHE_ENABLED: true
};

// Offline mode kontrolu
const LOCAL_STORAGE_KEYS = {
  OFFLINE_MODE: 'supabase_offline_mode'
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

export default supabase;

// Repeated operations with retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      console.error('Retry limit exceeded', error);
      throw error;
    }

    console.warn(`Operation failed, retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return withRetry(operation, retries - 1, delay * backoff, backoff);
  }
};

// Check if we are in offline mode
export const isOfflineMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const storedValue = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFLINE_MODE);
  return storedValue === 'true';
};

// Set offline mode
export const setOfflineMode = (isOffline: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEYS.OFFLINE_MODE, isOffline ? 'true' : 'false');
};

// Cache implementation
type CacheItem<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheItem<any>>();

export const queryWithCache = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    staleTime?: number;
    forceRefresh?: boolean;
  } = {}
): Promise<T> => {
  const {
    enabled = CACHE_CONFIG.CACHE_ENABLED,
    staleTime = CACHE_CONFIG.CACHE_EXPIRY_MS,
    forceRefresh = false
  } = options;

  // Skip cache in certain conditions
  if (!enabled || forceRefresh) {
    const data = await queryFn();
    if (enabled) {
      cache.set(key, { data, timestamp: Date.now() });
    }
    return data;
  }

  // Check if we have cached data
  const cachedItem = cache.get(key);
  const now = Date.now();

  if (cachedItem && (now - cachedItem.timestamp < staleTime)) {
    console.log(`[Cache] Using cached data for ${key}`);
    return cachedItem.data;
  }

  // Get fresh data
  try {
    const data = await queryFn();
    cache.set(key, { data, timestamp: now });
    return data;
  } catch (error) {
    // If we have stale data, return it on error
    if (cachedItem) {
      console.warn(`[Cache] Error fetching fresh data, using stale cache for ${key}`, error);
      return cachedItem.data;
    }
    throw error;
  }
};

// Clear all or specific cache items
export const clearCache = (key?: string): void => {
  if (key) {
    cache.delete(key);
    console.log(`[Cache] Cleared cache for ${key}`);
  } else {
    cache.clear();
    console.log('[Cache] Cleared all cache');
  }
};
