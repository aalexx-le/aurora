import { Inject, forwardRef } from "@nestjs/common";
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { PrismaService } from "nestjs-prisma";
import { MembershipPlan } from "src/entities/membership-plan/membership-plan.model";
import { MembershipPrice } from "src/entities/membership-price/membership-price.model";
import { TimePeriod } from "src/entities/time-period/time-period.model";
import { UnitPrice } from "src/entities/unit-price/unit-price.model";
import { MembershipPlanService } from "../plan/membership-plan.service";
import { CreatePriceArgs } from "./dtos/create-price.dto";
import { DeletePriceArgs } from "./dtos/delete-price.dto";
import { GetPriceArgs } from "./dtos/get-price.dto";
import { UpdatePriceArgs } from "./dtos/update-price.dto";
import { MembershipPriceService } from "./membership-price.service";

@Resolver(() => MembershipPrice)
export class MembershipPriceResolver {
    constructor(
        private readonly priceService: MembershipPriceService,
        @Inject(forwardRef(() => MembershipPlanService))
        private readonly planService: MembershipPlanService,
        private readonly prisma: PrismaService,
    ) {}

    @Query(() => [MembershipPrice], { name: "getMembershipPrices" })
    async getPrices(): Promise<MembershipPrice[]> {
        return this.priceService.findAll();
    }

    @Query(() => MembershipPrice, { name: "getMembershipPrice" })
    async getPrice(@Args() args: GetPriceArgs): Promise<MembershipPrice> {
        return this.priceService.findOne(args.id);
    }

    @Query(() => [MembershipPrice], { name: "getMembershipPricesByPlan" })
    async getPricesByPlan(
        @Args("planId") planId: string,
    ): Promise<MembershipPrice[]> {
        return this.priceService.findByPlan(planId);
    }

    @Mutation(() => MembershipPrice, { name: "createMembershipPrice" })
    async createPrice(@Args() args: CreatePriceArgs): Promise<MembershipPrice> {
        return this.priceService.create(args.data);
    }

    @Mutation(() => MembershipPrice, { name: "updateMembershipPrice" })
    async updatePrice(@Args() args: UpdatePriceArgs): Promise<MembershipPrice> {
        return this.priceService.update(args.id, args.data);
    }

    @Mutation(() => Boolean, { name: "deleteMembershipPrice" })
    async deletePrice(@Args() args: DeletePriceArgs): Promise<boolean> {
        return this.priceService.delete(args.id);
    }

    @ResolveField("plan", () => MembershipPlan)
    async getPlan(@Parent() price: MembershipPrice) {
        return this.planService.findOne(price.planId);
    }

    @ResolveField("billingCycle", () => TimePeriod, { nullable: true })
    async getBillingCycle(@Parent() price: MembershipPrice) {
        if (!price.billingCycleId) return null;
        return this.prisma.timePeriod.findUnique({
            where: { id: price.billingCycleId },
        });
    }

    @ResolveField("trialPeriod", () => TimePeriod, { nullable: true })
    async getTrialPeriod(@Parent() price: MembershipPrice) {
        if (!price.trialPeriodId) return null;
        return this.prisma.timePeriod.findUnique({
            where: { id: price.trialPeriodId },
        });
    }

    @ResolveField("unitPrice", () => UnitPrice)
    async getUnitPrice(@Parent() price: MembershipPrice) {
        return this.prisma.unitPrice.findUnique({
            where: { id: price.unitPriceId },
        });
    }
}
