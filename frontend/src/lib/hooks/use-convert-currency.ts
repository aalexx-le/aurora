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

export const useConvertCurrencies = <T>(
    values: T[],
    key: keyof T,
    isFormatted: boolean = false,
) => {
    const [convertedValues, setConvertedValues] = useState<T[]>([]);
    const { convertCurrency } = useConvertCurrencyContext();

    useEffect(() => {
        const convert = async () => {
            const converted = await Promise.all(
                values.map((v) =>
                    convertCurrency(v[key] as number, isFormatted),
                ),
            );
            setConvertedValues(
                values.map((v, i) => ({ ...v, [key]: converted[i] })),
            );
        };
        convert();
    }, [values, key, isFormatted, convertCurrency]);

    return convertedValues;
};
