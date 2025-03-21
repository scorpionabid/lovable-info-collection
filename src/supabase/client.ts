
/**
 * Mərkəzləşdirilmiş Supabase müştərisi
 * İnfoLine tətbiqi üçün əsas Supabase inteqrasiyası
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from './config';
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

// Əsas köməkçi funksiyalar
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

// Bağlantını yoxlamaq üçün
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

// Sorğu yaratmaq üçün köməkçi funksiyalar
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

export default supabase;
