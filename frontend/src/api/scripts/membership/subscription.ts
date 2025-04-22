import { gql } from "@apollo/client";

export const GET_MY_SUBSCRIPTIONS = gql`
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
`;

export const GET_MY_ACTIVE_SUBSCRIPTIONS = gql`
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
`;

// Mutation to cancel a subscription
export const CANCEL_SUBSCRIPTION = gql`
    mutation CancelMembershipSubscription($id: String!) {
        cancelPaddleSubscription(id: $id) {
            id
            status
            endDate
        }
    }
`;

// Mutation to update a subscription
export const UPDATE_SUBSCRIPTION = gql`
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
`;

// Add the reactivatePaddleSubscription mutation
export const REACTIVATE_PADDLE_SUBSCRIPTION = gql`
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
`;

export const SUBSCRIPTION_UPDATED = gql`
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
`;
