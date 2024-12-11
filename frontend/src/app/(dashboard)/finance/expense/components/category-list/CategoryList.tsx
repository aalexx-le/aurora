import React, {useState} from "react";
import {useMutation} from "@apollo/client";
import {GET_EXPENSE_CATEGORIES, REMOVE_EXPENSE_CATEGORY,} from "@/api/script/expense-category";
import {MutationRemoveExpenseCategoryArgs, RemoveExpenseCategoryMutation,} from "@/gql/graphql"
import {ExpenseCategory} from "@/app/(dashboard)/finance/expense/components/category-list/types";
import {useToast} from "@/hooks/use-toast";
import {DataTableRowActionType} from "@/types";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";
import CreateCategoryDialog from "@/app/(dashboard)/finance/expense/components/category-list/CreateCategoryDialog";
import {CategoryBadge} from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";
import {ActionButton} from "@/components/list/action-button";
import {UpdateCategoryDialog} from "@/app/(dashboard)/finance/expense/components/category-list/UpdateCategoryDialog";
import {DeleteDialog} from "@/app/(dashboard)/finance/expense/components/transaction-table/DeleteDialog";
import {CreateMonthlyTargetDialog} from "@/app/(dashboard)/finance/expense/components/category-list/CreateMonthlyTargetDialog";
import {useDateFilterContext} from "@/lib/context/date-range.context";

interface IProps {
    categories: ExpenseCategory[];
}

const CategoryList = ({categories}: IProps) => {
    const {toast} = useToast()
    const {dateRange} = useDateFilterContext();
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
            {categories?.map((ctg) => {
                const monthlyTarget = ctg.monthlyTargets?.find(
                    (target) => target.month === dateRange.from?.getMonth() && target.year === dateRange.from.getFullYear()
                );

                return (
                    <div className="grid gap-2" key={ctg.id}>
                        <div className="flex gap-4 items-center justify-between rounded-lg">
                            <CategoryBadge category={ctg} targetAmount={monthlyTarget?.target}/>
                            <div className="flex items-center gap-2">
                                <p className="text-sm">
                                    {formatCurrency(ctg.totalSpentAmounts.reduce((acc, curr) => acc + Math.abs(curr.amount), 0))}
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
                )
            })}
            {category && (
                <>
                    <UpdateCategoryDialog
                        category={category}
                        open={action === DataTableRowActionType.UPDATE}
                        onOpenChange={() => setAction(null)}
                    />
                    <CreateMonthlyTargetDialog
                        categoryId={category.id}
                        open={action === DataTableRowActionType.CREATE}
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
