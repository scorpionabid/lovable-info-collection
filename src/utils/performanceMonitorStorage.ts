import { logger } from './logger';

// Performans məlumatları üçün tip
export interface PerformanceEntry {
  id: string;
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
  status: 'success' | 'error';
  errorMessage?: string;
}

// Maksimum log sayı
const MAX_LOG_COUNT = 1000;

/**
 * Performans məlumatlarını saxlamaq üçün utilit
 */
export const performanceStorage = {
  /**
   * Performans məlumatlarını local storage-də saxlamaq
   * @param entry Performans məlumatı
   */
  savePerformanceEntry: (entry: PerformanceEntry): void => {
    try {
      // Əgər brauzer mühiti deyilsə, heç nə etmirik
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      
      // Mövcud məlumatları əldə edirik
      const existingEntriesJson = localStorage.getItem('performance_logs');
      const existingEntries: PerformanceEntry[] = existingEntriesJson 
        ? JSON.parse(existingEntriesJson) 
        : [];
      
      // Yeni məlumatı əlavə edirik
      const updatedEntries = [entry, ...existingEntries];
      
      // Əgər məlumat sayı maksimumu keçirsə, ən köhnə məlumatları silirik
      if (updatedEntries.length > MAX_LOG_COUNT) {
        updatedEntries.length = MAX_LOG_COUNT;
      }
      
      // Məlumatları saxlayırıq
      try {
        localStorage.setItem('performance_logs', JSON.stringify(updatedEntries));
      } catch (storageError) {
        // LocalStorage limiti aşıldığı halda, köhnə məlumatları silirik
        logger.warn('LocalStorage limit may be exceeded, clearing older entries');
        if (updatedEntries.length > 100) {
          updatedEntries.length = 100;
          localStorage.setItem('performance_logs', JSON.stringify(updatedEntries));
        }
      }
    } catch (error) {
      logger.error('Error saving performance entry to localStorage', { error });
    }
  },
  
  /**
   * Performans məlumatlarını əldə etmək
   * @returns Performans məlumatları
   */
  getPerformanceEntries: (): PerformanceEntry[] => {
    try {
      // Əgər brauzer mühiti deyilsə, boş massiv qaytarırıq
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return [];
      }
      
      // Məlumatları əldə edirik
      const entriesJson = localStorage.getItem('performance_logs');
      return entriesJson ? JSON.parse(entriesJson) : [];
    } catch (error) {
      logger.error('Error getting performance entries from localStorage', { error });
      return [];
    }
  },
  
  /**
   * Bütün performans məlumatlarını silmək
   */
  clearPerformanceEntries: (): void => {
    try {
      // Əgər brauzer mühiti deyilsə, heç nə etmirik
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      
      // Məlumatları silirik
      localStorage.removeItem('performance_logs');
    } catch (error) {
      logger.error('Error clearing performance entries from localStorage', { error });
    }
  }
};
