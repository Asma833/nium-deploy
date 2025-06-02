/**
 * Centralized logging utility for encryption services
 * Controls console output based on environment configuration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  service: string;
  method?: string;
  url?: string;
  [key: string]: any;
}

class EncryptionLogger {
  private static instance: EncryptionLogger;
  private isDevelopment: boolean;
  private isEncryptionDebugEnabled: boolean;
  private logLevel: LogLevel;

  private constructor() {
    this.isDevelopment = import.meta.env.VITE_ENV === 'development';
    this.isEncryptionDebugEnabled =
      import.meta.env.VITE_ENCRYPTION_DEBUG === 'true';
    this.logLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'error';
  }

  static getInstance(): EncryptionLogger {
    if (!EncryptionLogger.instance) {
      EncryptionLogger.instance = new EncryptionLogger();
    }
    return EncryptionLogger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && !this.isEncryptionDebugEnabled) {
      return level === 'error'; // Only errors in production
    }

    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatMessage(message: string, context?: LogContext): string {
    if (!context) return message;

    const contextStr = Object.entries(context)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    return `${message} [${contextStr}]`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(
        `[ENCRYPTION DEBUG] ${this.formatMessage(message, context)}`
      );
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(`[ENCRYPTION INFO] ${this.formatMessage(message, context)}`);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(`[ENCRYPTION WARN] ${this.formatMessage(message, context)}`);
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorMsg = error ? `${message}: ${error.message}` : message;
      console.error(
        `[ENCRYPTION ERROR] ${this.formatMessage(errorMsg, context)}`
      );

      // In development, also log the stack trace
      if (this.isDevelopment && error?.stack) {
        console.error(error.stack);
      }
    }
  }

  // Specific methods for common encryption logging patterns
  logRSAKeyLoaded(source: 'env' | 'api', fallback = false): void {
    const action = fallback ? 'fallback' : 'primary';
    this.info(`RSA public key loaded from ${source}`, {
      service: 'EncryptionService',
      method: 'ensureRSAPublicKey',
      source,
      action,
    });
  }

  logEncryptionStart(url: string): void {
    this.debug('Starting request encryption', {
      service: 'EncryptionInterceptor',
      method: 'encryptRequestInterceptor',
      url,
    });
  }

  logDecryptionStart(url: string): void {
    this.debug('Starting response decryption', {
      service: 'EncryptionInterceptor',
      method: 'decryptResponseInterceptor',
      url,
    });
  }

  logEncryptionSkipped(url: string, reason: string): void {
    this.debug(`Encryption skipped: ${reason}`, {
      service: 'EncryptionInterceptor',
      url,
      reason,
    });
  }

  logContextMissing(contextKey?: string): void {
    this.warn('Encryption context not found for response decryption', {
      service: 'EncryptionInterceptor',
      contextKey: contextKey || 'undefined',
    });
  }
}

// Export singleton instance
export const encryptionLogger = EncryptionLogger.getInstance();
export default encryptionLogger;
