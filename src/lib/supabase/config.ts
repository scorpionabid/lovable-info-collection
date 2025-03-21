
/**
 * Supabase konfiqurasiyası
 */

// Supabase parametrlərini mühitdən oxu
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wxkaasjwpavlwrpvsuia.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
export const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// API baza URL-i
export const API_URL = import.meta.env.VITE_API_URL || "https://api.infoline.az";

// Supabase konfiqurasiyası 
export const SUPABASE_CONFIG = {
  // Auth konfiqurasiyası
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  
  // Real-time konfiqurasiyası
  realtime: {
    enabled: true,
    multiplexing: true,
    presenceTimeout: 60 // saniyə
  },
  
  // Global headers
  global: {
    headers: {
      'x-application-name': 'infoline-web-app',
      'x-client-info': 'supabase-js/2.x'
    }
  },
  
  // Storage konfiqurasiyası
  storage: {
    retryAttempts: 3,
    multipartConcurrency: 5,
    multipartThreshold: 5 * 1024 * 1024 // 5 MB
  }
};

// Supabase cədvəl adları
export const TABLE_NAMES = {
  USERS: 'users',
  PROFILES: 'profiles',
  REGIONS: 'regions',
  SECTORS: 'sectors',
  SCHOOLS: 'schools',
  CATEGORIES: 'categories',
  COLUMNS: 'columns',
  DATA: 'data',
  DATA_HISTORY: 'data_history',
  AUDIT_LOGS: 'audit_logs',
  API_METRICS: 'api_metrics',
  NOTIFICATIONS: 'notifications',
  ROLES: 'roles',
  SCHOOL_TYPES: 'school_types'
};

// Default sorğu parametrləri
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 10,
  cacheDuration: 5 * 60 * 1000, // 5 dəqiqə
  retries: 2
};

// Keş konfiqurasiyası
export const CACHE_CONFIG = {
  enabled: true,
  defaultTTL: 5 * 60 * 1000, // 5 dəqiqə
  storagePrefix: 'infoline_',
  longTermTTL: 24 * 60 * 60 * 1000, // 1 gün
  persistToLocalStorage: true
};
