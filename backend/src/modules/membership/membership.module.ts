import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SUBSCRIPTION_PUB_SUB_PROVIDER } from "../../shared/providers/pubsub";
import { FeatureModule } from "../feature/feature.module";
import { PaymentModule } from "../payment/payment.module";
import { MembershipFeatureResolver } from "./feature/membership-feature.resolver";
import { MembershipFeatureService } from "./feature/membership-feature.service";
import { MembershipPlanResolver } from "./plan/membership-plan.resolver";
import { MembershipPlanService } from "./plan/membership-plan.service";
import { MembershipPriceResolver } from "./price/membership-price.resolver";
import { MembershipPriceService } from "./price/membership-price.service";
import { MembershipSubscriptionResolver } from "./subscription/membership-subscription.resolver";
import { MembershipSubscriptionService } from "./subscription/membership-subscription.service";
import { MembershipDiscountService } from "./discount/membership-discount.service";
import { MembershipDiscountResolver } from "./discount/membership-discount.resolver";

@Module({
    imports: [
        ConfigModule,
        forwardRef(() => PaymentModule),
        FeatureModule,
    ],
    providers: [
        MembershipPlanService,
        MembershipPriceService,
        MembershipSubscriptionService,
        MembershipFeatureService,
        MembershipDiscountService,

        MembershipPlanResolver,
        MembershipPriceResolver,
        MembershipSubscriptionResolver,
        MembershipFeatureResolver,
        MembershipDiscountResolver,

        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
    exports: [
        MembershipPlanService,
        MembershipPriceService,
        MembershipSubscriptionService,
        MembershipFeatureService,
        MembershipDiscountService,
    ],
})
export class MembershipModule {}
