import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Feature } from "src/entities/feature/feature.model";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { CreateFeatureArgs } from "./dtos/create-feature.dto";
import { DeleteFeatureArgs } from "./dtos/delete-feature.dto";
import { GetFeatureArgs } from "./dtos/get-feature.dto";
import { UpdateFeatureArgs } from "./dtos/update-feature.dto";
import { FeatureService } from "./feature.service";

@UseGuards(JwtGuard)
@Resolver(() => Feature)
export class FeatureResolver {
    constructor(private readonly featureService: FeatureService) {}

    @Query(() => [Feature], { name: "getFeatures" })
    async getFeatures(): Promise<Feature[]> {
        return this.featureService.findAll();
    }

    @Query(() => Feature, { name: "getFeature" })
    async getFeature(@Args() args: GetFeatureArgs): Promise<Feature> {
        return this.featureService.findOne(args.id);
    }

    @Mutation(() => Feature, { name: "createFeature" })
    async createFeature(@Args() args: CreateFeatureArgs): Promise<Feature> {
        return this.featureService.create(args.data);
    }

    @Mutation(() => Feature, { name: "updateFeature" })
    async updateFeature(@Args() args: UpdateFeatureArgs): Promise<Feature> {
        return this.featureService.update(args.id, args.data);
    }

    @Mutation(() => Feature, { name: "deleteFeature" })
    async deleteFeature(@Args() args: DeleteFeatureArgs): Promise<Feature> {
        return this.featureService.delete(args.id);
    }
}
