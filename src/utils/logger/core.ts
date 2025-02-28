import type { Logger } from './types';

// Enable debug mode based on environment
const isDebugMode = process.env.NODE_ENV === 'development';

// Core logger implementation
class LoggerImpl implements Logger {
  debug(...args: any[]) {
    if (isDebugMode) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args: any[]) {
    if (isDebugMode) {
      console.log('[INFO]', ...args);
    }
  }

  warn(...args: any[]) {
    if (isDebugMode) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]) {
    if (isDebugMode) {
      console.error('[ERROR]', ...args);
    }
  }

  stateChange(component: string, action: string, prevState: any, nextState: any) {
    if (isDebugMode) {
      console.group(`[${component}] ${action}`);
      console.log('Previous:', prevState);
      console.log('Next:', nextState);
      console.groupEnd();
    }
  }
}

// Create singleton instance
export const logger = new LoggerImpl();