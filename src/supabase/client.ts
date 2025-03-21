
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from '@/supabase/config';
import type { Database } from '@/types/supabase';

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_CONFIG
);

// Error handling utility
export const handleSupabaseError = (error: any, context: string = 'Supabase operation'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Unknown Supabase error'
  );
  
  console.error(`${context} error:`, error);
  return formattedError;
};

// Retry mechanism
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  while (retries <= maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      const delay = 1000 * Math.pow(1.5, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export default supabase;
