import { Args, Query, Resolver, Subscription } from "@nestjs/graphql";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { CryptoPortfolioService } from "./portfolio.service";
import { Inject } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import {
    GetHistoricalBalanceArgs,
    GetHistoricalBalanceInput,
} from "./dto/get-historical-balance.input";
import { PaginationInput } from "../../../shared/pagination/pagination.args";
import { HistoricalCryptoBalanceEventListener } from "./historical-balance.event-listener";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";

@Resolver(() => HistoricalCryptoBalance)
export class HistoricalBalanceResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @Query(() => [HistoricalCryptoBalance], { name: "getHistoricalBalances" })
    getHistoricalBalances(
        @Args("data") input: GetHistoricalBalanceInput,
        @Args("pagination") pagination: PaginationInput,
    ) {
        return this.cryptoPortfolioService.findHistoricalBalances(
            input,
            pagination,
        );
    }

    @Subscription(() => HistoricalCryptoBalance, {
        name: HistoricalCryptoBalanceEventListener.NEW_HISTORICAL_CRYPTO_BALANCE_1m_PAYLOAD_NAME,
        filter: async (payload, variables: GetHistoricalBalanceArgs) => {
            const balance: HistoricalCryptoBalance =
                payload[
                    HistoricalCryptoBalanceEventListener
                        .NEW_HISTORICAL_CRYPTO_BALANCE_1m_PAYLOAD_NAME
                ]!;
            const { cryptoPortfolioIds } = variables.data;
            return cryptoPortfolioIds.includes(balance.cryptoPortfolioId);
        },
    })
    async onHistoricalCryptoBalance1mInserted(
        @Args() args: GetHistoricalBalanceArgs,
    ) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.HISTORICAL_CRYPTO_BALANCE_1m_INSERTED,
        );
    }

    @Subscription(() => HistoricalCryptoBalance, {
        name: HistoricalCryptoBalanceEventListener.NEW_HISTORICAL_CRYPTO_BALANCE_1h_PAYLOAD_NAME,
        filter: async (payload, variables: GetHistoricalBalanceArgs) => {
            const balance: HistoricalCryptoBalance =
                payload[
                    HistoricalCryptoBalanceEventListener
                        .NEW_HISTORICAL_CRYPTO_BALANCE_1h_PAYLOAD_NAME
                ]!;
            const { cryptoPortfolioIds } = variables.data;

            return cryptoPortfolioIds.includes(balance.cryptoPortfolioId);
        },
    })
    async onHistoricalCryptoBalance1hInserted(
        @Args() args: GetHistoricalBalanceArgs,
    ) {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.HISTORICAL_CRYPTO_BALANCE_1h_INSERTED,
        );
    }
}
