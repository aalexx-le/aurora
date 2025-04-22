import { PubSub } from "graphql-subscriptions";

export const SUBSCRIPTION_PUB_SUB_PROVIDER = {
    provide: "SUBSCRIPTION_PUB_SUB",
    useValue: new PubSub(),
};
