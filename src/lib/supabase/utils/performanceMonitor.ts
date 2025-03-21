/**
 * Supabase əməliyyatları üçün performans izləmə funksiyaları
 */
import { logPerformance } from './logger';

/**
 * Funksiyanın icra vaxtını ölçür
 * @param fn - İcra ediləcək funksiya
 * @param operationName - Əməliyyat adı
 * @returns Funksiyanın nəticəsi
 */
export const measurePerformance = async <T>(
  fn: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    logPerformance(operationName, startTime);
    return result;
  } catch (error) {
    logPerformance(`${operationName} (failed)`, startTime);
    throw error;
  }
};

/**
 * Performans ölçmə dekoratoru
 * @param operationName - Əməliyyat adı
 * @returns Dekorator funksiya
 */
export function withPerformanceTracking<T>(operationName: string) {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return measurePerformance(
        () => originalMethod.apply(this, args),
        operationName || `${target.constructor.name}.${propertyKey}`
      );
    };
    
    return descriptor;
  };
}

export default {
  measurePerformance,
  withPerformanceTracking
};
