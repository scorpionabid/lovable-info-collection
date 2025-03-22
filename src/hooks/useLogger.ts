
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
}

export const useLogger = (namespace: string): Logger => {
  const logWithLevel = (level: LogLevel, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${namespace}] ${message}`;
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, data || '');
        break;
      case 'info':
        console.info(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
    }
    
    // Burada servere log göndərmək üçün əlavə funksionallıq da əlavə edilə bilər
  };
  
  return {
    debug: (message: string, data?: any) => logWithLevel('debug', message, data),
    info: (message: string, data?: any) => logWithLevel('info', message, data),
    warn: (message: string, data?: any) => logWithLevel('warn', message, data),
    error: (message: string, data?: any) => logWithLevel('error', message, data)
  };
};

export default useLogger;
