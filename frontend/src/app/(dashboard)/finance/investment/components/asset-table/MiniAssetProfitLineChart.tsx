"use client"
import {useQuery} from "@apollo/client";
import {GetHistoricalAssetProfitsQuery, GetHistoricalAssetProfitsQueryVariables} from "@/gql/graphql";
import {GET_HISTORICAL_ASSET_PROFIT} from "@/api/script/crypto/crypto";
import {
    AssetProfitLineChart
} from "@/app/(dashboard)/finance/investment/components/asset-profit-line-chart/AssetProfitLineChart";
import {ResponsiveContainer} from "recharts";
import {MoneyUpDownAnimated} from "@/components/money/money-up-down-animated";

interface IProps {
    cryptoPortfolioId: string;
    assetInfoId: string;
}

export function MiniAssetProfitLineChart({cryptoPortfolioId, assetInfoId}: IProps) {
    const {data, loading} = useQuery<GetHistoricalAssetProfitsQuery, GetHistoricalAssetProfitsQueryVariables>(
        GET_HISTORICAL_ASSET_PROFIT,
        {
            variables: {
                data: {
                    cryptoPortfolioId,
                    assetInfoId,
                    timeFrame: "1 day"
                },
                pagination: {
                    take: 500
                },
            },
        }
    );

    const profitData = data?.getHistoricalAssetProfits ?? [];

    if (profitData.length === 1) {
        return (
            <div className="flex justify-center">
                <div className="">
                    <MoneyUpDownAnimated number={profitData[0].estimatedProfit}/>
                </div>
            </div>
        )
    }

    return (
        <ResponsiveContainer>
            <AssetProfitLineChart profitData={data?.getHistoricalAssetProfits ?? []} minimal={true}/>
        </ResponsiveContainer>
    )

}