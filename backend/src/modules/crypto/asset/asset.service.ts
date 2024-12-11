import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { DataInterval } from "./enum/data-interval";
import { GetAssetPriceInput } from "./dto/get-asset-price.input";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { PaginationInput } from "../../../shared/pagination/pagination.args";
import { AssetPrice } from "src/entities/asset-price";
import { getTimeframeMaterializedViewName } from "../../../shared/utils/get-timeframe-materialized-view-name";

@Injectable()
export class CryptoAssetService {
    constructor(private prisma: PrismaService) {}

    async findManyPrices(
        getAssetPriceArgs: GetAssetPriceInput,
        pagination: PaginationInput,
    ) {
        const { assetInfoId, timeFrame } = getAssetPriceArgs;
        const { take, after } = pagination;

        let assetPrices: AssetPrice[] = [];
        const args: Prisma.AssetPriceFindManyArgs<DefaultArgs> = {
            where: {
                assetInfoId,
            },
            take: -1 * take,
            orderBy: {
                open_time: "asc",
            },
        };
        if (after) {
            args.skip = 1;
            args.cursor = {
                assetInfoId_open_time: {
                    assetInfoId,
                    open_time: after,
                },
            };
        }

        if (timeFrame === DataInterval.MINUTE_1) {
            assetPrices = await this.prisma.assetPrice.findMany(args);
        } else {
            assetPrices =
                this.prisma[
                    getTimeframeMaterializedViewName(timeFrame, "asset_price")
                ].findMany(args);
        }

        return assetPrices;
    }

    async findOneInfo(id: string) {
        return this.prisma.assetInfo.findUnique({ where: { id } });
    }
}
