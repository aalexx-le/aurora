import { UseGuards } from "@nestjs/common";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Feature } from "src/entities/feature/feature.model";
import { MembershipFeature } from "src/entities/membership-feature/membership-feature.model";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { FeatureService } from "src/modules/feature/feature.service";
import { MembershipFeatureService } from "./membership-feature.service";

@UseGuards(JwtGuard)
@Resolver(() => MembershipFeature)
export class MembershipFeatureResolver {
    constructor(
        private readonly membershipFeatureService: MembershipFeatureService,
        private readonly featureService: FeatureService,
    ) {}

    @ResolveField(() => Feature, { name: "feature" })
    async getFeature(
        @Parent() membershipFeature: MembershipFeature,
    ): Promise<Feature> {
        return this.featureService.findOne(membershipFeature.featureId);
    }
}
