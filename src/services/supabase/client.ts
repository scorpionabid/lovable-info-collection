
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './client/config';
export * from './client/types';

// Create the Supabase client with better error handling and session persistence
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'infoline_auth_token', // Custom storage key for better identification
  },
  global: {
    headers: {
      'x-app-version': import.meta.env.VITE_APP_VERSION || 'development',
    },
  },
  db: {
    schema: 'public',
  },
});

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

// Check if connection is successful and log info in development
try {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Warning: Could not verify Supabase connection', error);
  } else {
    console.log('Supabase connection initialized successfully');
    
    // Cache frequently used auth values for later use
    const sessionUser = data?.session?.user;
    if (sessionUser) {
      localStorage.setItem('supabase_user_id', sessionUser.id);
      localStorage.setItem('supabase_user_email', sessionUser.email || '');
    }
  }
} catch (error) {
  console.error('Supabase initialization warning:', error);
  // Continue execution - don't block the app
}
