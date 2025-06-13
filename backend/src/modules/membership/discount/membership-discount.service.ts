import { Injectable, Logger } from "@nestjs/common";
import { GraphQLError } from "graphql";
import { PrismaService } from "nestjs-prisma";
import { MembershipDiscount } from "src/entities/membership-discount/membership-discount.model";
import { DiscountTargetType } from "src/entities/prisma/discount-target-type.enum";
import { DiscountType } from "src/entities/prisma/discount-type.enum";
import { PaddleDiscountService } from "src/modules/payment/paddle/paddle-discount.service";
import { CreateDiscountDto } from "./dtos/create-discount.dto";
import {
    LinkDiscountToPriceArgs,
    UnlinkDiscountFromPriceArgs,
} from "./dtos/link-discount-price.dto";
import { UpdateDiscountDto } from "./dtos/update-discount.dto";
import {
    DiscountErrorCode,
    DiscountValidationResult,
    ValidateDiscountDto,
} from "./dtos/validate-discount.dto";

@Injectable()
export class MembershipDiscountService {
    private readonly logger = new Logger(MembershipDiscountService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly paddleDiscountService: PaddleDiscountService,
    ) {}

    async findAll(): Promise<MembershipDiscount[]> {
        return this.prisma.membershipDiscount.findMany();
    }

    async findOne(id: string): Promise<MembershipDiscount> {
        return this.prisma.membershipDiscount.findUnique({
            where: { id },
        });
    }

    async findByCode(code: string): Promise<MembershipDiscount | null> {
        return await this.prisma.membershipDiscount.findUnique({
            where: { code },
        });
    }

    async create(data: CreateDiscountDto): Promise<MembershipDiscount> {
        // Validate business rules
        await this.validateDiscountData(data);

        try {
            const paddleDiscount =
                await this.paddleDiscountService.createDiscount(data);

            const discount = await this.prisma.membershipDiscount.create({
                data: {
                    id: paddleDiscount.id,
                    name: data.name,
                    description: data.description,
                    code: data.code,
                    type: data.type,
                    value: parseFloat(data.value),
                    currencyCode: data.currencyCode,
                    maxAmount: data.maxAmount
                        ? parseFloat(data.maxAmount)
                        : null,
                    isActive: data.isActive ?? true,
                    maxUses: data.maxUses,
                    maxUsesPerUser: data.maxUsesPerUser ?? 1,
                    targetType:
                        data.targetType ?? DiscountTargetType.FIRST_TIME_USER,
                    startDate: data.startDate ? new Date(data.startDate) : null,
                    endDate: data.endDate ? new Date(data.endDate) : null,
                },
            });

            this.logger.log(`Created discount with Paddle ID: ${discount.id}`);
            return discount;
        } catch (error) {
            this.logger.error(
                `Failed to create discount with Paddle integration: ${error.message}`,
            );
            throw new GraphQLError("Failed to create discount", {
                extensions: { code: "DISCOUNT_CREATION_FAILED" },
            });
        }
    }

    async update(
        id: string,
        data: UpdateDiscountDto,
    ): Promise<MembershipDiscount> {
        this.logger.log(`Updating discount with ID: ${id}`);

        // Check if discount exists
        const existingDiscount = await this.findOne(id);
        if (!existingDiscount) {
            throw new GraphQLError("Discount not found", {
                extensions: { code: "DISCOUNT_NOT_FOUND" },
            });
        }

        // Validate business rules if data is being updated
        if (Object.keys(data).length > 0) {
            await this.validateDiscountData(data, id);
        }

        const updateData: any = { ...data };

        // Convert string fields to appropriate types
        if (data.value !== undefined) {
            updateData.value = parseFloat(data.value);
        }
        if (data.maxAmount !== undefined) {
            updateData.maxAmount = data.maxAmount
                ? parseFloat(data.maxAmount)
                : null;
        }
        if (data.startDate !== undefined) {
            updateData.startDate = data.startDate
                ? new Date(data.startDate)
                : null;
        }
        if (data.endDate !== undefined) {
            updateData.endDate = data.endDate ? new Date(data.endDate) : null;
        }

        try {
            // Update in our database first
            const updatedDiscount = await this.prisma.membershipDiscount.update(
                {
                    where: { id },
                    data: updateData,
                },
            );

            // Update Paddle discount using the DTO directly
            await this.paddleDiscountService.updatePaddleDiscount(id, data);
            this.logger.log(`Updated Paddle discount: ${id}`);

            return updatedDiscount;
        } catch (error) {
            this.logger.error(`Failed to update discount: ${error.message}`);
            throw new GraphQLError("Failed to update discount", {
                extensions: { code: "DISCOUNT_UPDATE_FAILED" },
            });
        }
    }

