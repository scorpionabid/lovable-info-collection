
// Supabase configuration
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://wxkaasjwpavlwrpvsuia.supabase.co';
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM';

/**
 * Sorğuların keşlənməsi üçün konfiqurasiya
 */
export const CACHE_CONFIG = {
  // Əsas konfiqurasiya
  enabled: true,                    // Keşləməni qlobal olaraq aktiv etmək
  defaultTTL: 5 * 60 * 1000,        // Standart saxlama müddəti: 5 dəqiqə
  staleWhileRevalidate: true,       // Köhnə keş istifadə olunarkən arxa planda yeniləmə
  persistToLocalStorage: true,      // Keşi localStorage-də saxlamaq
  storagePrefix: 'infoline_cache_', // Keş açarları üçün prefiks
  
  // Xas tiplər üçün fərqli saxlama müddətləri
  regions: 10 * 60 * 1000,          // Regionlar: 10 dəqiqə
  sectors: 10 * 60 * 1000,          // Sektorlar: 10 dəqiqə
  schools: 5 * 60 * 1000,           // Məktəblər: 5 dəqiqə
  users: 2 * 60 * 1000,             // İstifadəçilər: 2 dəqiqə
  roles: 30 * 60 * 1000,            // Rollar: 30 dəqiqə
  
  // Keşdən istisna edilən yollar
  excludeFromCache: [
    // Keşlənməyəcək yollar
    '/auth/',
    '/storage/',
    '/realtime/'
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
export const isDevelopment = process.env.NODE_ENV === 'development';
