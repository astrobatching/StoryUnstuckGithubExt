import { logger } from './core';

// Action tracking wrapper
export function trackAction<T extends Function>(
  actionName: string, 
  fn: T,
  context?: string
): T {
  return ((...args: any[]) => {
    logger.debug(`[${context || 'Action'}] ${actionName} started`, { args });
    try {
      const result = fn(...args);
      logger.debug(`[${context || 'Action'}] ${actionName} completed`, { result });
      return result;
    } catch (error) {
      logger.error(`[${context || 'Action'}] ${actionName} failed`, { error, args });
      throw error;
    }
  }) as any;
}

// State change tracker
export function trackStateChange(
  component: string,
  prevState: any,
  nextState: any
) {
  logger.stateChange(
    component,
    'State Change',
    prevState,
    nextState
  );
}