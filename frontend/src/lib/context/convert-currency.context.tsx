"use client";

import {createContext, useContext, useState} from "react";
import {Convert} from "easy-currencies";


const ConvertCurrencyContext = createContext<{ // Changed to ConvertCurrencyContext
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    convertCurrency: (balance: number, isFormatted: boolean) => Promise<string>;
    formatCurrency: (value: number) => string;
}>({
    selectedCurrency: "VND",
    setSelectedCurrency: () => {},
    convertCurrency: async () => "",
    formatCurrency: () => "",
});

export const ConvertCurrencyProvider = ({ children, baseCurrency }: { children: React.ReactNode, baseCurrency: string }) => { // Changed to ConvertCurrencyProvider
    const [selectedCurrency, setSelectedCurrency] = useState("VND");

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: selectedCurrency }).format(
            value,
        );
    }

    const convertCurrency = async (balance: number, isFormatted: boolean = true) => {
        return await Convert(balance).from(baseCurrency).to(selectedCurrency).then((value) => {
            if (isFormatted) {
                return formatCurrency(value);
            }

            return value.toString();
        });
    }

    return (
        <ConvertCurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, convertCurrency, formatCurrency }}>
            {children}
        </ConvertCurrencyContext.Provider>
    );
};

export const useConvertCurrencyContext = () => useContext(ConvertCurrencyContext); // Changed to useConvertCurrency