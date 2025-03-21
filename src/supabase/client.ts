
/**
 * Əsas Supabase klienti və əlaqəli funksiyalar
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from './config';
import type { Database } from './types';
import { logInfo, logError } from './utils/logger';

// Supabase klienti yaratma
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    ...SUPABASE_CONFIG,
    global: {
      ...SUPABASE_CONFIG.global,
      headers: {
        ...SUPABASE_CONFIG.global.headers,
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  }
);

// Klient vəziyyətini yoxlamaq üçün funksiya
export const checkClientStatus = async () => {
  try {
    logInfo('Checking Supabase client status');
    const { data, error } = await supabase.from('regions').select('id').limit(1);
    
    if (error) {
      logError(error, 'Supabase client status check');
      return { ok: false, error };
    }
    
    return { ok: true, data };
  } catch (error) {
    logError(error, 'Supabase client status check');
    return { ok: false, error };
  }
};

// Yeni Supabase klienti yaratmaq üçün funksiya
export const createNewClient = () => {
  logInfo('Creating new Supabase client instance');
  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      ...SUPABASE_CONFIG,
      global: {
        ...SUPABASE_CONFIG.global,
        headers: {
          ...SUPABASE_CONFIG.global.headers,
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    }
  );
};

// Utility funksiyalarını ixrac etmək
export { handleSupabaseError, checkConnection, isOfflineMode } from './utils/errorHandling';
export { withRetry, configureRetry } from './utils/retryMechanism';
export { measurePerformance } from './utils/performanceMonitor';

// Cache funksiyalarını ixrac etmək
import cacheUtils from './utils/cache';
export const { 
  queryWithCache, 
  clearAllCache, 
  clearCache, 
  invalidateCache, 
  getFromCache, 
  setInCache 
} = cacheUtils;

export default supabase;
