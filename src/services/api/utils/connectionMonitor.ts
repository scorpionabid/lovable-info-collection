
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

const connectionLogger = logger.createLogger('connectionMonitor');
let isMonitoringActive = false;
let checkInterval: NodeJS.Timeout | null = null;
let lastConnectionStatus = false;

/**
 * Check if Supabase connection is working
 * @returns Promise resolving to true if connection works, false otherwise
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple health check query
    const start = Date.now();
    
    // Use a simple query with timeout
    const { data, error } = await Promise.race([
      supabase.from('regions').select('id').limit(1),
      new Promise<{data: null, error: Error}>((resolve) => {
        setTimeout(() => {
          resolve({
            data: null, 
            error: new Error('Connection check timeout (5s)')
          });
        }, 5000);
      })
    ]);
    
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
 * Add connection monitoring to detect timeouts and connection issues
 */
export const setupConnectionMonitoring = () => {
  // Don't create multiple monitors
  if (isMonitoringActive) {
    return () => {};
  }
  
  isMonitoringActive = true;
  connectionLogger.info('Starting Supabase connection monitoring');
  
  // Create a channel for monitoring connection status
  const channel = supabase.channel('system');
  
  // Log connection status changes
  channel
    .on('system', { event: 'disconnect' }, (payload) => {
      connectionLogger.error('Supabase realtime disconnected', payload);
      lastConnectionStatus = false;
    })
    .on('system', { event: 'reconnect' }, () => {
      connectionLogger.info('Supabase realtime attempting to reconnect');
    })
    .on('system', { event: 'connected' }, () => {
      connectionLogger.info('Supabase realtime connection established');
      lastConnectionStatus = true;
    })
    .subscribe((status) => {
      connectionLogger.info(`Supabase realtime subscription status: ${status}`);
    });
    
  // Set up periodic connection checks
  checkInterval = setInterval(async () => {
    const isConnected = await checkSupabaseConnection();
    
    // Only log changes in connection status
    if (isConnected !== lastConnectionStatus) {
      connectionLogger.info(`Connection status changed: ${isConnected ? 'Connected' : 'Disconnected'}`);
      lastConnectionStatus = isConnected;
    }
  }, 30000); // Check every 30 seconds
  
  // Return cleanup function
  return () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    channel.unsubscribe();
    isMonitoringActive = false;
    connectionLogger.info('Stopped Supabase connection monitoring');
  };
};

// Initialize connection monitoring on module load
const cleanup = setupConnectionMonitoring();

// Handle module hot reloading if in development
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (cleanup) {
      cleanup();
    }
  });
}

export { withRetry } from '@/integrations/supabase/client';
