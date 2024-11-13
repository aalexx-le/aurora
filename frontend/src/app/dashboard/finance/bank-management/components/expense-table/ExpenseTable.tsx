import {DataTable} from "@/components/data-table/data-table";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import React, {useMemo, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {DataTableAdvancedFilterField, DataTableRowActionState, DataTableRowActionType,} from "@/types";
import {DeleteDialog} from "@/app/dashboard/finance/bank-management/components/transaction-table/DeleteDialog";
import {Expense} from "@/app/dashboard/finance/bank-management/components/expense-table/types";
import {getExpenseColumns} from "@/app/dashboard/finance/bank-management/components/expense-table/expenseColumns";
import {UpdateExpenseSheet} from "@/app/dashboard/finance/bank-management/components/expense-table/UpdateExpenseSheet";
import {GET_EXPENSES, REMOVE_EXPENSE} from "@/api/expense";
import {useToast} from "@/hooks/use-toast";
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar";
import {
    ExpenseTableToolbarActions
} from "@/app/dashboard/finance/bank-management/components/expense-table/ExpenseTableToolbarActions";
import {
    GetExpenseCategoriesQuery,
    GetExpenseCategoriesQueryVariables,
    MutationRemoveExpenseArgs,
    RemoveExpenseMutation,
} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {useAppSelector} from "@/state/hooks";
import CategoryAvatar from "@/app/dashboard/finance/bank-management/components/category-list/CategoryAvatar";
import {
    DuplicateExpenseSheet
} from "@/app/dashboard/finance/bank-management/components/expense-table/DuplicateExpenseSheet";
import {useDateFilterContext} from "@/lib/context/date-range.context";
import {getGraphqlErrorMessage} from "@/lib/utils/graphql";

interface IProps {
    expenses: Expense[];
}

export default function ExpenseTable({ expenses }: IProps) {
    const [rowAction, setRowAction] =
        useState<DataTableRowActionState<Expense> | null>(null);
    const { toast } = useToast();
    const { dateRange } = useDateFilterContext();
    const { user } = useAppSelector((state) => state.auth.state);
    const [removeExpense] = useMutation<
        RemoveExpenseMutation,
        MutationRemoveExpenseArgs
    >(REMOVE_EXPENSE, {
        refetchQueries: [GET_EXPENSES, "GetExpenses"],
        awaitRefetchQueries: true,
    });
    const { data } = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        variables: {
            userId: Number(user?.id),
            startDate: dateRange?.from,
            endDate: dateRange?.to,
        },
    });
    const categories = data?.getExpenseCategories ?? [];

    const columns = useMemo(
        () => getExpenseColumns({ setRowAction }),
        [setRowAction],
    );

    const filterFields: DataTableAdvancedFilterField<Expense>[] = [
        {
            id: "description",
            label: "Description",
            type: "text",
            placeholder: "Search by description",
        },
        {
            id: "category",
            label: "Category",
            type: "multi-select",
            options: categories.map((ctg) => ({
                label: (
                    <div className="w-min flex items-center p-2 gap-2 rounded-lg border shadow-sm">
                        <CategoryAvatar
                            avatar={ctg.color}
                            className="w-4 h-4"
                        />
                        <p className="max-w-[8rem] truncate text-sm font-medium leading-none">
                            {ctg.name}
                        </p>
                    </div>
                ),
                value: ctg.name,
                count: ctg.countExpenses,
            })),
        },
    ];

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: expenses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters,
        },
    });

    const handleDeleteExpense = async (id: string) => {
        try {
            await removeExpense({
                variables: { id },
            });
            toast({
                title: "Deleted expense!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to delete expense",
                description: getGraphqlErrorMessage(error),
            });
        }
    };

    return (
        <>
            <DataTable table={table}>
                <DataTableToolbar table={table} filterFields={filterFields}>
                    <ExpenseTableToolbarActions table={table} />
                </DataTableToolbar>
            </DataTable>
            {rowAction && (
                <>
                    <DuplicateExpenseSheet
                        open={rowAction.type === DataTableRowActionType.CREATE}
                        onOpenChange={() => setRowAction(null)}
                        expense={rowAction.row.original}
                    />
                    <UpdateExpenseSheet
                        open={rowAction.type === DataTableRowActionType.UPDATE}
                        onOpenChange={() => setRowAction(null)}
                        expense={rowAction.row.original}
                    />
                    <DeleteDialog
                        open={rowAction.type === DataTableRowActionType.DELETE}
                        onOpenChange={() => setRowAction(null)}
                        rows={[rowAction.row.original]}
                        showTrigger={false}
                        onDelete={() =>
                            handleDeleteExpense(rowAction.row.original.id)
                        }
                        onSuccess={() => rowAction.row.toggleSelected(false)}
                    />
                </>
            )}
        </>
    );
}
