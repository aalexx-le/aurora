import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { AssetPrice } from "../../../entities/asset-price";
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
        name: AssetPriceEventListener.NEW_ASSET_PRICE_1m_PAYLOAD_NAME,
        filter: async (payload, variables: GetAssetPriceArgs) => {
            const assetPrice: AssetPrice =
                payload[
                    AssetPriceEventListener.NEW_ASSET_PRICE_1m_PAYLOAD_NAME
                ]!;
            const { assetInfoId } = variables.data;
            return assetPrice.assetInfoId === assetInfoId;
        },
    })
    async onAssetPrice1mInserted(@Args() _: GetAssetPriceArgs) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.ASSET_PRICE_1m_INSERTED,
        );
    }

    @Subscription(() => AssetPrice, {
        name: AssetPriceEventListener.NEW_ASSET_PRICE_5m_PAYLOAD_NAME,
        filter: async (payload, variables: GetAssetPriceArgs) => {
            const assetPrice: AssetPrice =
                payload[
                    AssetPriceEventListener.NEW_ASSET_PRICE_5m_PAYLOAD_NAME
                ]!;
            const { assetInfoId } = variables.data;

            return assetPrice.assetInfoId === assetInfoId;
        },
    })
    async onAssetPrice5mInserted(@Args() _: GetAssetPriceArgs) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.ASSET_PRICE_5m_INSERTED,
        );
    }
}
