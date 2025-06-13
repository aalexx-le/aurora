import { graphql } from "@/gql";

export const GET_MEMBERSHIP_PLANS = graphql(`
    query GetMembershipPlans {
        getMembershipPlans {
            id
            name
            description
            createdAt
            updatedAt
            prices {
                id
                billingCycle {
                    frequency
                    interval
                }
                trialPeriod {
                    frequency
                    interval
                }
                unitPrice {
                    amount
                    currencyCode
                }
            }
            membershipFeatures {
                feature {
                    name
                    type
                }
            }
        }
    }
`);
