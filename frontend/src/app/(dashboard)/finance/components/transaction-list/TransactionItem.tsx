import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {Tooltip, TooltipContent, TooltipTrigger,} from "@/components/ui/tooltip";
import moment from "moment";
import React from "react";
import {BankTransaction} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";

interface IProps {
    transaction: BankTransaction;
}

export default function TransactionItem({ transaction }: IProps) {
    return (
        <div className="flex items-center gap-4">
            <Avatar>
                <AvatarImage src="https://sanfactory.vn/wp-content/uploads/2023/10/logo-vietinbank-3.png" />
                <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <div className="flex gap-6 items-center">
                <Tooltip delayDuration={0}>
                    <TooltipTrigger className="text-start">
                        <div
                            className={cn(
                                "flex flex-col",
                                transaction.spentAmount === 0 &&
                                    "opacity-50",
                            )}
                        >
                            <span
                                className={cn(
                                    "font-bold",
                                    transaction.amount > 0
                                        ? "text-chart-2"
                                        : "text-chart-5",
                                )}
                            >
                                {transaction.amount > 0 ? "+" : ""}
                                <MoneyWithCurrency
                                    amount={transaction.amount}
                                />
                            </span>

                            <div className="flex flex-col justify-start">
                                <span className="text-xs text-muted-foreground">
                                    {moment(transaction.createdAt).format(
                                        "MMMM Do YYYY, H:mm a",
                                    )}
                                </span>
                            </div>
                            <p
                                className={cn(
                                    "text-xs font-bold",
                                    transaction.amount > 0
                                        ? "text-chart-2"
                                        : "text-chart-5",
                                )}
                            >
                                Remain&nbsp;
                                {transaction.amount > 0 ? "+" : ""}
                                <MoneyWithCurrency
                                    amount={transaction.spentAmount}
                                />
                            </p>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>
                            There are remain&nbsp;
                            <span
                                className={cn(
                                    "text-xs font-bold",
                                    transaction.amount > 0
                                        ? "text-chart-2"
                                        : "text-chart-5",
                                )}
                            >
                                {transaction.amount > 0 ? "+" : ""}
                                <MoneyWithCurrency
                                    amount={transaction.spentAmount}
                                />
                            </span>
                            &nbsp;that you do not categorize yet.
                        </span>
                    </TooltipContent>
                </Tooltip>
                <p className="text-sm text-muted-foreground">
                    {transaction.description}
                </p>
            </div>
        </div>
    );
}
