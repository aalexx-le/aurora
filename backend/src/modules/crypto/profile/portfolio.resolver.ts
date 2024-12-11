import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
    Subscription,
} from "@nestjs/graphql";
import { CryptoPortfolioService } from "./portfolio.service";
import {
    CreateCryptoPortfolioArgs,
    CreateCryptoRes,
} from "./dto/create-crypto-portfolio.input";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import { Inject } from "@nestjs/common";
import { PortfolioEventListener } from "./portfolio-event-listener.service";
import { GetCryptoPortfolioArgs } from "./dto/get-crypto-portfolio.input";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { AssetBalance } from "src/entities/asset-balance";
import { CryptoPortfolio } from "src/entities/crypto-portfolio";
import { HistoricalAssetProfit } from "../../../entities/historical-asset-profit";

@Resolver(() => CryptoPortfolio)
export class CryptoPortfolioResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @Mutation(() => CreateCryptoRes, { name: "createCryptoPortfolio" })
    create(@Args() args: CreateCryptoPortfolioArgs) {
        this.cryptoPortfolioService.createPortfolio(args.data);
        return {
            userId: args.data.userId,
        };
    }

    @Query(() => [CryptoPortfolio], { name: "getCryptoPortfolios" })
    async get(@Args() args: GetCryptoPortfolioArgs) {
        return this.cryptoPortfolioService.findPortfolios(args.data.userId);
    }

    @Subscription(() => CryptoPortfolio, {
        name: PortfolioEventListener.CREATE_SUCCESS_PAYLOAD_NAME,
        filter: (payload, variables: GetCryptoPortfolioArgs) =>
            payload[PortfolioEventListener.CREATE_SUCCESS_PAYLOAD_NAME]
                .userId === variables.data.userId,
    })
    onProfileCreated(@Args() _: GetCryptoPortfolioArgs) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.CRYPTO_PORTFOLIO_CREATED,
        );
    }

    @ResolveField("balances", () => [AssetBalance])
    getBalances(@Parent() cryptoPortfolio: CryptoPortfolio) {
        return this.cryptoPortfolioService.findBalances(cryptoPortfolio.id);
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

        return historicalBalance[0];
    }

    @ResolveField("latestAssetProfits", () => [HistoricalAssetProfit])
    async getLatestAssetProfits(@Parent() portfolio: CryptoPortfolio) {
        return this.cryptoPortfolioService.findHistoricalAssetProfits(
            portfolio.id,
            { take: 1 },
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
