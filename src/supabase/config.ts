
/**
 * Supabase konfiqurasiyası
 * Mərkəzləşdirilmiş Supabase parametrləri və konfiqurasyonu
 */

// Supabase URL və API açarları
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wxkaasjwpavlwrpvsuia.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
export const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Sorğu vaxt məhdudiyyəti və təkrar cəhd
export const REQUEST_TIMEOUT_MS = 15000; // 15 saniyə
export const MAX_RETRIES = 2;
export const RETRY_DELAY_MS = 1000;

// Supabase klient konfiqurasiyası
export const SUPABASE_CONFIG = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'infoLine',
      'x-client-info': 'supabase-js/2.x'
    }
  },
  db: {
    schema: 'public' as const
  }
};

// Cədvəl adları
export const TABLES = {
  USERS: 'users',
  PROFILES: 'profiles',
  REGIONS: 'regions',
  SECTORS: 'sectors',
  SCHOOLS: 'schools',
  SCHOOL_TYPES: 'school_types',
  CATEGORIES: 'categories',
  COLUMNS: 'columns',
  DATA: 'data',
  DATA_HISTORY: 'data_history',
  AUDIT_LOGS: 'audit_logs',
  API_METRICS: 'api_metrics',
  NOTIFICATIONS: 'notifications',
  ROLES: 'roles'
};

// Keş konfiqurasiyası
export const CACHE_CONFIG = {
  enabled: true,
  defaultTTL: 5 * 60 * 1000, // 5 dəqiqə
  storagePrefix: 'infoline_',
  longTermTTL: 24 * 60 * 60 * 1000, // 1 gün
  persistToLocalStorage: true
};

// Default sorğu parametrləri 
export const DEFAULT_QUERY_PARAMS = {
  pageSize: 10,
  cacheDuration: 5 * 60 * 1000, // 5 dəqiqə
  retries: MAX_RETRIES
};
