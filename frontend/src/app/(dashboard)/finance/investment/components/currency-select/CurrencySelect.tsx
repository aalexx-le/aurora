'use client'

import React, {useEffect, useState} from "react";
import {countries, Country} from "country-data";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";

interface IProps {
}

const SUPPORT_COUNTRY = [
    "US",
    "VN",
];

export default function CurrencySelect({}: IProps) {
    const {setSelectedCurrency, selectedCurrency} = useConvertCurrencyContext()
    const [countryList, setCountryList] = useState<Country[]>([]);
    const [open, setOpen] = useState(false);
    const selectedCountry = countryList.find((country) => country.currencies?.[0] === selectedCurrency)

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

    const onSelect = (currency: string) => {
        setSelectedCurrency(currency);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between gap-2"
                >
                    {selectedCountry ? (
                        <span className="flex items-center gap-2">
                            <span className={`aspect-square fi fi-${selectedCountry.alpha2?.toLowerCase()}`}/>
                            {selectedCountry.currencies}
                        </span>
                    ) : "Select Currency"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
                <Command>
                    <CommandInput placeholder="Search ..."/>
                    <CommandList>
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                            {countryList.map((country) => (
                                <CommandItem key={country.alpha2} value={country.currencies?.[0]} onSelect={onSelect}>
                                    <span className="flex items-center gap-2">
                                        <span className={`fi fi-${country.alpha2?.toLowerCase()}`}/>
                                        {country.currencies}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}