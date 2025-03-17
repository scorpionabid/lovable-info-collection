
import { supabase, withRetry, checkConnection } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Create logger for school client
const schoolLogger = logger.createLogger('schoolClient');

// Log initialization
schoolLogger.info('School Supabase client initialized');

// Re-export the supabase client and utilities
export { supabase, withRetry, checkConnection };

// Export the logger for school operations
export const schoolServiceLogger = schoolLogger;
