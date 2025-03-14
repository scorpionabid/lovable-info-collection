
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if Supabase connection is working
 * @returns Promise resolving to true if connection works, false otherwise
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple health check query
    const { data, error } = await supabase.from('regions').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Supabase connection check failed:', err);
    return false;
  }
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
      console.error('Supabase realtime disconnected:', payload);
    })
    .on('system', { event: 'reconnect' }, () => {
      console.log('Supabase realtime attempting to reconnect');
    })
    .on('system', { event: 'connected' }, () => {
      console.log('Supabase realtime connection established');
    })
    .subscribe((status) => {
      console.log(`Supabase realtime subscription status: ${status}`);
    });
    
  // Additional diagnostic information
  console.log(`Supabase realtime connection status: ${supabase.realtime.connectionState}`);
};
