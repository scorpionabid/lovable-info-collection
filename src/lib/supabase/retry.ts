
/**
 * Təkrar cəhd mexanizmi
 * Şəbəkə xətaları və keçici problemlər üçün təkrar cəhd etməyi təmin edir
 */
import { isNetworkError } from './cache';
import { logger } from '@/utils/logger';

interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  factor: number;
}

interface RetryFunction {
  <T>(
    fn: () => Promise<T>, 
    options?: Partial<RetryOptions>,
    retryCondition?: (error: any) => boolean
  ): Promise<T>;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 300,
  maxDelay: 5000,
  factor: 2
};

/**
 * Xətalara görə təkrar cəhd etmək üçün əsas funksiya
 */
export const withRetry: RetryFunction = async (
  fn,
  options = {},
  retryCondition = isNetworkError
) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { maxRetries, initialDelay, maxDelay, factor } = opts;
  
  let attempt = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      // Maksimum cəhd sayını yoxlayın
      if (attempt >= maxRetries) {
        logger.warn(`Maksimum cəhd sayına (${maxRetries}) çatılıb. Xəta: ${error}`);
        throw error;
      }
      
      // Təkrar cəhd etmək üçün şərti yoxlayın
      if (!retryCondition(error)) {
        logger.warn(`Təkrar cəhd şərti qarşılanmadı. Xəta: ${error}`);
        throw error;
      }
      
      // Növbəti cəhd üçün gözləmə müddətini hesablayın
      delay = Math.min(delay * factor, maxDelay);
      
      // Gündəliyə qeyd edin
      logger.info(`Təkrar cəhd edilir (${attempt}/${maxRetries}) ${delay}ms sonra. Xəta: ${error}`);
      
      // Növbəti cəhd üçün gözləyin
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Şəbəkə və keçici server xətaları üçün təkrar cəhd
 */
export const withNetworkRetry = <T>(fn: () => Promise<T>, options = {}): Promise<T> => {
  return withRetry(fn, {
    maxRetries: 3,
    initialDelay: 500,
    ...options,
    retryCondition: isNetworkError
  });
};

/**
 * Bütün xətalar üçün təkrar cəhd (diqqətlə istifadə edin!)
 */
export const withFullRetry = <T>(fn: () => Promise<T>, options = {}): Promise<T> => {
  return withRetry(fn, {
    maxRetries: 2,
    initialDelay: 300,
    ...options,
    retryCondition: () => true
  });
};

/**
 * Xüsusi təkrar cəhd şərti ilə təkrar cəhd
 */
export const withCustomRetry = <T>(
  fn: () => Promise<T>, 
  retryCondition: (error: any) => boolean,
  options = {}
): Promise<T> => {
  return withRetry(fn, {
    maxRetries: 3,
    initialDelay: 400,
    ...options,
    retryCondition
  });
};