    async delete(id: string): Promise<boolean> {
        this.logger.log(`Deleting discount with ID: ${id}`);

        // Check if discount exists
        const existingDiscount = await this.findOne(id);
        if (!existingDiscount) {
            throw new GraphQLError("Discount not found", {
                extensions: { code: "DISCOUNT_NOT_FOUND" },
            });
        }

        // Check if there are any usage records
        const usageCount = await this.prisma.membershipDiscountUsage.count({
            where: { discountId: id },
        });

        if (usageCount > 0) {
            throw new GraphQLError(
                "Cannot delete discount that has been used",
                {
                    extensions: {
                        code: "DISCOUNT_HAS_USAGE_HISTORY",
                    },
                },
            );
        }

        try {
            // Archive Paddle discount (using the same ID)
            await this.paddleDiscountService.archiveDiscount(id);
            this.logger.log(`Archived Paddle discount: ${id}`);

            // Delete from our database
            await this.prisma.membershipDiscount.delete({
                where: { id },
            });

            return true;
        } catch (error) {
            this.logger.error(`Failed to delete discount: ${error.message}`);
            throw new GraphQLError("Failed to delete discount", {
                extensions: { code: "DISCOUNT_DELETION_FAILED" },
            });
        }
    }

    /**
     * Link a discount to a specific price
     */
    async linkDiscountToPrice(args: LinkDiscountToPriceArgs): Promise<boolean> {
        this.logger.log(
            `Linking discount ${args.discountId} to price ${args.priceId}`,
        );

        // Verify discount exists
        const discount = await this.findOne(args.discountId);
        if (!discount) {
            throw new GraphQLError("Discount not found", {
                extensions: { code: "DISCOUNT_NOT_FOUND" },
            });
        }

        // Verify price exists
        const price = await this.prisma.membershipPrice.findUnique({
            where: { id: args.priceId },
        });

        if (!price) {
            throw new GraphQLError("Price not found", {
                extensions: { code: "PRICE_NOT_FOUND" },
            });
        }

        // Check if link already exists
        const existingLink =
            await this.prisma.membershipDiscountPrice.findFirst({
                where: {
                    discountId: args.discountId,
                    priceId: args.priceId,
                },
            });

        if (existingLink) {
            throw new GraphQLError("Discount is already linked to this price", {
                extensions: { code: "DISCOUNT_PRICE_ALREADY_LINKED" },
            });
        }

        // Create the link
        await this.prisma.membershipDiscountPrice.create({
            data: {
                discountId: args.discountId,
                priceId: args.priceId,
            },
        });

        // Update Paddle discount with price restrictions
        try {
            const linkedPrices =
                await this.prisma.membershipDiscountPrice.findMany({
                    where: { discountId: args.discountId },
                });

            const paddlePriceIds = linkedPrices
                .map((link) => link.priceId)
                .filter(Boolean);

            // Create a minimal update DTO for price restrictions only
            const updateDto: UpdateDiscountDto = {};
            await this.paddleDiscountService.updatePaddleDiscount(
                args.discountId,
                updateDto,
                paddlePriceIds,
            );
            this.logger.log(
                `Updated Paddle discount with new price restrictions`,
            );
        } catch (error) {
            this.logger.warn(
                `Failed to update Paddle discount: ${error.message}`,
            );
        }

        this.logger.log(
            `Successfully linked discount ${args.discountId} to price ${args.priceId}`,
        );
        return true;
    }

