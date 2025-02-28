// Enable debug mode based on environment
const isDebugMode = process.env.NODE_ENV === 'development';

// Logger implementation
export const logger = {
  debug: (...args: any[]) => {
    if (isDebugMode) console.debug('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    if (isDebugMode) console.log('[INFO]', ...args);
  },
  warn: (...args: any[]) => {
    if (isDebugMode) console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    if (isDebugMode) console.error('[ERROR]', ...args);
  },
  stateChange: (hook: string, action: string, prev: any, next: any) => {
    if (!isDebugMode) return;
    console.group(`[${hook}] ${action}`);
    console.log('Previous:', prev);
    console.log('Next:', next);
    console.groupEnd();
  }
};

// Action tracking wrapper
export const trackAction = <T extends Function>(
  name: string,
  fn: T,
  context?: string
): T => {
  return ((...args: any[]) => {
    logger.debug(`Action Start: ${name}`, { args, context });
    try {
      const result = fn(...args);
      logger.debug(`Action Complete: ${name}`, { result });
      return result;
    } catch (error) {
      logger.error(`Action Failed: ${name}`, { error, args });
      throw error;
    }
  }) as any;
};