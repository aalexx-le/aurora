import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    EventEntity,
    EventName,
    Paddle,
    SubscriptionCanceledEvent,
    SubscriptionUpdatedEvent,
    TransactionNotification,
} from "@paddle/paddle-node-sdk";
import { PubSub } from "graphql-subscriptions";
import { PrismaService } from "nestjs-prisma";
import {
    MembershipSubscriptionStatus,
    PaymentProvider,
} from "src/entities/prisma";
import { SubscriptionEvent } from "src/shared/constants/subscription.event";
import { PaddleService } from "./paddle.service";

@Injectable()
export class PaddleWebhookService {
    public static MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME =
        "onMembershipSubscriptionUpdated";

    private readonly logger = new Logger(PaddleWebhookService.name);
    private readonly webhookSecret: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        @Inject(PaddleService)
        private readonly paddleService: PaddleService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {
        this.webhookSecret = this.configService.get<string>(
            "PADDLE_WEBHOOK_SECRET",
        );
        if (!this.webhookSecret) {
            this.logger.warn(
                "PADDLE_WEBHOOK_SECRET is not configured. Webhook verification will fail.",
            );
        }
    }

    /**
     * Get the Paddle instance from the PaddleService
     */
    private get paddle(): Paddle {
        return this.paddleService.getPaddle();
    }

