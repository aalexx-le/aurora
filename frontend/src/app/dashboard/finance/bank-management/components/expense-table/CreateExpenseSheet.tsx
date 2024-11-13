"use client";

import * as React from "react";
import {useState, useTransition} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useMutation} from "@apollo/client";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import {CreateExpenseInput, createExpenseSchema} from "@/lib/schema/expense";
import {CreateExpenseMutation, MutationCreateExpenseArgs,} from "@/gql/graphql";
import {CREATE_EXPENSE, GET_EXPENSES} from "@/api/expense";
import {useToast} from "@/hooks/use-toast";
import {useAppSelector} from "@/state/hooks";
import {PlusIcon} from "@radix-ui/react-icons";
import {BankTransaction} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";
import ExpenseForm from "@/app/dashboard/finance/bank-management/components/expense/expense-form/ExpenseForm";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";

interface CreateExpenseSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    transaction: BankTransaction;
    showTrigger?: boolean;
}

export function CreateExpenseSheet({
    transaction,
    showTrigger = true,
    ...props
}: CreateExpenseSheetProps) {
    const [isPending, startTransition] = useTransition();
    const [openSheet, setOpenSheet] = useState(false);
    const { toast } = useToast();
    const { user } = useAppSelector((state) => state.auth.state);
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
            bankTransactionId: transaction ? transaction.id : "",
        },
    });
    const { getValues, setValue, setError } = form;

    function onSubmit(input: CreateExpenseInput) {
        startTransition(async () => {
            try {
                if (!transaction) {
                    setError("amount", {
                        message: "Please specify a transaction",
                    });
                    return;
                }

                if (input.amount > Math.abs(transaction.spentAmount)) {
                    setError("amount", {
                        message:
                            "Expense amount cannot be greater than transaction amount",
                    });
                    return;
                }

                const { data } = await createExpense({
                    variables: {
                        data: {
                            ...input,
                            amount:
                                input.amount *
                                (transaction.amount /
                                    Math.abs(transaction.amount)),
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
                        disabled={transaction?.spentAmount === 0}
                        variant="ghost"
                        size="icon"
                        onClick={() => setOpenSheet(true)}
                    >
                        <PlusIcon className="size-4" />
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
                    transaction={transaction}
                    onSubmit={onSubmit}
                    isPending={isPending}
                    buttonText="Create"
                />
            </SheetContent>
        </Sheet>
    );
}
