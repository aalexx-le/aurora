import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {GET_EXPENSE_CATEGORIES, REMOVE_EXPENSE_CATEGORY,} from "@/api/expense-category";
import {MutationRemoveExpenseCategoryArgs, RemoveExpenseCategoryMutation,} from "@/gql/graphql";
import CreateCategoryDialog
    from "@/app/dashboard/finance/bank-management/components/category-list/CreateCategoryDialog";
import {DeleteDialog} from "@/app/dashboard/finance/bank-management/components/transaction-table/DeleteDialog";
import {ActionButton} from "@/components/list/action-button";
import {DataTableRowActionType} from "@/types";
import {
    UpdateCategoryDialog
} from "@/app/dashboard/finance/bank-management/components/category-list/UpdateCategoryDialog";
import {ExpenseCategory} from "@/app/dashboard/finance/bank-management/components/category-list/types";
import CategoryAvatar from "@/app/dashboard/finance/bank-management/components/category-list/CategoryAvatar";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {useToast} from "@/hooks/use-toast";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";

interface IProps {
    categories: ExpenseCategory[];
}

const CategoryList = ({categories}: IProps) => {
    const {toast} = useToast()
    const [action, setAction] = useState<DataTableRowActionType | null>(null);
    const [category, setCategory] = useState<ExpenseCategory | null>(null);
    const {formatCurrency} = useConvertCurrencyContext();
    const [removeCategory] = useMutation<
        RemoveExpenseCategoryMutation,
        MutationRemoveExpenseCategoryArgs
    >(REMOVE_EXPENSE_CATEGORY, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, "GetExpenseCategories"],
        awaitRefetchQueries: true,
    });

    const handleDeleteCategory = (id: string) => async () => {
        try {
            await removeCategory({
                variables: {id},
            });
        } catch (e) {
            toast({
                title: "Error",
                description: getGraphqlErrorMessage(e),
                variant: "destructive"
            })
        }
    };

    return (
        <div className="grid xs:grid-cols-1 gap-4">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                    Category
                </h2>
                <CreateCategoryDialog/>
            </div>
            {categories?.map((ctg) => (
                <div className="grid gap-2" key={ctg.id}>
                    <div className="flex gap-4 items-center justify-between rounded-lg">
                        <div className="flex items-center gap-4 justify-between">
                            <CategoryAvatar avatar={ctg.color}/>
                            <div className="max-w-[20rem]">
                                <p className="overflow-hidden truncate text-sm font-medium leading-none">
                                    {ctg.name}
                                </p>
                                <p className="overflow-hidden truncate text-sm text-muted-foreground">
                                    {ctg.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm">
                                {formatCurrency(ctg.totalAmount)}
                            </p>
                            <ActionButton
                                row={ctg}
                                setAction={(v) => {
                                    setAction(v);
                                    setCategory(ctg);
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
            {category && (
                <>
                    <UpdateCategoryDialog
                        category={category}
                        open={action === DataTableRowActionType.UPDATE}
                        onOpenChange={() => setAction(null)}
                    />
                    <DeleteDialog
                        rows={[category]}
                        open={action === DataTableRowActionType.DELETE}
                        onOpenChange={() => setAction(null)}
                        onDelete={handleDeleteCategory(category.id)}
                        showTrigger={false}
                    />
                </>
            )}

        </div>
    );
};

export default CategoryList;
