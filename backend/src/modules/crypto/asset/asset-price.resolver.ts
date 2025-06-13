import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { AssetPrice } from "src/entities/asset-price";
import { CryptoAssetService } from "./asset.service";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import {
    GetAssetPriceArgs,
    GetAssetPriceInput,
} from "./dto/get-asset-price.input";
import { AssetPriceEventListener } from "./asset-price.event-listener";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import { PaginationInput } from "../../../shared/pagination/pagination.args";

// @UseGuards(JwtGuard)
@Resolver(() => AssetPrice)
export class CryptoAssetPriceResolver {
    constructor(
        private readonly cryptoAssetService: CryptoAssetService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @Query(() => [AssetPrice], { name: "getAssetPrices" })
    async get(
        @Args("data") args: GetAssetPriceInput,
        @Args("pagination") pagination: PaginationInput,
    ) {
        return this.cryptoAssetService.findManyPrices(args, pagination);
    }

    @Subscription(() => AssetPrice, {
        name: AssetPriceEventListener.NEW_ASSET_PRICE_PAYLOAD_NAME,
        filter: async (payload, variables: GetAssetPriceArgs) => {
            const assetPrice: AssetPrice =
                payload[AssetPriceEventListener.NEW_ASSET_PRICE_PAYLOAD_NAME]!;
            const timeFrame = payload[AssetPriceEventListener.TIME_FRAME]!;
            const { assetInfoId, timeFrame: timeFrameInput } = variables.data;
            return (
                assetPrice.assetInfoId === assetInfoId &&
                timeFrame === timeFrameInput
            );
        },
    })
    async onAssetPriceInserted(@Args() _: GetAssetPriceArgs) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.ASSET_PRICE_1m_INSERTED,
        );
    }
}
