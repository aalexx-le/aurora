import React, { ComponentType, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { ErrorDisplay } from '../error-ui/ErrorDisplay';
import { parseError, logError } from '@/lib/utils/error-utils';

/**
 * Props for the withErrorHandling HOC
 */
export interface WithErrorHandlingProps {
  // You can add any props that should be passed to the error handling components
  errorFallback?: React.ReactNode;
}

/**
 * Higher-order component that wraps a component with error handling
 * 
 * @param Component - The component to wrap
 * @param options - Options for error handling
 * @returns A wrapped component with error handling
 */
export function withErrorHandling<P extends object>(
  Component: ComponentType<P>,
  options: {
    /**
     * Whether to log errors to the console and error reporting service
     */
    logErrors?: boolean;
    /**
     * Custom error reporter function
     */
    errorReporter?: (error: Error, errorInfo: React.ErrorInfo) => void;
    /**
     * Whether to show the error UI
     */
    showErrorUI?: boolean;
    /**
     * Custom error fallback component
     */
    fallback?: (props: { error: Error; reset: () => void }) => React.ReactNode;
  } = {}
) {
  const {
    logErrors = true,
    errorReporter,
    showErrorUI = true,
    fallback,
  } = options;

  // Set a display name for the wrapped component
  const displayName = Component.displayName || Component.name || 'Component';

  // Create the wrapped component
  const WrappedComponent = React.forwardRef<unknown, P & WithErrorHandlingProps>(
    (props, ref) => {
      const [error, setError] = useState<Error | null>(null);

      // Reset error state when component mounts
      useEffect(() => {
        setError(null);
      }, []);

      // Handle errors
      const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        // Set the error state
        setError(error);

        // Log the error
        if (logErrors) {
          logError(error, { component: displayName, errorInfo });
        }

        // Call the custom error reporter
        if (errorReporter) {
          errorReporter(error, errorInfo);
        }
      };

      // Reset the error state
      const resetError = () => {
        setError(null);
      };

      // If there's an error and showErrorUI is true, show the error UI
      if (error && showErrorUI) {
        // If a custom fallback is provided, use it
        if (fallback) {
          return fallback({ error, reset: resetError });
        }

        // If a custom error fallback is provided in props, use it
        if (props.errorFallback) {
          return props.errorFallback;
        }

        // Otherwise, use the default error UI
        const parsedError = parseError(error);
        return (
          <ErrorDisplay
            title={`Error in ${displayName}`}
            message={parsedError.message}
            details={parsedError.details}
            onRetry={resetError}
            severity="error"
          />
        );
      }

      // If there's no error, render the component
      return (
        <ErrorBoundary
          onError={handleError}
          resetKeys={[error]}
        >
          <Component {...(props as P)} ref={ref} />
        </ErrorBoundary>
      );
    }
  );

  // Set the display name for the wrapped component
  WrappedComponent.displayName = `withErrorHandling(${displayName})`;

  return WrappedComponent;
}

export default withErrorHandling; 