import {
    RefreshTokenMutation,
    RefreshTokenMutationVariables,
} from "@/gql/graphql";
import { createErrorLink } from "@/lib/apollo/error-link";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import { Cookie } from "@/lib/utils/cookie";
import { logError } from "@/lib/utils/error-utils";
import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    fromPromise,
    split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { REFRESH_TOKEN_MUTATION } from "./scripts/auth/auth";

// Creates a new client without auth for the refresh token request
const createRefreshClient = () => {
    return new ApolloClient({
        link: new HttpLink({
            uri:
                process.env.GRAPHQL_API_SERVER ||
                "http://localhost:5001/graphql",
        }),
        cache: new InMemoryCache(),
    });
};

// Function to refresh the token
const refreshToken = async () => {
    const refreshToken = Cookie.getRefreshToken();

    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    try {
        const refreshClient = createRefreshClient();

        const { data } = await refreshClient.mutate<
            RefreshTokenMutation,
            RefreshTokenMutationVariables
        >({
            mutation: REFRESH_TOKEN_MUTATION,
            variables: {
                data: { refreshToken },
            },
        });

        if (!data?.refreshToken) {
            throw new Error("Failed to refresh token");
        }

        Cookie.saveTokens({
            accessToken: data.refreshToken.accessToken,
            refreshToken: data.refreshToken.refreshToken,
            expiresIn: data.refreshToken.expiresIn,
        });

        return data.refreshToken.accessToken;
    } catch (error) {
        // Clear tokens on refresh failure
        Cookie.clearTokens();
        logError(error, { operation: "refreshToken" });
        throw error;
    }
};

// Authentication error link to handle token refresh
const authErrorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (graphQLErrors) {
        for (const error of graphQLErrors) {
            const { message, extensions } = error;

            // Handle authentication errors
            if (
                extensions?.code === "UNAUTHENTICATED" ||
                message.includes("Unauthorized")
            ) {
                // Try refreshing the token
                return fromPromise(
                    refreshToken().catch((error) => {
                        // Redirect to login page on refresh failure
                        if (typeof window !== "undefined") {
                            window.location.href = AUTH_ROUTE.value;
                        }
                        throw error;
                    }),
                ).flatMap((accessToken) => {
                    // Retry the operation with the new token
                    operation.setContext(({ headers = {} }) => ({
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }));

                    return forward(operation);
                });
            }
        }
    }

    // Let the operation continue
    return forward(operation);
});

// Create our custom error link for general error handling
const errorLink = createErrorLink((error) => {
    // This callback will be called for all errors that aren't handled by the authErrorLink
    console.log("Error handled by custom error link:", error);
    // You could also dispatch to a global error state here
});

const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_API_SERVER || "http://localhost:5001/graphql",
});

const authLink = setContext((operation, previousContext) => {
    const { headers, type } = previousContext;
    if (type === "public") {
        return previousContext;
    }

    // Check if token is expired before making a request
    if (Cookie.isTokenExpired()) {
        // If we have a refresh token, let the error link handle the refresh
        // Otherwise, just proceed (the operation will fail and redirect to login)
        if (!Cookie.getRefreshToken()) {
            Cookie.clearTokens();
        }
    }

    // Get the access token
    const accessToken = Cookie.getAccessToken();
    if (accessToken) {
        return {
            ...previousContext,
            headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }

    return { ...previousContext };
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: process.env.SUBSCRIPTION_SERVER || "ws://localhost:5001/graphql",
        connectionParams: () => {
            const accessToken = Cookie.getAccessToken();
            return {
                authorization: `Bearer ${accessToken}`,
            };
        },
        retryAttempts: Infinity,
        shouldRetry: () => true,
        keepAlive: 10000,
    }),
);

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: ApolloLink.from([authLink, authErrorLink, errorLink, link]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: "all",
        },
        query: {
            errorPolicy: "all",
        },
        mutate: {
            errorPolicy: "all",
        },
    },
});

export default client;
