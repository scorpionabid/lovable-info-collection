
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
  getCurrentUserId,
  isOfflineMode,
  clearCache,
  isNetworkError
} from '@/lib/supabase';

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
  isNetworkError
};

// Əsas məlumatı konsola yaz
console.log('Supabase inteqrasiyası yükləndi:', {
  url: supabase.supabaseUrl,
  authEnabled: !!supabase.auth,
  realtimeEnabled: !!supabase.realtime,
  storageEnabled: !!supabase.storage
});
