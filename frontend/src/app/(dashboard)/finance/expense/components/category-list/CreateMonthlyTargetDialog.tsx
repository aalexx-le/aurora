import MonthSelect from "@/app/(dashboard)/finance/expense/components/category-list/MonthSelect";
import { useCreateMonthlyTargetMutation } from "@/app/(dashboard)/finance/expense/hooks/useCreateMonthlyTargetMutation";
import { Button } from "@/components/ui/button";
import CurrencyInput from "@/components/ui/currency-input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinning";
import { useDateFilterContext } from "@/lib/context/date-range.context";
import { CreateMonthlyTargetInput, createMonthlyTargetSchema } from "@/lib/schema/expenseCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface IProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
    categoryId: string;
}

export function CreateMonthlyTargetDialog({categoryId, ...props}: IProps) {
    const {dateRange} = useDateFilterContext();
    const form = useForm<CreateMonthlyTargetInput>({
        resolver: zodResolver(createMonthlyTargetSchema),
        defaultValues: {
            target: 0,
            month: dateRange?.from?.getMonth() || new Date().getMonth(),
            year: dateRange?.from?.getFullYear() || new Date().getFullYear(),
        }
    });
    const {handleSubmit, reset, getValues, setValue} = form;


    const onSuccess = () => {
        reset();
        props.onOpenChange?.(false);
    };

    const { handleCreateMonthlyTarget, loading } = useCreateMonthlyTargetMutation(categoryId, onSuccess);


    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Monthly Target</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Form {...form}> {/* Use Form component */}
                        <form onSubmit={handleSubmit(handleCreateMonthlyTarget)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="month"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Month</FormLabel>
                                        <FormControl>
                                            <MonthSelect
                                                categoryId={categoryId}
                                                selectedMonth={getValues(
                                                    "month",
                                                )}
                                                setSelectedMonth={(m) =>
                                                    setValue("month", m)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <div className="flex-1">
                                <CurrencyInput
                                    form={form}
                                    label="Target Amount"
                                    name="target"
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Spinner className="text-secondary mr-2" size="small"/>}
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}