    /**
     * Unlink a discount from a specific price
     */
    async unlinkDiscountFromPrice(
        args: UnlinkDiscountFromPriceArgs,
    ): Promise<boolean> {
        this.logger.log(
            `Unlinking discount ${args.discountId} from price ${args.priceId}`,
        );

        // Verify the link exists
        const existingLink =
            await this.prisma.membershipDiscountPrice.findFirst({
                where: {
                    discountId: args.discountId,
                    priceId: args.priceId,
                },
            });

        if (!existingLink) {
            throw new GraphQLError("Discount is not linked to this price", {
                extensions: { code: "DISCOUNT_PRICE_NOT_LINKED" },
            });
        }

        // Remove the link
        await this.prisma.membershipDiscountPrice.delete({
            where: {
                discountId_priceId: {
                    discountId: args.discountId,
                    priceId: args.priceId,
                },
            },
        });

        // Update Paddle discount with updated price restrictions
        try {
            const remainingLinks =
                await this.prisma.membershipDiscountPrice.findMany({
                    where: { discountId: args.discountId },
                });

            const paddlePriceIds = remainingLinks
                .map((link) => link.priceId)
                .filter(Boolean);

            // Create a minimal update DTO for price restrictions only
            const updateDto: UpdateDiscountDto = {};
            await this.paddleDiscountService.updatePaddleDiscount(
                args.discountId,
                updateDto,
                paddlePriceIds,
            );
            this.logger.log(
                `Updated Paddle discount with updated price restrictions`,
            );
        } catch (error) {
            this.logger.warn(
                `Failed to update Paddle discount: ${error.message}`,
            );
        }

        this.logger.log(
            `Successfully unlinked discount ${args.discountId} from price ${args.priceId}`,
        );
        return true;
    }

    async validateDiscount(
        data: ValidateDiscountDto,
        userId: number,
    ): Promise<DiscountValidationResult> {
        this.logger.log(
            `Validating discount code: ${data.code} for user: ${userId}`,
        );

        try {
            // Find discount by code
            const discount = await this.findByCode(data.code);

            if (!discount) {
                return {
                    isValid: false,
                    errorCode: DiscountErrorCode.DISCOUNT_NOT_FOUND,
                };
            }

            // Check if discount is linked to the specific price (if priceId is provided)
            if (data.priceId) {
                const linkedPrice = await this.prisma.membershipDiscountPrice.findFirst({
                    where: {
                        discountId: discount.id,
                        priceId: data.priceId,
                    },
                });

                if (!linkedPrice) {
                    return {
                        isValid: false,
                        discount,
                        errorCode: DiscountErrorCode.DISCOUNT_NOT_APPLICABLE,
                    };
                }
            }

            const price = await this.prisma.membershipPrice.findUnique({
                where: { id: data.priceId },
                include: {
                    unitPrice: true,
                }
            });

            // Check if discount is active
            if (!discount.isActive) {
                return {
                    isValid: false,
                    discount,
                    errorCode: DiscountErrorCode.DISCOUNT_INACTIVE,
                };
            }

            // Check expiration
            const now = new Date();
            if (discount.endDate && discount.endDate < now) {
                return {
                    isValid: false,
                    discount,
                    errorCode: DiscountErrorCode.DISCOUNT_EXPIRED,
                };
            }

            if (discount.startDate && discount.startDate > now) {
                return {
                    isValid: false,
                    discount,
                    errorCode: DiscountErrorCode.DISCOUNT_INACTIVE,
                };
            }

            // Check usage limits
            if (discount.maxUses && discount.currentUses >= discount.maxUses) {
                return {
                    isValid: false,
                    discount,
                    errorCode: DiscountErrorCode.DISCOUNT_EXHAUSTED,
                };
            }

            // Check per-user usage limit
            const userUsageCount =
                await this.prisma.membershipDiscountUsage.count({
                    where: {
                        discountId: discount.id,
                    },
                });

            if (
                discount.maxUsesPerUser &&
                userUsageCount >= discount.maxUsesPerUser
            ) {
                return {
                    isValid: false,
                    discount,
                    errorCode: DiscountErrorCode.USER_LIMIT_EXCEEDED,
                };
            }

            // Check first-time user eligibility
            if (discount.targetType === DiscountTargetType.FIRST_TIME_USER) {
                const existingSubscriptions =
                    await this.prisma.membershipSubscription.count({
                        where: { userId },
                    });

                if (existingSubscriptions > 0) {
                    return {
                        isValid: false,
                        discount,
                        errorCode: DiscountErrorCode.DISCOUNT_NOT_APPLICABLE,
                    };
                }
            }

            // Check currency compatibility
            const originalAmount = parseFloat(price.unitPrice.amount);
            if (discount.type === DiscountType.FIXED_AMOUNT) {
                if (discount.currencyCode !== price.unitPrice.currencyCode) {
                    return {
                        isValid: false,
                        discount,
                        errorCode: DiscountErrorCode.INVALID_CURRENCY,
                    };
                }
            }

            // Calculate discount amounts
            const { discountAmount, finalAmount } =
                this.calculateDiscountAmount(discount, originalAmount);

            return {
                isValid: true,
                discount,
                originalAmount: originalAmount.toFixed(2),
                discountAmount: discountAmount.toFixed(2),
                finalAmount: finalAmount.toFixed(2),
            };
        } catch (error) {
            this.logger.error(
                `Error validating discount: ${error.message}`,
                error.stack,
            );
            return {
                isValid: false,
                errorCode: DiscountErrorCode.VALIDATION_ERROR,
            };
        }
    }

