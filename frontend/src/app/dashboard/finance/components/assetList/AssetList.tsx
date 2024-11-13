import {GetCryptoPortfolioQuery} from "@/gql/graphql";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {useRouter} from "next/navigation";
import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";
import {useEffect, useMemo, useState} from "react";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";

interface IProps {
    portfolio: GetCryptoPortfolioQuery["getCryptoPortfolios"][number];
}

export default function AssetList({ portfolio }: IProps) {
    const assetList = useMemo(() => {
        return [...portfolio?.balances].sort(
            (a, b) =>
                b.balance * b.assetInfo.lastPrice -
                a.balance * a.assetInfo.lastPrice,
        );
    }, [portfolio?.balances]);

    const router = useRouter();
    const { convertCurrency } = useConvertCurrencyContext(); // Get selectedCurrency from context
    const [convertedPrices, setConvertedPrices] = useState<number[]>([]); // State to store converted prices
    const [convertedBalances, setConvertedBalances] = useState<number[]>([]); // State to store converted balances

    const goToAssetPricePage = (assetInfoId: string) => {
        router.push(DASHBOARD_ROUTE.finance.assetPrice.value(assetInfoId));
    };

    useEffect(() => {
        const convertPrices = async () => {
            const promises = assetList.map(async (asset) => {
                return await convertCurrency(asset.assetInfo.lastPrice);
            });
            const prices = await Promise.all(promises);
            setConvertedPrices(prices);
        };

        // Convert balances to selected currency
        const convertBalances = async () => {
            const promises = assetList.map(async (asset) => {
                return await convertCurrency(
                    asset.balance * asset.assetInfo.lastPrice,
                );
            });
            const balances = await Promise.all(promises);
            setConvertedBalances(balances);
        };

        convertPrices();
        convertBalances();
    }, [assetList, convertCurrency]); // Re-run when assetList or selectedCurrency changes

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
                        <TableHead className="p-4 text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="rounded-lg">
                    {assetList.map((asset, i) => (
                        <TableRow
                            key={asset.assetInfo.symbol}
                            className="cursor-pointer"
                            onClick={() =>
                                goToAssetPricePage(asset.assetInfo.id!)
                            }
                        >
                            <TableCell className="p-4">
                                <Avatar>
                                    <AvatarImage src={asset.assetInfo.logo!} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{asset.assetInfo.symbol}</TableCell>
                            <TableCell>
                                {asset.balance.toLocaleString("en-US", {
                                    maximumFractionDigits: 10,
                                })}
                            </TableCell>
                            <TableCell>{convertedPrices[i]}</TableCell>
                            <TableCell className="p-4 text-right">
                                {convertedBalances[i]}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
