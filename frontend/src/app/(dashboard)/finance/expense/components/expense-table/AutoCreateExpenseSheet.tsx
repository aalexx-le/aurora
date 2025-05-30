"use client";

import ExpenseForm from "@/app/(dashboard)/finance/expense/components/expense-form/ExpenseForm";
import { useAISuggestExpenses } from "@/app/(dashboard)/finance/expense/hooks/useAISuggestedExpenses";
import { useReviewTransaction } from "@/app/(dashboard)/finance/expense/hooks/useReviewTransaction";
import { useSubmitExpenseForm } from "@/app/(dashboard)/finance/expense/hooks/useSubmitForm";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { CreateExpenseInput, createExpenseSchema } from "@/lib/schema/expense";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";

interface CreateExpenseSheetProps
    extends React.ComponentPropsWithRef<typeof Sheet> {
    initTransactionId: number;
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
    const {onSubmit} = useSubmitExpenseForm(form, reviewTransaction, startTransition, props.onOpenChange);

    // Reset form when click on another transaction
    useEffect(() => {
        form.reset(defaultValues);
    }, [initTransactionId, defaultValues, form]);

    return (
        <Sheet {...props}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md">
                <SheetHeader className="text-left">
                    <SheetTitle>AI Suggest Expense</SheetTitle>
                    <SheetDescription>
                        Select a suggestion or adjust the details to match your desired expense
                    </SheetDescription>
                </SheetHeader>
                
                {suggestedExpenses.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Suggested Expenses</h3>
                        <ScrollArea className="h-[180px] w-full rounded-md border">
                            <div className="grid grid-cols-1 gap-2 p-2">
                                {suggestedExpenses.map((exp, i) => (
                                    <Card 
                                        key={i} 
                                        className={cn(
                                            "transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer",
                                            "border-2",
                                            JSON.stringify(form.getValues()) === JSON.stringify(exp) && "border-primary"
                                        )}
                                        onClick={() => form.reset(exp as CreateExpenseInput)}
                                    >
                                        <CardContent className="p-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h4 className="font-medium truncate max-w-[200px]">{exp.name}</h4>
                                                    {exp.description && (
                                                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {exp.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "font-bold text-base", 
                                                    exp.amount > 0 ? "text-chart-2" : "text-chart-5"
                                                )}>
                                                    {exp.amount > 0 ? "+" : ""}
                                                    <MoneyWithCurrency amount={exp.amount} />
                                                </span>
                                            </div>
                                            
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[100px] border rounded-md bg-muted/20">
                        <p className="text-sm text-muted-foreground">No suggestions available</p>
                    </div>
                )}
                
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
