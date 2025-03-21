
export class Logger {
  private namespace: string;
  private options: { level: 'debug' | 'info' | 'warn' | 'error' };

  constructor(namespace: string, options?: { level: 'debug' | 'info' | 'warn' | 'error' }) {
    this.namespace = namespace;
    this.options = options || { level: 'info' };
  }

  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.options.level];
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(`[${this.namespace}] ${message}`, data || '');
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(`[${this.namespace}] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`[${this.namespace}] ${message}`, data || '');
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      console.error(`[${this.namespace}] ${message}`, data || '');
    }
  }

  createLogger(subNamespace: string): Logger {
    return new Logger(`${this.namespace}:${subNamespace}`, this.options);
  }
}

export const logger = new Logger('InfoLine');
