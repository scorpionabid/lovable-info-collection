/**
 * Mərkəzləşdirilmiş Supabase müştərisi
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

// Supabase konfiqurasiyası
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wxkaasjwpavlwrpvsuia.supabase.co";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
export const REQUEST_TIMEOUT_MS = 15000; // 15 saniyə

// Offline rejim idarəetməsi
let isOffline = false;

// Şəbəkə vəziyyətini izləmək
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOffline = false;
    logger.info('Şəbəkə bağlantısı bərpa edildi');
    // Offline zamanı gözlənilən sorğuları yerinə yetir
    processOfflineQueue();
  });
  
  window.addEventListener('offline', () => {
    isOffline = true;
    logger.warn('Şəbəkə bağlantısı itirildi, offline rejimə keçildi');
  });
  
  // İlkin şəbəkə vəziyyətini yoxla
  isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
}

// Offline zamanı gözlənilən sorğular üçün növbə
interface QueuedRequest {
  id: string;
  execute: () => Promise<any>;
  timestamp: number;
  retryCount: number;
}

const offlineQueue: QueuedRequest[] = [];
const MAX_QUEUE_SIZE = 100;
const MAX_RETRY_COUNT = 3;

// Keşləmə üçün konfiqurasiya
export interface CacheConfig {
  ttl: number; // millisaniyə ilə
  maxSize: number;
}

export const CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 dəqiqə
  maxSize: 100 // maksimum keş elementi
};

// Supabase müştərisinin yaradılması
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      // Sorğuların vaxt aşımını idarə etmək üçün
      const fetchWithTimeout = async (resource: RequestInfo, options: RequestInit = {}) => {
        // Offline rejim yoxlaması
        if (isOffline) {
          logger.warn('Offline rejim: Sorğu növbəyə əlavə edildi', { url: resource.toString() });
          return new Response(JSON.stringify({ error: 'Offline mode' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        
        try {
          const response = await fetch(resource, {
            ...options,
            signal: controller.signal,
            headers: {
              ...options.headers,
              'x-application-name': 'infoLine',
              'x-request-id': crypto.randomUUID()
            }
          });
          
          clearTimeout(id);
          return response;
        } catch (error) {
          clearTimeout(id);
          
          // Şəbəkə xətası baş verdikdə offline rejimə keç
          if (error instanceof TypeError && error.message.includes('fetch')) {
            isOffline = true;
            logger.warn('Şəbəkə xətası, offline rejimə keçildi', { error });
            
            return new Response(JSON.stringify({ error: 'Network error' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          throw error;
        }
      };
      
      return fetchWithTimeout(args[0] as RequestInfo, args[1] as RequestInit);
    },
    headers: { 'x-application-name': 'infoLine' }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 1 // Realtime hadisələrin limitini azalt
    }
  }
});

// Auth hadisələrini izləmək üçün
supabase.auth.onAuthStateChange((event, session) => {
  logger.info('Supabase auth hadisəsi:', {event, isAuthenticated: !!session});
  
  // Sessiya yeniləndiyi zaman keşi təmizlə
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
    clearCache();
    logger.info('Auth dəyişikliyi ilə keş təmizləndi');
  }
});

// Offline növbəni işlə
const processOfflineQueue = async () => {
  if (isOffline || offlineQueue.length === 0) {
    return;
  }
  
  logger.info(`Offline növbədə ${offlineQueue.length} sorğu işlənir`);
  
  // Növbədəki sorğuları kopyala və növbəni təmizlə
  const queueToProcess = [...offlineQueue];
  offlineQueue.length = 0;
  
  for (const request of queueToProcess) {
    try {
      logger.info(`Offline sorğu işlənir: ${request.id}`);
      await request.execute();
      logger.info(`Offline sorğu uğurla işləndi: ${request.id}`);
    } catch (error) {
      logger.error(`Offline sorğu işlənmə xətası: ${request.id}`, error);
      
      // Yenidən cəhd limitini aşmayıbsa, növbəyə qaytar
      if (request.retryCount < MAX_RETRY_COUNT) {
        request.retryCount++;
        offlineQueue.push(request);
        logger.info(`Sorğu yenidən offline növbəyə əlavə edildi: ${request.id}`);
      } else {
        logger.warn(`Sorğu maksimum cəhd sayını aşdı və silindi: ${request.id}`);
      }
    }
  }
  
  // Yenilənmiş növbəni saxla
  saveOfflineQueue();
};

// Offline növbəni local storage-ə saxla
const saveOfflineQueue = () => {
  try {
    // Yalnız əsas məlumatları saxla, funksiyaları yox
    const queueData = offlineQueue.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      retryCount: item.retryCount
    }));
    
    localStorage.setItem('offlineQueue', JSON.stringify(queueData));
  } catch (error) {
    logger.error('Offline növbəni saxlama xətası', error);
  }
};

// Keşi təmizləmək
export const clearCache = (): void => {
  window.dispatchEvent(new CustomEvent('supabase-cache-clear'));
  logger.info('Supabase sorğu keşi təmizləndi');
};

// Offline rejim vəziyyətini əldə etmək üçün
export const isOfflineMode = (): boolean => {
  return isOffline;
};

// Şəbəkə xətası olub-olmadığını yoxla
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Xəta mesajında şəbəkə ilə əlaqəli açar sözlər
  const networkErrorKeywords = [
    'network', 'fetch', 'timeout', 'abort', 'connection', 
    'offline', 'internet', 'ECONNREFUSED', 'ETIMEDOUT'
  ];
  
  // Xəta mesajında şəbəkə açar sözlərini axtar
  if (error.message && typeof error.message === 'string') {
    return networkErrorKeywords.some(keyword => 
      error.message.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  // Xəta kodunda şəbəkə ilə əlaqəli kodları yoxla
  if (error.code) {
    return ['PGRST301', 'ECONNREFUSED', 'ETIMEDOUT'].includes(error.code);
  }
  
  return false;
};

// Bağlantını yoxlamaq üçün funksiya
export const checkConnection = async (): Promise<boolean> => {
  try {
    const start = Date.now();
    
    // Sadə sorğu ilə bağlantını yoxla
    const { data, error } = await supabase
      .from('regions')
      .select('id, name')
      .limit(1)
      .maybeSingle();
    
    const duration = Date.now() - start;
    
    if (error) {
      logger.error('Supabase bağlantı yoxlaması uğursuz oldu', { error, duration });
      return false;
    }
    
    logger.info('Supabase bağlantı yoxlaması uğurlu oldu', { duration, hasData: !!data });
    return true;
  } catch (err) {
    logger.error('Supabase bağlantı istisna halı', { error: err });
    return false;
  }
};

// Supabase xətalarını emal etmək üçün funksiya
export const handleSupabaseError = (error: any, context: string = 'Supabase əməliyyatı'): Error => {
  // Xəta obyekti yaratmaq
  const formattedError = new Error(
    error?.message || error?.error_description || 'Bilinməyən Supabase xətası'
  );
  
  // Xəta məlumatlarını əlavə etmək
  (formattedError as any).originalError = error;
  (formattedError as any).context = context;
  (formattedError as any).code = error?.code || 'UNKNOWN_ERROR';
  (formattedError as any).status = error?.status || 500;
  (formattedError as any).isNetworkError = isNetworkError(error);
  (formattedError as any).timestamp = new Date().toISOString();
  
  // Xətanı jurnalın qeyd etmək
  logger.error(`${context} xətası:`, {
    message: formattedError.message,
    code: (formattedError as any).code,
    status: (formattedError as any).status,
    isNetworkError: (formattedError as any).isNetworkError
  });
  
  return formattedError;
};
