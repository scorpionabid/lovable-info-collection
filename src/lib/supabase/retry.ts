
/**
 * Təkrar sorğu mexanizmi
 */
import { logger } from '@/utils/logger';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryBackoff?: boolean;
  shouldRetry?: (error: any) => boolean;
}

/**
 * Sorğunu müəyyən sayda təkrar etmək üçün universal funksiya
 * @param fn Yerinə yetirilən funksiya
 * @param options Təkrar sorğu parametrləri
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryBackoff = true,
    shouldRetry = () => true
  } = options;

  let attempts = 0;
  let lastError: any;

  while (attempts <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempts++;

      // Maximum attempts reached, break the loop
      if (attempts > maxRetries) {
        break;
      }

      // Check if the error should trigger a retry
      if (!shouldRetry(error)) {
        logger.warn(`Retry aborted due to shouldRetry condition for error: ${error}`);
        break;
      }

      // Calculate delay for next attempt
      const delay = retryBackoff
        ? retryDelay * Math.pow(1.5, attempts - 1) // Exponential backoff
        : retryDelay;

      logger.info(`Retry ${attempts}/${maxRetries} will be executed in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Network errors için retry
 */
export const retryNetworkErrors = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const shouldRetryNetworkError = (error: any) => {
    if (!error) return false;

    // Network error matchers
    const isNetworkError = 
      (error.message && typeof error.message === 'string' && (
        error.message.includes('network') ||
        error.message.includes('fetch') ||
        error.message.includes('timeout') ||
        error.message.includes('connection')
      )) ||
      (error.code && [
        'PGRST301',
        'ECONNREFUSED',
        'ETIMEDOUT',
        'ERR_NETWORK'
      ].includes(error.code));

    return isNetworkError;
  };

  return retry(fn, {
    maxRetries: 3,
    retryDelay: 1000,
    retryBackoff: true,
    shouldRetry: shouldRetryNetworkError,
    ...options
  });
};

/**
 * 5XX errors için retry
 */
export const retry5xxErrors = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const shouldRetry5xx = (error: any) => {
    if (!error) return false;

    // HTTP 5XX errors
    const is5xxError = 
      (error.status && error.status >= 500 && error.status < 600) ||
      (error.statusCode && error.statusCode >= 500 && error.statusCode < 600);

    return is5xxError;
  };

  return retry(fn, {
    maxRetries: 3,
    retryDelay: 2000,
    retryBackoff: true,
    shouldRetry: shouldRetry5xx,
    ...options
  });
};

/**
 * Generic retry wrapper function compatible with existing code
 */
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2,
  retryDelay = 1000,
): Promise<T> => {
  return retry(queryFn, {
    maxRetries,
    retryDelay,
    retryBackoff: true
  });
};
