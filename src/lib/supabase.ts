/**
 * Mərkəzləşdirilmiş Supabase müştərisi və köməkçi funksiyalar
 * Bu fayl geriyə uyğunluq üçün saxlanılıb
 * Yeni kodu src/lib/supabase/* qovluğunda axtarın
 */

// Yeni modulyar strukturdan exportlar
import { supabase } from './supabase/client';
export { supabase };
export * from './supabase/client';
export * from './supabase/cache';
export * from './supabase/query';
export * from './supabase/retry';
