
/**
 * Tətbiq boyu logger funksionalı təmin edən hook
 */

export const useLogger = (name: string) => {
  const getTimestamp = () => new Date().toISOString();
  
  return {
    info: (message: string, data?: any) => {
      console.log(`[${name}] [${getTimestamp()}] INFO: ${message}`, data ?? '');
    },
    
    warn: (message: string, data?: any) => {
      console.warn(`[${name}] [${getTimestamp()}] WARN: ${message}`, data ?? '');
    },
    
    error: (message: string, data?: any) => {
      console.error(`[${name}] [${getTimestamp()}] ERROR: ${message}`, data ?? '');
    },
    
    debug: (message: string, data?: any) => {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${name}] [${getTimestamp()}] DEBUG: ${message}`, data ?? '');
      }
    },
    
    trace: (message: string, data?: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.trace(`[${name}] [${getTimestamp()}] TRACE: ${message}`, data ?? '');
      }
    }
  };
};

export default useLogger;
