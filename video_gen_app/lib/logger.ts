type LogLevel = 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  path?: string;
  [key: string]: any;
}

export const Logger = {
  formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  },

  info(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.log(Logger.formatMessage('info', message, context));
    }
  },

  warn(message: string, context?: LogContext) {
    console.warn(Logger.formatMessage('warn', message, context));
  },

  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = error ? {
      ...context,
      errorName: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
    } : context;

    console.error(Logger.formatMessage('error', message, errorContext));
  }
};
