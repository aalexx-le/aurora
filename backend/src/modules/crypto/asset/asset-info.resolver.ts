import { Args, Query, Resolver } from "@nestjs/graphql";
import { CryptoAssetService } from "./asset.service";
import { AssetInfo } from "../../../entities/asset-info";
import { GetAssetInfoArgs } from "./dto/get-asset-info.input";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";

@UseGuards(JwtGuard)
@Resolver(() => AssetInfo)
export class CryptoAssetInfoResolver {
    constructor(private readonly cryptoAssetService: CryptoAssetService) {}

    @Query(() => AssetInfo, { name: "getAssetInfo" })
    async get(@Args() args: GetAssetInfoArgs) {
        return this.cryptoAssetService.findOneInfo(args.data.id);
    }
}
