import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getCookie } from "cookies-next";
import { AuthParams } from "@/lib/constants/params";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) => {
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            );
            console.log(locations?.[0].toString());
        });

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({ uri: process.env.API_SERVER });

const authLink = setContext((operation, previousContext) => {
    const { headers, type } = previousContext;
    if (type === "public") {
        return previousContext;
    }

    //You access token to make call
    const accessToken = getCookie(AuthParams.ACCESS_TOKEN);
    if (accessToken) {
        return {
            ...previousContext,
            headers: {
                ...headers,
                Authorization: "Bearer " + accessToken,
            },
        };
    }

    return { ...previousContext };
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: process.env.SUBSCRIPTION_SERVER || "ws://localhost:5000/graphql",
        connectionParams: {},
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
    link: ApolloLink.from([authLink, errorLink, link]),
    cache: new InMemoryCache(),
});

export default client;
