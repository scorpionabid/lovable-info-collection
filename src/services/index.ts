/**
 * Mərkəzi export nöqtəsi bütün servis funksionallığı üçün
 * @deprecated Birbaşa @/lib/supabase istifadə edin.
 */

// Bütün servisləri yenidən ixrac edirik
export * from '@/lib/supabase';

// Supabase klienti və konfiqurasiyasını ixrac edirik
export { supabase } from '@/lib/supabase/client';
export { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  CACHE_CONFIG 
} from '@/lib/supabase/config';
