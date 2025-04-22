import { GET_BANK_ACCOUNTS } from "@/api/scripts/bank/account";
import { BankAccount } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import { MoneyAnimated } from "@/components/money/money-animated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GetBankAccountsQuery, GetBankAccountsQueryVariables } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { ChevronsUpDown } from "lucide-react";
import moment from "moment/moment";
import { useState } from "react";
import { BANK_INFOS } from "../bank-select/BankSelect";

interface BankAccountSelectProps {
    selectedAccountId: string;
    setSelectedAccountId: (accountId: string) => void;
}

export default function BankAccountSelect({
    selectedAccountId,
    setSelectedAccountId
}: BankAccountSelectProps) {
    const [open, setOpen] = useState(false);
    const { data, refetch } = useQuery<GetBankAccountsQuery, GetBankAccountsQueryVariables>(GET_BANK_ACCOUNTS);

    const accounts = data?.getBankAccounts || [];
    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);

    const onSelect = (id: string) => {
        setSelectedAccountId(id);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between gap-2"
                >
                    {selectedAccount ? (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="https://www.vietinbank.vn/web/global/vtb-logo.png"/>
                                    <AvatarFallback>{selectedAccount.name[0]}</AvatarFallback>
                                </Avatar>

                                <span className="text-xs text-muted-foreground">
                                    {selectedAccount.accountNumber}
                                </span>
                            </div>

                            <MoneyAnimated
                                number={selectedAccount.balance}
                                className="text-sm font-medium"
                            />
                        </div>
                    ) : (
                        "Select bank account"
                    )}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search bank account..." />
                    <ScrollArea>
                        <CommandList>
                            <CommandEmpty>No bank account found.</CommandEmpty>
                            {accounts.map((account) => (
                                <CommandItem
                                    key={account.id}
                                    value={account.id}
                                    onSelect={() => onSelect(account.id)}
                                >
                                    <BankAccountItem account={account} />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function BankAccountItem({ account }: { account: BankAccount }) {
    const bankInfo = BANK_INFOS.find(b => b.name === account.name);
    
    return (
        <div className="flex items-center gap-2 w-full">
            <Avatar className="w-6 h-6">
                <AvatarImage src={bankInfo?.logo} />
                <AvatarFallback>{account.name[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{account.name}</span>
                    <MoneyAnimated
                        number={account.balance}
                        className="text-sm font-medium"
                    />
                </div>
                <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                        {account.accountNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Updated {moment(account.updatedAt).fromNow()}
                    </span>
                </div>
            </div>
        </div>
    );
}