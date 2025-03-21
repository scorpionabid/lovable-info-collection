/**
 * Supabase sorğuları üçün təkrar cəhd mexanizmi
 */
import { logInfo, logError } from './logger';

/**
 * Funksiya üçün təkrar cəhd mexanizmi
 * @param queryFn - İcra ediləcək funksiya
 * @param maxRetries - Maksimum təkrar cəhd sayı
 * @param context - Loqlaşdırma konteksti
 * @returns Funksiyanın nəticəsi
 */
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2,
  context = 'Supabase query'
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        logInfo(`Retry attempt ${retries}/${maxRetries} for ${context}`);
      }
      
      return await queryFn();
    } catch (error) {
      lastError = error;
      
      if (retries === maxRetries) {
        logError(error, `${context} failed after ${maxRetries} retries`);
        break;
      }
      
      retries++;
      const delay = 1000 * Math.pow(1.5, retries - 1);
      logInfo(`Waiting ${delay}ms before retry ${retries}/${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Təkrar cəhd parametrlərini konfiqurasiya etmək üçün funksiya
 * @param options - Təkrar cəhd parametrləri
 * @returns Konfiqurasiya edilmiş təkrar cəhd funksiyası
 */
export const configureRetry = (options: {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
}) => {
  const { maxRetries = 2, baseDelay = 1000, maxDelay = 10000 } = options;
  
  return async <T>(queryFn: () => Promise<T>, context = 'Supabase query'): Promise<T> => {
    let retries = 0;
    let lastError: unknown;
    
    while (retries <= maxRetries) {
      try {
        if (retries > 0) {
          logInfo(`Retry attempt ${retries}/${maxRetries} for ${context}`);
        }
        
        return await queryFn();
      } catch (error) {
        lastError = error;
        
        if (retries === maxRetries) {
          logError(error, `${context} failed after ${maxRetries} retries`);
          break;
        }
        
        retries++;
        const delay = Math.min(baseDelay * Math.pow(1.5, retries - 1), maxDelay);
        logInfo(`Waiting ${delay}ms before retry ${retries}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  };
};

export default {
  withRetry,
  configureRetry
};
