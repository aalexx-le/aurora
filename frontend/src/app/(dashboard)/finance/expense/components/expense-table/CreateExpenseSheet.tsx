"use client";

import * as React from "react";
import {useMemo, useState, useTransition} from "react";
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
    const [openSheet, setOpenSheet] = useState(false);
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

    const form = useForm<CreateExpenseInput>({
        resolver: zodResolver(createExpenseSchema),
        defaultValues: {
            name: "",
            description: "",
            amount: 0,
            bankTransactionId: initTransactionId,
            createdAt: new Date(),
        },
    });
    const {getValues, setError, watch} = form;
    const transactions = useTransactionQuery()
    const [reviewTransactionId] = watch(["bankTransactionId"]);
    const reviewTransaction = useMemo(
        () => transactions.find((txn) => txn.id === reviewTransactionId),
        [transactions, reviewTransactionId]
    );

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
                    setOpenSheet(false);
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
        <Sheet open={openSheet} onOpenChange={setOpenSheet} {...props}>
            {showTrigger && (
                <SheetTrigger asChild>
                    <Button
                        disabled={reviewTransaction?.spentAmount === 0}
                        variant="ghost"
                        size="icon"
                        className="aspect-square"
                        onClick={() => setOpenSheet(true)}
                    >
                        <PlusIcon className="size-4"/>
                    </Button>
                </SheetTrigger>
            )}
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
