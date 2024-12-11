"use client";

import React, {useEffect} from 'react';
import {useMutation} from '@apollo/client';
import {GET_EXPENSE_CATEGORIES, UPDATE_EXPENSE_CATEGORY} from '@/api/script/expense-category';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {CreateExpenseCategoryInput, createExpenseCategorySchema} from "@/lib/schema/expenseCategory";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {GradientPicker} from "@/components/ui/color-picker";
import {MutationUpdateExpenseCategoryArgs, UpdateExpenseCategoryMutation} from "@/gql/graphql";
import {useToast} from "@/hooks/use-toast";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import {CategoryBadge} from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";
import {ExpenseCategory} from "@/app/(dashboard)/finance/expense/components/category-list/types";

interface IProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
    category: ExpenseCategory | null;
}

export function UpdateCategoryDialog({category, ...props}: IProps) {
    const form = useForm<CreateExpenseCategoryInput>({
        resolver: zodResolver(createExpenseCategorySchema),
    });
    const {toast} = useToast();
    const {handleSubmit, reset, control, setValue, getValues, watch} = form
    const [reviewName, reviewColor] = watch(["name", "color"]);
    const [updateCategory, {loading}] = useMutation<UpdateExpenseCategoryMutation, MutationUpdateExpenseCategoryArgs>(UPDATE_EXPENSE_CATEGORY, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, 'GetExpenseCategories'],
        awaitRefetchQueries: true,
    })

    useEffect(() => {
        if (!category) return;
        reset({
            color: category.color,
            name: category.name,
            description: category.description as string,
        });
    }, [category, reset]);

    const onSubmit = async (data: CreateExpenseCategoryInput) => {
        try {
            if (!category) return;

            await updateCategory({
                variables: {
                    data,
                    id: category.id
                },
            });
            // Reset form fields
            reset();

            // Close the dialog
            props.onOpenChange?.(false);
        } catch (e) {
            toast({
                title: 'Fail to update category',
                description: getGraphqlErrorMessage(e),
                variant: 'destructive'
            })
        }
    };

    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Form {...form}> {/* Use Form component */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <FormField
                                        control={control}
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
                                    control={control}
                                    name="color"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <GradientPicker
                                                    popupAlign="end"
                                                    background={getValues("color")}
                                                    setBackground={(color) => setValue('color', color)}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={control}
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
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};