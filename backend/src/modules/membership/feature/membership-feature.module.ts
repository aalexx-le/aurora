import { forwardRef, Module } from "@nestjs/common";
import { FeatureModule } from "src/modules/feature/feature.module";
import { MembershipSubscriptionModule } from "../subscription/membership-subscription.module";
import { MembershipFeatureResolver } from "./membership-feature.resolver";
import { MembershipFeatureService } from "./membership-feature.service";

@Module({
    imports: [FeatureModule, forwardRef(() => MembershipSubscriptionModule)],
    providers: [MembershipFeatureService, MembershipFeatureResolver],
    exports: [MembershipFeatureService],
})
export class MembershipFeatureModule {}
