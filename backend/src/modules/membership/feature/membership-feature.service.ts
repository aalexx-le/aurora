import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class MembershipFeatureService {
    private readonly logger = new Logger(MembershipFeatureService.name);

    constructor(private readonly prisma: PrismaService) {}

    /**
     * Find all membership features for a plan
     * @param planId The plan ID
     * @returns Array of membership features with their related feature
     */
    async findByPlanId(planId: string) {
        this.logger.log(`Finding features for plan with ID: ${planId}`);
        return await this.prisma.membershipFeature.findMany({
            where: { planId },
        });
    }

    /**
     * Create multiple membership features for a plan
     * @param planId The plan ID
     * @param featureIds Array of feature IDs
     * @returns Created membership features
     */
    async createMany(planId: string, featureIds: number[]) {
        this.logger.log(
            `Creating ${featureIds.length} features for plan ${planId}`,
        );

        const createdFeatures = await Promise.all(
            featureIds.map((featureId) =>
                this.prisma.membershipFeature.create({
                    data: {
                        planId,
                        featureId,
                    },
                    include: { feature: true },
                }),
            ),
        );

        return createdFeatures;
    }

    /**
     * Delete all membership features for a plan
     * @param planId The plan ID
     */
    async deleteByPlanId(planId: string): Promise<void> {
        this.logger.log(`Deleting all features for plan ${planId}`);
        await this.prisma.membershipFeature.deleteMany({
            where: { planId },
        });
    }
}
