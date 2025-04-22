"use client";

import { GET_EXPENSE_CATEGORIES, UPDATE_EXPENSE_CATEGORY } from '@/api/scripts/expense/expense-category';
import { CategoryBadge } from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";
import { ExpenseCategory } from "@/app/(dashboard)/finance/expense/components/category-list/types";
import { CreateOrUpdateDialog } from '@/components/crud/create-or-update-dialog';
import { GradientPicker } from "@/components/ui/color-picker";
import { Dialog } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MutationUpdateExpenseCategoryArgs, UpdateExpenseCategoryMutation } from "@/gql/graphql";
import { CreateExpenseCategoryInput, createExpenseCategorySchema } from "@/lib/schema/expenseCategory";
import { useMutation } from '@apollo/client';
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo } from 'react';
import { useForm, UseFormReturn } from "react-hook-form";

interface IProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
    category: ExpenseCategory | null;
}

// Create a separate function for the category form fields
const getCategoryForm = (form: UseFormReturn<CreateExpenseCategoryInput>) => {
    const [reviewName, reviewColor] = form.watch(["name", "color"]);
    
    return (
        <>
            <div className="flex items-end gap-4">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="color"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <GradientPicker
                                    popupAlign="end"
                                    background={form.getValues("color")}
                                    setBackground={(color) => form.setValue('color', color)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="description"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
            <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl>
                    <CategoryBadge
                        category={{name: reviewName, color: reviewColor} as ExpenseCategory}/>
                </FormControl>
            </FormItem>
        </>
    );
};

export function UpdateCategoryDialog({category, ...props}: IProps) {
    const form = useForm<CreateExpenseCategoryInput>({
        resolver: zodResolver(createExpenseCategorySchema),
    });
    
    const [updateCategory, {loading}] = useMutation<UpdateExpenseCategoryMutation, MutationUpdateExpenseCategoryArgs>(UPDATE_EXPENSE_CATEGORY, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, 'GetExpenseCategories'],
        awaitRefetchQueries: true,
    });

    const defaultValues = useMemo(() => ({
        color: category?.color ?? '',
        name: category?.name ?? '',
        description: category?.description as string ?? '',
    }), [category]);

    useEffect(() => {
        if (!category) return;
        form.reset(defaultValues);
    }, [category, form, defaultValues]);

    const onSubmit = async (data: CreateExpenseCategoryInput) => {
        if (!category) return;

        await updateCategory({
            variables: {
                data,
                id: category.id
            },
        });
        // Reset form fields
        form.reset();
        // Close the dialog
        props.onOpenChange?.(false);
    };

    return (
        <CreateOrUpdateDialog<CreateExpenseCategoryInput>
            title="Update Category"
            formSchema={createExpenseCategorySchema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            form={form}
            loading={loading}
            open={props.open}
            onOpenChange={props.onOpenChange}
            showTrigger={false}
            isUpdate
        >
            {getCategoryForm}
        </CreateOrUpdateDialog>
    );
}