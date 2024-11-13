import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { AssetPriceInterval } from "./enum/asset-price-interval";
import { GetAssetPriceInput } from "./dto/get-asset-price.input";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";
import { PaginationInput } from "../../../shared/pagination/pagination.args";

@Injectable()
export class CryptoAssetService {
    private readonly logger = new Logger(CryptoAssetService.name);
    constructor(private prisma: PrismaService) {}

    async findManyPrices(
        getAssetPriceArgs: GetAssetPriceInput,
        pagination: PaginationInput,
    ) {
        const { assetInfoId, timeFrame } = getAssetPriceArgs;
        const { take, after } = pagination;

        this.logger.log(
            `Finding asset prices for asset ${assetInfoId} with interval ${timeFrame}`,
        );
        let assetPrices = [];
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

        if (timeFrame === AssetPriceInterval.MINUTE_1) {
            assetPrices = await this.prisma.assetPrice.findMany(args);
            console.log({ assetPrices });
        } else {
            assetPrices =
                this.prisma[
                    this.getAssetPriceMaterializedViewName(timeFrame)
                ].findMany(args);
        }

        return assetPrices;
    }

    async findOneInfo(id: string) {
        return this.prisma.assetInfo.findUnique({ where: { id } });
    }

    private getAssetPriceMaterializedViewName(timeFrame?: string): string {
        const [time, unit] = timeFrame.split(" ");
        let formattedTimeFrame = time + unit.charAt(0);

        if (unit === "month") {
            formattedTimeFrame = time + "M";
        }
        console.log("formattedTimeFrame", formattedTimeFrame);
        return `asset_price_${formattedTimeFrame}`;
    }
}
