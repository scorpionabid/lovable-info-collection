/**
 * Offline caching and data persistence utilities
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Cache configuration
export const CACHE_CONFIG = {
  CACHE_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours default cache duration
  STALE_TIME_MS: 15 * 60 * 1000, // 15 minutes stale time
  OFFLINE_FIRST: true, // Whether to prioritize cached data in offline mode
  PREFER_CACHE: false, // Whether to always prefer cache over network
  MAX_LOCAL_SIZE: 50 * 1024 * 1024, // 50MB max local storage
  RETRY_COUNT: 3, // Number of times to retry failed requests
  RETRY_DELAY_MS: 1000, // Initial delay between retries (increases exponentially)
};

// Check if we're in offline mode
export function isOfflineMode(): boolean {
  return !navigator.onLine;
}

// Main cache utility
export async function queryWithCache<T>(
  queryFn: () => Promise<{ data: T; error: any }>,
  cacheKey: string,
  options: {
    duration?: number;
    forceRefresh?: boolean;
    ignoreCache?: boolean;
  } = {}
): Promise<{ data: T; error: any; fromCache?: boolean }> {
  const {
    duration = CACHE_CONFIG.CACHE_DURATION_MS,
    forceRefresh = false,
    ignoreCache = false
  } = options;

  // If we're offline and have a cached result, use it
  const isOffline = isOfflineMode();
  if (isOffline || CACHE_CONFIG.PREFER_CACHE) {
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult && !forceRefresh) {
      return { ...cachedResult, fromCache: true };
    }
  }

  // If we're online or don't have a cached result, fetch new data
  if (!isOffline && !CACHE_CONFIG.PREFER_CACHE) {
    try {
      const result = await withRetry(() => queryFn());
      // Cache the result if successful
      if (result.data && !result.error) {
        setCachedResult(cacheKey, result, duration);
      }
      return { ...result, fromCache: false };
    } catch (error) {
      // If fetch failed and we have a cached result, use it
      const cachedResult = getCachedResult<T>(cacheKey);
      if (cachedResult) {
        return { ...cachedResult, fromCache: true };
      }
      // Otherwise, return the error
      return { data: null as unknown as T, error, fromCache: false };
    }
  }

  // We're offline and don't have a cached result
  return {
    data: null as unknown as T,
    error: new Error('Cannot fetch data: offline and no cached result available'),
    fromCache: false
  };
}

// Retry utility
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = CACHE_CONFIG.RETRY_COUNT,
  delay = CACHE_CONFIG.RETRY_DELAY_MS
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

// Get cached result
function getCachedResult<T>(key: string): { data: T; error: any } | null {
  try {
    const cached = localStorage.getItem(`cache:${key}`);
    if (!cached) return null;

    const { data, error, expires } = JSON.parse(cached);
    if (expires && new Date(expires) < new Date()) {
      // Cache expired
      localStorage.removeItem(`cache:${key}`);
      return null;
    }

    return { data, error };
  } catch (e) {
    console.warn('Cache read error:', e);
    return null;
  }
}

// Set cached result
function setCachedResult<T>(
  key: string,
  result: { data: T; error: any },
  duration: number
): void {
  try {
    const expires = new Date(new Date().getTime() + duration).toISOString();
    localStorage.setItem(
      `cache:${key}`,
      JSON.stringify({
        data: result.data,
        error: result.error,
        expires
      })
    );
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}

// Check and establish connection
export async function checkConnection(): Promise<boolean> {
  if (navigator.onLine) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/health`, { 
        method: 'HEAD',
        cache: 'no-cache',
        headers: { 'pragma': 'no-cache' }
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }
  return false;
}
