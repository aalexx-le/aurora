import {Check, ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Dispatch, SetStateAction, useState} from "react";
import {GetCryptoPortfolioQuery} from "@/gql/graphql";

interface IProps {
    profiles: GetCryptoPortfolioQuery["getCryptoPortfolios"];
    setSelectedCryptoProfile: Dispatch<
        SetStateAction<GetCryptoPortfolioQuery["getCryptoPortfolios"][number]>
    >;
    selectedCryptoProfile: GetCryptoPortfolioQuery["getCryptoPortfolios"][number];
}

export default function ProfileSelector({
    profiles,
    selectedCryptoProfile,
    setSelectedCryptoProfile,
}: IProps) {
    const [open, setOpen] = useState(false);

    const onSelectCryptoProfile = (id: string) => {
        const selected = profiles.find((profile) => profile.id === id);
        if (!selected) return;
        setSelectedCryptoProfile(selected);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selectedCryptoProfile
                        ? profiles.find(
                              (p) =>
                                  p.id ===
                                  selectedCryptoProfile.id,
                          )?.exchanges
                        : "Select profile..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search portfolio..." />
                    <CommandList>
                        <CommandEmpty>No profile found.</CommandEmpty>
                        <CommandGroup>
                            {profiles.map((profile) => (
                                <CommandItem
                                    key={profile.id}
                                    value={profile.exchanges}
                                    onSelect={onSelectCryptoProfile}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCryptoProfile.id ===
                                                profile.id
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {profile.exchanges}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
