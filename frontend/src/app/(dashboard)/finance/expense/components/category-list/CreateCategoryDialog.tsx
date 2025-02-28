import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {CREATE_EXPENSE_CATEGORY, GET_EXPENSE_CATEGORIES} from '@/api/script/expense-category';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {PlusIcon} from '@radix-ui/react-icons';
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {CreateExpenseCategoryInput, createExpenseCategorySchema} from "@/lib/schema/expenseCategory";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {GradientPicker} from "@/components/ui/color-picker";
import {CreateExpenseCategoryMutation, MutationCreateExpenseCategoryArgs} from "@/gql/graphql";
import {useAppSelector} from "@/state/hooks";
import {CategoryBadge} from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";
import {ExpenseCategory} from "@/app/(dashboard)/finance/expense/components/category-list/types";
import {CreateDialog} from "@/components/create-dialog";

interface IProps {
}

const CreateCategoryDialog = ({}: IProps) => {
    const defaultValues: CreateExpenseCategoryInput = {
        color: '#000000',
        name: '',
        description: '',
    }
    const form = useForm<CreateExpenseCategoryInput>({
        resolver: zodResolver(createExpenseCategorySchema),
        defaultValues
    });
    const [reviewName, reviewColor] = form.watch(["name", "color"]);
    const [createCategory, {loading}] = useMutation<CreateExpenseCategoryMutation, MutationCreateExpenseCategoryArgs>(CREATE_EXPENSE_CATEGORY, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, 'GetExpenseCategories'],
        awaitRefetchQueries: true,
    });

    const handleSubmit = async (data: CreateExpenseCategoryInput) => {
        await createCategory({
            variables: {
                data
            }
        });
    };

    return (
        <CreateDialog<CreateExpenseCategoryInput>
            title="New Category"
            form={form}
            formSchema={createExpenseCategorySchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={loading}
        >
            {(form) => (
                <>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Category name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
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
                    {reviewName && (
                        <FormItem>
                            <FormLabel>Preview</FormLabel>
                            <FormControl>
                                <CategoryBadge
                                    category={{name: reviewName, color: reviewColor} as ExpenseCategory}/>
                            </FormControl>
                        </FormItem>
                    )}
                </>
            )}
        </CreateDialog>
    );
};

export default CreateCategoryDialog;