    /**
     * Entry point for handling incoming webhooks from the controller.
     * Performs initial checks, verification, unmarshalling, and triggers event processing.
     * @param signatureHeader The value of the 'Paddle-Signature' header.
     * @param rawBody The raw request body buffer.
     */
    async processIncomingWebhook(
        signatureHeader: string,
        rawBody: Buffer,
    ): Promise<void> {
        this.logger.log("Processing incoming Paddle webhook...");

        if (!signatureHeader) {
            this.logger.warn(
                "Webhook received without paddle-signature header.",
            );
            throw new BadRequestException("Missing paddle-signature header");
        }

        if (!rawBody || rawBody.length === 0) {
            this.logger.error(
                "Webhook received with missing or empty raw body.",
            );
            throw new BadRequestException(
                "Webhook processing failed: Raw body missing or empty",
            );
        }

        try {
            // Call internal verification/unmarshalling
            const eventData = await this.verifyAndUnmarshalWebhook(
                signatureHeader,
                rawBody,
            );

            // Process asynchronously if verification was successful
            await this.processWebhookEvent(eventData);
        } catch (error) {
            this.logger.error(`Webhook handling failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Processes a validated Paddle webhook event.
     * @param event The parsed event object from Paddle.
     */
    private async processWebhookEvent(event: EventEntity): Promise<void> {
        this.logger.log(
            `Processing Paddle event: ${event.eventType} (ID: ${event.eventId})`,
        );

        // Extract userId from custom data if available
        let userId: number | undefined;

        try {
            // Access customData safely through type assertion
            const customData = (event.data as any).customData;
            if (customData && typeof customData === "object") {
                userId = customData.userId;
            }
        } catch (error) {
            this.logger.warn(
                `Could not extract userId from event ${event.eventId}: ${error.message}`,
            );
        }

        if (!userId) {
            this.logger.error(
                `Event ${event.eventId} (${event.eventType}) missing userId in custom_data. Cannot process.`,
            );
            return;
        }

        // --- Process based on Event Type ---
        switch (event.eventType) {
            case EventName.TransactionCompleted:
                await this.handleTransactionCompleted(event, userId);
                break;

            case EventName.SubscriptionCreated:
                await this.handleSubscriptionCreated(event, userId);
                break;

            case EventName.SubscriptionUpdated:
                await this.handleSubscriptionUpdated(event, userId);
                break;

            case EventName.SubscriptionCanceled:
                await this.handleSubscriptionCanceled(event, userId);
                break;

            case EventName.SubscriptionPastDue:
                await this.handleSubscriptionPastDue(event, userId);
                break;

            case EventName.SubscriptionPaused:
                await this.handleSubscriptionPaused(event, userId);
                break;

            case EventName.SubscriptionResumed:
                await this.handleSubscriptionResumed(event, userId);
                break;

            case EventName.SubscriptionTrialing:
                await this.handleSubscriptionTrialing(event, userId);
                break;

            default:
                this.logger.log(
                    `No specific processing logic for event type: ${event.eventType}`,
                );
        }
    }

    /**
     * Handles TransactionCompleted event
     * @param event The TransactionCompleted event
     * @param userId The user ID from custom data
     */
    private async handleTransactionCompleted(
        event: EventEntity,
        userId: number,
    ): Promise<void> {
        if (event.eventType !== EventName.TransactionCompleted) {
            this.logger.error(
                `Invalid event type for handleTransactionCompleted: ${event.eventType}`,
            );
            return;
        }

        // Type assertion needed for Paddle SDK type compatibility
        const data = event.data;
        const paddleCustomerId = data.customerId;
        const transactionId = data.id;

        // Extract address and business IDs if available
        const addressId = data.addressId || null;
        const businessId = data.businessId || null;

        this.logger.log(
            `Transaction completed: ${transactionId} for Paddle Customer ${paddleCustomerId}`,
        );

        if (!paddleCustomerId) {
            this.logger.error(
                `TransactionCompleted ${transactionId} missing paddleCustomerId. Cannot link payment method.`,
            );
            return;
        }

        try {
            // --- Create Payment Method Records (Idempotent) ---
            const existingPaddleMethod =
                await this.prisma.paddlePaymentMethod.findUnique({
                    where: { customerId: paddleCustomerId },
                });

            let paymentMethodId: number;

            if (!existingPaddleMethod) {
                this.logger.log(
                    `Creating new PaymentMethod records for Paddle Customer ${paddleCustomerId}`,
                );
                // Use transaction to ensure both records are created or neither
                const result = await this.prisma.$transaction(async (tx) => {
                    const newPaymentMethod = await tx.paymentMethod.create({
                        data: {
                            userId,
                            provider: PaymentProvider.PADDLE,
                        },
                    });

                    await tx.paddlePaymentMethod.create({
                        data: {
                            customerId: paddleCustomerId,
                            addressId,
                            businessId,
                            // Link to the parent PaymentMethod record
                            paymentMethod: {
                                connect: { id: newPaymentMethod.id },
                            },
                        },
                    });

                    return { paymentMethodId: newPaymentMethod.id };
                });

                paymentMethodId = result.paymentMethodId;
                this.logger.log(
                    `Successfully created PaymentMethod and PaddlePaymentMethod for Paddle Customer ${paddleCustomerId}`,
                );

                if (addressId || businessId) {
                    this.logger.log(
                        `Stored address ID ${addressId} and business ID ${businessId} for customer ${paddleCustomerId}`,
                    );
                }
            } else {
                paymentMethodId = existingPaddleMethod.paymentMethodId;

                // Update address and business IDs if they changed and are provided
                if (
                    (addressId &&
                        addressId !== existingPaddleMethod.addressId) ||
                    (businessId &&
                        businessId !== existingPaddleMethod.businessId)
                ) {
                    // Use standard Prisma update instead of raw query
                    await this.prisma.paddlePaymentMethod.update({
                        where: { id: existingPaddleMethod.id },
                        data: {
                            addressId: addressId || undefined,
                            businessId: businessId || undefined,
                        },
                    });

                    this.logger.log(
                        `Updated PaddlePaymentMethod with address ID ${addressId} and business ID ${businessId}`,
                    );
                } else {
                    this.logger.log(
                        `PaddlePaymentMethod already exists for Paddle Customer ${paddleCustomerId}. No updates needed.`,
                    );
                }
            }

            // Create payment transaction if subscription exists
            const subscriptionId = data.subscriptionId;
            if (subscriptionId) {
                const subscription =
                    await this.prisma.membershipSubscription.findUnique({
                        where: {
                            id: subscriptionId,
                        },
                    });

                if (subscription) {
                    // Create payment transaction record
                    await this.createPaymentTransaction(
                        data,
                        userId,
                        subscription.id,
                    );
                } else {
                    this.logger.warn(
                        `No subscription found for user ${userId} with paddle subscription ID ${subscriptionId}`,
                    );
                }
            } else {
                this.logger.log(
                    `Transaction ${transactionId} has no subscription ID, skipping transaction record creation`,
                );
            }
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId} / Paddle Customer ${paddleCustomerId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Handles SubscriptionCreated event
     * @param event The SubscriptionCreated event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionCreated(
        event: EventEntity,
        userId: number,
    ): Promise<void> {
        if (event.eventType !== EventName.SubscriptionCreated) {
            this.logger.error(
                `Invalid event type for handleSubscriptionCreated: ${event.eventType}`,
            );
            return;
        }

        try {
            // Type assertion needed for Paddle SDK type compatibility
            const data = event.data;
            const subscriptionId = data.id;

            // Safety checks for required data
            if (
                !data.items ||
                !Array.isArray(data.items) ||
                data.items.length === 0
            ) {
                this.logger.error(
                    `SubscriptionCreated ${subscriptionId} missing items array. Cannot create subscription.`,
                );
                return;
            }

            // Get the price from the first item
            const firstItem = data.items[0];

            if (!firstItem.price.id) {
                this.logger.error(
                    `SubscriptionCreated ${subscriptionId} missing price info. Cannot create subscription.`,
                );
                return;
            }

            // Find our MembershipPrice that corresponds to the Paddle price
            const membershipPrice = await this.prisma.membershipPrice.findFirst(
                {
                    where: {
                        id: firstItem.price.id,
                    },
                },
            );

            if (!membershipPrice) {
                this.logger.error(
                    `No membership price found for Paddle price ${firstItem.price.id}`,
                );
                return;
            }

            // Calculate end date based on next billing date or default to 30 days
            const startDate = new Date();
            const endDate = this.calculateEndDate(startDate, data.billingCycle);

            // Create subscription record
            const subscription =
                await this.prisma.membershipSubscription.create({
                    data: {
                        id: subscriptionId,
                        userId,
                        planId: membershipPrice.planId,
                        status: data.status,
                        startDate,
                        endDate,
                    },
                });

            this.logger.log(
                `Created subscription ID ${subscription.id} for user ${userId}`,
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Calculates the subscription end date based on billing cycle
     * @param startDate Starting date of the subscription
     * @param billingCycle Billing cycle information from Paddle
     * @returns Calculated end date
     */
    private calculateEndDate(startDate: Date, billingCycle?: any): Date {
        let endDate = new Date(startDate);

        if (billingCycle) {
            const { interval, frequency } = billingCycle;

            switch (interval.toLowerCase()) {
                case "day":
                    endDate.setDate(endDate.getDate() + frequency);
                    break;
                case "week":
                    endDate.setDate(endDate.getDate() + frequency * 7);
                    break;
                case "month":
                    endDate.setMonth(endDate.getMonth() + frequency);
                    break;
                case "year":
                    endDate.setFullYear(endDate.getFullYear() + frequency);
                    break;
                default:
                    this.logger.warn(
                        `Unknown billing interval: ${interval}, defaulting to 30 days`,
                    );
                    endDate.setDate(endDate.getDate() + 30);
            }
        } else {
            // Default to 30 days if no billing cycle is specified
            endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        }

        return endDate;
    }

    /**
     * Handles SubscriptionUpdated event
     * @param event The SubscriptionUpdated event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionUpdated(
        event: SubscriptionUpdatedEvent,
        userId: number,
    ): Promise<void> {
        try {
            const data = event.data;
            let updatedSubscription;

            // If the event is a scheduled change, it is cancel subscription in the future
            if (data.scheduledChange) {
                updatedSubscription =
                    await this.prisma.membershipSubscription.update({
                        where: { id: data.id },
                        data: {
                            status: MembershipSubscriptionStatus.canceled,
                        },
                    });
            } else {
                // Update subscription
                updatedSubscription =
                    await this.prisma.membershipSubscription.update({
                        where: { id: data.id },
                        data: {
                            status: data.status,
                        },
                    });
            }

            this.logger.log(
                `Updated subscription ID ${data.id} for user ${userId}`,
            );

            // Publish the subscription update event
            await this.pubSub.publish(
                SubscriptionEvent.MEMBERSHIP_SUBSCRIPTION_UPDATED,
                {
                    [PaddleWebhookService.MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME]:
                        updatedSubscription,
                },
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Handles SubscriptionCanceled event
     * @param event The SubscriptionCanceled event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionCanceled(
        event: SubscriptionCanceledEvent,
        userId: number,
    ): Promise<void> {
        try {
            // Type assertion needed for Paddle SDK type compatibility
            const data = event.data;
            const paddleSubscriptionId = data.id;

            // Find existing subscription for this user
            const membershipSubscription =
                await this.prisma.membershipSubscription.findFirst({
                    where: {
                        userId,
                        // Add additional fields to match the right subscription
                    },
                });

            if (!membershipSubscription) {
                this.logger.error(`No subscription found for user ${userId}`);
                return;
            }

            // Update subscription status to CANCELED
            // Keep the end date as is since the subscription remains active until the current period ends
            const updatedSubscription =
                await this.prisma.membershipSubscription.update({
                    where: { id: membershipSubscription.id },
                    data: {
                        status: MembershipSubscriptionStatus.canceled,
                    },
                    include: {
                        plan: true,
                        paymentTransactions: true,
                    },
                });

            this.logger.log(
                `Marked subscription ID ${membershipSubscription.id} as canceled for user ${userId}`,
            );

            // Publish the subscription update event
            await this.pubSub.publish(
                SubscriptionEvent.MEMBERSHIP_SUBSCRIPTION_UPDATED,
                {
                    [PaddleWebhookService.MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME]:
                        updatedSubscription,
                },
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Handles SubscriptionPastDue event
     * @param event The SubscriptionPastDue event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionPastDue(
        event: EventEntity,
        userId: number,
    ): Promise<void> {
        if (event.eventType !== EventName.SubscriptionPastDue) {
            this.logger.error(
                `Invalid event type for handleSubscriptionPastDue: ${event.eventType}`,
            );
            return;
        }

        try {
            // Type assertion needed for Paddle SDK type compatibility
            const data = event.data as any;
            const paddleSubscriptionId = data.id;

            // Find existing subscription for this user
            const membershipSubscription =
                await this.prisma.membershipSubscription.findFirst({
                    where: {
                        userId,
                        // Add additional fields to match the right subscription
                    },
                });

            if (!membershipSubscription) {
                this.logger.error(`No subscription found for user ${userId}`);
                return;
            }

            // Update subscription status to PAST_DUE
            const updatedSubscription =
                await this.prisma.membershipSubscription.update({
                    where: { id: membershipSubscription.id },
                    data: {
                        status: "PAST_DUE" as any, // Type assertion needed for enum handling
                    },
                    include: {
                        plan: true,
                        paymentTransactions: true,
                    },
                });

            this.logger.log(
                `Marked subscription ID ${membershipSubscription.id} as past due for user ${userId}`,
            );

            // Publish the subscription update event
            await this.pubSub.publish(
                SubscriptionEvent.MEMBERSHIP_SUBSCRIPTION_UPDATED,
                {
                    [PaddleWebhookService.MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME]:
                        updatedSubscription,
                },
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Handles SubscriptionPaused event
     * @param event The SubscriptionPaused event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionPaused(
        event: EventEntity,
        userId: number,
    ): Promise<void> {
        if (event.eventType !== EventName.SubscriptionPaused) {
            this.logger.error(
                `Invalid event type for handleSubscriptionPaused: ${event.eventType}`,
            );
            return;
        }

        try {
            // Type assertion needed for Paddle SDK type compatibility
            const data = event.data as any;
            const paddleSubscriptionId = data.id;

            // Find existing subscription
            const membershipSubscription =
                await this.prisma.membershipSubscription.findFirst({
                    where: {
                        userId,
                        // Add additional fields to match the right subscription
                    },
                });

            if (!membershipSubscription) {
                this.logger.error(`No subscription found for user ${userId}`);
                return;
            }

            // Note: You might want to add a PAUSED status to your enum if you want to track this state
            // For now, we'll just log the event
            this.logger.log(
                `Subscription ${membershipSubscription.id} paused for user ${userId}`,
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Handles SubscriptionResumed event
     * @param event The SubscriptionResumed event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionResumed(
        event: EventEntity,
        userId: number,
    ): Promise<void> {
        if (event.eventType !== EventName.SubscriptionResumed) {
            this.logger.error(
                `Invalid event type for handleSubscriptionResumed: ${event.eventType}`,
            );
            return;
        }

        try {
            // Type assertion needed for Paddle SDK type compatibility
            const data = event.data;

            // Find existing subscription
            const membershipSubscription =
                await this.prisma.membershipSubscription.findFirst({
                    where: {
                        userId,
                    },
                });

            if (!membershipSubscription) {
                this.logger.error(`No subscription found for user ${userId}`);
                return;
            }

            // Update subscription status back to ACTIVE
            const updatedSubscription =
                await this.prisma.membershipSubscription.update({
                    where: { id: membershipSubscription.id },
                    data: {
                        status: data.status,
                    },
                    include: {
                        plan: true,
                        paymentTransactions: true,
                    },
                });

            this.logger.log(
                `Resumed subscription ID ${membershipSubscription.id} for user ${userId}`,
            );

            // Publish the subscription update event
            await this.pubSub.publish(
                SubscriptionEvent.MEMBERSHIP_SUBSCRIPTION_UPDATED,
                {
                    [PaddleWebhookService.MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME]:
                        updatedSubscription,
                },
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Handles SubscriptionTrialing event
     * @param event The SubscriptionTrialing event
     * @param userId The user ID from custom data
     */
    private async handleSubscriptionTrialing(
        event: EventEntity,
        userId: number,
    ): Promise<void> {
        if (event.eventType !== EventName.SubscriptionTrialing) {
            this.logger.error(
                `Invalid event type for handleSubscriptionTrialing: ${event.eventType}`,
            );
            return;
        }

        try {
            // Type assertion needed for Paddle SDK type compatibility
            const data = event.data;
            const paddleSubscriptionId = data.id;

            // Find existing subscription
            const membershipSubscription =
                await this.prisma.membershipSubscription.findFirst({
                    where: {
                        userId,
                        // Add additional fields to match the right subscription
                    },
                });

            if (!membershipSubscription) {
                this.logger.error(`No subscription found for user ${userId}`);
                return;
            }

            // Log trial status, ensure subscription is marked as 'active'
            const updatedSubscription =
                await this.prisma.membershipSubscription.update({
                    where: { id: membershipSubscription.id },
                    data: {
                        status: data.status,
                    },
                    include: {
                        plan: true,
                        paymentTransactions: true,
                    },
                });

            this.logger.log(
                `Subscription ${membershipSubscription.id} is in trial for user ${userId}`,
            );

            // Publish the subscription update event
            await this.pubSub.publish(
                SubscriptionEvent.MEMBERSHIP_SUBSCRIPTION_UPDATED,
                {
                    [PaddleWebhookService.MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME]:
                        updatedSubscription,
                },
            );
        } catch (error) {
            this.logger.error(
                `Error processing ${event.eventType} for User ${userId}: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Creates a payment transaction record
     * @param transactionData Transaction data from Paddle
     * @param userId User ID
     * @param subscriptionId Subscription ID in our system
     */
    private async createPaymentTransaction(
        transactionData: TransactionNotification,
        userId: number,
        subscriptionId: string,
    ): Promise<void> {
        try {
            // Extract transaction details
            const payment = transactionData.payments[0];
            const amount = payment.amount;
            const currency = transactionData.currencyCode;
            const paddleTransactionId = transactionData.id;

            // Check if transaction already exists to prevent duplicates
            const existingTransaction =
                await this.prisma.paymentTransaction.findFirst({
                    where: {
                        userId,
                        membershipSubscriptionId: subscriptionId,
                    },
                    include: {
                        paddlePaymentTransaction: true,
                    },
                });

            if (
                existingTransaction &&
                existingTransaction.paddlePaymentTransaction
            ) {
                this.logger.log(
                    `Transaction already exists for subscription ${subscriptionId}, skipping creation`,
                );
                return;
            }

            // Create payment transaction records
            await this.prisma.$transaction(async (tx) => {
                // Create the base transaction
                const paymentTransaction = await tx.paymentTransaction.create({
                    data: {
                        membershipSubscriptionId: subscriptionId,
                        userId,
                        amount,
                        currency,
                        status: payment.status, // Type assertion needed for enum handling
                    },
                });

                // Create the paddle-specific transaction data
                await tx.paddlePaymentTransaction.create({
                    data: {
                        paymentTransactionId: paymentTransaction.id,
                    },
                });
            });

            this.logger.log(
                `Created payment transaction record for Paddle transaction ${paddleTransactionId}`,
            );
        } catch (error) {
            this.logger.error(
                `Error creating payment transaction: ${error.message}`,
                error.stack,
            );
        }
    }

    /**
     * Verifies the signature and unmarshals the event payload using the Paddle SDK.
     * @param signatureHeader The value of the 'Paddle-Signature' header.
     * @param rawBody The raw request body buffer.
     * @returns The parsed and validated EventEntity.
     * @throws Error if verification fails or parsing errors occur.
     */
    private async verifyAndUnmarshalWebhook(
        signatureHeader: string,
        rawBody: Buffer,
    ): Promise<EventEntity> {
        if (!this.paddle) {
            this.logger.error(
                "Attempted to verify webhook before Paddle SDK was initialized.",
            );
            throw new InternalServerErrorException("Paddle Service not ready");
        }
        if (!this.webhookSecret) {
            // This should ideally be caught earlier, but double-check
            this.logger.error(
                "Webhook secret key is missing, cannot verify signature.",
            );
            throw new InternalServerErrorException(
                "Webhook secret not configured",
            );
        }
        if (!signatureHeader || !rawBody) {
            this.logger.error(
                "Missing signature header or raw body for webhook verification.",
            );
            throw new BadRequestException(
                "Missing required data for webhook verification",
            );
        }

        try {
            const eventData = await this.paddle.webhooks.unmarshal(
                rawBody.toString("utf8"),
                this.webhookSecret, // Use the stored secret
                signatureHeader,
            );
            this.logger.log(
                `Webhook unmarshalled successfully for event: ${eventData.eventType}`,
            );
            return eventData;
        } catch (error) {
            this.logger.error(
                `Webhook unmarshal failed: ${error.message}`,
                error.stack,
            );
            // Rethrow or wrap the error appropriately. Wrapping allows adding context.
            // Throwing specific exceptions based on error type (e.g., SignatureMismatchError) might be better if the SDK provides them.
            if (
                error.message?.includes("signature mismatch") ||
                error.message?.includes("timestamp")
            ) {
                throw new BadRequestException(
                    `Webhook validation failed: ${error.message}`,
                );
            } else {
                throw new InternalServerErrorException(
                    `Webhook processing error: ${error.message}`,
                );
            }
        }
    }
}
