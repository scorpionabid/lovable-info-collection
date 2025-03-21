/**
 * Supabase əməliyyatları üçün loqlaşdırma funksiyaları
 */
import { Logger } from '@/utils/logger';
import { isDevelopment } from '../config';

// Supabase əməliyyatları üçün loqlaşdırma konfiqurasiyası
const supabaseLogger = new Logger('Supabase', {
  level: isDevelopment ? 'debug' : 'info'
});

/**
 * Xəta loqlaşdırması
 * @param error - Xəta obyekti
 * @param context - Xətanın konteksti
 */
export const logError = (error: unknown, context?: string): void => {
  supabaseLogger.error(`${context || 'Error'}: ${error instanceof Error ? error.message : String(error)}`);
  if (isDevelopment && error instanceof Error && error.stack) {
    supabaseLogger.debug(error.stack);
  }
};

/**
 * İnformasiya loqlaşdırması
 * @param message - Loqlaşdırılacaq mesaj
 * @param data - Əlavə məlumatlar
 */
export const logInfo = (message: string, data?: any): void => {
  supabaseLogger.info(message, data);
};

/**
 * Ətraflı loqlaşdırma (yalnız development rejimində)
 * @param message - Loqlaşdırılacaq mesaj
 * @param data - Əlavə məlumatlar
 */
export const logDebug = (message: string, data?: any): void => {
  if (isDevelopment) {
    supabaseLogger.debug(message, data);
  }
};

/**
 * Performans ölçmə loqlaşdırması
 * @param operation - Əməliyyat adı
 * @param startTime - Başlama vaxtı
 */
export const logPerformance = (operation: string, startTime: number): void => {
  const duration = Date.now() - startTime;
  supabaseLogger.info(`${operation} completed in ${duration}ms`);
  
  if (duration > 1000) {
    supabaseLogger.warn(`${operation} took longer than expected: ${duration}ms`);
  }
};

/**
 * Loqlaşdırma funksiyalarını yaratmaq üçün fabrik
 * @param context - Loqlaşdırma konteksti
 * @returns Loqlaşdırma funksiyaları
 */
export const createLogger = (context: string) => {
  return {
    error: (error: unknown, subContext?: string) => 
      logError(error, subContext ? `${context}:${subContext}` : context),
    info: (message: string, data?: any) => 
      logInfo(`[${context}] ${message}`, data),
    debug: (message: string, data?: any) => 
      logDebug(`[${context}] ${message}`, data),
    performance: (operation: string, startTime: number) => 
      logPerformance(`${context}:${operation}`, startTime)
  };
};

export default {
  logError,
  logInfo,
  logDebug,
  logPerformance,
  createLogger
};
