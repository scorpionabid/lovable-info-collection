
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

export {
  supabase,
  withRetry,
  checkConnection,
  handleSupabaseError,
  getCurrentUser,
  getCurrentUserId
};
