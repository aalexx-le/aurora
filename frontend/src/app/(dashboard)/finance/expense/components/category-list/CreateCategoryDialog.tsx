import { CREATE_EXPENSE_CATEGORY, GET_EXPENSE_CATEGORIES } from '@/api/script/expense/expense-category';
import { CategoryBadge } from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";
import { ExpenseCategory } from "@/app/(dashboard)/finance/expense/components/category-list/types";
import { CreateOrUpdateDialog } from "@/components/create-or-update-dialog";
import { GradientPicker } from "@/components/ui/color-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CreateExpenseCategoryMutation, MutationCreateExpenseCategoryArgs } from "@/gql/graphql";
import { CreateExpenseCategoryInput, createExpenseCategorySchema } from "@/lib/schema/expenseCategory";
import { useMutation } from '@apollo/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
        <CreateOrUpdateDialog<CreateExpenseCategoryInput>
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
        </CreateOrUpdateDialog>
    );
};

export default CreateCategoryDialog;