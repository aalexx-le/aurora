import { Module, forwardRef } from "@nestjs/common";
import { PaddleModule } from "src/modules/paddle/paddle.module";
import { PaddleService } from "src/modules/paddle/paddle.service";
import { MembershipPlanModule } from "../plan/membership-plan.module";
import { MembershipPriceResolver } from "./membership-price.resolver";
import { MembershipPriceService } from "./membership-price.service";

@Module({
    imports: [PaddleModule, forwardRef(() => MembershipPlanModule)],
    providers: [MembershipPriceService, PaddleService, MembershipPriceResolver],
    exports: [MembershipPriceService],
})
export class MembershipPriceModule {}
