
/**
 * Mərkəzləşdirilmiş Supabase konfiqurasiyası
 */

// Supabase məlumatları
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wxkaasjwpavlwrpvsuia.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";

// İstehsal və ya development mühitini təyin etmək
export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

// Offline rejim parametrləri
export const OFFLINE_CONFIG = {
  maxQueueSize: 100,
  maxRetryCount: 3,
  requestTimeoutMs: 15000, // 15 saniyə
};

// Keşləmə parametrləri
export const CACHE_CONFIG = {
  ttl: 5 * 60 * 1000, // 5 dəqiqə
  maxSize: 100 // maksimum keş elementi
};

// Bütün konfiqurasiyaları bir obyektdə ixrac et
export const supabaseConfig = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  isDev: isDevelopment(),
  offline: OFFLINE_CONFIG,
  cache: CACHE_CONFIG
};

// URL-in doğru format olub-olmadığını yoxlamaq üçün funksiya
export const isValidSupabaseUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    console.error('Invalid Supabase URL format:', error);
    return false;
  }
};

// Konfiqurasiyanın doğruluğunu yoxla və xəbərdarlıq et
if (!isValidSupabaseUrl(SUPABASE_URL)) {
  console.warn(`Supabase URL format is invalid: ${SUPABASE_URL}. Check your environment variables.`);
}
