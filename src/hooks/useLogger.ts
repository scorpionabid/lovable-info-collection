
/**
 * Custom hook for standardized logging across the application
 */
export const useLogger = (componentName: string) => {
  const formatLog = (level: string, message: string, data?: any): string => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${componentName}] ${message}`;
  };

  const info = (message: string, data?: any) => {
    if (data) {
      console.info(formatLog('INFO', message), data);
    } else {
      console.info(formatLog('INFO', message));
    }
  };
  
  const error = (message: string, error?: any) => {
    if (error) {
      console.error(formatLog('ERROR', message), error);
      // Log additional details if error is an object
      if (error instanceof Error) {
        console.error(`Error details: ${error.message}`, {
          name: error.name,
          stack: error.stack
        });
      }
    } else {
      console.error(formatLog('ERROR', message));
    }
  };
  
  const warn = (message: string, data?: any) => {
    if (data) {
      console.warn(formatLog('WARN', message), data);
    } else {
      console.warn(formatLog('WARN', message));
    }
  };
  
  const debug = (message: string, data?: any) => {
    if (data) {
      console.debug(formatLog('DEBUG', message), data);
    } else {
      console.debug(formatLog('DEBUG', message));
    }
  };

  // Specific API logging methods
  const apiRequest = (endpoint: string, params?: any) => {
    console.info(formatLog('API', `Request to ${endpoint}`), { params });
  };
  
  const apiResponse = (endpoint: string, response: any, duration?: number) => {
    console.info(formatLog('API', `Response from ${endpoint} in ${duration || '?'}ms`), {
      status: 'success',
      dataType: typeof response,
      isArray: Array.isArray(response),
      dataSnapshot: typeof response === 'object' 
        ? JSON.stringify(response).substring(0, 500) 
        : response
    });
  };
  
  const apiError = (endpoint: string, error: any, params?: any) => {
    console.error(formatLog('API', `Error from ${endpoint}`), {
      error,
      params,
      errorMessage: error?.message || 'Unknown error',
      errorCode: error?.code || 'UNKNOWN',
      errorDetails: error?.details || null
    });
  };
  
  return {
    info,
    error,
    warn,
    debug,
    apiRequest,
    apiResponse,
    apiError
  };
};
