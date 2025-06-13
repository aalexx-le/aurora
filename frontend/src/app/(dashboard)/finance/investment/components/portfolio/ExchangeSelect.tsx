import LogoSvg from "@/components/logo/logo-svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Exchanges } from "@/gql/graphql";
import { CRYPTO_EXCHANGES_INFOS } from "@/lib/constants/crypto-exchanges";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface IProps {
    selectedExchanges: string;
    setSelectedExchanges: (exchanges: Exchanges) => void;
}

const CRYPTO_EXCHANGES_INFOS_WITHOUT_ALL = CRYPTO_EXCHANGES_INFOS.filter((e) => e.id !== Exchanges.All);

export function ExchangeLogo({id, logo, name, className}: {id: Exchanges, logo: string, name: string, className?: string}) {
    return id !== Exchanges.All ? <Avatar className="h-4 w-4 rounded-lg">
        <AvatarImage src={logo} alt={name}/>
        <AvatarFallback className="rounded-lg">
            {name}
        </AvatarFallback>
    </Avatar> : <LogoSvg className={cn("size-4", className)} />;
}


export function ExchangeSelect({selectedExchanges, setSelectedExchanges}: IProps) {
    const [open, setOpen] = React.useState(false);

    const onSelect = (exchanges: string) => {
        setSelectedExchanges(exchanges as Exchanges);
        setOpen(false);
    }

    const selected = CRYPTO_EXCHANGES_INFOS.find((e) => e.id === selectedExchanges);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between w-full"
                    aria-expanded={open}
                >
                    {selected ?
                        <ExchangeLogo id={selected.id} logo={selected.logo} name={selected.name} className="size-4" />
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
                        <CommandEmpty>No exchange found.</CommandEmpty>
                        <CommandGroup>
                            {CRYPTO_EXCHANGES_INFOS_WITHOUT_ALL.map((e) => (
                                <CommandItem
                                    key={e.id}
                                    value={e.id}
                                    onSelect={onSelect}
                                >
                                    <ExchangeLogo id={e.id} logo={e.logo} name={e.name} className="size-4" />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}