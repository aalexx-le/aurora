import {ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import React, {useEffect, useState} from "react";
import {GetCryptoPortfoliosQuery} from "@/gql/graphql";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {cryptoActions} from "@/state/slices/crypto.slice";
import {EXCHANGES_INFOS} from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface IProps {
    portfolios: GetCryptoPortfoliosQuery["getCryptoPortfolios"];
}

export default function PortfolioSelect({
                                            portfolios,
                                        }: IProps) {
    const dispatch = useAppDispatch()
    const {portfolio} = useAppSelector((state) => state.crypto.state);
    const [open, setOpen] = useState(false);

    const onSelectCryptoProfile = (id: string) => {
        const selected = portfolios.find((profile) => profile.id === id);
        if (!selected) return;
        dispatch(cryptoActions.setPortfolio(selected))
        setOpen(false);
    };

    const selectedExchangesInfo = EXCHANGES_INFOS.find((e) => e.id === portfolio?.exchanges);

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
                            {/*<Avatar className="h-4 w-4 rounded-lg">*/}
                            {/*    <AvatarImage src={selected.logo} alt={selected.name}/>*/}
                            {/*    <AvatarFallback className="rounded-lg">*/}
                            {/*        {selected.name}*/}
                            {/*    </AvatarFallback>*/}
                            {/*</Avatar>*/}
                            {selectedExchangesInfo && <Avatar className="h-4 w-4 rounded-lg">
                                <AvatarImage src={selectedExchangesInfo.logo} alt={selectedExchangesInfo.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {selectedExchangesInfo.name}
                                </AvatarFallback>
                            </Avatar>}
                            {portfolio.name}
                        </div>
                        :
                        <p className="text-muted-foreground">Select exchanges...</p>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search portfolio..."/>
                    <CommandList>
                        <CommandEmpty>No portfolio found.</CommandEmpty>
                        <CommandGroup>
                            {portfolios.map((p) => {
                                const exchangesInfo = EXCHANGES_INFOS.find((e) => e.id === p.exchanges);
                                return (
                                    <CommandItem
                                        key={p.id}
                                        value={p.id}
                                        onSelect={onSelectCryptoProfile}
                                    >
                                        {exchangesInfo && <Avatar className="h-4 w-4 rounded-lg">
                                            <AvatarImage src={exchangesInfo.logo} alt={exchangesInfo.name}/>
                                            <AvatarFallback className="rounded-lg">
                                                {exchangesInfo.name}
                                            </AvatarFallback>
                                        </Avatar>}
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
