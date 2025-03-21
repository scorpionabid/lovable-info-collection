
/**
 * Mərkəzləşdirilmiş Supabase müştərisi və köməkçi funksiyalar
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabase konfiqurasiyası
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wxkaasjwpavlwrpvsuia.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
export const REQUEST_TIMEOUT_MS = 15000; // 15 saniyə

// Mərkəzi supabase müştərisi
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'infoLine' }
  }
});

// Xəta emalı üçün köməkçi funksiya
export const handleSupabaseError = (error: any, context: string = 'Supabase əməliyyatı'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Bilinməyən Supabase xətası'
  );
  
  console.error(`${context} xətası:`, error);
  return formattedError;
};

// Supabase bağlantısını yoxlamaq
export const checkConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('id')
      .limit(1);
    
    return !error;
  } catch (err) {
    console.error('Supabase bağlantı xətası:', err);
    return false;
  }
};

// Təkrar cəhd mexanizmi
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2
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
      const delay = 1000 * Math.pow(1.5, retries - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Auth ilə bağlı köməkçi funksiyalar
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('İstifadəçi məlumatları alınarkən xəta:', error);
    return null;
  }
};

export const getCurrentUserId = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.id || null;
};
