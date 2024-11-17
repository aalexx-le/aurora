import {UseFormReturn} from "react-hook-form";
import {SheetClose, SheetFooter} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import CurrencyInput from "@/components/ui/currency-input";
import {cn} from "@/lib/utils";
import * as React from "react";
import {CreateExpenseInput} from "@/lib/schema/expense";
import {Spinner} from "@/components/ui/spinning";
import TransactionSelect from "@/app/(dashboard)/finance/components/expense-table/TransactionSelect";
import {Expense} from "@/app/(dashboard)/finance/components/expense-table/types";
import CategorySelect from "@/app/(dashboard)/finance/components/expense-table/CategorySelect";

interface IProps {
    form: UseFormReturn<CreateExpenseInput>;
    transaction: Expense["transaction"];
    onSubmit: (data: CreateExpenseInput) => void;
    isPending: boolean;
    buttonText: string;
}

export default function ExpenseForm({
    form,
    transaction,
    onSubmit,
    isPending,
    buttonText,
}: IProps) {
    const { getValues, setValue } = form;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <FormField
                    control={form.control}
                    name="bankTransactionId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>From Transaction</FormLabel>
                            <FormControl>
                                <TransactionSelect
                                    selectedTransactionId={getValues(
                                        "bankTransactionId",
                                    )}
                                    setSelectedTransactionId={(txnId) =>
                                        setValue("bankTransactionId", txnId)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <CategorySelect
                                    selectedCategoryId={getValues("categoryId")}
                                    setSelectedCategoryId={(categoryId) =>
                                        setValue("categoryId", categoryId)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Expense description"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <CurrencyInput
                    form={form}
                    className={cn(
                        transaction?.amount && transaction?.amount > 0
                            ? "text-chart-2"
                            : "text-chart-5",
                    )}
                    maxValue={transaction?.amount}
                    label="Amount"
                    name="amount"
                />
                <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                    <SheetClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </SheetClose>
                    <Button disabled={isPending}>
                        {isPending && <Spinner className="text-secondary mr-2" size="small"/>}
                        {buttonText}
                    </Button>
                </SheetFooter>
            </form>
        </Form>
    );
}
