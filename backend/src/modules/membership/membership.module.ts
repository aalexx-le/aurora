import { Module } from "@nestjs/common";
import { MembershipFeatureModule } from "./feature/membership-feature.module";
import { MembershipPlanModule } from "./plan/membership-plan.module";
import { MembershipPriceModule } from "./price/membership-price.module";
import { MembershipSubscriptionModule } from "./subscription/membership-subscription.module";

@Module({
    imports: [
        MembershipPlanModule,
        MembershipPriceModule,
        MembershipSubscriptionModule,
        MembershipFeatureModule,
    ],
    exports: [
        MembershipPlanModule,
        MembershipPriceModule,
        MembershipSubscriptionModule,
        MembershipFeatureModule,
    ],
})
export class MembershipModule {}
