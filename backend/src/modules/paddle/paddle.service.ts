import {
    forwardRef,
    Inject,
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
import { CreatePriceInputData, UpdatePriceInputData } from "./dtos/price.dto";
import {
    CreateProductInputData,
    UpdateProductInputData,
} from "./dtos/product.dto";
import { PaddleWebhookService } from "./paddle-webhook.service";

@Injectable()
export class PaddleService implements OnModuleInit {
    private readonly logger = new Logger(PaddleService.name);
    private paddle: Paddle;

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {}

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
     * Get the initialized Paddle instance
     * For use by other services like PaddleWebhookService
     */
    getPaddle(): Paddle {
        if (!this.paddle) {
            throw new InternalServerErrorException(
                "Paddle SDK not initialized",
            );
        }
        return this.paddle;
    }

    private handlePaddleError(error: any, context: string): never {
        this.logger.error(
            `Paddle API Error in ${context}: ${error.message}`,
            error.stack,
        );
        // Attempt to extract Paddle specific error details if available
        const paddleErrorDetails = error.response?.data?.error;
        const message =
            paddleErrorDetails?.detail ||
            error.message ||
            "An error occurred with the Paddle API.";
        const code = paddleErrorDetails?.code || "PADDLE_API_ERROR";

        throw new GraphQLError(message, {
            extensions: {
                code: code,
                paddleError: paddleErrorDetails, // Include raw Paddle error if available
            },
        });
    }

    // --- Product Methods ---
    async listProducts() {
        this.logger.log("Listing products from Paddle");
        try {
            const products = [];
            for await (const product of this.paddle.products.list()) {
                products.push(product);
            }
            this.logger.debug(`Retrieved ${products.length} products`);
            return products;
        } catch (error) {
            this.handlePaddleError(error, "listProducts");
        }
    }

    async createProduct(data: CreateProductInputData) {
        this.logger.log(`Creating product in Paddle with name: ${data.name}`);
        try {
            const newProduct = await this.paddle.products.create(data);
            this.logger.log(
                `Successfully created product with ID: ${newProduct.id}`,
            );
            return newProduct;
        } catch (error) {
            this.handlePaddleError(error, "createProduct");
        }
    }

    async getProduct(id: string) {
        this.logger.log(`Getting product from Paddle with ID: ${id}`);
        try {
            const product = await this.paddle.products.get(id);
            if (!product) {
                throw new NotFoundException(
                    `Product with ID ${id} not found in Paddle.`,
                );
            }
            this.logger.debug(`Retrieved product: ${product.name}`);
            return product;
        } catch (error) {
            if (error?.status === 404 || error instanceof NotFoundException) {
                throw new NotFoundException(
                    `Product with ID ${id} not found in Paddle.`,
                );
            }
            this.handlePaddleError(error, "getProduct");
        }
    }

    async updateProduct(id: string, data: UpdateProductInputData) {
        this.logger.log(`Updating product in Paddle with ID: ${id}`);
        try {
            await this.getProduct(id);
            const updatedProduct = await this.paddle.products.update(id, data);
            this.logger.log(`Successfully updated product with ID: ${id}`);
            return updatedProduct;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.handlePaddleError(error, "updateProduct");
        }
    }

    // --- Price Methods ---
    async listPrices() {
        this.logger.log("Listing prices from Paddle");
        try {
            const prices = [];
            for await (const price of this.paddle.prices.list()) {
                prices.push(price);
            }
            this.logger.debug(`Retrieved ${prices.length} prices`);
            return prices;
        } catch (error) {
            this.handlePaddleError(error, "listPrices");
        }
    }

    async createPrice(data: CreatePriceInputData) {
        this.logger.log(
            `Creating price in Paddle for product ID: ${data.productId}`,
        );
        try {
            await this.getProduct(data.productId);
            const newPrice = await this.paddle.prices.create(data);
            this.logger.log(
                `Successfully created price with ID: ${newPrice.id} for product ${data.productId}`,
            );
            return newPrice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new GraphQLError(
                    `Cannot create price: Product with ID ${data.productId} not found.`,
                    {
                        extensions: { code: "PRODUCT_NOT_FOUND" },
                    },
                );
            }
            this.handlePaddleError(error, "createPrice");
        }
    }

    async getPrice(id: string) {
        this.logger.log(`Getting price from Paddle with ID: ${id}`);
        try {
            const price = await this.paddle.prices.get(id);
            if (!price) {
                throw new NotFoundException(
                    `Price with ID ${id} not found in Paddle.`,
                );
            }
            this.logger.debug(`Retrieved price: ${price.description}`);
            return price;
        } catch (error) {
            if (error?.status === 404 || error instanceof NotFoundException) {
                throw new NotFoundException(
                    `Price with ID ${id} not found in Paddle.`,
                );
            }
            this.handlePaddleError(error, "getPrice");
        }
    }

    async updatePrice(id: string, data: UpdatePriceInputData) {
        this.logger.log(`Updating price in Paddle with ID: ${id}`);
        try {
            await this.getPrice(id);
            const updatedPrice = await this.paddle.prices.update(id, data);
            this.logger.log(`Successfully updated price with ID: ${id}`);
            return updatedPrice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.handlePaddleError(error, "updatePrice");
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
}
