import { ApolloError } from "@apollo/client";

/**
 * Standard error codes for the application
 */
export enum ErrorCode {
    // Network errors
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT = "TIMEOUT",

    // Authentication errors
    UNAUTHENTICATED = "UNAUTHENTICATED",
    UNAUTHORIZED = "UNAUTHORIZED",

    // Data errors
    NOT_FOUND = "NOT_FOUND",
    VALIDATION_ERROR = "VALIDATION_ERROR",

    // Server errors
    SERVER_ERROR = "SERVER_ERROR",

    // Client errors
    CLIENT_ERROR = "CLIENT_ERROR",

    // Unknown errors
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Standard error interface for the application
 */
export interface AppError {
    code: ErrorCode;
    message: string;
    details?: string;
    originalError?: any;
}

/**
 * Map HTTP status codes to error codes
 */
const statusToErrorCode: Record<number, ErrorCode> = {
    400: ErrorCode.VALIDATION_ERROR,
    401: ErrorCode.UNAUTHENTICATED,
    403: ErrorCode.UNAUTHORIZED,
    404: ErrorCode.NOT_FOUND,
    408: ErrorCode.TIMEOUT,
    500: ErrorCode.SERVER_ERROR,
    502: ErrorCode.SERVER_ERROR,
    503: ErrorCode.SERVER_ERROR,
    504: ErrorCode.TIMEOUT,
};

/**
 * Map GraphQL error codes to error codes
 */
const graphqlToErrorCode: Record<string, ErrorCode> = {
    UNAUTHENTICATED: ErrorCode.UNAUTHENTICATED,
    FORBIDDEN: ErrorCode.UNAUTHORIZED,
    BAD_USER_INPUT: ErrorCode.VALIDATION_ERROR,
    INTERNAL_SERVER_ERROR: ErrorCode.SERVER_ERROR,
};

/**
 * Get a user-friendly error message based on the error code
 */
export function getUserFriendlyErrorMessage(code: ErrorCode): string {
    switch (code) {
        case ErrorCode.NETWORK_ERROR:
            return "Unable to connect to the server. Please check your internet connection.";
        case ErrorCode.TIMEOUT:
            return "The request timed out. Please try again.";
        case ErrorCode.UNAUTHENTICATED:
            return "You need to sign in to access this resource.";
        case ErrorCode.UNAUTHORIZED:
            return "You do not have permission to perform this action.";
        case ErrorCode.NOT_FOUND:
            return "The requested resource was not found.";
        case ErrorCode.VALIDATION_ERROR:
            return "There was an error with the data you provided.";
        case ErrorCode.SERVER_ERROR:
            return "Something went wrong on our end. Please try again later.";
        case ErrorCode.CLIENT_ERROR:
            return "An error occurred in the application. Please refresh the page and try again.";
        default:
            return "An unexpected error occurred. Please try again.";
    }
}

/**
 * Parse an HTTP error into a standardized AppError
 */
export function parseHttpError(error: any): AppError {
    // Handle fetch errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
        return {
            code: ErrorCode.NETWORK_ERROR,
            message: getUserFriendlyErrorMessage(ErrorCode.NETWORK_ERROR),
            originalError: error,
        };
    }

    // Handle timeout errors
    if (error.name === "AbortError") {
        return {
            code: ErrorCode.TIMEOUT,
            message: getUserFriendlyErrorMessage(ErrorCode.TIMEOUT),
            originalError: error,
        };
    }

    // Handle HTTP errors with status codes
    if (error.status && typeof error.status === "number") {
        const code = statusToErrorCode[error.status] || ErrorCode.UNKNOWN_ERROR;
        return {
            code,
            message: getUserFriendlyErrorMessage(code),
            details: error.statusText || undefined,
            originalError: error,
        };
    }

    // Handle unknown errors
    return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: getUserFriendlyErrorMessage(ErrorCode.UNKNOWN_ERROR),
        originalError: error,
    };
}

/**
 * Interface for GraphQL error data
 */
export interface GraphQLErrorData {
    graphQLErrors?: readonly any[];
    networkError?: Error | null;
    message: string;
    name: string;
}

/**
 * Parse an Apollo GraphQL error into a standardized AppError
 */
export function parseGraphQLError(
    error: ApolloError | GraphQLErrorData,
): AppError {
    // Handle network errors
    if (error.networkError) {
        return {
            code: ErrorCode.NETWORK_ERROR,
            message: getUserFriendlyErrorMessage(ErrorCode.NETWORK_ERROR),
            details: error.message,
            originalError: error,
        };
    }

    // Handle GraphQL errors
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        const extensions = graphQLError.extensions || {};
        const code = extensions.code
            ? graphqlToErrorCode[extensions.code as string] ||
              ErrorCode.UNKNOWN_ERROR
            : ErrorCode.UNKNOWN_ERROR;

        return {
            code,
            message: getUserFriendlyErrorMessage(code),
            details: graphQLError.message,
            originalError: error,
        };
    }

    // Handle unknown errors
    return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: getUserFriendlyErrorMessage(ErrorCode.UNKNOWN_ERROR),
        details: error.message,
        originalError: error,
    };
}

/**
 * Parse any error into a standardized AppError
 */
export function parseError(error: any): AppError {
    // Handle Apollo errors
    if (error instanceof ApolloError) {
        return parseGraphQLError(error);
    }

    // Handle HTTP errors
    if (error.status || error.statusText) {
        return parseHttpError(error);
    }

    // Handle standard errors
    if (error instanceof Error) {
        return {
            code: ErrorCode.UNKNOWN_ERROR,
            message: getUserFriendlyErrorMessage(ErrorCode.UNKNOWN_ERROR),
            details: error.message,
            originalError: error,
        };
    }

    // Handle unknown errors
    return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: getUserFriendlyErrorMessage(ErrorCode.UNKNOWN_ERROR),
        originalError: error,
    };
}

/**
 * Log an error to the console and optionally to an error reporting service
 */
export function logError(error: any, context?: Record<string, any>): void {
    const appError = parseError(error);

    console.error("[Error]", {
        code: appError.code,
        message: appError.message,
        details: appError.details,
        context,
        originalError: appError.originalError,
    });

    // Here you could add integration with error reporting services like Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(appError.originalError || appError, {
    //     tags: { errorCode: appError.code },
    //     extra: { ...context, details: appError.details },
    //   });
    // }
}
