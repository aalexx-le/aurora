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
import { CEXExchanges } from "../../../entities/prisma";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import {
    CreateCryptoPortfolioArgs,
    CreateCryptoRes,
    CreateOKXCryptoPortfolioArgs,
} from "./dto/create-crypto-portfolio.input";
import { CryptoPortfolioService } from "./portfolio.service";

@Resolver(() => CryptoPortfolio)
export class CryptoPortfolioResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @UseGuards(JwtGuard)
    @Mutation(() => CreateCryptoRes, { name: "createCryptoPortfolio" })
    create(@AuthUser() user: User, @Args() args: CreateCryptoPortfolioArgs) {
        this.cryptoPortfolioService.createPortfolio(user.id, args.data);
        return {
            userId: user.id,
        };
    }

    @UseGuards(JwtGuard)
    @Mutation(() => CreateCryptoRes, { name: "createOKXCryptoPortfolio" })
    createOKX(
        @AuthUser() user: User,
        @Args() args: CreateOKXCryptoPortfolioArgs,
    ) {
        this.cryptoPortfolioService.createPortfolio(user.id, args.data);
        return {
            userId: user.id,
        };
    }

    @UseGuards(JwtGuard)
    @Query(() => [CryptoPortfolio], { name: "getCryptoPortfolios" })
    async get(@AuthUser() user: User) {
        return this.cryptoPortfolioService.findPortfolios(user.id);
    }

    @Subscription(() => CreatePortfolioExecution, {
        name: "onCreatePortfolioExecution",
        filter: (payload, variables, context) => {
            const execution =
                payload[SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS];
            const userId = context.req.user.id;
            return execution.userId === userId;
        },
    })
    @UseGuards(JwtGuard)
    onPortfolioCreationStatus() {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS,
        );
    }

    @ResolveField("balances", () => [AssetBalance])
    async getBalances(@Parent() cryptoPortfolio: CryptoPortfolio) {
        return this.cryptoPortfolioService.findBalances(
            cryptoPortfolio.id,
            cryptoPortfolio.exchanges as CEXExchanges,
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
    async getCreatePortfolioExecutions(@Args("userId") userId: number) {
        return this.cryptoPortfolioService.getCreatePortfolioExecutions(userId);
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
