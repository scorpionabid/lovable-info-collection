
// A simple logger hook to provide consistent logging
interface LoggerOptions {
  debug?: boolean;
  prefix?: string;
}

export const useLogger = (componentName: string, options: LoggerOptions = {}) => {
  const { debug = true, prefix = '' } = options;
  const prefixString = prefix ? `[${prefix}] ` : '';
  const componentPrefix = `[${componentName}] ${prefixString}`;

  return {
    debug: (message: string, ...args: any[]) => {
      if (debug && process.env.NODE_ENV !== 'production') {
        console.debug(`${componentPrefix}${message}`, ...args);
      }
    },
    log: (message: string, ...args: any[]) => {
      console.log(`${componentPrefix}${message}`, ...args);
    },
    info: (message: string, ...args: any[]) => {
      console.info(`${componentPrefix}${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`${componentPrefix}${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      console.error(`${componentPrefix}${message}`, ...args);
    }
  };
};

export default useLogger;
