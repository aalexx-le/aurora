import { graphql } from "@/gql";

export const GET_MY_MEMBERSHIP_FEATURES = graphql(`
  query GetMyMembershipFeatures {
    myMembershipFeatures {
      feature {
        id
        type
        name
      }
    }
  }
`);