/**
 * Supabase əməliyyatları üçün xəta idarəetmə funksiyaları
 */
import { logError } from './logger';

/**
 * Supabase xətasını formatlaşdırır və qeyd edir
 * @param error - Xəta obyekti
 * @param context - Xətanın konteksti
 * @returns Formatlaşdırılmış xəta
 */
export const handleSupabaseError = (error: any, context: string = 'Supabase operation'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Unknown Supabase error'
  );
  
  logError(error, context);
  return formattedError;
};

/**
 * Şəbəkə bağlantısının vəziyyətini yoxlayır
 * @returns Şəbəkə bağlantısının olub-olmadığı
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    // Sadə şəbəkə yoxlaması
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.google.com', { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    logError(error, 'Connection check');
    return false;
  }
};

/**
 * Offline rejimində olub-olmadığını yoxlayır
 * @returns Offline rejimində olub-olmadığı
 */
export const isOfflineMode = (): boolean => {
  return !navigator.onLine;
};

export default {
  handleSupabaseError,
  checkConnection,
  isOfflineMode
};
