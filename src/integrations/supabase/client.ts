
/**
 * Supabase inteqrasiyası üçün mərkəzləşdirilmiş modul
 * Bu modul src/lib/supabase faylından funksiyaları ixrac edir
 */
import { 
  supabase,
  withRetry,
  checkConnection,
  handleSupabaseError,
  getCurrentUser,
  getCurrentUserId
} from '@/lib/supabase';

import {
  isOfflineMode,
  clearCache,
  isNetworkError,
  queryWithCache
} from '@/lib/supabase/cache';

// Bütün funksiyaları ixrac et
export {
  supabase,
  withRetry,
  checkConnection,
  handleSupabaseError,
  getCurrentUser,
  getCurrentUserId,
  isOfflineMode,
  clearCache,
  isNetworkError,
  queryWithCache
};

// Export query helpers
export * from '@/lib/supabase/query';
export * from '@/lib/supabase/retry';

// Əsas məlumatı konsola yaz
console.log('Supabase inteqrasiyası yükləndi:', {
  url: process.env.NODE_ENV === 'production' ? 'PRODUCTION_URL' : 'SUPABASE_URL',
  authEnabled: !!supabase.auth,
  realtimeEnabled: !!supabase.realtime,
  storageEnabled: !!supabase.storage
});
