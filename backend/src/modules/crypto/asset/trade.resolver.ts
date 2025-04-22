import { UseGuards } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CryptoPortfolio } from "../../../entities/crypto-portfolio";
import { Trade } from "../../../entities/trade";
import { User } from "../../../entities/user";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { CryptoPortfolioService } from "../portfolio/portfolio.service";
import { CryptoAssetService } from "./asset.service";
import { GetTradeInput } from "./dto/get-trade.input";

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
