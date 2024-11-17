"use client"

import {type Table} from "@tanstack/react-table"

import {useMutation} from "@apollo/client";
import {MutationRemoveExpensesArgs, RemoveExpensesMutation} from "@/gql/graphql";
import {GET_EXPENSES, REMOVE_EXPENSES} from "@/api/expense";
import {toast} from "@/hooks/use-toast";
import {useState} from "react";
import {DeleteDialog} from "@/app/(dashboard)/finance/components/transaction-table/DeleteDialog";
import {Expense} from "@/app/(dashboard)/finance/components/expense-table/types";

interface IProps {
    table: Table<Expense>
}

export function ExpenseTableToolbarActions({
                                               table,
                                           }: IProps) {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [removeExpense] = useMutation<RemoveExpensesMutation, MutationRemoveExpensesArgs>(REMOVE_EXPENSES, {
        refetchQueries: [GET_EXPENSES, 'GetExpenses'],
        awaitRefetchQueries: true,
    });
    const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original);

    const handleDeleteExpense = async (ids: string[]) => {
        await removeExpense({
            variables: {
                ids
            },
        });
        toast({
            title: "Deleted expense!"
        });
    };

    return (
        <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <DeleteDialog
                    open={openDeleteDialog}
                    onOpenChange={setOpenDeleteDialog}
                    rows={selectedRows}
                    onDelete={() => handleDeleteExpense(selectedRows.map((row) => row.id))}
                    onSuccess={() => table.toggleAllRowsSelected(false)}
                />
            ) : null}
            {/*<Button*/}
            {/*    variant="outline"*/}
            {/*    size="sm"*/}
            {/*    onClick={() =>*/}
            {/*        exportTableToCSV(table, {*/}
            {/*            filename: "tasks",*/}
            {/*            excludeColumns: ["select", "actions"],*/}
            {/*        })*/}
            {/*    }*/}
            {/*    className="gap-2"*/}
            {/*>*/}
            {/*    <Download className="size-4" aria-hidden="true" />*/}
            {/*    Export*/}
            {/*</Button>*/}
            {/**
             * Other actions can be added here.
             * For example, import, view, etc.
             */}
        </div>
    )
}
