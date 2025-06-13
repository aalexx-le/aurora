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

@Injectable()
export class PaddleService implements OnModuleInit {
    protected readonly logger = new Logger(PaddleService.name);
    protected paddle: Paddle;

    constructor(protected readonly configService: ConfigService) {}

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

    protected handlePaddleError(error: any, context: string): never {
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
}