    public calculateDiscountAmount(
        discount: MembershipDiscount,
        originalAmount: number,
    ): { discountAmount: number; finalAmount: number } {
        let discountAmount = 0;

        switch (discount.type) {
            case DiscountType.PERCENTAGE:
                discountAmount =
                    originalAmount * parseFloat(discount.value.toString());
                // Apply maximum discount cap if specified
                if (
                    discount.maxAmount &&
                    discountAmount > parseFloat(discount.maxAmount.toString())
                ) {
                    discountAmount = parseFloat(discount.maxAmount.toString());
                }
                break;
            case DiscountType.FIXED_AMOUNT:
                discountAmount = parseFloat(discount.value.toString());
                // Ensure discount doesn't exceed original amount
                if (discountAmount > originalAmount) {
                    discountAmount = originalAmount;
                }
                break;
            case DiscountType.FREE_TRIAL:
                // For free trial, the discount amount equals the original amount
                discountAmount = originalAmount;
                break;
        }

        const finalAmount = Math.max(0, originalAmount - discountAmount);
        return { discountAmount, finalAmount };
    }

    private async validateDiscountData(
        data: Partial<CreateDiscountDto>,
        excludeId?: string,
    ): Promise<void> {
        // Validate unique code if provided
        if (data.code) {
            const existingDiscount =
                await this.prisma.membershipDiscount.findUnique({
                    where: { code: data.code },
                });

            if (existingDiscount && existingDiscount.id !== excludeId) {
                throw new GraphQLError(
                    `Discount code '${data.code}' already exists`,
                    {
                        extensions: {
                            code: "DUPLICATE_DISCOUNT_CODE",
                        },
                    },
                );
            }
        }

        // Validate date range
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate >= endDate) {
                throw new GraphQLError("Start date must be before end date", {
                    extensions: {
                        code: "INVALID_DATE_RANGE",
                    },
                });
            }
        }

        // Validate discount value
        if (data.value !== undefined) {
            const value = parseFloat(data.value);
            if (value <= 0) {
                throw new GraphQLError(
                    "Discount value must be greater than 0",
                    {
                        extensions: {
                            code: "INVALID_DISCOUNT_VALUE",
                        },
                    },
                );
            }

            // For percentage discounts, value should be between 0 and 1
            if (
                data.type === DiscountType.PERCENTAGE &&
                (value < 0 || value > 1)
            ) {
                throw new GraphQLError(
                    "Percentage discount value must be between 0 and 1 (e.g., 0.1 for 10%)",
                    {
                        extensions: {
                            code: "INVALID_PERCENTAGE_VALUE",
                        },
                    },
                );
            }
        }

        // Validate currency code for fixed amount discounts
        if (data.type === DiscountType.FIXED_AMOUNT && !data.currencyCode) {
            throw new GraphQLError(
                "Currency code is required for fixed amount discounts",
                {
                    extensions: {
                        code: "MISSING_CURRENCY_CODE",
                    },
                },
            );
        }
    }

    async findDiscountsForPrice(priceId: string): Promise<MembershipDiscount[]> {
        this.logger.log(`Finding discounts for price: ${priceId}`);
        
        const discountPrices = await this.prisma.membershipDiscountPrice.findMany({
            where: { priceId },
            include: {
                discount: {
                    include: {
                        prices: {
                            include: {
                                price: {
                                    include: {
                                        unitPrice: true,
                                    },
                                },
                            },
                        },
                        usageHistory: true,
                    },
                },
            },
        });

        return discountPrices.map(dp => dp.discount);
    }
}
