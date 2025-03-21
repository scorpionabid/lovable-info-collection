
// Mərkəzləşdirilmiş Supabase müştərisinə körpü fayl
import { supabase, withRetry, checkConnection } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Köhnə fayl istifadəsini günlüyə yaz
logger.warn('Köhnə sector/supabaseClient.ts fayl yolu istifadə edilir - birbaşa @/integrations/supabase/client-dən import etməyi düşünün');

// Supabase müştərisini və köməkçi funksiyaları ixrac et
export { supabase, withRetry, checkConnection };

// Əgər hər hansı bir servisdə supabaseAdmin istifadə olunursa
export const supabaseAdmin = supabase;
