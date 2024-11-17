import MoneyWithCurrency from "@/components/ui/money-with-currency";
import React from "react";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";

interface IProps {
    totalBalance: number;
}

export default function FinanceSummary({totalBalance}: IProps) {
    const formattedBalance = useConvertCurrencyContext().formatCurrency(totalBalance);

    return (
        <div className="flex gap-2">
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                    Total Balance
                </h2>
                <div>
                    <p className="text-3xl font-bold flex items-center gap-4">
                        <MoneyWithCurrency amount={totalBalance} />
                    </p>
                </div>
            </div>
            <div className="flex flex-1">
                {/*<CategoryPieChart/>*/}
            </div>
        </div>
    )
}