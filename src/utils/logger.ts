
/**
 * Standard logger utility for consistent logging across the application
 */
export const createLogger = (componentName: string) => {
  const formatLog = (level: string, message: string, data?: any): string => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${componentName}] ${message}`;
  };

  // Helper to safely stringify objects (handles circular references)
  const safeStringify = (obj: any, maxDepth = 3, depth = 0): string => {
    if (depth >= maxDepth) return '[Object]';
    
    try {
      if (typeof obj !== 'object' || obj === null) {
        return typeof obj === 'string' ? obj : JSON.stringify(obj);
      }
      
      // Handle circular references and deep objects
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
          if (depth + 1 >= maxDepth) return '[Object]';
        }
        return value;
      }, 2);
    } catch (e) {
      return '[Unstringifiable Object]';
    }
  };

  const info = (message: string, data?: any) => {
    if (data) {
      console.info(formatLog('INFO', message), 
        typeof data === 'object' ? safeStringify(data) : data);
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
      console.warn(formatLog('WARN', message), 
        typeof data === 'object' ? safeStringify(data) : data);
    } else {
      console.warn(formatLog('WARN', message));
    }
  };
  
  const debug = (message: string, data?: any) => {
    if (data) {
      console.debug(formatLog('DEBUG', message), 
        typeof data === 'object' ? safeStringify(data) : data);
    } else {
      console.debug(formatLog('DEBUG', message));
    }
  };

  // Enhanced API logging methods
  const apiRequest = (endpoint: string, params?: any) => {
    const logData = {
      endpoint,
      params,
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).substring(2, 12)}`
    };
    
    console.info(formatLog('API', `Request to ${endpoint}`), safeStringify(logData));
    return logData.requestId; // Return request ID for correlation
  };
  
  const apiResponse = (endpoint: string, response: any, requestId?: string, duration?: number) => {
    const logData = {
      endpoint,
      requestId,
      duration: duration || '?',
      status: 'success',
      dataType: typeof response,
      isArray: Array.isArray(response),
      hasData: !!response,
      dataCount: Array.isArray(response) ? response.length : 
                (response && typeof response === 'object' && response.data ? 
                  (Array.isArray(response.data) ? response.data.length : 'object') : 
                  'not-array'),
      dataSnapshot: typeof response === 'object' ? safeStringify(response).substring(0, 500) + 
                   (safeStringify(response).length > 500 ? '...' : '') : response
    };
    
    console.info(formatLog('API', `Response from ${endpoint} in ${duration || '?'}ms`), safeStringify(logData));
  };
  
  const apiError = (endpoint: string, error: any, requestId?: string, params?: any) => {
    const logData = {
      endpoint,
      requestId,
      params,
      errorMessage: error?.message || 'Unknown error',
      errorCode: error?.code || 'UNKNOWN',
      errorDetails: error?.details || null,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    };
    
    console.error(formatLog('API', `Error from ${endpoint}`), safeStringify(logData));
  };
  
  return {
    info,
    error,
    warn,
    debug,
    apiRequest,
    apiResponse,
    apiError,
    safeStringify
  };
};

// Export a default logger for general use
export const logger = {
  createLogger,
  ...createLogger('app')
};
