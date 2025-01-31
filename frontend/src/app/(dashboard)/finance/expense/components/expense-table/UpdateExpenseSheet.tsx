"use client";

import * as React from "react";
import {useMemo, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutation} from "@apollo/client";

import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {CreateExpenseInput, createExpenseSchema} from "@/lib/schema/expense";
import {MutationUpdateExpenseArgs, UpdateExpenseMutation,} from "@/gql/graphql";
import {GET_EXPENSES, UPDATE_EXPENSE} from "@/api/script/expense";
import {useToast} from "@/hooks/use-toast";
import {PlusIcon} from "@radix-ui/react-icons";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import {Expense} from "@/app/(dashboard)/finance/expense/components/expense-table/types";
import ExpenseForm from "@/app/(dashboard)/finance/expense/components/expense-form/ExpenseForm";
import {useTransactionQuery} from "@/app/(dashboard)/finance/expense/components/transaction-list/useTransactionQuery";

interface CreateExpenseSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    expense: Expense;
}

export function UpdateExpenseSheet({
    expense,
    ...props
}: CreateExpenseSheetProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [updateExpense] = useMutation<
        UpdateExpenseMutation,
        MutationUpdateExpenseArgs
    >(UPDATE_EXPENSE, {
        refetchQueries: [GET_EXPENSES, "GetExpenses"],
        awaitRefetchQueries: true,
    });

    const form = useForm<CreateExpenseInput>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues: {
            name: expense.name,
            description: expense.description as string,
            amount: Math.abs(expense.amount),
            categoryId: expense.category.id,
            bankTransactionId: expense.transaction.id,
            createdAt: new Date(expense.createdAt),
        },
    });
    const { setError, watch } = form;
    const transactions = useTransactionQuery()
    const [reviewTransactionId] = watch(["bankTransactionId"]);
    const reviewTransaction = useMemo(
        () => transactions.find((txn) => txn.id === reviewTransactionId),
        [transactions, reviewTransactionId]
    );
    const maxSpentAmount = useMemo(() => {
        const isSameTransaction = reviewTransaction?.id === expense.transaction.id;
        if (isSameTransaction) {
            return reviewTransaction?.spentAmount + expense.amount;
        }
        else {
            return reviewTransaction?.spentAmount || 0;
        }
    }, [reviewTransaction, expense]);

    function onSubmit(input: CreateExpenseInput) {
        if (!expense) return;

        startTransition(async () => {
            try {
                if (!reviewTransaction) {
                    setError("amount", {
                        message: "Please specify a transaction",
                    });
                    return;
                }

                if (input.amount > Math.abs(reviewTransaction.amount)) {
                    setError("amount", {
                        message:
                            "Expense amount cannot be greater than amount of this transaction",
                    });
                    return;
                }

                const { data } = await updateExpense({
                    variables: {
                        id: expense.id,
                        data: {
                            ...input,
                            amount:
                                input.amount *
                                (reviewTransaction.amount /
                                    Math.abs(reviewTransaction.amount)),
                        },
                    },
                });

                if (data) {
                    form.reset();
                    props.onOpenChange?.(false);
                    toast({
                        title: "Updated expense!",
                    });
                }
            } catch (e) {
                toast({
                    title: "Error updating expense",
                    description: getGraphqlErrorMessage(e),
                    variant: "destructive"
                });
            }
        });
    }

    return (
        <Sheet {...props}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <PlusIcon className="size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md">
                <SheetHeader className="text-left">
                    <SheetTitle>Update Expense</SheetTitle>
                    <SheetDescription>
                        Fill in the details to update the expense
                    </SheetDescription>
                </SheetHeader>
                <ExpenseForm
                    form={form}
                    transaction={reviewTransaction}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    buttonText="Update"
                    maxSpentAmount={maxSpentAmount}
                />
            </SheetContent>
        </Sheet>
    );
}
