import React, {useLayoutEffect, useState} from "react";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/money/money-with-currency";

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
    number: number;
    isPercent?: boolean;
}

export function MoneyAnimated({number, isPercent = false, className}: IProps) {
    const [animate, setAnimate] = useState(false);

    useLayoutEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 1500);
        return () => clearTimeout(timer);
    }, [number]);

    return (
        <span
            className={cn(
                "p-0.5 rounded font-bold transition duration-2000 ease-in-out", className,
                animate && "animate-bg-fade")}>
            {isPercent && "("}
            {isPercent ? number.toFixed(2) + "%" + ")" : <MoneyWithCurrency amount={number}/>}
        </span>
    );
}