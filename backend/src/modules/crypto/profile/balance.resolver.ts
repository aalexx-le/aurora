import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { AssetBalance } from "src/entities/asset-balance";
import { CryptoPortfolioService } from "./portfolio.service";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { AssetInfoOutput } from "./dto/get-asset-info.output";
import { CryptoPortfolio } from "../../../entities/crypto-portfolio";
import { Trade } from "../../../entities/trade";

@UseGuards(JwtGuard)
@Resolver(() => AssetBalance)
export class CryptoBalanceResolver {
    constructor(
        private readonly cryptoPortfolioService: CryptoPortfolioService,
    ) {}
    @ResolveField("assetInfo", () => AssetInfoOutput)
    getBalances(@Parent() assetBalance: AssetBalance) {
        const { assetInfoId } = assetBalance;
        return this.cryptoPortfolioService.findAssetInfo(assetInfoId);
    }

    @ResolveField("cryptoPortfolio", () => CryptoPortfolio)
    async getCryptoPortfolio(@Parent() assetBalance: AssetBalance) {
        const { cryptoPortfolioId } = assetBalance;
        return this.cryptoPortfolioService.findPortfolio(cryptoPortfolioId);
    }
}
