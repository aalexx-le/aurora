import {DataTable} from "@/components/data-table/data-table";
import {
    getTransactionColumns
} from "@/app/dashboard/finance/bank-management/components/transaction-table/transactionColumns";
import {BankTransaction} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";
import {getCoreRowModel, getSortedRowModel, useReactTable} from "@tanstack/react-table";
import {DataTableRowActionState, DataTableRowActionType} from "@/types";
import {useMemo, useState} from "react";
import {DeleteDialog} from "@/app/dashboard/finance/bank-management/components/transaction-table/DeleteDialog";

interface IProps {
    transactions: BankTransaction[];
}

export default function TransactionTable({transactions}: IProps) {
    const [rowAction, setRowAction] = useState<DataTableRowActionState<BankTransaction> | null>(null)

    const columns = useMemo(
        () => getTransactionColumns({ setRowAction }),
        [setRowAction]
    )

    const table = useReactTable({
        data: transactions,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // initialState: {
        //     sorting: [{ id: "date", desc: false }],
        //     columnPinning: { right: ["actions"] },
        // },
    })

    // const advancedFilterFields: DataTableAdvancedFilterField<BankTransaction>[] = [
    //     {
    //         id: "id",
    //         label: "Transaction ID",
    //         type: "text",
    //     },
    //     {
    //         id: "date",
    //         label: "Date",
    //         type: "date",
    //     },
    // ]

    return (
        <>
            <DataTable table={table}/>
            {/*<UpdateTaskSheet*/}
            {/*    open={rowAction?.type === "update"}*/}
            {/*    onOpenChange={() => setRowAction(null)}*/}
            {/*    task={rowAction?.row.original ?? null}*/}
            {/*/>*/}
            {/*<UpdateTransactionSheet*/}
            {/*    open={rowAction?.type === DataTableRowActionType.UPDATE}*/}
            {/*    onOpenChange={() => setRowAction(null)}*/}
            {/*    task={rowAction?.row.original ?? null}*/}
            {/*/>*/}
            <DeleteDialog
                open={rowAction?.type === DataTableRowActionType.DELETE}
                onOpenChange={() => setRowAction(null)}
                rows={rowAction?.row.original ? [rowAction?.row.original] : []}
                showTrigger={false}
                onSuccess={() => rowAction?.row.toggleSelected(false)}
            />
        </>
    )
}