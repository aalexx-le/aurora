import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import {
    MembershipSubscription,
    MembershipSubscriptionStatus,
} from "@prisma/client";
import { GraphQLError } from "graphql";
import { PrismaService } from "nestjs-prisma";
import { CustomerPortalSessionResponse } from "./dtos/customer-portal-session.dto";
import { CreatePriceInputData, UpdatePriceInputData } from "./dtos/price.dto";
import {
    CreateProductInputData,
    UpdateProductInputData,
} from "./dtos/product.dto";
import { PaddleService } from "./paddle.service";

@Injectable()
export class PaddleSubscriptionService extends PaddleService {
    constructor(
        protected readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super(configService);
    }

    onModuleInit() {
        const apiKey = this.configService.get<string>("PADDLE_API_KEY");
        const environment =
            process.env.NODE_ENV === "production"
                ? Environment.production
                : Environment.sandbox;

        if (!apiKey) {
            this.logger.error(
                "PADDLE_API_KEY is not configured in environment variables.",
            );
            throw new InternalServerErrorException(
                "Paddle API Key is missing.",
            );
        }

        try {
            this.paddle = new Paddle(apiKey, { environment });
            this.logger.log(
                `Paddle SDK initialized for ${environment} environment.`,
            );
        } catch (error) {
            this.logger.error("Failed to initialize Paddle SDK", error.stack);
            throw new InternalServerErrorException(
                "Failed to initialize Paddle SDK",
            );
        }
    }

