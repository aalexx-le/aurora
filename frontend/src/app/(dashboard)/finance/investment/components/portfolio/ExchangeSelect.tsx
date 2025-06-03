import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CexExchanges } from "@/gql/graphql";
import { CRYPTO_EXCHANGES_INFOS } from "@/lib/constants/crypto-exchanges";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface IProps {
    selectedExchanges: string;
    setSelectedExchanges: (exchanges: CexExchanges) => void;
}



export function ExchangeSelect({selectedExchanges, setSelectedExchanges}: IProps) {
    const [open, setOpen] = React.useState(false);

    const onSelect = (exchanges: string) => {
        setSelectedExchanges(exchanges as CexExchanges);
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
                        <div className="flex flex-row gap-2 items-center">
                            <Avatar className="h-4 w-4 rounded-lg">
                                <AvatarImage src={selected.logo} alt={selected.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {selected.name}
                                </AvatarFallback>
                            </Avatar>
                            {selected.name}
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
                        <CommandEmpty>No exchange found.</CommandEmpty>
                        <CommandGroup>
                            {CRYPTO_EXCHANGES_INFOS.map((e) => (
                                <CommandItem
                                    key={e.id}
                                    value={e.id}
                                    onSelect={onSelect}
                                >
                                    <Avatar className="h-4 w-4 rounded-lg">
                                        <AvatarImage src={e.logo} alt={e.name}/>
                                        <AvatarFallback className="rounded-lg">
                                            {e.name}
                                        </AvatarFallback>
                                    </Avatar>
                                    {e.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}