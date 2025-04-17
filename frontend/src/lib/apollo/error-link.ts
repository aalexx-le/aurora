import {
    GraphQLErrorData,
    logError,
    parseGraphQLError,
} from "@/lib/utils/error-utils";
import { onError } from "@apollo/client/link/error";

/**
 * Create an error link for Apollo Client
 *
 * @param errorCallback - Optional callback to handle errors
 * @returns An error link for Apollo Client
 */
export const createErrorLink = (errorCallback?: (error: any) => void) => {
    return onError(({ graphQLErrors, networkError, operation, forward }) => {
        // Handle GraphQL errors
        if (graphQLErrors) {
            for (const error of graphQLErrors) {
                const errorData: GraphQLErrorData = {
                    graphQLErrors: [error],
                    networkError: networkError || null,
                    message: error.message,
                    name: "GraphQLError",
                };

                const parsedError = parseGraphQLError(errorData);

                // Log the error
                logError(error, {
                    operation: operation.operationName,
                    variables: operation.variables,
                    path: error.path,
                    extensions: error.extensions,
                });

                // Call the error callback if provided
                if (errorCallback) {
                    errorCallback(parsedError);
                }

                // Handle specific error codes
                if (error.extensions?.code === "UNAUTHENTICATED") {
                    // Handle authentication errors (e.g., redirect to login)
                    if (typeof window !== "undefined") {
                        // Check if we're not already on the login page to avoid redirect loops
                        if (!window.location.pathname.includes("/auth/login")) {
                            console.log(
                                "Redirecting to login due to authentication error",
                            );
                            // Store the current path to redirect back after login
                            localStorage.setItem(
                                "redirectAfterLogin",
                                window.location.pathname,
                            );
                            window.location.href = "/auth/login";
                        }
                    }
                }
            }
        }

        // Handle network errors
        if (networkError) {
            logError(networkError, {
                operation: operation.operationName,
                variables: operation.variables,
            });

            // Call the error callback if provided
            if (errorCallback) {
                errorCallback(networkError);
            }
        }

        // Continue the operation
        return forward(operation);
    });
};

export default createErrorLink;