    /**
     * Cancel a subscription in Paddle and update the membership subscription status
     * @param subscriptionId - The subscription ID to cancel
     */
    async cancelSubscription(
        subscriptionId: string,
    ): Promise<MembershipSubscription> {
        this.logger.log(
            `Cancelling subscription with ID: ${subscriptionId} in Paddle`,
        );

        try {
            // Check if the subscription exists in our database
            const subscription =
                await this.prisma.membershipSubscription.findUnique({
                    where: { id: subscriptionId },
                });

            if (!subscription) {
                throw new NotFoundException(
                    `Subscription with ID ${subscriptionId} not found`,
                );
            }

            if (subscription.status === MembershipSubscriptionStatus.canceled) {
                throw new GraphQLError("Subscription is already cancelled", {
                    extensions: {
                        code: "SUBSCRIPTION_ALREADY_CANCELLED",
                    },
                });
            }

            // Call Paddle API to cancel the subscription
            await this.paddle.subscriptions.cancel(subscriptionId, {
                effectiveFrom: "next_billing_period", // Cancel at end of billing period
            });

            this.logger.log(
                `Successfully scheduled cancellation of Paddle subscription: ${subscriptionId}`,
            );

            return subscription;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            }

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error cancelling subscription ${subscriptionId}: ${error.message}`,
                error.stack,
            );
            throw new GraphQLError(
                "Failed to cancel subscription with Paddle",
                {
                    extensions: {
                        code: "PADDLE_CANCELLATION_FAILED",
                        originalError: error.message,
                    },
                },
            );
        }
    }

    /**
     * Reactivate a subscription in Paddle by removing the scheduled cancellation
     * If the subscription has already ended, create a new subscription
     * @param subscriptionId - The subscription ID to reactivate
     */
    async reactivateSubscription(
        subscriptionId: string,
    ): Promise<MembershipSubscription> {
        this.logger.log(
            `Reactivating subscription with ID: ${subscriptionId} in Paddle`,
        );

        try {
            // Check if the subscription exists in our database
            const subscription =
                await this.prisma.membershipSubscription.findUnique({
                    where: { id: subscriptionId },
                });

            if (!subscription) {
                throw new NotFoundException(
                    `Subscription with ID ${subscriptionId} not found`,
                );
            }

            // Check if the subscription is currently canceled
            if (subscription.status !== MembershipSubscriptionStatus.canceled) {
                throw new GraphQLError(
                    "Only canceled subscriptions can be reactivated",
                    {
                        extensions: {
                            code: "SUBSCRIPTION_CANNOT_BE_REACTIVATED",
                        },
                    },
                );
            }

            const now = new Date();

            // Scenario 1: Subscription is canceled but has a future end date (scheduled cancellation)
            if (subscription.endDate && new Date(subscription.endDate) > now) {
                this.logger.log(
                    `Subscription ${subscriptionId} has a future end date. Removing scheduled cancellation.`,
                );

                // Call Paddle API to remove the scheduled change
                await this.paddle.subscriptions.update(subscriptionId, {
                    scheduledChange: null,
                });

                this.logger.log(
                    `Successfully removed scheduled cancellation for subscription: ${subscriptionId}`,
                );

                return subscription;
            }
            // Scenario 2: Subscription has already ended
            else if (subscription.endDate && subscription.endDate <= now) {
                this.logger.log(
                    `Subscription ${subscriptionId} has already ended. Creating a new subscription.`,
                );

                return subscription;
            } else {
                throw new GraphQLError(
                    "Subscription is in an invalid state for reactivation",
                    {
                        extensions: {
                            code: "INVALID_SUBSCRIPTION_STATE",
                        },
                    },
                );
            }
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            }

            if (error instanceof NotFoundException) {
                throw error;
            }

            this.logger.error(
                `Error reactivating subscription ${subscriptionId}: ${error.message}`,
                error.stack,
            );
            throw new GraphQLError(
                "Failed to reactivate subscription with Paddle",
                {
                    extensions: {
                        code: "PADDLE_REACTIVATION_FAILED",
                        originalError: error.message,
                    },
                },
            );
        }
    }

    /**
     * Create a customer portal session for a user
     * @param userId - The user ID to create portal session for
     * @param subscriptionIds - Optional array of subscription IDs for deep linking
     */
    async createCustomerPortalSession(
        userId: number,
        subscriptionIds?: string[],
    ): Promise<CustomerPortalSessionResponse> {
        this.logger.log(
            `Creating customer portal session for user ID: ${userId}`,
        );

        try {
            // First, get the Paddle customer ID for this user
            const paddleCustomerId =
                await this.getPaddleCustomerIdByUserId(userId);

            if (!paddleCustomerId) {
                throw new GraphQLError(
                    "No Paddle customer found for this user",
                    {
                        extensions: { code: "CUSTOMER_NOT_FOUND" },
                    },
                );
            }

            this.logger.log(
                `Found Paddle customer ID: ${paddleCustomerId} for user: ${userId}`,
            );

            // Create the portal session using Paddle SDK
            const response = await this.paddle.customerPortalSessions.create(
                paddleCustomerId,
                subscriptionIds || [],
            );

            this.logger.log(
                `Successfully created customer portal session: ${response.id}`,
            );

            return response;
        } catch (error) {
            if (error instanceof GraphQLError) {
                throw error;
            }
            this.handlePaddleError(error, "createCustomerPortalSession");
        }
    }

    /**
     * Get Paddle customer ID for a user by looking up their payment method
     * @param userId - The user ID to look up
     * @returns Paddle customer ID or null if not found
     */
    private async getPaddleCustomerIdByUserId(
        userId: number,
    ): Promise<string | null> {
        this.logger.debug(`Looking up Paddle customer ID for user: ${userId}`);

        const paymentMethod = await this.prisma.paymentMethod.findFirst({
            where: {
                userId,
                provider: "PADDLE",
            },
            include: {
                paddlePaymentMethod: true,
            },
        });

        const customerId =
            paymentMethod?.paddlePaymentMethod?.customerId || null;

        if (customerId) {
            this.logger.debug(
                `Found Paddle customer ID: ${customerId} for user: ${userId}`,
            );
        } else {
            this.logger.debug(
                `No Paddle customer ID found for user: ${userId}`,
            );
        }

        return customerId;
    }
}
