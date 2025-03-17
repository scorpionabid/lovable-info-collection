
import { supabase } from '@/integrations/supabase/client';
import { useLogger } from '@/hooks/useLogger';

const logger = useLogger('connectionMonitor');

/**
 * Check if Supabase connection is working
 * @returns Promise resolving to true if connection works, false otherwise
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple health check query
    const start = Date.now();
    const { data, error } = await supabase.from('regions').select('count').limit(1);
    const duration = Date.now() - start;
    
    if (error) {
      logger.error('Supabase connection error', { error, duration });
      return false;
    }
    
    logger.debug('Supabase connection check successful', { duration });
    return true;
  } catch (err) {
    logger.error('Supabase connection check failed', err);
    return false;
  }
};

/**
 * Adds appropriate retry logic to Supabase queries
 * @param queryFn Function that performs the actual Supabase query
 * @param maxRetries Maximum number of retry attempts
 * @param initialRetryDelay Initial delay for retry in ms
 * @returns Result of the query or throws an error after max retries
 */
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 3, 
  initialRetryDelay = 500
): Promise<T> => {
  let retries = 0;
  let lastError: any;
  
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        logger.info(`Retry attempt ${retries}/${maxRetries}`);
      }
      
      const result = await queryFn();
      
      if (retries > 0) {
        logger.info(`Retry successful after ${retries} attempts`);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // If this was the last retry, don't wait
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      
      // Calculate exponential backoff with jitter
      const delay = initialRetryDelay * Math.pow(2, retries - 1) * (0.5 + Math.random() * 0.5);
      
      logger.warn(`Query failed, retrying in ${Math.round(delay)}ms`, {
        error,
        attempt: retries,
        maxRetries
      });
      
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  logger.error(`Query failed after ${maxRetries} retry attempts`, lastError);
  throw lastError;
};

/**
 * Add connection monitoring to detect timeouts and connection issues
 */
export const setupConnectionMonitoring = () => {
  // Create a channel for monitoring connection status
  const channel = supabase.channel('system');
  
  // Log connection status changes
  channel
    .on('system', { event: 'disconnect' }, (payload) => {
      logger.error('Supabase realtime disconnected', payload);
    })
    .on('system', { event: 'reconnect' }, () => {
      logger.info('Supabase realtime attempting to reconnect');
    })
    .on('system', { event: 'connected' }, () => {
      logger.info('Supabase realtime connection established');
    })
    .subscribe((status) => {
      logger.info(`Supabase realtime subscription status: ${status}`);
    });
    
  // Additional diagnostic information
  logger.info(`Supabase realtime connection status: ${supabase.realtime.connectionState}`);
  
  // Set up periodic connection checks
  const checkInterval = setInterval(async () => {
    const isConnected = await checkSupabaseConnection();
    logger.debug(`Periodic connection check: ${isConnected ? 'Connected' : 'Disconnected'}`);
  }, 60000); // Check every minute
  
  // Return cleanup function
  return () => {
    clearInterval(checkInterval);
    channel.unsubscribe();
  };
};

// Initialize connection monitoring on module load
setupConnectionMonitoring();
