"use client";

import * as React from "react";
import {useEffect, useMemo, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutation} from "@apollo/client";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,} from "@/components/ui/sheet";
import {CreateExpenseInput, createExpenseSchema} from "@/lib/schema/expense";
import {CreateExpenseMutation, MutationCreateExpenseArgs,} from "@/gql/graphql";
import {CREATE_EXPENSE, GET_EXPENSES} from "@/api/script/expense";
import {useToast} from "@/hooks/use-toast";
import {useAppSelector} from "@/state/hooks";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import ExpenseForm from "@/app/(dashboard)/finance/expense/components/expense-form/ExpenseForm";
import {useAISuggestExpenses} from "@/app/(dashboard)/finance/expense/components/expense-table/useAISuggestedExpenses";
import {useReviewTransaction} from "@/app/(dashboard)/finance/expense/components/expense-table/useReviewTransaction";
import {useSubmitForm} from "@/app/(dashboard)/finance/expense/components/expense-table/useSubmitForm";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {MenuItem, Menu, MenuContent} from "@radix-ui/react-menu";
import {Button} from "@/components/ui/button";
import {Expense} from "@/app/(dashboard)/finance/expense/components/expense-table/types";

interface CreateExpenseSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    initTransactionId: string;
    showTrigger?: boolean;
}

export function AutoCreateExpenseSheet({
                                           initTransactionId,
                                           showTrigger = true,
                                           ...props
                                       }: CreateExpenseSheetProps) {
    const [isPending, startTransition] = useTransition();


    const defaultValues = useMemo(() => ({
        name: "",
        description: "",
        amount: 0,
        bankTransactionId: initTransactionId,
        createdAt: new Date(),
    }), [initTransactionId]);

    const form = useForm<CreateExpenseInput>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues,
    });
    const suggestedExpenses = useAISuggestExpenses(form);

    const reviewTransaction = useReviewTransaction(form);
    const {onSubmit} = useSubmitForm(form, reviewTransaction, startTransition, props.onOpenChange);

    // Reset form when click on another transaction
    useEffect(() => {
        form.reset(defaultValues);
    }, [initTransactionId]);

    return (
        <Sheet {...props}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md">
                <SheetHeader className="text-left">
                    <SheetTitle>AI Suggest Expense</SheetTitle>
                    <SheetDescription>
                        Adjust the details to match your desired expense
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
                    <div className="flex flex-row">
                        {suggestedExpenses.map((exp, i) => (
                            <div key={i} className="flex flex-col p-4 text-sm hover:cursor-pointer hover:bg-muted" onClick={() => form.reset(exp as CreateExpenseInput)}>
                                <span className="truncate font-medium">
                                    {exp.name}
                                </span>
                                <span className={cn("font-bold", exp.amount > 0 ? "text-chart-2" : "text-chart-5")}>
                                    {exp.amount > 0 ? "+" : ""}<MoneyWithCurrency amount={exp.amount}/>
                                </span>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
                <ExpenseForm
                    form={form}
                    transaction={reviewTransaction}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    buttonText="Create"
                    maxSpentAmount={reviewTransaction?.spentAmount || 0}
                />
            </SheetContent>
        </Sheet>
    );
}
