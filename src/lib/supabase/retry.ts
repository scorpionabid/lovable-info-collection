
/**
 * Təkrar cəhd (retry) mexanizmi utilləri
 */
import { logger } from '@/utils/logger';
import { isNetworkError } from './client';

// Təkrar cəhd üçün default parametrlər
export const DEFAULT_RETRY_OPTIONS = {
  maxRetries: 2,
  initialDelay: 1000,
  maxDelay: 10000,
  factor: 1.5
};

/**
 * Təkrar cəhd mexanizmi - əgər şəbəkə xətası baş verərsə sorğunu təkrarlayır
 * @param fn Təkrar cəhd ediləcək funksiya
 * @param options Təkrar cəhd parametrləri
 * @returns Funksiya nəticəsi
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
    retryCondition?: (error: any) => boolean;
    onRetry?: (error: any, attempt: number) => void;
  } = {}
): Promise<T> => {
  const {
    maxRetries = DEFAULT_RETRY_OPTIONS.maxRetries,
    initialDelay = DEFAULT_RETRY_OPTIONS.initialDelay,
    maxDelay = DEFAULT_RETRY_OPTIONS.maxDelay,
    factor = DEFAULT_RETRY_OPTIONS.factor,
    retryCondition = isNetworkError,
    onRetry
  } = options;

  let attempt = 0;
  let lastError: any;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;

      // Təkrar cəhd şərti yoxla
      if (attempt > maxRetries || !retryCondition(error)) {
        throw error;
      }

      // Təkrar cəhd gecikməsini hesabla (exponential backoff)
      const delay = Math.min(
        initialDelay * Math.pow(factor, attempt - 1),
        maxDelay
      );

      // Təkrar cəhd callback-i çağır
      if (onRetry) {
        onRetry(error, attempt);
      }

      logger.info(
        `Təkrar cəhd ${attempt}/${maxRetries}, ${delay}ms gözləyir...`,
        {
          error: error instanceof Error ? error.message : String(error),
          attempt,
          maxRetries,
          delay
        }
      );

      // Geciktirmə 
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Bu nöqtəyə gəlmək mümkün deyil, amma TypeScript-i xoşbəxt etmək üçün
  throw lastError;
};

/**
 * Xüsusi vəziyyətlərdə təkrar cəhd yaratmaq üçün konfiqurator
 */
export const createRetry = (defaultOptions: Partial<typeof DEFAULT_RETRY_OPTIONS>) => {
  return <T>(fn: () => Promise<T>, options = {}) =>
    retry(fn, { ...defaultOptions, ...options });
};

/**
 * Şəbəkə xətaları üçün təkrar cəhd
 */
export const retryNetworkErrors = createRetry({
  retryCondition: isNetworkError,
  maxRetries: 3
});

/**
 * HTTP 5xx xətaları üçün təkrar cəhd
 */
export const retryServerErrors = createRetry({
  retryCondition: (error: any) => {
    if (!error) return false;
    const status = error.status || error.statusCode;
    return status >= 500 && status < 600;
  },
  maxRetries: 2
});

/**
 * Rate limit xətaları üçün təkrar cəhd
 */
export const retryRateLimitErrors = createRetry({
  retryCondition: (error: any) => {
    if (!error) return false;
    const status = error.status || error.statusCode;
    return status === 429;
  },
  initialDelay: 2000,
  factor: 2,
  maxRetries: 3
});
