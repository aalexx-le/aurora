/**
 * Error UI Components
 *
 * This module exports a collection of components for displaying errors
 * and error states in the application.
 */

export {
    CriticalError,
    default as ErrorDisplay,
    Info,
    Warning,
} from "./ErrorDisplay";
export type { ErrorDisplayProps, ErrorSeverity } from "./ErrorDisplay";

export { default as ApiErrorDisplay } from "./ApiErrorDisplay";
export type { ApiErrorDisplayProps } from "./ApiErrorDisplay";

export { default as FormErrorMessage } from "./FormErrorMessage";
export type { FormErrorMessageProps } from "./FormErrorMessage";

export { default as EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { default as ErrorBoundary, withErrorBoundary } from "./ErrorBoundary";
export type { ErrorBoundaryProps } from "./ErrorBoundary";

export { default as GlobalErrorDisplay } from "./GlobalErrorDisplay";
