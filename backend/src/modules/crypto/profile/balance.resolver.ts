import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { AssetBalance } from "../../../entities/asset-balance";
import { CryptoPortfolioService } from "./portfolio.service";
import { AssetInfoOutput } from "./dto/get-asset-info.output";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";

@UseGuards(JwtGuard)
@Resolver(() => AssetBalance)
export class CryptoBalanceResolver {
    constructor(
        private readonly cryptoProfileService: CryptoPortfolioService,
    ) {}
    @ResolveField("assetInfo", () => AssetInfoOutput)
    getBalances(
        @Parent() assetBalance: AssetBalance,
    ): Promise<AssetInfoOutput> {
        const { assetInfoId } = assetBalance;
        return this.cryptoProfileService.findAssetInfo(assetInfoId);
    }
}
