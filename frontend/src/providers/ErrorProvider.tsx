"use client";

import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { ErrorDisplay, ErrorSeverity } from '@/components/error-ui/ErrorDisplay';
import { initGlobalErrorHandler } from '@/lib/error/global-error-handler';
import { logError, parseError } from '@/lib/utils/error-utils';
import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

/**
 * Interface for the error context
 */
interface ErrorContextType {
  /**
   * Show an error message
   */
  showError: (message: string, options?: ErrorOptions) => void;
  /**
   * Show an error from an Error object
   */
  showErrorFromException: (error: Error | unknown, options?: ErrorOptions) => void;
  /**
   * Clear all errors
   */
  clearErrors: () => void;
  /**
   * Clear a specific error by ID
   */
  clearError: (id: string) => void;
  /**
   * Current errors
   */
  errors: ErrorState[];
  /**
   * Whether there are any errors
   */
  hasErrors: boolean;
}

/**
 * Options for showing an error
 */
interface ErrorOptions {
  /**
   * Title of the error
   */
  title?: string;
  /**
   * Additional details about the error
   */
  details?: string;
  /**
   * Severity of the error
   */
  severity?: ErrorSeverity;
  /**
   * ID of the error (auto-generated if not provided)
   */
  id?: string;
  /**
   * Whether the error should be automatically dismissed after a timeout
   */
  autoDismiss?: boolean;
  /**
   * Timeout in milliseconds for auto-dismissing the error
   */
  autoDismissTimeout?: number;
  /**
   * Whether to log the error
   */
  log?: boolean;
}

/**
 * State for an error
 */
interface ErrorState extends ErrorOptions {
  /**
   * ID of the error
   */
  id: string;
  /**
   * Message of the error
   */
  message: string;
  /**
   * Timestamp when the error was created
   */
  timestamp: number;
}

/**
 * Props for the ErrorProvider component
 */
interface ErrorProviderProps {
  /**
   * Children components
   */
  children: ReactNode;
  /**
   * Whether to initialize the global error handler
   */
  initGlobalHandler?: boolean;
  /**
   * Whether to log errors to the console and error reporting service
   */
  logErrors?: boolean;
  /**
   * Custom error reporter function
   */
  errorReporter?: (error: Error | unknown, info?: any) => void;
}

// Create the error context
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

/**
 * Provider component for error handling
 */
export function ErrorProvider({
  children,
  initGlobalHandler = true,
  logErrors = true,
  errorReporter,
}: ErrorProviderProps): JSX.Element {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  // Initialize the global error handler
  useEffect(() => {
    if (initGlobalHandler) {
      initGlobalErrorHandler({
        logErrors,
        errorReporter,
        showErrorAlerts: false,
      });
    }
  }, [initGlobalHandler, logErrors, errorReporter]);

  // Show an error message
  const showError = useCallback((message: string, options: ErrorOptions = {}) => {
    const {
      title,
      details,
      severity = 'error',
      id = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      autoDismiss = false,
      autoDismissTimeout = 5000,
      log = true,
    } = options;

    // Create the error state
    const errorState: ErrorState = {
      id,
      message,
      title,
      details,
      severity,
      timestamp: Date.now(),
      autoDismiss,
      autoDismissTimeout,
    };

    // Log the error if configured
    if (log && logErrors) {
      logError(new Error(message), {
        title,
        details,
        severity,
      });
    }

    // Add the error to the state
    setErrors((prevErrors) => [...prevErrors, errorState]);

    // Auto-dismiss the error if configured
    if (autoDismiss) {
      setTimeout(() => {
        setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
      }, autoDismissTimeout);
    }

    return id;
  }, [logErrors]);

  // Show an error from an Error object
  const showErrorFromException = useCallback((error: Error | unknown, options: ErrorOptions = {}) => {
    // Parse the error
    const parsedError = parseError(error);

    // Show the error
    return showError(parsedError.message, {
      details: parsedError.details,
      ...options,
    });
  }, [showError]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Clear a specific error by ID
  const clearError = useCallback((id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  // Check if there are any errors
  const hasErrors = errors.length > 0;

  // Create the context value
  const contextValue: ErrorContextType = {
    showError,
    showErrorFromException,
    clearErrors,
    clearError,
    errors,
    hasErrors,
  };

  // Render the error provider
  return (
    <ErrorContext.Provider value={contextValue}>
      <ErrorBoundary
        onError={(error) => {
          if (logErrors) {
            logError(error, { source: 'ErrorProvider' });
          }
          if (errorReporter) {
            errorReporter(error);
          }
        }}
      >
        {children}
        {/* Render errors */}
        {errors.length > 0 && (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
            {errors.map((error) => (
              <ErrorDisplay
                key={error.id}
                title={error.title}
                message={error.message}
                details={error.details}
                severity={error.severity}
                onDismiss={() => clearError(error.id)}
                compact
              />
            ))}
          </div>
        )}
      </ErrorBoundary>
    </ErrorContext.Provider>
  );
}

export default ErrorProvider; 