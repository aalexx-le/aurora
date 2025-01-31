"use client";

import * as React from "react";
import {useEffect, useMemo, useState, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutation} from "@apollo/client";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {CreateExpenseInput, createExpenseSchema} from "@/lib/schema/expense";
import {CreateExpenseMutation, MutationCreateExpenseArgs,} from "@/gql/graphql";
import {CREATE_EXPENSE, GET_EXPENSES} from "@/api/script/expense";
import {useToast} from "@/hooks/use-toast";
import {useAppSelector} from "@/state/hooks";
import {PlusIcon} from "@radix-ui/react-icons";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import ExpenseForm from "@/app/(dashboard)/finance/expense/components/expense-form/ExpenseForm";
import {useTransactionQuery} from "@/app/(dashboard)/finance/expense/components/transaction-list/useTransactionQuery";

interface CreateExpenseSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    initTransactionId: string;
    showTrigger?: boolean;
}

export function CreateExpenseSheet({
                                       initTransactionId,
                                       showTrigger = true,
                                       ...props
                                   }: CreateExpenseSheetProps) {
    const [isPending, startTransition] = useTransition();
    const {toast} = useToast();
    const {user} = useAppSelector((state) => state.auth.state);

    const [createExpense] = useMutation<
        CreateExpenseMutation,
        MutationCreateExpenseArgs
    >(CREATE_EXPENSE, {
        refetchQueries: [
            GET_EXPENSES,
            "GetExpenses",
            "GetExpenseCategories",
            "GetBanks",
        ],
        awaitRefetchQueries: true,
    });

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
    const {setError, watch, reset} = form;

    const transactions = useTransactionQuery()
    const [reviewTransactionId] = watch(["bankTransactionId"]);
    const reviewTransaction = useMemo(
        () => transactions.find((txn) => txn.id === reviewTransactionId),
        [transactions, reviewTransactionId]
    );

    // Reset form when click on another transaction
    useEffect(() => {
        reset(defaultValues);
    }, [initTransactionId, reset, defaultValues]);

    function onSubmit(input: CreateExpenseInput) {
        startTransition(async () => {
            try {
                if (!reviewTransaction) {
                    setError("amount", {
                        message: "Please specify a transaction",
                    });
                    return;
                }

                if (input.amount > Math.abs(reviewTransaction.spentAmount)) {
                    setError("amount", {
                        message:
                            "Expense amount cannot be greater than transaction amount",
                    });
                    return;
                }

                const {data} = await createExpense({
                    variables: {
                        data: {
                            ...input,
                            amount:
                                input.amount *
                                (reviewTransaction.amount /
                                    Math.abs(reviewTransaction.amount)),
                            userId: Number(user?.id),
                        },
                    },
                });

                if (data) {
                    form.reset();
                    props.onOpenChange?.(false);
                    toast({
                        title: "Created expense!",
                    });
                }
            } catch (e) {
                toast({
                    title: "Error creating expense",
                    description: getGraphqlErrorMessage(e),
                    variant: "destructive"
                });
            }
        });
    }

    return (
        <Sheet {...props}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md">
                <SheetHeader className="text-left">
                    <SheetTitle>New Expense</SheetTitle>
                    <SheetDescription>
                        Fill in the details to create a new expense
                    </SheetDescription>
                </SheetHeader>
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
