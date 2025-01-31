import {ColumnDef} from "@tanstack/react-table";
import {Trade} from "@/app/(dashboard)/finance/investment/types";
import {Button} from "@/components/ui/button";
import {ArrowDown, ArrowUp, MoreHorizontal} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {MoneyTransferAmount} from "@/components/money/money-transfer-amount";
import moment from "moment";
import {EXCHANGES_INFOS} from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DataTableRowActionState} from "@/types";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {MoneyAnimated} from "@/components/money/money-animated";
import {cn} from "@/lib/utils";

interface GetTradeColumnsParams {
    setRowAction: (action: DataTableRowActionState<Trade>) => void;
}

export const getTradeColumns = ({
                                    setRowAction,
                                }: GetTradeColumnsParams): ColumnDef<Trade>[] => [
    {
        accessorKey: "time",
        header: "Time",
        cell: ({row}) => moment(row.getValue("time")).format("MMM D YYYY, h:mm A")
    },
    {
        accessorKey: "exchange",
        header: "Exchange",
        cell: ({row}) => {
            const exchange = EXCHANGES_INFOS.find(e => e.id === row.original.cryptoPortfolio.exchanges);
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={exchange?.logo}/>
                        <AvatarFallback>{exchange?.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{exchange?.name}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "portfolio",
        header: "Portfolio",
        cell: ({row}) => row.original.cryptoPortfolio.name
    },
    {
        accessorKey: "qty",
        header: "Amount",
        cell: ({row}) => (
            <MoneyTransferAmount
                number={row.getValue("qty")}
                displayCurrency={false}
                className="font-mono"
            />
        )
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({row}) => (
            <MoneyAnimated
                number={row.original.price}
                className="font-mono"
            />
        )
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({row}) => (
            <MoneyTransferAmount
                number={row.original.quoteQty}
                displayCurrency={true}
                className="font-mono"
            />
        )
    },
    {
        accessorKey: "commission",
        header: "Commission",
        cell: ({row}) => {
            if (row.original.commissionAsset === "USDT") {
                return (
                    <div className="flex items-center gap-2">
                        <span>{row.original.commission}</span>
                        <Badge variant="outline" className="bg-chart-2">{row.original.commissionAsset}</Badge>
                    </div>
                )
            }
            else if (row.original.commissionAsset === "BNB") {
                return (
                    <div className="flex items-center gap-2">
                        <span>{row.original.commission}</span>
                        <Badge variant="outline" className="bg-chart-3">{row.original.commissionAsset}</Badge>
                    </div>
                )
            }

            return (
                <div className="flex items-center gap-2">
                    <span>{row.original.commission}</span>
                    <Badge variant="outline">{row.original.commissionAsset}</Badge>
                </div>
            )
        }
    },
];