
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from './config';
import type { Database } from '@/types/supabase';

// Create the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any, context: string = 'Supabase operation'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Unknown Supabase error'
  );
  
  console.error(`${context} error:`, error);
  return formattedError;
};

// Function to refresh the token
export const refreshToken = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error('Exception during token refresh:', error);
    return false;
  }
};

// Add withRetry helper
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2,
  retryDelay = 1000
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
      const delay = retryDelay * Math.pow(1.5, retries - 1);
      console.log(`Retry ${retries}/${maxRetries}, waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Function for cached queries
export const queryWithCache = async <T>(
  key: string,
  queryFn: () => Promise<T>,
  ttlMs = 300000 // 5 minutes default
): Promise<T> => {
  const cacheKey = `infoline_${key}`;
  
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const { data, expiry } = JSON.parse(cachedItem);
      if (expiry > Date.now()) {
        console.log(`Cache hit for ${key}`);
        return data as T;
      }
      localStorage.removeItem(cacheKey); // Clear expired item
    }
  } catch (e) {
    console.warn('Error accessing cache:', e);
  }
  
  // Execute the query
  const result = await queryFn();
  
  // Store in cache
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data: result,
      expiry: Date.now() + ttlMs
    }));
  } catch (e) {
    console.warn('Error storing in cache:', e);
  }
  
  return result;
};

// Check connection status
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Warning: Could not verify Supabase connection', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase connection check error:', error);
    return false;
  }
};

export default supabase;
