import { Module, forwardRef } from "@nestjs/common";
import { PaddleModule } from "src/modules/paddle/paddle.module";
import { PaddleService } from "src/modules/paddle/paddle.service";
import { MembershipFeatureModule } from "../feature/membership-feature.module";
import { MembershipPriceModule } from "../price/membership-price.module";
import { MembershipPlanResolver } from "./membership-plan.resolver";
import { MembershipPlanService } from "./membership-plan.service";

@Module({
    imports: [
        PaddleModule,
        forwardRef(() => MembershipPriceModule),
        MembershipFeatureModule,
    ],
    providers: [MembershipPlanService, PaddleService, MembershipPlanResolver],
    exports: [MembershipPlanService],
})
export class MembershipPlanModule {}
