"use client"
import {
    AssetProfitLineChart
} from "@/app/(dashboard)/finance/investment/components/asset-profit-line-chart/AssetProfitLineChart";
import { useHistoricalAssetProfitQuery } from "@/app/(dashboard)/finance/investment/components/asset-table/useHistoricalAssetProfitQuery";
import { MoneyUpDownAnimated } from "@/components/money/money-up-down-animated";
import { ResponsiveContainer } from "recharts";

interface IProps {
    cryptoPortfolioId: string;
    assetInfoId: string;
}

export function MiniAssetProfitLineChart({cryptoPortfolioId, assetInfoId}: IProps) {
    const { profitData } = useHistoricalAssetProfitQuery(cryptoPortfolioId, assetInfoId);

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
            <AssetProfitLineChart profitData={profitData} minimal={true}/>
        </ResponsiveContainer>
    )
}