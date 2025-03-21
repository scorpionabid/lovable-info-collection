
// Supabase configuration
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wxkaasjwpavlwrpvsuia.supabase.co';
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM';

// Cache configuration for query caching
export const CACHE_CONFIG = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  excludeFromCache: [
    // List of paths to exclude from caching
  ],
};

// Supabase client options
export const SUPABASE_CONFIG = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: fetch,
    headers: {
      'x-application-name': 'infoline',
    }
  }
};

// Development mode flag for conditional behaviors
export const isDevelopment = process.env.NODE_ENV === 'development';
