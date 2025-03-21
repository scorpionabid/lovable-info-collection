
/**
 * Servis faylları üçün mərkəzləşdirilmiş Supabase müştərisi
 * Bu fayl köhnə servislərin işləməsi üçün geriyə uyğunluq təmin edir
 */
import { 
  supabase, 
  withRetry, 
  checkConnection, 
  handleSupabaseError 
} from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Köhnə fayl istifadəsini günlüyə yaz
logger.warn('Köhnə supabaseClient.ts fayl yolu istifadə edilir - birbaşa @/integrations/supabase/client-dən import etməyi düşünün');

// Supabase müştərisini və köməkçi funksiyaları ixrac et
export { 
  supabase, 
  withRetry, 
  checkConnection, 
  handleSupabaseError 
};

// Əgər hər hansı bir servisdə supabaseAdmin istifadə olunursa
export const supabaseAdmin = supabase;

// Data struktur tipləri üçün geriyə uyğunluq
export type DataEntry = any;
export type DataHistory = any;
export type Region = any;
export type Notification = any;
export type Category = any;
export type Sector = any;
export type User = any;
export type Json = any;
