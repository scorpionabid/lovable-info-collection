
import { supabase, checkConnection, withRetry } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

// Create a logger for Supabase operations
const sectorLogger = logger.createLogger('sectorClient');

// Log connection status
sectorLogger.info('Supabase client initialized', {
  connectionState: supabase.realtime.connectionState
});

// Export the supabase client and utilities
export { supabase, checkConnection, withRetry };

// Export the logger for sector operations
export const sectorServiceLogger = sectorLogger;
