"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, RefreshCw } from "lucide-react";

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /**
   * The children to render
   */
  children: ReactNode;
  
  /**
   * Custom fallback component to render when an error occurs
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  
  /**
   * Whether to log errors to the console
   */
  logErrors?: boolean;
  
  /**
   * Custom error handler function
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /**
   * Whether an error has occurred
   */
  hasError: boolean;
  
  /**
   * The error that occurred
   */
  error: Error | null;
}

/**
 * A component that catches JavaScript errors in its child component tree
 * and displays a fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console
    if (this.props.logErrors !== false) {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    
    // Call the custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error boundary state
   */
  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback if provided
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(this.state.error!, this.reset);
        }
        return this.props.fallback;
      }
      
      // Render default error UI
      return (
        <Alert variant="destructive" className="my-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p>An unexpected error occurred in this component.</p>
            <p className="text-xs mt-1 opacity-80">
              {this.state.error?.message || "Unknown error"}
            </p>
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={this.reset}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

/**
 * A higher-order component that wraps a component with an ErrorBoundary
 * 
 * @param Component - The component to wrap
 * @param errorBoundaryProps - Props for the ErrorBoundary
 * @returns A wrapped component with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
): React.FC<P> {
  const displayName = Component.displayName || Component.name || "Component";
  
  const WrappedComponent: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}

export default ErrorBoundary; 