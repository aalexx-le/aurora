import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { TaxMode } from "@paddle/paddle-node-sdk";
import { PriceStatus } from "@prisma/client";
import { GraphQLError } from "graphql";
import { PrismaService } from "nestjs-prisma";
import { MembershipPrice } from "src/entities/membership-price/membership-price.model";
import { PaddleProductService } from "src/modules/payment/paddle/paddle-product.service";
import { CreatePriceDto } from "./dtos/create-price.dto";
import { UpdatePriceDto } from "./dtos/update-price.dto";

@Injectable()
export class MembershipPriceService {
    private readonly logger = new Logger(MembershipPriceService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly paddleProductService: PaddleProductService,
    ) {}

    async findAll(): Promise<MembershipPrice[]> {
        this.logger.log("Finding all membership prices");
        return await this.prisma.membershipPrice.findMany();
    }

    async findOne(id: string): Promise<MembershipPrice> {
        this.logger.log(`Finding membership price with ID: ${id}`);
        const price = await this.prisma.membershipPrice.findUnique({
            where: { id },
        });

        if (!price) {
            throw new NotFoundException(
                `Membership price with ID ${id} not found`,
            );
        }

        return price;
    }

    async findByPlan(planId: string): Promise<MembershipPrice[]> {
        this.logger.log(`Finding membership prices for plan ID: ${planId}`);

        return await this.prisma.membershipPrice.findMany({
            where: {
                planId,
                status: PriceStatus.active,
            },
        });
    }

    async create(data: CreatePriceDto): Promise<MembershipPrice> {
        this.logger.log(
            `Creating membership price for plan ID: ${data.planId}`,
        );

        // Create the unit price first
        this.logger.log("Creating unit price");
        const unitPrice = await this.prisma.unitPrice.create({
            data: {
                amount: (parseInt(data.unitPrice.amount) / 100).toString(),
                currencyCode: data.unitPrice.currencyCode,
            },
        });

        // Initialize variables for billing cycle and trial period
        let billingCycleId: number | undefined;
        let trialPeriodId: number | undefined;

        if (data.billingCycle) {
            this.logger.log("Creating billing cycle");
            const billingCycle = await this.prisma.timePeriod.create({
                data: data.billingCycle,
            });

            billingCycleId = billingCycle.id;
        }

        if (data.trialPeriod) {
            this.logger.log("Creating trial period");
            const trialPeriod = await this.prisma.timePeriod.create({
                data: data.trialPeriod,
            });

            trialPeriodId = trialPeriod.id;
        }

        const plan = await this.prisma.membershipPlan.findUnique({
            where: { id: data.planId },
        });

        // Create the price in Paddle
        this.logger.log("Creating price in Paddle");
        const paddlePrice = await this.paddleProductService.createPrice({
            productId: data.planId,
            description: `Membership Price for Plan ${plan.name}`,
            unitPrice: data.unitPrice,
            billingCycle: data.billingCycle,
            trialPeriod: data.trialPeriod,
            quantity: {
                minimum: 1,
                maximum: 1,
            },
            taxMode: "account_setting" as TaxMode,
        });

        // Create our membership price with the IDs of the created entities
        this.logger.log("Creating membership price in database");
        return await this.prisma.membershipPrice.create({
            data: {
                id: paddlePrice.id,
                planId: data.planId,
                billingCycleId,
                trialPeriodId,
                unitPriceId: unitPrice.id,
                status: data.status,
            },
        });
    }

    async update(id: string, data: UpdatePriceDto): Promise<MembershipPrice> {
        this.logger.log(`Updating membership price with ID: ${id}`);

        // In Paddle, prices are usually immutable so we don't update the price
        // Instead, we could archive the old price and create a new one
        // For this implementation, we'll just update our local record
        // In a production environment, the approach should be discussed with business stakeholders
        return this.prisma.membershipPrice.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<boolean> {
        this.logger.log(`Deleting membership price with ID: ${id}`);
        // Check if price exists
        await this.findOne(id);

        // Check if price is used in any active subscriptions
        const price = await this.prisma.membershipPrice.findUnique({
            where: { id },
            include: {
                plan: {
                    include: {
                        subscriptions: true,
                    },
                },
            },
        });

        if (price.plan.subscriptions.length > 0) {
            throw new GraphQLError(
                "Cannot delete price that has active subscriptions",
                {
                    extensions: {
                        code: "PRICE_HAS_SUBSCRIPTIONS",
                    },
                },
            );
        }

        // For Paddle, we would typically archive the price instead of deleting it
        // This implementation would need to be aligned with your business requirements

        await this.prisma.membershipPrice.delete({
            where: { id },
        });

        return true;
    }
}
