import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {CexExchanges} from "@/gql/graphql";

interface IProps {
    selectedExchanges: string;
    setSelectedExchanges: (exchanges: CexExchanges) => void;
}



export const EXCHANGES_INFOS = [
    {
        id: CexExchanges.Binance,
        name: "Binance",
        logo: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png"
    },
    {
        id: CexExchanges.Mexc,
        name: "MEXC",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/mexc-logo.png"
    },
    {
        id: CexExchanges.Okx,
        name: "OKX",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo.jpg"
    },
    {
        id: CexExchanges.All,
        name: "All",
        logo: "https://media.istockphoto.com/id/1209243460/vector/vector-icon-hi-tech-circle-company-design-business-symbol-concept-minimal-line-style.jpg?s=612x612&w=0&k=20&c=ylQwTj0xMI20AShoJb898N5NH0QRGYzdNXUZFdXNomE="
    },
]

export function ExchangeSelect({selectedExchanges, setSelectedExchanges}: IProps) {
    const [open, setOpen] = React.useState(false);

    const onSelect = (exchanges: string) => {
        setSelectedExchanges(exchanges as CexExchanges);
        setOpen(false);
    }

    const selected = EXCHANGES_INFOS.find((e) => e.id === selectedExchanges);

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
                            {EXCHANGES_INFOS.map((e) => (
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