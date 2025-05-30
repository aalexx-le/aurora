import {
    Args,
    Parent,
    Query,
    ResolveField,
    Resolver,
    Subscription,
} from "@nestjs/graphql";
import { HistoricalAssetProfit } from "src/entities/historical-asset-profit";
import { CryptoPortfolioService } from "./portfolio.service";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { PaginationInput } from "../../../shared/pagination/pagination.args";
import { HistoricalAssetProfitEventListener } from "./historical-asset-profit.event-listener";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import {
    GetHistoricalAssetProfitArgs,
    GetHistoricalAssetProfitInput,
} from "./dto/get-historical-asset-profit.input";
import { AssetInfoOutput } from "./dto/get-asset-info.output";
import { CryptoPortfolio } from "../../../entities/crypto-portfolio";

@Resolver(() => HistoricalAssetProfit)
export class HistoricalAssetProfitResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @ResolveField("assetInfo", () => AssetInfoOutput)
    getAssetInfo(@Parent() historicalAssetProfit: HistoricalAssetProfit) {
        const { assetInfoId } = historicalAssetProfit;
        return this.cryptoPortfolioService.findAssetInfo(assetInfoId);
    }

    @ResolveField("cryptoPortfolio", () => CryptoPortfolio)
    async getCryptoPortfolio(
        @Parent() historicalAssetProfit: HistoricalAssetProfit,
    ) {
        const { cryptoPortfolioId } = historicalAssetProfit;
        return this.cryptoPortfolioService.findPortfolio(cryptoPortfolioId);
    }

    @Query(() => [HistoricalAssetProfit], { name: "getHistoricalAssetProfits" })
    getHistoricalAssetProfits(
        @Args("data") input: GetHistoricalAssetProfitInput,
        @Args("pagination") pagination: PaginationInput,
    ) {
        return this.cryptoPortfolioService.findOneHistoricalAssetProfit(
            input,
            pagination,
        );
    }

    @Subscription(() => HistoricalAssetProfit, {
        name: HistoricalAssetProfitEventListener.NEW_HISTORICAL_ASSET_PROFIT_PAYLOAD_NAME,
        filter: async (payload, variables: GetHistoricalAssetProfitArgs) => {
            const profit: HistoricalAssetProfit =
                payload[
                    HistoricalAssetProfitEventListener
                        .NEW_HISTORICAL_ASSET_PROFIT_PAYLOAD_NAME
                ]!;
            const timeFrame = payload[
                HistoricalAssetProfitEventListener.TIME_FRAME
            ]!;
            const {
                cryptoPortfolioId,
                assetInfoId,
                timeFrame: timeFrameInput,
            } = variables.data;
            
            return (
                profit.cryptoPortfolioId === cryptoPortfolioId &&
                profit.assetInfoId === assetInfoId &&
                timeFrame === timeFrameInput
            );
        },
    })
    async onHistoricalAssetProfitInserted(
        @Args() args: GetHistoricalAssetProfitArgs,
    ) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.HISTORICAL_ASSET_PROFIT_INSERTED,
        );
    }
}
