import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import React, { useEffect, useState } from "react";
import { Exchanges, GetCryptoPortfoliosQuery } from "@/gql/graphql";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { cryptoActions } from "@/state/slices/crypto.slice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CRYPTO_EXCHANGES_INFOS } from "@/lib/constants/crypto-exchanges";
import LogoSvg from "@/components/logo/logo-svg";
import { ExchangeLogo } from "./ExchangeSelect";

interface IProps {
    portfolios: GetCryptoPortfoliosQuery["getCryptoPortfolios"];
}

export default function PortfolioSelect({
    portfolios,
}: IProps) {
    const dispatch = useAppDispatch()
    const { portfolio } = useAppSelector((state) => state.crypto.state);
    const [open, setOpen] = useState(false);

    const onSelectCryptoProfile = (id: string) => {
        const selected = portfolios.find((profile) => profile.id === id);
        if (!selected) return;
        dispatch(cryptoActions.setPortfolio(selected))
        setOpen(false);
    };

    const selectedExchangesInfo = CRYPTO_EXCHANGES_INFOS.find((e) => e.id === portfolio?.exchanges);

    useEffect(() => {
        if (portfolios.length > 0) {
            dispatch(cryptoActions.setPortfolio(portfolios[0]))
        }
    }, [portfolios, dispatch]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-min min-w-[10rem]"
                    aria-expanded={open}
                >
                    {portfolio ?
                        <div className="flex flex-row gap-2 items-center">
                            {selectedExchangesInfo && (
                                <ExchangeLogo id={selectedExchangesInfo.id} logo={selectedExchangesInfo.logo} name={selectedExchangesInfo.name} className="size-4" />
                            )}
                            {portfolio.name}
                        </div>
                        :
                        <p className="text-muted-foreground">Select exchanges...</p>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search portfolio..." />
                    <CommandList>
                        <CommandEmpty>No portfolio found.</CommandEmpty>
                        <CommandGroup>
                            {portfolios.map((p) => {
                                const exchangesInfo = CRYPTO_EXCHANGES_INFOS.find((e) => e.id === p.exchanges);
                                return (
                                    <CommandItem
                                        key={p.id}
                                        value={p.id}
                                        onSelect={onSelectCryptoProfile}
                                    >
                                        {exchangesInfo && <ExchangeLogo id={exchangesInfo.id} logo={exchangesInfo.logo} name={exchangesInfo.name} className="size-4" />}
                                        {p.name}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
