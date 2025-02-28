import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {AutoBankManagerThirdParty} from "@/gql/graphql";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

interface IProps {
    selectedThirdParty: string;
    setSelectedThirdParty: (thirdParty: AutoBankManagerThirdParty) => void;
}

export const AUTO_BANK_THIRD_PARTY_INFOS = [
    {
        id: AutoBankManagerThirdParty.Casso,
        name: "CASSO",
        logo: "https://casso.vn/wp-content/uploads/2023/06/casso-mascot-logo.png"
    }
] as const;

export function ThirdPartySelect({ selectedThirdParty, setSelectedThirdParty }: IProps) {
    const [open, setOpen] = React.useState(false);

    const onSelect = (thirdParty: string) => {
        setSelectedThirdParty(thirdParty as AutoBankManagerThirdParty);
        setOpen(false);
    }

    const selected = AUTO_BANK_THIRD_PARTY_INFOS.find((t) => t.id === selectedThirdParty);

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
                                <AvatarImage src={selected.logo} alt={selected.name} />
                                <AvatarFallback className="rounded-lg">
                                    {selected.name}
                                </AvatarFallback>
                            </Avatar>
                            {selected.name}
                        </div>
                        :
                        <p className="text-muted-foreground">Select third party...</p>
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search third party..." />
                    <CommandList>
                        <CommandEmpty>No third party found.</CommandEmpty>
                        <CommandGroup>
                            {AUTO_BANK_THIRD_PARTY_INFOS.map((t) => (
                                <CommandItem
                                    key={t.id}
                                    value={t.id}
                                    onSelect={onSelect}
                                >
                                    <Avatar className="h-4 w-4 rounded-lg">
                                        <AvatarImage src={t.logo} alt={t.name} />
                                        <AvatarFallback className="rounded-lg">
                                            {t.name}
                                        </AvatarFallback>
                                    </Avatar>
                                    {t.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 