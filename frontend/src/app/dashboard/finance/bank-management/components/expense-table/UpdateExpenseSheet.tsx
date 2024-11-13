"use client";

import * as React from "react";
import {useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutation} from "@apollo/client";

import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {CreateExpenseInput, createExpenseSchema} from "@/lib/schema/expense";
import {MutationUpdateExpenseArgs, UpdateExpenseMutation,} from "@/gql/graphql";
import {GET_EXPENSES, UPDATE_EXPENSE} from "@/api/expense";
import {useToast} from "@/hooks/use-toast";
import {PlusIcon} from "@radix-ui/react-icons";
import {Expense} from "@/app/dashboard/finance/bank-management/components/expense-table/types";
import ExpenseForm from "@/app/dashboard/finance/bank-management/components/expense/expense-form/ExpenseForm";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";

interface CreateExpenseSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    expense: Expense;
}

export function UpdateExpenseSheet({
    expense,
    ...props
}: CreateExpenseSheetProps) {
    const transaction = expense.transaction;
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
            bankTransactionId: transaction.id,
        },
    });
    const { setError } = form;

    function onSubmit(input: CreateExpenseInput) {
        if (!expense) return;

        startTransition(async () => {
            try {
                if (!transaction) {
                    setError("amount", {
                        message: "Please specify a transaction",
                    });
                    return;
                }

                if (input.amount > Math.abs(transaction.amount)) {
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
                                (transaction.amount /
                                    Math.abs(transaction.amount)),
                            bankTransactionId: transaction.id,
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
                    transaction={transaction}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    buttonText="Update"
                />
            </SheetContent>
        </Sheet>
    );
}
