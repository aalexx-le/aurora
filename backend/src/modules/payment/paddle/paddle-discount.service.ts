import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CurrencyCode, DiscountType as PaddleDiscountType } from "@paddle/paddle-node-sdk";
import { GraphQLError } from "graphql";
import { DiscountType } from "src/entities/prisma/discount-type.enum";
import { CreateDiscountDto } from "src/modules/membership/discount/dtos/create-discount.dto";
import { UpdateDiscountDto } from "src/modules/membership/discount/dtos/update-discount.dto";
import { PaddleDiscountData } from "./dtos/discount.dto";
import { PaddleService } from "./paddle.service";

@Injectable()
export class PaddleDiscountService extends PaddleService {
    protected readonly logger = new Logger(PaddleDiscountService.name);

    constructor(protected readonly configService: ConfigService) {
        super(configService);
    }

    /**
     * Create a discount in Paddle using CreateDiscountDto
     */
    async createDiscount(
        createDto: CreateDiscountDto,
        priceIds?: string[],
    ): Promise<any> {
        this.logger.log(`Creating discount in Paddle: ${createDto.name}`);

        try {
            const paddleDiscountData = this.mapCreateDtoToPaddleData(
                createDto,
                priceIds,
            );

            // Create discount in Paddle
            const paddleDiscount =
                await this.paddle.discounts.create(paddleDiscountData);

            this.logger.log(
                `Successfully created Paddle discount with ID: ${paddleDiscount.id}`,
            );
            return paddleDiscount;
        } catch (error) {
            this.logger.error(
                `Failed to create Paddle discount: ${error.message}`,
            );
            this.handlePaddleError(error, "createPaddleDiscount");
        }
    }

    /**
     * Update a discount in Paddle using UpdateDiscountDto
     */
    async updatePaddleDiscount(
        paddleDiscountId: string,
        updateDto: UpdateDiscountDto,
        priceIds?: string[],
    ): Promise<any> {
        this.logger.log(`Updating Paddle discount: ${paddleDiscountId}`);

        try {
            const paddleDiscountData = this.mapUpdateDtoToPaddleData(
                updateDto,
                priceIds,
            );

            // Update discount in Paddle
            const updatedDiscount = await this.paddle.discounts.update(
                paddleDiscountId,
                paddleDiscountData,
            );

            this.logger.log(
                `Successfully updated Paddle discount: ${paddleDiscountId}`,
            );
            return updatedDiscount;
        } catch (error) {
            this.logger.error(
                `Failed to update Paddle discount: ${error.message}`,
            );
            this.handlePaddleError(error, "updatePaddleDiscount");
        }
    }

    /**
     * Get a discount from Paddle
     */
    async getDiscount(paddleDiscountId: string): Promise<any> {
        this.logger.log(`Getting Paddle discount: ${paddleDiscountId}`);

        try {
            const discount = await this.paddle.discounts.get(paddleDiscountId);
            this.logger.debug(
                `Retrieved Paddle discount: ${discount.description}`,
            );
            return discount;
        } catch (error) {
            this.logger.error(
                `Failed to get Paddle discount: ${error.message}`,
            );
            this.handlePaddleError(error, "getPaddleDiscount");
        }
    }

    /**
     * List all discounts from Paddle
     */
    async listPaddleDiscounts(): Promise<any[]> {
        this.logger.log("Listing discounts from Paddle");

        try {
            const discounts = [];
            for await (const discount of this.paddle.discounts.list()) {
                discounts.push(discount);
            }
            this.logger.debug(`Retrieved ${discounts.length} Paddle discounts`);
            return discounts;
        } catch (error) {
            this.logger.error(
                `Failed to list Paddle discounts: ${error.message}`,
            );
            this.handlePaddleError(error, "listPaddleDiscounts");
        }
    }

    /**
     * Archive (soft delete) a discount in Paddle
     */
    async archiveDiscount(paddleDiscountId: string): Promise<boolean> {
        this.logger.log(`Archiving Paddle discount: ${paddleDiscountId}`);

        try {
            // Paddle doesn't have a delete endpoint, but we can disable the discount
            await this.paddle.discounts.update(paddleDiscountId, {
                enabledForCheckout: false,
            });

            this.logger.log(
                `Successfully archived Paddle discount: ${paddleDiscountId}`,
            );
            return true;
        } catch (error) {
            this.logger.error(
                `Failed to archive Paddle discount: ${error.message}`,
            );
            this.handlePaddleError(error, "archivePaddleDiscount");
        }
    }

