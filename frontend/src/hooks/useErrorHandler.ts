import { useState, useCallback } from "react";

/**
 * Interface for error state
 */
export interface ErrorState {
    hasError: boolean;
    message: string;
    code?: string | number;
    details?: any;
}

/**
 * Initial error state
 */
const initialErrorState: ErrorState = {
    hasError: false,
    message: "",
    code: undefined,
    details: undefined,
};

/**
 * Custom hook for handling errors in functional components
 *
 * @param errorReporter - Optional function to report errors to an external service
 * @returns Object containing error state and utility functions
 */
export function useErrorHandler(
    errorReporter?: (error: Error | unknown, info?: any) => void,
) {
    const [error, setError] = useState<ErrorState>(initialErrorState);

    /**
     * Handle an error by updating the error state
     */
    const handleError = useCallback(
        (err: Error | unknown, info?: any) => {
            console.error("Error caught by useErrorHandler:", err, info);

            // Report error if reporter is provided
            if (errorReporter) {
                errorReporter(err, info);
            }

            // Extract error details
            let errorMessage = "An unexpected error occurred";
            let errorCode: string | number | undefined = undefined;
            let errorDetails: any = undefined;

            if (err instanceof Error) {
                errorMessage = err.message;

                // Handle specific error types
                if ("code" in err) {
                    errorCode = (err as any).code;
                }

                if ("details" in err) {
                    errorDetails = (err as any).details;
                }
            } else if (typeof err === "string") {
                errorMessage = err;
            } else if (err && typeof err === "object") {
                if ("message" in err) {
                    errorMessage = (err as any).message;
                }
                if ("code" in err) {
                    errorCode = (err as any).code;
                }
                if ("details" in err) {
                    errorDetails = (err as any).details;
                }
            }

            setError({
                hasError: true,
                message: errorMessage,
                code: errorCode,
                details: errorDetails,
            });
        },
        [errorReporter],
    );

    /**
     * Clear the error state
     */
    const clearError = useCallback(() => {
        setError(initialErrorState);
    }, []);

    /**
     * Wrap an async function with error handling
     */
    const withErrorHandling = useCallback(
        <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
            return async (...args: T): Promise<R | undefined> => {
                try {
                    return await fn(...args);
                } catch (err) {
                    handleError(err);
                    return undefined;
                }
            };
        },
        [handleError],
    );

    return {
        error,
        handleError,
        clearError,
        withErrorHandling,
    };
}

export default useErrorHandler;
