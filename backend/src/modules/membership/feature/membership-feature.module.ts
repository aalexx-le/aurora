import { Module } from "@nestjs/common";
import { MembershipFeatureService } from "./membership-feature.service";
import { FeatureModule } from "src/modules/feature/feature.module";
import { MembershipFeatureResolver } from "./membership-feature.resolver";

@Module({
    imports: [FeatureModule],
    providers: [MembershipFeatureService, MembershipFeatureResolver],
    exports: [MembershipFeatureService],
})
export class MembershipFeatureModule {}
