/**
 * Sorğuların təkrar cəhd mexanizmi
 */
import { logger } from '@/utils/logger';
import { isOfflineMode, isNetworkError } from './client';

/**
 * Offline növbəyə sorğu əlavə etmək üçün
 * @param queryFn Yerinə yetiriləcək sorğu funksiyası
 */
const addToOfflineQueue = <T>(queryFn: () => Promise<T>): Promise<T> => {
  // Bu funksiyanın tam tətbiqi əsas client faylında mövcuddur
  logger.info('Sorğu offline növbəyə əlavə edildi');
  
  // Xəta göndər (offline növbə funksiyası hələ köçürülməyib)
  return Promise.reject(new Error('Offline rejim: sorğu icra edilə bilməz'));
};

/**
 * Təkrar cəhd məntiqi
 * @param queryFn Yerinə yetiriləcək sorğu funksiyası
 * @param maxRetries Maksimum cəhd sayı
 * @param initialRetryDelay İlkin gecikmə (millisaniyə ilə)
 * @param offlineQueueable Offline növbəyə əlavə edilə bilər
 */
export const withRetry = async <T>(
  queryFn: () => Promise<T>, 
  maxRetries = 2, 
  initialRetryDelay = 1000,
  offlineQueueable = false
): Promise<T> => {
  let retries = 0;
  let lastError: unknown;
  
  // Offline rejim yoxlaması
  if (isOfflineMode() && offlineQueueable) {
    return addToOfflineQueue<T>(queryFn);
  }
  
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        logger.info(`Təkrar cəhd ${retries}/${maxRetries}`);
      }
      
      const result = await queryFn();
      return result;
    } catch (error) {
      lastError = error;
      
      // Şəbəkə xətası baş verdikdə və sorğu növbələnə bilərsə
      if (offlineQueueable && isNetworkError(error)) {
        logger.warn('Şəbəkə xətası, sorğu offline növbəyə əlavə edilir');
        return addToOfflineQueue<T>(queryFn);
      }
      
      // Son cəhd idisə, gözləmə
      if (retries === maxRetries) {
        break;
      }
      
      retries++;
      
      // Eksponensial gecikmə hesabla
      const delay = initialRetryDelay * Math.pow(1.5, retries - 1) * (0.9 + Math.random() * 0.2);
      
      logger.warn(`Sorğu uğursuz oldu, ${Math.round(delay)}ms sonra təkrar cəhd ediləcək`, {
        error,
        attempt: retries,
        maxRetries
      });
      
      // Növbəti cəhddən əvvəl gözlə
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // Bütün cəhdlər uğursuz olduqda və sorğu növbələnə bilərsə
  if (offlineQueueable) {
    logger.warn('Bütün cəhdlər uğursuz oldu, sorğu offline növbəyə əlavə edilir');
    return addToOfflineQueue<T>(queryFn);
  }
  
  logger.error(`Sorğu ${maxRetries} təkrar cəhddən sonra uğursuz oldu`, lastError);
  throw lastError;
};
