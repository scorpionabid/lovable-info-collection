
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/useLogger';

// Create a logger for Supabase operations
const logger = useLogger('supabaseClient');

// Log connection status
logger.info('Supabase client initialized', {
  connectionStatus: supabase.realtime.connectionState
});

// Add a method to check connection status
export const checkConnection = async () => {
  try {
    const start = Date.now();
    const { data, error } = await supabase.from('sectors').select('count').limit(1);
    const duration = Date.now() - start;
    
    if (error) {
      logger.error('Supabase connection check failed', { error, duration });
      return false;
    }
    
    logger.info('Supabase connection check successful', { duration });
    return true;
  } catch (err) {
    logger.error('Supabase connection exception', err);
    return false;
  }
};

// Export the supabase client
export { supabase };
