
/**
 * Custom hook for standardized logging across the application
 */
export const useLogger = (componentName: string) => {
  const info = (message: string, data?: any) => {
    if (data) {
      console.info(`[${componentName}] ${message}`, data);
    } else {
      console.info(`[${componentName}] ${message}`);
    }
  };
  
  const error = (message: string, error?: any) => {
    if (error) {
      console.error(`[${componentName}] ${message}`, error);
    } else {
      console.error(`[${componentName}] ${message}`);
    }
  };
  
  const warn = (message: string, data?: any) => {
    if (data) {
      console.warn(`[${componentName}] ${message}`, data);
    } else {
      console.warn(`[${componentName}] ${message}`);
    }
  };
  
  const debug = (message: string, data?: any) => {
    if (data) {
      console.debug(`[${componentName}] ${message}`, data);
    } else {
      console.debug(`[${componentName}] ${message}`);
    }
  };
  
  return {
    info,
    error,
    warn,
    debug,
  };
};
