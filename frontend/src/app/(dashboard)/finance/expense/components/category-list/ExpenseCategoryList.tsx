import { CategoryActionButton } from "@/app/(dashboard)/finance/expense/components/category-list/CategoryActionButton";
import { CategoryBadge } from "@/app/(dashboard)/finance/expense/components/category-list/CategoryBadge";
import CreateCategoryDialog from "@/app/(dashboard)/finance/expense/components/category-list/CreateCategoryDialog";
import { CreateMonthlyTargetDialog } from "@/app/(dashboard)/finance/expense/components/category-list/CreateMonthlyTargetDialog";
import { ExpenseCategory } from "@/app/(dashboard)/finance/expense/components/category-list/types";
import { UpdateCategoryDialog } from "@/app/(dashboard)/finance/expense/components/category-list/UpdateCategoryDialog";
import { useDeleteExpenseCategoryMutation } from "@/app/(dashboard)/finance/expense/hooks/useDeleteExpenseCategoryMutation";
import { DeleteDialog } from "@/components/crud/delete-dialog";
import { useConvertCurrencyContext } from "@/lib/context/convert-currency.context";
import { useDateFilterContext } from "@/lib/context/date-range.context";
import { DataTableRowActionType } from "@/types";
import { useState } from "react";

interface IProps {
    categories: ExpenseCategory[];
}

const ExpenseCategoryList = ({categories}: IProps) => {
    const {dateRange} = useDateFilterContext();
    const [action, setAction] = useState<DataTableRowActionType | null>(null);
    const [category, setCategory] = useState<ExpenseCategory | null>(null);
    const {formatCurrency} = useConvertCurrencyContext();
    const { handleDeleteCategory } = useDeleteExpenseCategoryMutation();

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
                                <CategoryActionButton
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

export default ExpenseCategoryList;
