import {ChevronsUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {bankActions} from "@/state/slices/bank.slice";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {AUTO_BANK_THIRD_PARTY_INFOS} from "@/app/(dashboard)/finance/components/third-party-select/ThirdPartySelect";
import {useBankManagersQuery} from "@/app/(dashboard)/finance/components/bank-manager-select/useBankManagersQuery";
import {cn} from "@/lib/utils";
import {AutoBankManagerThirdParty} from "@/gql/graphql";

interface IProps {
    selectedBankManagerId: string;
    setSelectedBankManager: (bankManager: BankManager) => void;
    buttonClassName?: string;
}

interface BankManagerItemProps {
    bankManager: BankManager;
}

const findBankManagerInfo = (bankManager: BankManager) => {
    if (bankManager.autoBankManager) return AUTO_BANK_THIRD_PARTY_INFOS.find((t) => t.id === bankManager?.autoBankManager?.thirdParty);

    return {
        id: "",
        name: "Manual",
        logo: "https://static.vecteezy.com/system/resources/previews/000/287/488/original/bank-vector-icon.jpg"
    }
}

function BankManagerItem({bankManager}: BankManagerItemProps) {
    const bankManagerInfo = findBankManagerInfo(bankManager);

    return (
        <div className="flex flex-row gap-2 items-center">
            {bankManagerInfo && (
                <Avatar className="h-4 w-4 rounded-lg">
                    <AvatarImage src={bankManagerInfo.logo} alt={bankManagerInfo.name}/>
                    <AvatarFallback className="rounded-lg">
                        {bankManager.name[0]}
                    </AvatarFallback>
                </Avatar>
            )}
            {bankManager.name}
        </div>
    );
}

export default function BankManagerSelect({selectedBankManagerId, setSelectedBankManager, buttonClassName}: IProps) {
    const {bankManagers} = useBankManagersQuery()

    // const {bankManager} = useAppSelector((state) => state.bank);
    const bankManager = bankManagers.find((manager) => manager.id === selectedBankManagerId);
    const [open, setOpen] = React.useState(false);

    const onSelectBankManager = (id: string) => {
        const selected = bankManagers.find((manager) => manager.id === id);
        if (!selected) return;

        setSelectedBankManager(selected);

        setOpen(false);
    };

    useEffect(() => {
        if (bankManagers.length > 0) {
            setSelectedBankManager(bankManagers[0]);
        }
    }, [bankManagers, setSelectedBankManager]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn("justify-between w-min min-w-[10rem]", buttonClassName)}
                    aria-expanded={open}
                >
                    {bankManager ? (
                        <BankManagerItem
                            bankManager={bankManager}
                        />
                    ) : (
                        <p className="text-muted-foreground">Select bank manager...</p>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search bank manager..."/>
                    <CommandList>
                        <CommandEmpty>No bank manager found.</CommandEmpty>
                        <CommandGroup>
                            {bankManagers.map((manager) =>
                                <CommandItem
                                    key={manager.id}
                                    value={manager.id}
                                    onSelect={onSelectBankManager}
                                >
                                    <BankManagerItem
                                        bankManager={manager}
                                    />
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
} 