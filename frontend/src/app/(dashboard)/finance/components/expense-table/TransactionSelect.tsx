import {ChevronsUpDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import React, {useState} from "react";
import {GetBankTransactionsQuery, QueryGetBankTransactionsArgs,} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {useAppSelector} from "@/state/hooks";
import {GET_TRANSACTIONS} from "@/api/bank";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import moment from "moment/moment";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {BankTransaction} from "@/app/(dashboard)/finance/components/transaction-table/types";

interface IProps {
    selectedTransactionId: string;
    setSelectedTransactionId: (transactionId: string) => void;
}

export default function TransactionSelect({
    selectedTransactionId,
    setSelectedTransactionId,
}: IProps) {
    const { user } = useAppSelector((state) => state.auth.state);
    const [open, setOpen] = useState(false);
    const { data } = useQuery<
        GetBankTransactionsQuery,
        QueryGetBankTransactionsArgs
    >(GET_TRANSACTIONS, {
        variables: { userId: Number(user?.id ?? 0) },
    });
    const transactions = data?.getBankTransactions ?? [];
    const selectedTransaction = transactions.find(
        (txn) => txn.id === selectedTransactionId,
    );
    const onSelect = (id: string) => {
        setSelectedTransactionId(id);
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
                    {selectedTransaction ? (
                        <TransactionItem
                            transaction={selectedTransaction}
                            avatarClassname="w-4 h-4"
                            displayDescription={false}
                        />
                    ) : (
                        "Select transaction"
                    )}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    <CommandInput placeholder="Search transaction" />
                    <ScrollArea>
                        <CommandList>
                            <CommandEmpty>No transaction found.</CommandEmpty>
                            {transactions.map((txn) => (
                                <CommandItem
                                    key={txn.id}
                                    value={txn.id}
                                    onSelect={onSelect}
                                >
                                    <TransactionItem transaction={txn} />
                                </CommandItem>
                            ))}
                        </CommandList>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface ITransactionItemProps {
    transaction: BankTransaction;
    avatarClassname?: React.ComponentProps<"div">["className"];
    displayDescription?: boolean;
}

const TransactionItem = ({
    transaction,
    avatarClassname,
    displayDescription = true,
}: ITransactionItemProps) => {
    return (
        <div
            className={cn(
                "flex items-center gap-2",
                transaction.spentAmount === 0 && "opacity-50",
            )}
        >
            <Avatar className={cn("w-6 h-6", avatarClassname)}>
                <AvatarImage src="https://sanfactory.vn/wp-content/uploads/2023/10/logo-vietinbank-3.png" />
                <AvatarFallback>B</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-sm font-bold",
                            transaction.amount > 0
                                ? "text-chart-2"
                                : "text-chart-5",
                        )}
                    >
                        <MoneyWithCurrency amount={transaction.spentAmount} />
                        <span className="font-bold">&nbsp;/&nbsp;</span>
                        <MoneyWithCurrency amount={transaction.amount} />
                    </span>

                    <div className="flex flex-col justify-start">
                        <span className="text-xs text-muted-foreground">
                            {moment(transaction.createdAt).format(
                                "DD/MM/YYYY, H:mm a",
                            )}
                        </span>
                    </div>
                </div>
                {displayDescription && (
                    <p className="truncate text-sm text-muted-foreground">
                        {transaction.description}
                    </p>
                )}
            </div>
        </div>
    );
};
