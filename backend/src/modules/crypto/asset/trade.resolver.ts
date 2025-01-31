import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CryptoAssetService } from "./asset.service";
import { GetTradeInput } from "./dto/get-trade.input";
import { Trade } from "../../../entities/trade";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { User } from "../../../entities/user";
import { CryptoPortfolio } from "../../../entities/crypto-portfolio";
import { CryptoPortfolioService } from "../profile/portfolio.service";

@UseGuards(JwtGuard)
@Resolver(() => Trade)
export class TradeResolver {
    constructor(
        private readonly cryptoAssetService: CryptoAssetService,
        private readonly cryptoPortfolioService: CryptoPortfolioService,
    ) {}

    @Query(() => [Trade], { name: "getTrades" })
    async get(
        @AuthUser() user: User,
        @Args("data") input: GetTradeInput,
        // @Args("pagination") pagination: PaginationInput,
    ) {
        return this.cryptoAssetService.findManyTrades(user.id, input);
    }

    @ResolveField("cryptoPortfolio", () => CryptoPortfolio)
    async getCryptoPortfolio(@Parent() trade: Trade) {
        const { cryptoPortfolioId } = trade;
        return this.cryptoPortfolioService.findPortfolio(cryptoPortfolioId);
    }
}
