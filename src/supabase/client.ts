
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Environment variables (these are injected at build time)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Helper to handle common error patterns
export const handleSupabaseError = (error: any) => {
  console.error('Supabase Error:', error);
  let message = 'An unknown error occurred';
  
  if (error?.message) {
    message = error.message;
  } else if (error?.error_description) {
    message = error.error_description;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  return { error: message };
};

// Retry function for network resilience
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * retries));
    }
  }
  
  throw new Error('Maximum retries exceeded');
};

export default supabase;
