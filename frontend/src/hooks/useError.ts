import { useCallback, useState } from "react";

/**
 * Error state interface
 */
export interface ErrorState {
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
}

/**
 * Options for the useError hook
 */
export interface UseErrorOptions {
    /**
     * Initial error state
     */
    initialError?: Error | null;

    /**
     * Whether to log errors to the console
     */
    logErrors?: boolean;

    /**
     * Custom error handler
     */
    onError?: (error: Error) => void;
}

/**
 * A custom hook for managing error states in components
 *
 * @param options - Hook options
 * @returns Error state and utility functions
 */
export function useError(options: UseErrorOptions = {}) {
    const { initialError = null, logErrors = true, onError } = options;

    const [errorState, setErrorState] = useState<ErrorState>({
        hasError: !!initialError,
        error: initialError,
        message: initialError?.message || "",
    });

    /**
     * Set an error
     */
    const setError = useCallback(
        (error: Error | string) => {
            const errorObj =
                typeof error === "string" ? new Error(error) : error;

            if (logErrors) {
                console.error("Error caught by useError:", errorObj);
            }

            if (onError) {
                onError(errorObj);
            }

            setErrorState({
                hasError: true,
                error: errorObj,
                message: errorObj.message,
            });
        },
        [logErrors, onError],
    );

    /**
     * Clear the error
     */
    const clearError = useCallback(() => {
        setErrorState({
            hasError: false,
            error: null,
            message: "",
        });
    }, []);

    /**
     * Wrap a function with error handling
     */
    const withErrorHandling = useCallback(
        <T extends (...args: any[]) => any>(
            fn: T,
        ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
            return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
                try {
                    clearError();
                    return await fn(...args);
                } catch (err) {
                    setError(
                        err instanceof Error ? err : new Error(String(err)),
                    );
                    throw err;
                }
            };
        },
        [clearError, setError],
    );

    return {
        ...errorState,
        setError,
        clearError,
        withErrorHandling,
    };
}

export default useError;
