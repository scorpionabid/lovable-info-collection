
// Mərkəzləşdirilmiş Supabase müştərisinə körpü fayl
import { supabase, withRetry, checkConnection } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Köhnə fayl istifadəsini günlüyə yaz
logger.warn('Köhnə supabaseClient.ts fayl yolu istifadə edilir - birbaşa @/integrations/supabase/client-dən import etməyi düşünün');

// Supabase müştərisini və köməkçi funksiyaları ixrac et
export { supabase, withRetry, checkConnection };

// Əgər hər hansı bir servisdə supabaseAdmin istifadə olunursa
export const supabaseAdmin = supabase;

// Əgər başlanğıc supabaseClient.ts-dən başqa exportlar varsa,
// onlar burada yenidən yaradılmalı və ya import edilməlidir
export type DataEntry = any;
export type DataHistory = any;
export type Region = any;
export type Notification = any;
export type Category = any;
export type Sector = any;
export type User = any;
export type Json = any;
