
/**
 * Supabase client və köməkçi funksiyalar
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { toast } from 'sonner';

// Import configuration from lib/supabase
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  CACHE_CONFIG
} from '@/lib/supabase/config';

// Mərkəzi supabase müştərisi
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'infoLine' }
  }
});

// Xəta emalı üçün köməkçi funksiya
export const handleSupabaseError = (error: any, context: string = 'Supabase əməliyyatı'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Bilinməyən Supabase xətası'
  );
  
  console.error(`${context} xətası:`, error);
  // Optionally show error toast
  toast.error(`Xəta: ${formattedError.message}`);
  return formattedError;
};

// Check if we are in offline mode
export const isOfflineMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !navigator.onLine;
};

// Bağlantını yoxlamaq üçün funksiya
export const checkConnection = async (): Promise<boolean> => {
  try {
    const start = Date.now();
    
    // Sadə sorğu ilə bağlantını yoxla
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .limit(1)
      .maybeSingle();
    
    const duration = Date.now() - start;
    
    if (error) {
      console.error('Supabase bağlantı yoxlaması uğursuz oldu', { error, duration });
      return false;
    }
    
    console.log('Supabase bağlantı yoxlaması uğurlu oldu', { duration, hasData: !!data });
    return true;
  } catch (err) {
    console.error('Supabase bağlantı istisna halı', { error: err });
    return false;
  }
};

// Təkrar cəhd mexanizmi
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2,
  retryDelay = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  // Offline rejim yoxlaması
  if (isOfflineMode()) {
    console.log("Offline mode detected, can't perform request");
    throw new Error("You're offline. Please check your internet connection and try again.");
  }
  
  while (retries <= maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      const delay = retryDelay * Math.pow(1.5, retries - 1);
      console.log(`Təkrar cəhd ${retries}/${maxRetries}, ${delay}ms gözləyir...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Function for cached queries
export const queryWithCache = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlMs = CACHE_CONFIG.defaultTTL
): Promise<T> => {
  if (!CACHE_CONFIG.enabled) {
    return queryFn();
  }
  
  const cacheKey = `${CACHE_CONFIG.storagePrefix}${key}`;
  
  // Try to get from cache
  if (CACHE_CONFIG.persistToLocalStorage) {
    try {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        const { data, expiry } = JSON.parse(cachedItem);
        if (expiry > Date.now()) {
          console.log(`Cache hit for ${key}`);
          return data as T;
        }
        localStorage.removeItem(cacheKey); // Clear expired item
      }
    } catch (e) {
      console.warn('Error accessing cache:', e);
      // Continue with query if cache access fails
    }
  }
  
  // Execute the query
  const result = await queryFn();
  
  // Store in cache
  if (CACHE_CONFIG.persistToLocalStorage) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        expiry: Date.now() + ttlMs
      }));
    } catch (e) {
      console.warn('Error storing in cache:', e);
      // Continue even if caching fails
    }
  }
  
  return result;
};

// Export helper functions for query building
export const buildPaginatedQuery = (query: any, page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
};

export const buildSortedQuery = (query: any, field: string, ascending: boolean = true) => {
  return query.order(field, { ascending });
};

export const buildFilteredQuery = (query: any, filters: Record<string, any>) => {
  let result = query;
  
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    if (typeof value === 'string' && value.startsWith('%') && value.endsWith('%')) {
      result = result.ilike(key, value);
    } else {
      result = result.eq(key, value);
    }
  }
  
  return result;
};

export default supabase;
