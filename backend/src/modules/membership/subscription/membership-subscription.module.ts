import { forwardRef, Module } from "@nestjs/common";
import { MembershipPlanModule } from "../plan/membership-plan.module";
import { MembershipSubscriptionResolver } from "./membership-subscription.resolver";
import { MembershipSubscriptionService } from "./membership-subscription.service";
import { SUBSCRIPTION_PUB_SUB_PROVIDER } from "src/shared/providers/pubsub";

@Module({
    imports: [forwardRef(() => MembershipPlanModule)],
    providers: [
        MembershipSubscriptionService,
        MembershipSubscriptionResolver,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
    exports: [MembershipSubscriptionService, SUBSCRIPTION_PUB_SUB_PROVIDER],
})
export class MembershipSubscriptionModule {}
