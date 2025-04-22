import { registerEnumType } from '@nestjs/graphql';

export enum MembershipSubscriptionStatus {
    active = "active",
    canceled = "canceled",
    past_due = "past_due",
    paused = "paused",
    trialing = "trialing"
}


registerEnumType(MembershipSubscriptionStatus, { name: 'MembershipSubscriptionStatus', description: undefined })
