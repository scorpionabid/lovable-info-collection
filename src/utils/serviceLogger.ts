
/**
 * Simple logger for use in service files that doesn't rely on React hooks
 */
export const serviceLogger = {
  info: (module: string, message: string, data?: any) => 
    console.info(`[${new Date().toISOString()}] [INFO] [${module}]`, message, data ? JSON.stringify(data, null, 2) : ''),
  
  error: (module: string, message: string, error?: any) => {
    console.error(`[${new Date().toISOString()}] [ERROR] [${module}]`, message);
    if (error) {
      if (error instanceof Error) {
        console.error(`Error details: ${error.message}`, {
          name: error.name,
          stack: error.stack
        });
      } else {
        console.error('Error data:', error);
      }
    }
  },
  
  debug: (module: string, message: string, data?: any) => 
    console.debug(`[${new Date().toISOString()}] [DEBUG] [${module}]`, message, data ? JSON.stringify(data, null, 2) : ''),
  
  warn: (module: string, message: string, data?: any) => 
    console.warn(`[${new Date().toISOString()}] [WARN] [${module}]`, message, data ? JSON.stringify(data, null, 2) : ''),

  apiRequest: (module: string, endpoint: string, params?: any) => {
    const requestId = `req_${Math.random().toString(36).substring(2, 12)}`;
    console.info(`[${new Date().toISOString()}] [API] [${module}]`, `Request to ${endpoint}`, { 
      params, 
      requestId,
      timestamp: new Date().toISOString()
    });
    return requestId;
  },
  
  apiResponse: (module: string, endpoint: string, response: any, requestId?: string, duration?: number) => {
    console.info(`[${new Date().toISOString()}] [API] [${module}]`, `Response from ${endpoint} in ${duration || '?'}ms`, { 
      requestId,
      status: 'success',
      dataType: typeof response,
      hasData: !!response
    });
  },
  
  apiError: (module: string, endpoint: string, error: any, requestId?: string) => {
    console.error(`[${new Date().toISOString()}] [API] [${module}]`, `Error from ${endpoint}`, { 
      requestId,
      errorMessage: error?.message || 'Unknown error',
      errorCode: error?.code || 'UNKNOWN',
      errorDetails: error?.details || null,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
  }
};
