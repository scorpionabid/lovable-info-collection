
/**
 * Mərkəzləşdirilmiş Supabase müştərisi
 * İnfoLine tətbiqi üçün əsas Supabase inteqrasiyası
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG, TABLES } from './config';
import { Database } from './types';
import { logger } from '@/utils/logger';

// Mərkəzi Supabase müştərisi
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  SUPABASE_CONFIG
);

// Auth hadisələrini izləmək 
supabase.auth.onAuthStateChange((event, session) => {
  logger.info('Auth hadisəsi baş verdi:', { event, sessionMövcuddur: !!session });
});

// Supabase xətalarını handle etmək
export const handleSupabaseError = (error: any, context: string = 'Supabase əməliyyatı'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Bilinməyən Supabase xətası'
  );
  
  console.error(`${context} xətası:`, error);
  return formattedError;
};

// Cari istifadəçi ilə əlaqəli funksiyalar
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    logger.error('İstifadəçi məlumatları alınarkən xəta:', error);
    return null;
  }
};

export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.id || null;
};

// Bağlantını yoxlamaq
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('regions')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (err) {
    logger.error('Supabase bağlantı xətası:', err);
    return false;
  }
};

// Təkrar cəhd mexanizmi
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  while (retries <= maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      const delay = 1000 * Math.pow(1.5, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Offline rejim yoxlaması
export const isOfflineMode = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

// Keş funksiyaları
export function getCachedResult<T>(key: string): T | null {
  try {
    const cacheKey = `infoline_${key}`;
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
    logger.error('Keşdən oxuma xətası:', error);
    return null;
  }
}

// Nəticəni keşə saxlamaq
export function setCachedResult<T>(key: string, value: T, ttl: number): void {
  try {
    const cacheKey = `infoline_${key}`;
    const data = {
      value,
      expiry: Date.now() + ttl
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (error) {
    logger.error('Keşə yazmada xəta:', error);
  }
}

// Keşlə sorğu
export async function queryWithCache<T>(
  cacheKey: string,
  queryFn: () => Promise<{ data: T, error: any }>,
  ttl: number = 5 * 60 * 1000 // 5 dəqiqə default
): Promise<T> {
  // Keş aktiv deyilsə, birbaşa sorğu et
  if (!CACHE_CONFIG.enabled) {
    const { data, error } = await queryFn();
    if (error) throw error;
    return data as T;
  }

  // Offline rejim yoxlaması
  if (isOfflineMode()) {
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      logger.info(`Offline rejim: ${cacheKey} üçün keşdən istifadə edilir`);
      return cachedResult;
    }
    throw new Error('Offline rejim: Keşdə məlumat tapılmadı');
  }

  try {
    // Keşdən oxuma cəhdi
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      logger.debug(`Keş tapıldı: ${cacheKey}`);
      return cachedResult;
    }

    // Keşdə yoxdursa, sorğu yerinə yetirilir
    logger.debug(`Keş tapılmadı: ${cacheKey}, sorğu edilir...`);
    const { data, error } = await queryFn();
    if (error) throw error;

    // Nəticəni keşə saxla
    setCachedResult(cacheKey, data, ttl);
    return data as T;
  } catch (error) {
    logger.error(`${cacheKey} üçün məlumatlar alınarkən xəta:`, error);
    
    // Xəta halında belə keşdən oxuma cəhdi
    const cachedResult = getCachedResult<T>(cacheKey);
    if (cachedResult) {
      logger.info(`Xəta sonrası ${cacheKey} üçün köhnə keşdən istifadə edilir`);
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
    logger.info('Keş təmizləndi');
  }
};

// Filterləmə, səhifələmə və sıralama üçün köməkçi funksiyalar
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
