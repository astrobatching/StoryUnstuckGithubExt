import { logger } from './logger';

interface ErrorHandlerOptions {
  context: string;
  fallback?: () => void;
  rethrow?: boolean;
}

export function createErrorHandler({ context, fallback, rethrow = false }: ErrorHandlerOptions) {
  return (error: Error) => {
    logger.error(`[${context}] Error:`, error);
    
    if (fallback) {
      try {
        fallback();
      } catch (fallbackError) {
        logger.error(`[${context}] Fallback error:`, fallbackError);
      }
    }

    if (rethrow) {
      throw error;
    }
  };
}

export function wrapPromise<T>(
  promise: Promise<T>,
  context: string
): Promise<T> {
  return promise.catch(error => {
    logger.error(`[${context}] Async error:`, error);
    throw error;
  });
}