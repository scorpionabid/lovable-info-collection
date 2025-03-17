
// Bridge file to redirect to the centralized Supabase client
import { supabase, withRetry, checkConnection } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Log usage of the old bridge file
logger.warn('Legacy region/supabaseClient.ts import used - consider updating to direct import from @/integrations/supabase/client');

// Re-export the supabase client and utilities
export { supabase, withRetry, checkConnection };
