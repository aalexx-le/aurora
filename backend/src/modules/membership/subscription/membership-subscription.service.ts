import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { MembershipSubscription } from "src/entities/membership-subscription/membership-subscription.model";
import { MembershipSubscriptionStatus } from "src/entities/prisma/membership-subscription-status.enum";
import { MembershipPlanService } from "../plan/membership-plan.service";
import { CreateSubscriptionDto } from "./dtos/create-subscription.dto";
import { UpdateSubscriptionDto } from "./dtos/update-subscription.dto";

@Injectable()
export class MembershipSubscriptionService {
    private readonly logger = new Logger(MembershipSubscriptionService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly planService: MembershipPlanService,
    ) {}

    async findOne(id: string): Promise<MembershipSubscription> {
        this.logger.log(`Finding membership subscription with ID: ${id}`);
        const subscription =
            await this.prisma.membershipSubscription.findUnique({
                where: { id },
            });

        if (!subscription) {
            throw new NotFoundException(
                `Membership subscription with ID ${id} not found`,
            );
        }

        return subscription;
    }

    async findByUser(userId: number): Promise<MembershipSubscription[]> {
        this.logger.log(`Finding memberships for user with ID: ${userId}`);
        return await this.prisma.membershipSubscription.findMany({
            where: { userId },
        });
    }

    async findActivesByUser(userId: number): Promise<MembershipSubscription[]> {
        this.logger.log(
            `Finding all active membership subscriptions for user ID: ${userId}`,
        );

        const activeSubscriptions =
            await this.prisma.membershipSubscription.findMany({
                where: {
                    userId,
                    status: {
                        in: [
                            MembershipSubscriptionStatus.active,
                            MembershipSubscriptionStatus.trialing,
                        ],
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

        const canceledButNotExpiredSubscriptions =
            await this.prisma.membershipSubscription.findMany({
                where: {
                    userId,
                    status: MembershipSubscriptionStatus.canceled,
                    endDate: {
                        gt: new Date(),
                    },
                },
            });

        return [...activeSubscriptions, ...canceledButNotExpiredSubscriptions];
    }

    async create(data: CreateSubscriptionDto): Promise<MembershipSubscription> {
        this.logger.log(
            `Creating membership subscription for plan ID: ${data.planId}`,
        );
        // Verify the plan exists
        await this.planService.findOne(data.planId);

        return await this.prisma.membershipSubscription.create({
            data: {
                ...data,
                status: data.status || MembershipSubscriptionStatus.active,
            },
        });
    }

    async update(
        id: string,
        data: UpdateSubscriptionDto,
    ): Promise<MembershipSubscription> {
        this.logger.log(`Updating membership subscription with ID: ${id}`);
        // Check if subscription exists
        await this.findOne(id);

        // If updating plan, verify the new plan exists
        if (data.planId) {
            await this.planService.findOne(data.planId);
        }

        return await this.prisma.membershipSubscription.update({
            where: { id },
            data,
        });
    }

    async delete(id: string): Promise<boolean> {
        this.logger.log(`Deleting membership subscription with ID: ${id}`);
        // Check if subscription exists
        await this.findOne(id);

        await this.prisma.membershipSubscription.delete({
            where: { id },
        });

        return true;
    }
}
