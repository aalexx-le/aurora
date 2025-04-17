"use client";

import { ErrorSeverity } from '@/components/error-ui';
import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

/**
 * Error context state interface
 */
export interface ErrorContextState {
  /**
   * Whether there is an error
   */
  hasError: boolean;
  
  /**
   * The error object
   */
  error: Error | null;
  
  /**
   * The error message
   */
  message: string;
  
  /**
   * The error title
   */
  title: string;
  
  /**
   * The error severity
   */
  severity: ErrorSeverity;
  
  /**
   * Set an error
   */
  setError: (error: Error | string, title?: string, severity?: ErrorSeverity) => void;
  
  /**
   * Clear the error
   */
  clearError: () => void;
}

// Create the error context
const ErrorContext = createContext<ErrorContextState | undefined>(undefined);

/**
 * Props for the ErrorProvider component
 */
export interface ErrorProviderProps {
  /**
   * The children to render
   */
  children: ReactNode;
  
  /**
   * Custom error handler
   */
  onError?: (error: Error) => void;
}

/**
 * Provider component for the error context
 * 
 * @param props - The component props
 * @returns An error provider component
 */
export function ErrorProvider({ children, onError }: ErrorProviderProps) {
  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null as Error | null,
    message: '',
    title: 'Error',
    severity: 'error' as ErrorSeverity,
  });
  
  /**
   * Set an error
   */
  const setError = useCallback((
    error: Error | string,
    title = 'Error',
    severity: ErrorSeverity = 'error'
  ) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    console.error('Global error:', errorObj);
    
    if (onError) {
      onError(errorObj);
    }
    
    setErrorState({
      hasError: true,
      error: errorObj,
      message: errorObj.message,
      title,
      severity,
    });
  }, [onError]);
  
  /**
   * Clear the error
   */
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      message: '',
      title: 'Error',
      severity: 'error',
    });
  }, []);
  
  const value = {
    ...errorState,
    setError,
    clearError,
  };
  
  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

/**
 * Hook to use the error context
 * 
 * @returns The error context
 * @throws Error if used outside of an ErrorProvider
 */
export function useErrorContext(): ErrorContextState {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  
  return context;
}

export default ErrorContext; 