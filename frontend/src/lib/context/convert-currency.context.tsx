"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {Convert} from "easy-currencies";
import {formatCurrency} from "@/lib/utils/currency/format-currency";


const ConvertCurrencyContext = createContext<{ // Changed to ConvertCurrencyContext
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    convertCurrency: (balance: number, isFormatted: boolean) => Promise<string>;
    formatCurrency: (value: number) => string;
}>({
    selectedCurrency: "VND",
    setSelectedCurrency: () => {
    },
    convertCurrency: async () => "",
    formatCurrency: () => "",
});

export const ConvertCurrencyProvider = ({children, baseCurrency, toCurrency}: {
    children: React.ReactNode,
    baseCurrency: string,
    toCurrency?: string
}) => { // Changed to ConvertCurrencyProvider
    const [selectedCurrency, setSelectedCurrency] = useState(toCurrency || "VND");
    const [converter, setConverter] = useState<ReturnType<typeof Convert> | null>(null);

    useEffect(() => {
        Convert().from(baseCurrency).fetch().then((converter) => {
            setConverter(converter);
        });
    }, [baseCurrency]);

    const _formatCurrency = (value: number) => {
        return formatCurrency(value, selectedCurrency);
    }

    const convertCurrency = async (balance: number, isFormatted: boolean = true) => {
        if (!converter) {
            return "";
        }
        return await converter.amount(balance).to(selectedCurrency).then((value) => {
            if (isFormatted) {
                return _formatCurrency(value);
            }

            return value.toString();
        });
    }

    return (
        <ConvertCurrencyContext.Provider
            value={{selectedCurrency, setSelectedCurrency, convertCurrency, formatCurrency: _formatCurrency}}>
            {children}
        </ConvertCurrencyContext.Provider>
    );
};

export const useConvertCurrencyContext = () => useContext(ConvertCurrencyContext); // Changed to useConvertCurrency