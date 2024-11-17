import React from "react";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {CreateMonthlyTargetInput, createMonthlyTargetSchema} from "@/lib/schema/expenseCategory";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@apollo/client";
import {CreateMonthlyTargetMutation, MutationCreateMonthlyTargetArgs} from "@/gql/graphql";
import {CREATE_MONTHLY_TARGET, GET_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {useToast} from "@/hooks/use-toast";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import CurrencyInput from "@/components/ui/currency-input";
import {Spinner} from "@/components/ui/spinning";
import {useDateFilterContext} from "@/lib/context/date-range.context";
import MonthSelect from "@/app/(dashboard)/finance/components/category-list/MonthSelect";

interface IProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
    categoryId: string;
}

export function CreateMonthlyTargetDialog({categoryId, ...props}: IProps) {
    const {toast} = useToast();
    const {dateRange} = useDateFilterContext();
    const form = useForm<CreateMonthlyTargetInput>({
        resolver: zodResolver(createMonthlyTargetSchema),
        defaultValues: {
            target: 0,
            month: dateRange?.from?.getMonth() || new Date().getMonth(),
            year: dateRange?.from?.getFullYear() || new Date().getFullYear(),
        }
    });
    const {handleSubmit, reset, getValues, setValue} = form

    const [createMonthlyTarget, {loading}] = useMutation<CreateMonthlyTargetMutation, MutationCreateMonthlyTargetArgs>(CREATE_MONTHLY_TARGET, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, 'GetExpenseCategories'],
        awaitRefetchQueries: true,
    })

    const onSubmit = async (data: CreateMonthlyTargetInput) => {
        try {
            await createMonthlyTarget({
                variables: {
                    data: {
                        ...data,
                        categoryId,
                    }
                }
            })
            reset()
            props.onOpenChange?.(false);
        } catch (e) {
            toast({
                title: "Fail to create monthly target",
                description: getGraphqlErrorMessage(e),
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Monthly Target</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Form {...form}> {/* Use Form component */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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