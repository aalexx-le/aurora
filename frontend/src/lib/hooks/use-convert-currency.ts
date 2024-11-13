import { useEffect, useState } from "react";
import { useConvertCurrencyContext } from "@/lib/context/convert-currency.context";

export const useConvertCurrency = (
    value: number,
    isFormatted: boolean = true,
) => {
    const [convertedValue, setConvertedValue] = useState<string>(
        value.toString(),
    );
    const { convertCurrency } = useConvertCurrencyContext();

    useEffect(() => {
        convertCurrency(value, isFormatted).then((v) => {
            setConvertedValue(v);
        });
    }, [value, isFormatted, convertCurrency]);

    return convertedValue;
};
