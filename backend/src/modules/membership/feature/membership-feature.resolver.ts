import { UseGuards } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { MembershipFeature } from "src/entities/membership-feature/membership-feature.model";
import { User } from "src/entities/user/user.model";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { MembershipFeatureService } from "./membership-feature.service";
import { Feature } from "src/entities/feature/feature.model";
import { FeatureService } from "src/modules/feature/feature.service";

@UseGuards(JwtGuard)
@Resolver(() => MembershipFeature)
export class MembershipFeatureResolver {
    constructor(
        private readonly membershipFeatureService: MembershipFeatureService,
        private readonly featureService: FeatureService,
    ) {}

    @Query(() => [MembershipFeature], { name: "myMembershipFeatures" })
    async getMyMembershipFeatures(@AuthUser() user: User) {
        return this.membershipFeatureService.getMyMembershipFeatures(user.id);
    }

    @ResolveField("feature", () => Feature)
    async getFeature(@Parent() membershipFeature: MembershipFeature) {
        return this.featureService.findOne(membershipFeature.featureId);
    }
}
