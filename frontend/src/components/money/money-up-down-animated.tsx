import React, {useEffect, useLayoutEffect, useState} from "react";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {Triangle} from "lucide-react";
import {MoneyAnimated} from "@/components/money/money-animated";
import {PlusIcon} from "lucide-react";

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
    number: number;
    isPercent?: boolean;
}

export function MoneyUpDownAnimated({number, isPercent = false, className}: IProps) {
    const [animate, setAnimate] = useState(false);
    const isUpTrend = number > 0;

    useLayoutEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 1500);
        return () => clearTimeout(timer);
    }, [number]);

    if (number == 0) {
        return <MoneyAnimated number={number} isPercent={isPercent} className={className} />;
    }

    return (
        <span
            className={cn(
                "font-mono p-1 rounded font-bold transition duration-2000 ease-in-out flex flex-row items-center gap-1", className,
                isUpTrend ? "text-chart-2" : "text-chart-5",
                animate && (isUpTrend ? "animate-bg-fade-up" : "animate-bg-fade-down"))}>
            <p className="flex flex-row items-center">
                {isPercent && "("}
                <Triangle
                    className={cn("size-2", {
                        "fill-chart-2 stroke-chart-2": isUpTrend,
                        "fill-chart-5 stroke-chart-5 rotate-180": !isUpTrend,
                    })}
                />
                {/*<PlusIcon className="size-2"/>*/}
            </p>
            {isPercent ? Math.abs(number).toFixed(2) + "%" + ")" : <MoneyWithCurrency amount={Math.abs(number)}/>}
        </span>
    );
}