import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../utils/debug';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Component Error:', {
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border-4 border-red-500 bg-red-50">
          <h2 className="text-lg font-bold text-red-700 mb-2">
            Something went wrong
          </h2>
          <pre className="text-sm text-red-600 whitespace-pre-wrap">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}