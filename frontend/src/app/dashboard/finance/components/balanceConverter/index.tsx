'use client'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useEffect, useState} from "react";
import {countries, Country} from "country-data";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";

interface IProps {
}

const SUPPORT_COUNTRY = [
    "US",
    "VN",
];

export default function BalanceConverter({}: IProps) {
    const {setSelectedCurrency, selectedCurrency} = useConvertCurrencyContext()
    const [countryList, setCountryList] = useState<Country[]>([]);

    useEffect(() => {
        const countryList = Object.values(countries) as Country[];

        const filteredCountryList = countryList
            // Remove duplicate countries
            .filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.name === value.name
                    ))
            )
            // Remove unsupported countries
            .filter((country) => SUPPORT_COUNTRY.includes(country.alpha2));
        setCountryList(filteredCountryList);

    }, []);

    return (
        <Select onValueChange={setSelectedCurrency} value={selectedCurrency}>
            <SelectTrigger className="w-[7rem]">
                <SelectValue placeholder="Select Currency"/>
            </SelectTrigger>
            <SelectContent>
                {countryList.map((country) => (
                    <SelectItem key={country.alpha2} value={country.currencies?.[0]}>
                                    <span className="flex items-center gap-2">
                                        <span className={`fi fi-${country.alpha2?.toLowerCase()} rounded-full`}/>
                                        {country.currencies}
                                    </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}