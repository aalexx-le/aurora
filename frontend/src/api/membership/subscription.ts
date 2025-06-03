import { graphql } from "@/gql";

export const GET_MY_SUBSCRIPTIONS = graphql(`
    query GetMyMembershipSubscriptions {
        myMembershipSubscriptions {
            id
            userId
            planId
            status
            startDate
            endDate
            createdAt
            updatedAt
            plan {
                id
                name
                description
            }
            paymentTransactions {
                id
                amount
                currency
                status
                createdAt
            }
        }
    }
`);

export const GET_MY_ACTIVE_SUBSCRIPTIONS = graphql(`
    query GetMyActiveMembershipSubscriptions {
        myActiveMembershipSubscriptions {
            id
            userId
            planId
            status
            startDate
            endDate
            createdAt
            updatedAt
            plan {
                id
                name
                description
            }
        }
    }
`);

// Mutation to cancel a subscription
export const CANCEL_SUBSCRIPTION = graphql(`
    mutation CancelMembershipSubscription($id: String!) {
        cancelPaddleSubscription(id: $id) {
            id
            status
            endDate
        }
    }
`);

// Mutation to update a subscription
export const UPDATE_SUBSCRIPTION = graphql(`
    mutation UpdateMembershipSubscription(
        $id: String!
        $data: UpdateSubscriptionDto!
    ) {
        updateMembershipSubscription(id: $id, data: $data) {
            id
            status
            planId
            endDate
        }
    }
`);

// Add the reactivatePaddleSubscription mutation
export const REACTIVATE_PADDLE_SUBSCRIPTION = graphql(`
    mutation ReactivatePaddleSubscription($id: String!) {
        reactivatePaddleSubscription(id: $id) {
            id
            userId
            planId
            status
            startDate
            endDate
            createdAt
            updatedAt
        }
    }
`);

// Mutation to create customer portal session
export const CREATE_CUSTOMER_PORTAL_SESSION = graphql(`
    mutation CreateCustomerPortalSession($subscriptionIds: [String!]) {
        createCustomerPortalSession(subscriptionIds: $subscriptionIds) {
            id
            customerId
            urls {
                general {
                    overview
                }
            }
            createdAt
        }
    }
`);

export const SUBSCRIPTION_UPDATED = graphql(`
    subscription OnMembershipSubscriptionUpdated {
        onMembershipSubscriptionUpdated {
            id
            userId
            planId
            status
            startDate
            endDate
            createdAt
            updatedAt
        }
    }
`);
