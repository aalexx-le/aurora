import {ColumnDef} from "@tanstack/react-table";
import {BankTransaction} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";
import moment from "moment";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableRowAction} from "@/components/data-table/data-table-row-action";
import {Dispatch, SetStateAction} from "react";
import {DataTableRowActionState} from "@/types";


interface GetTransactionColumnsProps {
    setRowAction: Dispatch<SetStateAction<DataTableRowActionState<BankTransaction> | null>>
}

export const getTransactionColumns = ({setRowAction}: GetTransactionColumnsProps): ColumnDef<BankTransaction>[] => [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-0.5"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-0.5"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Transaction ID"/>
        ),
        cell: ({row}) => <div className="w-20">{row.original.id}</div>,
    },
    {
        accessorKey: 'createdAt',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Date"/>
        ),
        cell: ({row}) => <span>{moment(row.original.createdAt).format('DD MMM YYYY')}</span>,
    },
    {
        header: ({column}) => <DataTableColumnHeader column={column} title="Amount"/>,
        accessorKey: 'amount',
        cell: ({row: {original: {amount}}}) => (
            <span className={cn("font-bold", amount > 0 ? "text-chart-2" : "text-chart-5")}>
                {amount > 0 ? "+" : ""}<MoneyWithCurrency amount={amount}/>
            </span>
        ),
    },
    {
        header: "Description",
        accessorKey: 'description',
        cell: ({row}) => (
            <span className="w-20 truncate font-medium">
              {row.original.description}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({row}) => <DataTableRowAction setRowAction={setRowAction} row={row}/>
    }
]