    /**
     * Map CreateDiscountDto to Paddle discount data
     */
    private mapCreateDtoToPaddleData(
        dto: CreateDiscountDto,
        priceIds?: string[],
    ): PaddleDiscountData {
        // Validate required fields for Paddle
        this.validateDiscountForPaddle(dto);

        const paddleData: PaddleDiscountData = {
            description: dto.description || dto.name,
            type: this.mapDiscountType(dto.type),
            amount: this.formatDiscountAmount(dto.type, parseFloat(dto.value)),
            enabled_for_checkout: dto.isActive ?? true,
        };

        // Only add optional fields if they have values
        if (dto.code) {
            paddleData.code = dto.code;
        }
        if (dto.maxUses) {
            paddleData.usage_limit = dto.maxUses;
        }

        // Add currency for fixed amount discounts
        if (dto.type === DiscountType.FIXED_AMOUNT && dto.currencyCode) {
            paddleData.currency_code = dto.currencyCode as CurrencyCode;
        }

        // Add expiration date
        if (dto.endDate) {
            paddleData.expires_at = new Date(dto.endDate).toISOString();
        }

        // Restrict to specific prices if provided
        if (priceIds && priceIds.length > 0) {
            paddleData.restrict_to = priceIds;
        }

        if (dto.isRecurring) {
            paddleData.recur = true;
            paddleData.maximum_recurring_intervals = dto.maxUsesPerUser;
        }
        
        return paddleData;
    }

    /**
     * Map UpdateDiscountDto to Paddle discount data
     */
    private mapUpdateDtoToPaddleData(
        dto: UpdateDiscountDto,
        priceIds?: string[],
    ): Partial<PaddleDiscountData> {
        const paddleData: Partial<PaddleDiscountData> = {};

        // Only include fields that are being updated
        if (dto.description !== undefined) {
            paddleData.description = dto.description || dto.name || "";
        }

        if (dto.type !== undefined && dto.value !== undefined) {
            paddleData.type = this.mapDiscountType(dto.type);
            paddleData.amount = this.formatDiscountAmount(
                dto.type,
                parseFloat(dto.value),
            );
        }

        if (dto.isActive !== undefined) {
            paddleData.enabled_for_checkout = dto.isActive;
        }

        if (dto.code !== undefined && dto.code) {
            paddleData.code = dto.code;
        }

        if (dto.maxUses !== undefined && dto.maxUses) {
            paddleData.usage_limit = dto.maxUses;
        }

        // Add currency for fixed amount discounts
        if (dto.type === DiscountType.FIXED_AMOUNT && dto.currencyCode) {
            paddleData.currency_code = dto.currencyCode as CurrencyCode;
        }

        // Add expiration date
        if (dto.endDate !== undefined && dto.endDate) {
            paddleData.expires_at = new Date(dto.endDate).toISOString();
        }

        // Restrict to specific prices if provided
        if (priceIds !== undefined && priceIds.length > 0) {
            paddleData.restrict_to = priceIds;
        }

        // For free trial, set recur and maximum recurring intervals
        if (dto.type === DiscountType.FREE_TRIAL && dto.value) {
            paddleData.recur = true;
            paddleData.maximum_recurring_intervals = parseInt(dto.value);
        }

        return paddleData;
    }

    /**
     * Validate discount data for Paddle requirements
     */
    private validateDiscountForPaddle(dto: CreateDiscountDto): void {
        // Currency is required for fixed amount discounts
        if (dto.type === DiscountType.FIXED_AMOUNT && !dto.currencyCode) {
            throw new GraphQLError(
                "Currency code is required for fixed amount discounts",
                {
                    extensions: { code: "CURRENCY_REQUIRED" },
                },
            );
        }

        // Validate percentage values
        if (dto.type === DiscountType.PERCENTAGE) {
            const percentage = parseFloat(dto.value);
            if (percentage < 0 || percentage > 1) {
                throw new GraphQLError(
                    "Percentage discount must be between 0 and 1 (0% to 100%)",
                    {
                        extensions: { code: "INVALID_PERCENTAGE" },
                    },
                );
            }
        }

        // Validate fixed amount values
        if (dto.type === DiscountType.FIXED_AMOUNT) {
            const amount = parseFloat(dto.value);
            if (amount <= 0) {
                throw new GraphQLError(
                    "Fixed amount discount must be greater than 0",
                    {
                        extensions: { code: "INVALID_AMOUNT" },
                    },
                );
            }
        }

        // Validate free trial values
        if (dto.type === DiscountType.FREE_TRIAL) {
            const intervals = parseInt(dto.value);
            if (intervals <= 0 || !Number.isInteger(intervals)) {
                throw new GraphQLError(
                    "Free trial must specify a positive number of billing intervals",
                    {
                        extensions: { code: "INVALID_TRIAL_INTERVALS" },
                    },
                );
            }
        }
    }

    /**
     * Map our discount type to Paddle discount type
     */
    private mapDiscountType(type: DiscountType): PaddleDiscountType {
        switch (type) {
            case DiscountType.PERCENTAGE:
                return "percentage";
            case DiscountType.FIXED_AMOUNT:
                return "flat";
            case DiscountType.FREE_TRIAL:
                return "percentage"; // Free trial is 100% off for specified periods
            default:
                throw new GraphQLError(`Unsupported discount type: ${type}`);
        }
    }

    /**
     * Format discount amount for Paddle
     */
    private formatDiscountAmount(type: DiscountType, value: number): string {
        switch (type) {
            case DiscountType.PERCENTAGE:
                // Convert decimal to percentage (0.2 -> 20)
                return (value * 100).toString();
            case DiscountType.FIXED_AMOUNT:
                // Keep as is for fixed amounts
                return value.toString();
            case DiscountType.FREE_TRIAL:
                // Free trial is 100% off
                return "100";
            default:
                return value.toString();
        }
    }
}
