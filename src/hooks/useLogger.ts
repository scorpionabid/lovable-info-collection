
/**
 * Custom hook for standardized logging across the application
 */
export const useLogger = (componentName: string) => {
  const info = (message: string, data?: any) => {
    console.info(`[${componentName}] ${message}`, data || '');
  };
  
  const error = (message: string, error?: any) => {
    console.error(`[${componentName}] ${message}`, error || '');
  };
  
  const warn = (message: string, data?: any) => {
    console.warn(`[${componentName}] ${message}`, data || '');
  };
  
  const debug = (message: string, data?: any) => {
    console.debug(`[${componentName}] ${message}`, data || '');
  };
  
  return {
    info,
    error,
    warn,
    debug,
  };
};
