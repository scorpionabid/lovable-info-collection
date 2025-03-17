
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const connectionLogger = logger.createLogger('connectionMonitor');

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
      connectionLogger.error('Supabase connection error', { error, duration });
      return false;
    }
    
    connectionLogger.debug('Supabase connection check successful', { duration });
    return true;
  } catch (err) {
    connectionLogger.error('Supabase connection check failed', err);
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
        connectionLogger.info(`Retry attempt ${retries}/${maxRetries}`);
      }
      
      const result = await queryFn();
      
      if (retries > 0) {
        connectionLogger.info(`Retry successful after ${retries} attempts`);
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
      
      connectionLogger.warn(`Query failed, retrying in ${Math.round(delay)}ms`, {
        error,
        attempt: retries,
        maxRetries
      });
      
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  connectionLogger.error(`Query failed after ${maxRetries} retry attempts`, lastError);
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
      connectionLogger.error('Supabase realtime disconnected', payload);
    })
    .on('system', { event: 'reconnect' }, () => {
      connectionLogger.info('Supabase realtime attempting to reconnect');
    })
    .on('system', { event: 'connected' }, () => {
      connectionLogger.info('Supabase realtime connection established');
    })
    .subscribe((status) => {
      connectionLogger.info(`Supabase realtime subscription status: ${status}`);
    });
    
  // Additional diagnostic information
  connectionLogger.info(`Supabase realtime connection status: ${supabase.realtime.connectionState}`);
  
  // Set up periodic connection checks
  const checkInterval = setInterval(async () => {
    const isConnected = await checkSupabaseConnection();
    connectionLogger.debug(`Periodic connection check: ${isConnected ? 'Connected' : 'Disconnected'}`);
  }, 60000); // Check every minute
  
  // Return cleanup function
  return () => {
    clearInterval(checkInterval);
    channel.unsubscribe();
  };
};

// Initialize connection monitoring on module load
setupConnectionMonitoring();
