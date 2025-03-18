import { logger } from './logger';
import { performanceStorage, PerformanceEntry } from './performanceMonitorStorage';

interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success?: boolean;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Record<string, PerformanceMetric[]> = {};
  private readonly MODULE_NAME = 'PerformanceMonitor';
  
  /**
   * Əməliyyatın başlanğıcını qeyd edir
   * @param operation Əməliyyatın adı
   * @param metadata Əlavə məlumatlar
   * @returns Əməliyyat ID-si
   */
  startOperation(operation: string, metadata?: Record<string, any>): string {
    const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    if (!this.metrics[operation]) {
      this.metrics[operation] = [];
    }
    
    this.metrics[operation].push({
      operation,
      startTime: performance.now(),
      metadata
    });
    
    return operationId;
  }
  
  /**
   * Əməliyyatın bitməsini qeyd edir
   * @param operation Əməliyyatın adı
   * @param success Əməliyyatın uğurlu olub-olmadığı
   * @param additionalMetadata Əlavə məlumatlar
   */
  endOperation(operation: string, success: boolean = true, additionalMetadata?: Record<string, any>): void {
    if (!this.metrics[operation] || this.metrics[operation].length === 0) {
      logger.warn(this.MODULE_NAME, `No matching start found for operation: ${operation}`);
      return;
    }
    
    const metric = this.metrics[operation][this.metrics[operation].length - 1];
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = success;
    
    if (additionalMetadata) {
      metric.metadata = {
        ...metric.metadata,
        ...additionalMetadata
      };
    }
    
    // Performans metrikasını loqa yazırıq
    logger.info(`[${this.MODULE_NAME}] Operation completed: ${operation} (${metric.duration}ms, success: ${success})`);
    
    // Performans məlumatlarını local storage-ə saxlayırıq
    this.saveToStorage(operation, metric.duration, metric.success, metric.metadata);
    
    // Əgər əməliyyat 1 saniyədən çox çəkibsə, xəbərdarlıq edirik
    if (metric.duration > 1000) {
      logger.warn(`[${this.MODULE_NAME}] Slow operation detected: ${operation} (${metric.duration}ms)`);
    }
  }
  
  /**
   * Performans məlumatlarını local storage-ə saxlama
   */
  private saveToStorage(operation: string, duration: number, success: boolean, metadata?: Record<string, any>): void {
    const entry: PerformanceEntry = {
      id: `${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      operation,
      duration,
      timestamp: Date.now(),
      metadata,
      status: success ? 'success' : 'error',
      errorMessage: success ? undefined : 'Operation failed'
    };
    
    performanceStorage.savePerformanceEntry(entry);
  }
  
  /**
   * Əməliyyatı ölçmək üçün dekorator funksiya
   * @param operation Əməliyyatın adı
   * @param metadata Əlavə məlumatlar
   */
  async measure<T>(
    operation: string, 
    fn: () => Promise<T>, 
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startOperation(operation, metadata);
    
    try {
      const result = await fn();
      this.endOperation(operation, true, { hasResult: !!result });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.endOperation(operation, false, { error: errorMessage });
      throw error;
    }
  }
  
  /**
   * Son 24 saat ərzində toplanan metrikaları qaytarır
   */
  getMetrics(operation?: string, last24Hours: boolean = true): PerformanceMetric[] {
    const now = performance.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    const filterByTime = (metric: PerformanceMetric) => {
      if (!last24Hours) return true;
      return metric.startTime > (now - oneDayInMs);
    };
    
    if (operation) {
      return (this.metrics[operation] || []).filter(filterByTime);
    }
    
    return Object.values(this.metrics)
      .flat()
      .filter(filterByTime);
  }
  
  /**
   * Əməliyyatlar üzrə orta vaxtı hesablayır
   */
  getAverageTime(operation: string): number | null {
    const metrics = this.metrics[operation];
    
    if (!metrics || metrics.length === 0) {
      return null;
    }
    
    const completedMetrics = metrics.filter(m => m.duration !== undefined);
    
    if (completedMetrics.length === 0) {
      return null;
    }
    
    const totalDuration = completedMetrics.reduce((sum, metric) => sum + (metric.duration || 0), 0);
    return totalDuration / completedMetrics.length;
  }
  
  /**
   * Bütün metrikaları təmizləyir
   */
  clearMetrics(): void {
    this.metrics = {};
    // Local storage-dəki məlumatları da təmizləyirik
    performanceStorage.clearPerformanceEntries();
  }
  
  /**
   * Local storage-dəki performans məlumatlarını əldə etmək
   */
  getStoredPerformanceEntries(): PerformanceEntry[] {
    return performanceStorage.getPerformanceEntries();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Performans ölçmək üçün async funksiyaları əhatə edən utilit
 */
export async function measurePerformance<T>(
  operationName: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  return performanceMonitor.measure(operationName, fn, metadata);
}

// PerformanceEntry tipini yenidən export edirik
export type { PerformanceEntry } from './performanceMonitorStorage';
