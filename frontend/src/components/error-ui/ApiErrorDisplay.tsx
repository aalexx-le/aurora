import { ApolloError } from "@apollo/client";
import { ErrorDisplay, ErrorDisplayProps } from "./ErrorDisplay";
import { ServerError } from "@apollo/client/errors";

/**
 * Props for the ApiErrorDisplay component
 */
export interface ApiErrorDisplayProps extends Omit<ErrorDisplayProps, 'message' | 'title' | 'details'> {
  /**
   * The error object from Apollo Client
   */
  error: ApolloError | Error | ServerError | unknown;
  
  /**
   * Custom title to display (optional)
   */
  title?: string;
  
  /**
   * Whether to show detailed error information (default: false)
   */
  showDetails?: boolean;
}

/**
 * A component for displaying API errors with appropriate formatting
 * 
 * @param props - The component props
 * @returns An API error display component
 */
export function ApiErrorDisplay({ 
  error, 
  title = "Error", 
  showDetails = false,
  ...props 
}: ApiErrorDisplayProps) {
  // Extract error message and details
  let message = "An unexpected error occurred";
  let details = "";
  
  if (error instanceof ApolloError) {
    // Handle Apollo errors
    message = error.message;
    
    if (showDetails && error.graphQLErrors?.length) {
      details = error.graphQLErrors.map(e => e.message).join('\n');
    } else if (showDetails && error.networkError) {
      details = `Network error: ${error.networkError.message}`;
    }
  } else if (error instanceof Error) {
    // Handle standard JS errors
    message = error.message;
    if (showDetails && error.stack) {
      details = error.stack;
    }
  } else if (typeof error === 'string') {
    // Handle string errors
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    // Handle objects with message property
    message = String((error as { message: unknown }).message);
  }
  
  // Determine severity based on error type
  let severity: ErrorDisplayProps['severity'] = 'error';
  
  // Check for network errors which might be critical
  if (error instanceof ApolloError && error.networkError) {
    severity = 'critical';
  }
  
  return (
    <ErrorDisplay
      title={title}
      message={message}
      details={showDetails ? details : undefined}
      severity={severity}
      {...props}
    />
  );
}

export default ApiErrorDisplay; 