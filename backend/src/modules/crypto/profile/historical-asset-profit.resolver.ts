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
import { AssetBalance } from "src/entities/asset-balance";

@Resolver(() => HistoricalAssetProfit)
export class HistoricalAssetProfitResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @ResolveField("assetInfo", () => AssetInfoOutput)
    getBalances(@Parent() assetBalance: AssetBalance) {
        const { assetInfoId } = assetBalance;
        return this.cryptoPortfolioService.findAssetInfo(assetInfoId);
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
        name: HistoricalAssetProfitEventListener.NEW_HISTORICAL_ASSET_PROFIT_1m_PAYLOAD_NAME,
        filter: async (payload, variables: GetHistoricalAssetProfitArgs) => {
            const profit: HistoricalAssetProfit =
                payload[
                    HistoricalAssetProfitEventListener
                        .NEW_HISTORICAL_ASSET_PROFIT_1m_PAYLOAD_NAME
                ]!;
            const { cryptoPortfolioId, assetInfoId } = variables.data;
            return (
                profit.cryptoPortfolioId === cryptoPortfolioId &&
                profit.assetInfoId === assetInfoId
            );
        },
    })
    async onHistoricalAssetProfit1mInserted(
        @Args() args: GetHistoricalAssetProfitArgs,
    ) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.HISTORICAL_ASSET_PROFIT_1m_INSERTED,
        );
    }

    @Subscription(() => HistoricalAssetProfit, {
        name: HistoricalAssetProfitEventListener.NEW_HISTORICAL_ASSET_PROFIT_1h_PAYLOAD_NAME,
        filter: async (payload, variables: GetHistoricalAssetProfitArgs) => {
            const profit: HistoricalAssetProfit =
                payload[
                    HistoricalAssetProfitEventListener
                        .NEW_HISTORICAL_ASSET_PROFIT_1h_PAYLOAD_NAME
                ]!;
            const { cryptoPortfolioId, assetInfoId } = variables.data;
            return (
                profit.cryptoPortfolioId === cryptoPortfolioId &&
                profit.assetInfoId === assetInfoId
            );
        },
    })
    async onHistoricalAssetProfit1hInserted(
        @Args() args: GetHistoricalAssetProfitArgs,
    ) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.HISTORICAL_ASSET_PROFIT_1h_INSERTED,
        );
    }
}
