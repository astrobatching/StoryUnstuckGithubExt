// Define log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Define logger interface
export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  stateChange: (component: string, action: string, prevState: any, nextState: any) => void;
}