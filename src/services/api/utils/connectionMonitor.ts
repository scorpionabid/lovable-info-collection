
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
  // Add monitoring for connection errors
  supabase.realtime.onError((error) => {
    console.error('Supabase realtime connection error:', error);
  });
  
  // Log reconnection attempts
  supabase.realtime.onConnected(() => {
    console.log('Supabase realtime connection established');
  });
};
