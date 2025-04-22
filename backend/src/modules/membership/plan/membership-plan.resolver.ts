import { Inject, forwardRef } from "@nestjs/common";
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { MembershipFeature } from "src/entities/membership-feature/membership-feature.model";
import { MembershipPlan } from "src/entities/membership-plan/membership-plan.model";
import { MembershipPrice } from "src/entities/membership-price/membership-price.model";
import { MembershipFeatureService } from "../feature/membership-feature.service";
import { MembershipPriceService } from "../price/membership-price.service";
import { CreatePlanArgs } from "./dtos/create-plan.dto";
import { DeletePlanArgs } from "./dtos/delete-plan.dto";
import { GetPlanArgs } from "./dtos/get-plan.dto";
import { UpdatePlanArgs } from "./dtos/update-plan.dto";
import { MembershipPlanService } from "./membership-plan.service";

@Resolver(() => MembershipPlan)
export class MembershipPlanResolver {
    constructor(
        private readonly planService: MembershipPlanService,
        @Inject(forwardRef(() => MembershipPriceService))
        private readonly priceService: MembershipPriceService,
        private readonly membershipFeatureService: MembershipFeatureService,
    ) {}

    @Query(() => [MembershipPlan], { name: "getMembershipPlans" })
    async getPlans(): Promise<MembershipPlan[]> {
        return this.planService.findAll();
    }

    @Query(() => MembershipPlan, { name: "getMembershipPlan" })
    async getPlan(@Args() args: GetPlanArgs): Promise<MembershipPlan> {
        return this.planService.findOne(args.id);
    }

    @Mutation(() => MembershipPlan, { name: "createMembershipPlan" })
    async createPlan(@Args() args: CreatePlanArgs): Promise<MembershipPlan> {
        return this.planService.create(args.data);
    }

    @Mutation(() => MembershipPlan, { name: "updateMembershipPlan" })
    async updatePlan(@Args() args: UpdatePlanArgs): Promise<MembershipPlan> {
        return this.planService.update(args.id, args.data);
    }

    @Mutation(() => Boolean, { name: "deleteMembershipPlan" })
    async deletePlan(@Args() args: DeletePlanArgs): Promise<boolean> {
        return this.planService.delete(args.id);
    }

    @ResolveField("prices", () => [MembershipPrice])
    async getPrices(@Parent() plan: MembershipPlan) {
        return this.priceService.findByPlan(plan.id);
    }

    @ResolveField("membershipFeatures", () => [MembershipFeature])
    async getMembershipFeatures(@Parent() plan: MembershipPlan) {
        return this.membershipFeatureService.findByPlanId(plan.id);
    }
}
