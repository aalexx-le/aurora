import { Inject, UseGuards } from "@nestjs/common";
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
    Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AssetBalance } from "src/entities/asset-balance";
import { CreatePortfolioExecution } from "src/entities/create-portfolio-execution";
import { CryptoPortfolio } from "src/entities/crypto-portfolio";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { User } from "src/entities/user";
import { HistoricalAssetProfit } from "../../../entities/historical-asset-profit";
import { Exchanges } from "../../../entities/prisma";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import {
    CreateCryptoPortfolioArgs,
    CreateCryptoRes,
} from "./dto/create-crypto-portfolio.input";
import {
    CreateSupportTicketArgs,
    RetryPortfolioCreationArgs,
    UpdatePortfolioCredentialsArgs,
} from "./dto/portfolio-recovery.input";
import { PortfolioController } from "./portfolio.controller";
import { CryptoPortfolioService } from "./portfolio.service";

@UseGuards(JwtGuard)
@Resolver(() => CryptoPortfolio)
export class CryptoPortfolioResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @Mutation(() => CreateCryptoRes, { name: "createCryptoPortfolio" })
    create(@AuthUser() user: User, @Args() args: CreateCryptoPortfolioArgs) {
        this.cryptoPortfolioService.createPortfolio(user.id, args.data);
        return {
            userId: user.id,
        };
    }

    @Mutation(() => CreatePortfolioExecution, {
        name: "retryPortfolioCreation",
    })
    async retryPortfolioCreation(
        @AuthUser() user: User,
        @Args() args: RetryPortfolioCreationArgs,
    ): Promise<CreatePortfolioExecution> {
        return this.cryptoPortfolioService.retryPortfolioCreation(
            user.id,
            args.executionId,
        );
    }

    @Mutation(() => CreatePortfolioExecution, {
        name: "updatePortfolioCredentials",
    })
    async updatePortfolioCredentials(
        @AuthUser() user: User,
        @Args() args: UpdatePortfolioCredentialsArgs,
    ): Promise<CreatePortfolioExecution> {
        return this.cryptoPortfolioService.updateExecutionCredentials(
            user.id,
            args.executionId,
            args.credentials,
        );
    }

    @Mutation(() => Boolean, { name: "createSupportTicket" })
    async createSupportTicket(
        @AuthUser() user: User,
        @Args() args: CreateSupportTicketArgs,
    ): Promise<boolean> {
        return this.cryptoPortfolioService.createSupportTicket(user.id, args);
    }

    @Query(() => [CryptoPortfolio], { name: "getCryptoPortfolios" })
    async get(@AuthUser() user: User) {
        return this.cryptoPortfolioService.findPortfolios(user.id);
    }

    @Subscription(() => CreatePortfolioExecution, {
        name: PortfolioController.NEW_CREATE_PORTFOLIO_EXECUTION_PAYLOAD,
        filter: (payload, variables, context) => {
            const execution: CreatePortfolioExecution =
                payload[
                    PortfolioController.NEW_CREATE_PORTFOLIO_EXECUTION_PAYLOAD
                ];
            console.log("User ID: ", context.req.user.id);
            console.log("Execution ", execution);
            const userId = context.req.user.id;
            return execution.userId == userId;
        },
    })
    onPortfolioCreationStatus() {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS,
        );
    }

    @ResolveField("balances", () => [AssetBalance])
    async getBalances(@Parent() cryptoPortfolio: CryptoPortfolio) {
        return this.cryptoPortfolioService.findBalances(
            cryptoPortfolio.id,
            cryptoPortfolio.exchanges as Exchanges,
        );
    }

    @ResolveField("latestHistoricalBalances", () => HistoricalCryptoBalance)
    async getEstimatedBalance(
        @Parent() portfolio: CryptoPortfolio,
        @Args("timeFrame") timeFrame: string,
    ) {
        const historicalBalance =
            await this.cryptoPortfolioService.findHistoricalBalances(
                { cryptoPortfolioId: portfolio.id, timeFrame },
                {
                    take: 1,
                },
            );

        if (historicalBalance.length === 0) {
            return {
                time: new Date(),
                estimatedBalance: 0,
                changePercent: 0,
                changeBalance: 0,
                cryptoPortfolioId: portfolio.id,
            };
        }

        return historicalBalance[0];
    }

    @ResolveField("latestAssetProfits", () => [HistoricalAssetProfit])
    async getLatestAssetProfits(@Parent() portfolio: CryptoPortfolio) {
        return await this.cryptoPortfolioService.findHistoricalAssetProfits(
            portfolio.id,
            { take: 1 },
        );
    }

    @Query(() => [CreatePortfolioExecution], {
        name: "getCreatePortfolioExecutions",
    })
    async getCreatePortfolioExecutions(@AuthUser() user: User) {
        return this.cryptoPortfolioService.getCreatePortfolioExecutions(
            user.id,
        );
    }

    // @Mutation(() => Crypto)
    // updateCrypto(
    //     @Args("updateCryptoInput") updateCryptoInput: UpdateCryptoInput,
    // ) {
    //     return this.cryptoService.update(
    //         updateCryptoInput.id,
    //         updateCryptoInput,
    //     );
    // }

    // @Mutation(() => Crypto)
    // removeCrypto(@Args("id", { type: () => Int }) id: number) {
    //     return this.cryptoService.remove(id);
    // }
}
