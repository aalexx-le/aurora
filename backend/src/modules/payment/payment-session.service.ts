import { RedisService } from "@liaoliaots/nestjs-redis";
import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { PrismaService } from "nestjs-prisma";
import { v4 as uuidv4 } from "uuid";
import { MembershipDiscountService } from "../membership/discount/membership-discount.service";
import {
    CreatePaymentSessionDto,
    PaymentSession,
} from "./dtos/payment-session.dto";

@Injectable()
export class PaymentSessionService {
    private readonly logger = new Logger(PaymentSessionService.name);
    private readonly redis: Redis;
    private readonly SESSION_TTL: number;
    private readonly SESSION_PREFIX = "payment_session:";

    constructor(
        private readonly prisma: PrismaService,
        private readonly redisService: RedisService,
        private readonly discountService: MembershipDiscountService,
        private readonly configService: ConfigService,
    ) {
        this.redis = this.redisService.getOrThrow();
        this.SESSION_TTL = this.configService.get("PAYMENT_SESSION_TTL");
    }

    async createPaymentSession(
        data: CreatePaymentSessionDto,
        userId: number,
    ): Promise<PaymentSession> {
        this.logger.log(`Creating payment session for user ${userId}`);

        const sessionId = uuidv4();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.SESSION_TTL * 1000);

        const price = await this.prisma.membershipPrice.findUnique({
            where: { id: data.priceId },
            include: {
                unitPrice: true,
            }
        });

        if (!price) {
            throw new NotFoundException("Price not found");
        }

        let discountAmount = 0;
        let finalAmount = Number(price.unitPrice.amount);

        // Apply discount if provided
        if (data.discountId) {
            try {
                // Create proper ValidateDiscountDto using discount ID lookup
                const discount = await this.discountService.findOne(data.discountId);
                if (!discount) {
                    throw new BadRequestException("Invalid discount ID");
                }

                const { discountAmount: calculatedDiscountAmount, finalAmount: calculatedFinalAmount } =
                    this.discountService.calculateDiscountAmount(discount, parseFloat(price.unitPrice.amount));

                discountAmount = calculatedDiscountAmount;
                finalAmount = calculatedFinalAmount;
            } catch (error) {
                throw new BadRequestException("Failed to apply discount");
            }
        }

        const sessionData: PaymentSession = {
            sessionId,
            planId: data.planId,
            priceId: data.priceId,
            discountId: data.discountId,
            discountAmount: discountAmount > 0 ? discountAmount : undefined,
            finalAmount,
            userId,
            createdAt: now,
            expiresAt,
        };

        // Store session in Redis
        const redisKey = this.getRedisKey(sessionId);
        try {
            await this.redis.setex(
                redisKey,
                this.SESSION_TTL,
                JSON.stringify(sessionData),
            );

            this.logger.log(
                `Payment session ${sessionId} created for user ${userId}, expires at ${expiresAt.toISOString()}`,
            );

            return sessionData;
        } catch (error) {
            this.logger.error(
                `Failed to store payment session ${sessionId}: ${error.message}`,
            );
            throw new BadRequestException("Failed to create payment session");
        }
    }

    async getPaymentSession(
        sessionId: string,
        userId: number,
    ): Promise<PaymentSession> {
        this.logger.log(`Retrieving payment session ${sessionId} for user ${userId}`);

        const redisKey = this.getRedisKey(sessionId);

        try {
            const sessionDataString = await this.redis.get(redisKey);

            if (!sessionDataString) {
                throw new NotFoundException("Payment session not found or expired");
            }

            const sessionData: PaymentSession = JSON.parse(sessionDataString);

            // Verify user ownership
            if (sessionData.userId !== userId) {
                this.logger.warn(
                    `Unauthorized access attempt to session ${sessionId} by user ${userId}`,
                );
                throw new NotFoundException("Payment session not found");
            }

            // Check expiration
            if (new Date() > new Date(sessionData.expiresAt)) {
                this.logger.warn(`Payment session ${sessionId} has expired`);
                await this.cleanupSession(sessionId);
                throw new NotFoundException("Payment session has expired");
            }

            sessionData.expiresAt = new Date(sessionData.expiresAt);
            sessionData.createdAt = new Date(sessionData.createdAt);

            this.logger.log(`Payment session ${sessionId} retrieved successfully`);
            return sessionData;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Failed to retrieve payment session ${sessionId}: ${error.message}`,
            );
            throw new BadRequestException("Failed to retrieve payment session");
        }
    }

    async cleanupSession(sessionId: string): Promise<void> {
        const redisKey = this.getRedisKey(sessionId);
        try {
            await this.redis.del(redisKey);
            this.logger.log(`Payment session ${sessionId} cleaned up`);
        } catch (error) {
            this.logger.error(
                `Failed to cleanup payment session ${sessionId}: ${error.message}`,
            );
        }
    }

    async validateAndConsumeSession(
        sessionId: string,
        userId: number,
    ): Promise<PaymentSession> {
        const sessionData = await this.getPaymentSession(sessionId, userId);

        // Session is valid, now remove it to prevent reuse
        await this.cleanupSession(sessionId);

        this.logger.log(
            `Payment session ${sessionId} validated and consumed for user ${userId}`,
        );

        return sessionData;
    }

    private getRedisKey(sessionId: string): string {
        return `${this.SESSION_PREFIX}${sessionId}`;
    }

    async getActiveSessionsCount(): Promise<number> {
        try {
            const keys = await this.redis.keys(`${this.SESSION_PREFIX}*`);
            return keys.length;
        } catch (error) {
            this.logger.error(`Failed to get active sessions count: ${error.message}`);
            return 0;
        }
    }
} 