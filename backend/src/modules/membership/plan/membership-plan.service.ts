import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MembershipSubscriptionStatus } from "@prisma/client";
import { GraphQLError } from "graphql";
import { PrismaService } from "nestjs-prisma";
import { MembershipPlan } from "src/entities/membership-plan/membership-plan.model";
import { PaddleProductService } from "src/modules/payment/paddle/paddle-product.service";
import { CreatePlanDto } from "./dtos/create-plan.dto";
import { UpdatePlanDto } from "./dtos/update-plan.dto";

@Injectable()
export class MembershipPlanService {
    private readonly logger = new Logger(MembershipPlanService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly paddleProductService: PaddleProductService,
    ) {}

    async findAll(): Promise<MembershipPlan[]> {
        this.logger.log("Finding all membership plans");
        return await this.prisma.membershipPlan.findMany();
    }

    async findOne(id: string): Promise<MembershipPlan> {
        this.logger.log(`Finding membership plan with ID: ${id}`);
        const plan = await this.prisma.membershipPlan.findUnique({
            where: { id },
        });

        if (!plan) {
            throw new NotFoundException(
                `Membership plan with ID ${id} not found`,
            );
        }

        return plan;
    }

    async create(data: CreatePlanDto): Promise<MembershipPlan> {
        this.logger.log("Creating membership plan");
        const { featureIds, ...planData } = data;

        // Create product in Paddle first
        const paddleProduct = await this.paddleProductService.createProduct({
            name: planData.name,
            description: planData.description,
            taxCategory: "standard",
        });

        // Use the Paddle product ID for our plan
        const plan = await this.prisma.$transaction(async (tx) => {
            // Create the membership plan
            const plan = await tx.membershipPlan.create({
                data: {
                    id: paddleProduct.id,
                    ...planData,
                },
            });

            await Promise.all(
                featureIds.map((featureId) =>
                    tx.membershipFeature.create({
                        data: {
                            planId: plan.id,
                            featureId,
                        },
                        include: { feature: true },
                    }),
                ),
            );

            return plan;
        });

        return plan;
    }

    async update(id: string, data: UpdatePlanDto): Promise<MembershipPlan> {
        this.logger.log(`Updating membership plan with ID: ${id}`);
        // Check if plan exists
        const plan = await this.findOne(id);

        // Update the product in Paddle first
        await this.paddleProductService.updateProduct(id, {
            name: data.name,
            description: data.description,
        });

        return await this.prisma.membershipPlan.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<boolean> {
        this.logger.log(`Deleting membership plan with ID: ${id}`);
        // Check if plan exists
        await this.findOne(id);

        // Check if there are active subscriptions
        const activeSubscriptions =
            await this.prisma.membershipSubscription.findFirst({
                where: {
                    planId: id,
                    status: MembershipSubscriptionStatus.active,
                },
            });

        if (activeSubscriptions) {
            throw new GraphQLError(
                "Cannot delete plan with active subscriptions",
                {
                    extensions: {
                        code: "PLAN_HAS_ACTIVE_SUBSCRIPTIONS",
                    },
                },
            );
        }

        // Check if there are prices associated with this plan
        const prices = await this.prisma.membershipPrice.findMany({
            where: { planId: id },
        });

        if (prices.length > 0) {
            throw new GraphQLError(
                "Cannot delete plan with associated prices",
                {
                    extensions: {
                        code: "PLAN_HAS_ASSOCIATED_PRICES",
                    },
                },
            );
        }

        // Delete all membership features for this plan
        await this.prisma.membershipFeature.deleteMany({
            where: { planId: id },
        });

        // Note: We don't delete the product from Paddle here as it might be needed for historical records
        // Instead, we could archive it or handle it according to business requirements

        await this.prisma.membershipPlan.delete({
            where: { id },
        });

        return true;
    }
}
