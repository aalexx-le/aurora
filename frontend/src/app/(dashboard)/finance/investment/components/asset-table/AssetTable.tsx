import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useRouter} from "next/navigation";
import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";
import {useMemo} from "react";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import HistoricalBalanceChart
    from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/HistoricalBalanceChart";
import {CryptoPortfolio} from "@/app/(dashboard)/finance/investment/types";
import {
    MiniAssetProfitLineChart
} from "@/app/(dashboard)/finance/investment/components/asset-table/MiniAssetProfitLineChart";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {formatCurrency} from "@/lib/utils/currency/format-currency";

interface IProps {
    portfolios: CryptoPortfolio[];
}

export default function AssetTable({portfolios}: IProps) {
    const assetList = useMemo(() => {
        const balances = portfolios
            .map((portfolio) =>
                portfolio.balances.map(b => ({
                    ...b,
                    portfolioId: portfolio.id
                })
            )).flat();

        return balances.sort(
            (a, b) =>
                b.balance * b.assetInfo.lastPrice -
                a.balance * a.assetInfo.lastPrice,
        );
    }, [portfolios]);

    const router = useRouter();

    const goToAssetProfitPage = (portfolioId: string, assetInfoId: string) => {
        router.push(DASHBOARD_ROUTE.finance.investment.assetProfit.value(portfolioId, assetInfoId))
    }

    if (!assetList || !assetList?.length) {
        return <></>;
    }

    return (
        <div className="flex-1 h-min rounded-lg border shadow-sm overflow-hidden">
            <Table className="p-4">
                {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-4">Coin</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="p-4">Historical Profit</TableHead>
                        <TableHead className="p-4 text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="rounded-lg font-mono">
                    {assetList.map((asset, i) => (
                        <TableRow
                            key={asset.assetInfo.symbol + i}
                            className="cursor-pointer"
                            onClick={() =>
                                goToAssetProfitPage(asset.portfolioId, asset.assetInfo.id)
                            }
                        >
                            <TableCell
                                className="p-4 cursor-pointer"
                            >
                                <Avatar>
                                    <AvatarImage src={asset.assetInfo.logo}/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{asset.assetInfo.symbol}</TableCell>
                            <TableCell>
                                {asset.balance.toLocaleString("en-US", {
                                    maximumFractionDigits: 10,
                                })}
                            </TableCell>
                            <TableCell>
                                {formatCurrency(asset.assetInfo.lastPrice, "USD", {maximumFractionDigits: 10})}
                            </TableCell>
                            <TableCell className="max-w-[8rem]">
                                <MiniAssetProfitLineChart cryptoPortfolioId={asset.portfolioId}
                                                          assetInfoId={asset.assetInfo.id}/>
                            </TableCell>
                            <TableCell className="p-4 text-right">
                                <MoneyWithCurrency amount={asset.assetInfo.lastPrice * asset.balance}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
