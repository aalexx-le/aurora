import { Args, Query, Resolver } from "@nestjs/graphql";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { CryptoPortfolioService } from "./portfolio.service";
import { GetHistoricalBalanceInput } from "./dto/get-historical-balance.input";
import { PaginationInput } from "../../../shared/pagination/pagination.args";

@Resolver(() => HistoricalCryptoBalance)
export class HistoricalBalanceResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
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
}
