import { GetDiscountsForPriceQuery } from "@/gql/graphql";

export type MembershipDiscount = GetDiscountsForPriceQuery['getDiscountsForPrice'][number];