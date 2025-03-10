
import { isDevelopment } from './config';

// Wrapper function to log API calls in development
export const logApiCall = async <T>(
  name: string, 
  fn: () => Promise<T>
): Promise<T> => {
  if (!isDevelopment()) return fn();
  
  console.log(`API Call: ${name} - Started`);
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const endTime = performance.now();
    console.log(`API Call: ${name} - Completed in ${Math.round(endTime - startTime)}ms`, result);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`API Call: ${name} - Failed in ${Math.round(endTime - startTime)}ms`, error);
    throw error;
  }
};
