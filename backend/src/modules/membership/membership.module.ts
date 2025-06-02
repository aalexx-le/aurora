import { Module } from "@nestjs/common";
import { MembershipFeatureModule } from "./feature/membership-feature.module";
import { MembershipPlanModule } from "./plan/membership-plan.module";
import { MembershipPriceModule } from "./price/membership-price.module";
import { MembershipSubscriptionModule } from "./subscription/membership-subscription.module";
import {PaddleModule} from "../paddle/paddle.module";
import {SUBSCRIPTION_PUB_SUB_PROVIDER} from "../../shared/providers/pubsub";

@Module({
    imports: [
        PaddleModule,

        MembershipPlanModule,
        MembershipPriceModule,
        MembershipSubscriptionModule,
        MembershipFeatureModule,
    ],
    providers: [SUBSCRIPTION_PUB_SUB_PROVIDER],
    exports: [
        MembershipPlanModule,
        MembershipPriceModule,
        MembershipSubscriptionModule,
        MembershipFeatureModule,
    ],
})
export class MembershipModule {}
