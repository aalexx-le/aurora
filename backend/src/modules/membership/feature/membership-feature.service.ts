import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { MembershipSubscriptionService } from "../subscription/membership-subscription.service";

@Injectable()
export class MembershipFeatureService {
    private readonly logger = new Logger(MembershipFeatureService.name);

    constructor(private readonly prisma: PrismaService, private readonly membershipSubscriptionService: MembershipSubscriptionService) {}

    /**
     * Find all membership features for a plan
     * @param planId The plan ID
     * @returns Array of membership features with their related feature
     */
    async findByPlanId(planId: string) {
        return await this.prisma.membershipFeature.findMany({
            where: { planId },
        });
    }

    /**
     * Get all accessible features for a user based on their active subscriptions
     * @param userId The user ID
     * @returns Array of feature names the user has access to
     */
    async getMyMembershipFeatures(userId: number) {
        const activeSubscriptions = await this.membershipSubscriptionService.findActivesByUser(userId);

        const membershipFeatures = await this.prisma.membershipFeature.findMany({
            where: {
                planId: {
                    in: activeSubscriptions.map(subscription => subscription.planId),
                },
            },
        });

        return membershipFeatures;
    }
}
