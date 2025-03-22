
// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wxkaasjwpavlwrpvsuia.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM';

// Cache configuration for query caching
export const CACHE_CONFIG = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  staleWhileRevalidate: true,
  excludeFromCache: [
    // List of paths to exclude from caching
  ],
};

// Strongly typed table helper
export const TABLES = {
  USERS: 'users' as const,
  REGIONS: 'regions' as const,
  SECTORS: 'sectors' as const,
  SCHOOLS: 'schools' as const,
  CATEGORIES: 'categories' as const,
  COLUMNS: 'columns' as const,
  DATA: 'data' as const,
  DATA_HISTORY: 'data_history' as const,
  AUDIT_LOGS: 'audit_logs' as const,
  API_METRICS: 'api_metrics' as const, 
  NOTIFICATIONS: 'notifications' as const,
  ROLES: 'roles' as const,
  SCHOOL_TYPES: 'school_types' as const
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
export const isDevelopment = import.meta.env.DEV;
