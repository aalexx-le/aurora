import {
  GetMyMembershipSubscriptionsQuery
} from "@/gql/graphql";
  
export type MembershipSubscription = GetMyMembershipSubscriptionsQuery['myMembershipSubscriptions'][number];