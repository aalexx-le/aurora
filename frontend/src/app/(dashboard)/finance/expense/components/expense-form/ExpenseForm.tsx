import CategorySelect from "@/app/(dashboard)/finance/expense/components/expense-form/CategorySelect";
import { CreatedDateSelect } from "@/app/(dashboard)/finance/expense/components/expense-form/CreatedDateSelect";
import TransactionSelect from "@/app/(dashboard)/finance/expense/components/expense-form/TransactionSelect";
import { BankTransaction } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import { DateTimePicker } from "@/app/(dashboard)/schedule/components/event-calendar/date-picker";
import { Button } from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currency-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinning";
import { Textarea } from "@/components/ui/textarea";
import { CreateExpenseInput } from "@/lib/schema/expense";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface IProps {
    form: UseFormReturn<CreateExpenseInput>;
    transaction: BankTransaction | undefined;
    onSubmit: (data: CreateExpenseInput) => void;
    isPending: boolean;
    buttonText: string;
    maxSpentAmount: number;
}

export default function ExpenseForm({
                                        form,
                                        transaction,
                                        onSubmit,
                                        isPending,
                                        buttonText,
                                        maxSpentAmount,
                                    }: IProps) {
    const {getValues, setValue} = form;

    return (
        <div className="flex flex-col h-full">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col h-full"
                >
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-[calc(100vh-220px)]">
                            <div className="flex flex-col gap-4 pb-4 px-1 pr-4">
                                <FormField
                                    control={form.control}
                                    name="bankTransactionId"
                                    render={({field}) => (
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
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <CategorySelect
                                                    selectedCategoryId={field.value}
                                                    setSelectedCategoryId={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="createdAt"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Created Date</FormLabel>
                                            <FormControl>
                                                <DateTimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    granularity="minute"
                                                    weekStartsOn={1}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Expense description"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage/>
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
                                    maxValue={maxSpentAmount}
                                    label="Amount"
                                    name="amount"
                                />
                            </div>
                        </ScrollArea>
                    </div>
                    
                    <div className="sticky bottom-0 bg-background pt-4 border-t mt-4">
                        <SheetFooter className="gap-2">
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
                    </div>
                </form>
            </Form>
        </div>
    );
}
