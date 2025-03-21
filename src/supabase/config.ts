
// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wxkaasjwpavlwrpvsuia.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";

// Supabase configuration for client
export const SUPABASE_CONFIG = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'infoLine' }
  }
};

// Cache configuration
export const CACHE_CONFIG = {
  defaultTTL: 300000, // 5 minutes
  regions: 600000,    // 10 minutes
  sectors: 600000,    // 10 minutes
  schools: 600000,    // 10 minutes
  users: 300000,      // 5 minutes
  roles: 1800000      // 30 minutes
};

// Database table names for type safety
export const TABLES = {
  USERS: 'users',
  REGIONS: 'regions',
  SECTORS: 'sectors',
  SCHOOLS: 'schools',
  SCHOOL_TYPES: 'school_types',
  CATEGORIES: 'categories',
  COLUMNS: 'columns',
  DATA: 'data',
  DATA_HISTORY: 'data_history',
  ROLES: 'roles',
  NOTIFICATIONS: 'notifications',
  AUDIT_LOGS: 'audit_logs'
};
