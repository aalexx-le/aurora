import { logError } from "../utils/error-utils";

/**
 * Interface for the global error handler configuration
 */
interface GlobalErrorHandlerConfig {
    /**
     * Whether to log errors to the console and error reporting service
     */
    logErrors?: boolean;
    /**
     * Custom error reporter function
     */
    errorReporter?: (error: Error | unknown, info?: any) => void;
    /**
     * Whether to show error alerts for unhandled errors
     */
    showErrorAlerts?: boolean;
}

/**
 * Initialize the global error handler
 *
 * @param config - Configuration for the global error handler
 */
export function initGlobalErrorHandler(
    config: GlobalErrorHandlerConfig = {},
): void {
    const { logErrors = true, errorReporter, showErrorAlerts = false } = config;

    // Handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
        const error = event.reason;

        // Log the error
        if (logErrors) {
            logError(error, { type: "unhandledRejection" });
        }

        // Call the custom error reporter
        if (errorReporter) {
            errorReporter(error, { type: "unhandledRejection" });
        }

        // Show an error alert if configured
        if (showErrorAlerts) {
            console.error("Unhandled Promise Rejection:", error);
        }

        // Prevent the default browser behavior
        event.preventDefault();
    };

    // Handler for uncaught errors
    const handleError = (event: ErrorEvent): void => {
        const { error, message, filename, lineno, colno } = event;

        // Create an error object if one doesn't exist
        const errorObj = error || new Error(message);

        // Add additional context to the error
        const errorContext = {
            type: "uncaughtError",
            location: {
                filename,
                lineno,
                colno,
            },
        };

        // Log the error
        if (logErrors) {
            logError(errorObj, errorContext);
        }

        // Call the custom error reporter
        if (errorReporter) {
            errorReporter(errorObj, errorContext);
        }

        // Show an error alert if configured
        if (showErrorAlerts) {
            console.error("Uncaught Error:", errorObj);
        }

        // Prevent the default browser behavior
        event.preventDefault();
    };

    // Add event listeners for unhandled errors
    if (typeof window !== "undefined") {
        window.addEventListener("unhandledrejection", handleUnhandledRejection);
        window.addEventListener("error", handleError);

        // Log that the global error handler has been initialized
        console.log("[Global Error Handler] Initialized");
    }
}

/**
 * Create a wrapped version of a function that catches and handles errors
 *
 * @param fn - The function to wrap
 * @param errorHandler - The error handler function
 * @returns A wrapped function that catches and handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    errorHandler?: (
        error: Error,
        ...args: Parameters<T>
    ) => ReturnType<T> | void,
): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
        try {
            return fn(...args);
        } catch (error) {
            // Log the error
            logError(error, { function: fn.name, arguments: args });

            // Call the custom error handler if provided
            if (errorHandler && error instanceof Error) {
                return errorHandler(error, ...args) as ReturnType<T>;
            }

            return undefined;
        }
    };
}

/**
 * Create a wrapped version of an async function that catches and handles errors
 *
 * @param fn - The async function to wrap
 * @param errorHandler - The error handler function
 * @returns A wrapped async function that catches and handles errors
 */
export function withAsyncErrorHandling<
    T extends (...args: any[]) => Promise<any>,
>(
    fn: T,
    errorHandler?: (
        error: Error,
        ...args: Parameters<T>
    ) => Promise<ReturnType<T>> | Promise<void>,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | undefined> {
    return async (
        ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>> | undefined> => {
        try {
            return await fn(...args);
        } catch (error) {
            // Log the error
            logError(error, { function: fn.name, arguments: args });

            // Call the custom error handler if provided
            if (errorHandler && error instanceof Error) {
                return (await errorHandler(error, ...args)) as Awaited<
                    ReturnType<T>
                >;
            }

            return undefined;
        }
    };
}
