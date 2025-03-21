
import { Logger } from '@/utils/logger';
import { isDevelopment } from '@/supabase/config';

// Configure logger for Supabase operations
const supabaseLogger = new Logger('Supabase', {
  level: isDevelopment ? 'debug' : 'info'
});

export const logError = (error: unknown, context?: string): void => {
  supabaseLogger.error(`${context || 'Error'}: ${error instanceof Error ? error.message : String(error)}`);
  if (isDevelopment && error instanceof Error && error.stack) {
    supabaseLogger.debug(error.stack);
  }
};

export const logInfo = (message: string, data?: any): void => {
  supabaseLogger.info(message, data);
};

export const logDebug = (message: string, data?: any): void => {
  if (isDevelopment) {
    supabaseLogger.debug(message, data);
  }
};

export default {
  logError,
  logInfo,
  logDebug
};
