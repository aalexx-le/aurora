import React, {useEffect, useLayoutEffect, useState} from "react";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {Triangle} from "lucide-react";
import {MoneyAnimated} from "@/components/money/money-animated";
import {PlusIcon} from "lucide-react";

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
    number: number;
    displayCurrency?: boolean;
}

export function MoneyTransferAmount({number, displayCurrency = true, className}: IProps) {
    return (
        <span className={cn("font-bold", className, number > 0 ? "text-chart-2" : "text-chart-5")}>
            {number > 0 ? "+" : ""}{displayCurrency ? <MoneyWithCurrency amount={number}/> : number}
        </span>
    )
}