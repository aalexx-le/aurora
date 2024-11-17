import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import {CREATE_EXPENSE_CATEGORY, GET_EXPENSE_CATEGORIES} from '@/api/expense-category';
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

interface IProps {
}

const CreateCategoryDialog = ({}: IProps) => {
    const [openDialog, setOpenDialog] = useState(false);
    const {user} = useAppSelector((state) => state.auth.state);
    const form = useForm<CreateExpenseCategoryInput>({
        resolver: zodResolver(createExpenseCategorySchema),
        defaultValues: {
            color: '#000000',
            name: '',
            description: '',
        }
    });
    const {handleSubmit, formState, reset, control, setValue, getValues} = form
    const [createCategory, {
        loading,
        error
    }] = useMutation<CreateExpenseCategoryMutation, MutationCreateExpenseCategoryArgs>(CREATE_EXPENSE_CATEGORY, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, 'GetExpenseCategories'],
        awaitRefetchQueries: true,
    });

    const onSubmit = async (data: CreateExpenseCategoryInput) => {
        try {
            await createCategory({
                variables: {
                    data: {
                        ...data,
                        userId: Number(user?.id)
                    }
                },
            });
            // Reset form fields
            reset(formState.defaultValues);

            // Close the dialog
            setOpenDialog(false);
        } catch (e) {
            console.error(e);

        }
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setOpenDialog(true)}>
                    <PlusIcon className="size-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Category</DialogTitle>
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
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryDialog;