import {ColumnDef} from "@tanstack/react-table";
import {Expense} from "@/app/dashboard/finance/bank-management/components/expense-table/types";
import moment from "moment";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableRowAction} from "@/components/data-table/data-table-row-action";
import React, {Dispatch, SetStateAction} from "react";
import {DataTableRowActionState} from "@/types";
import CategoryAvatar from "@/app/dashboard/finance/bank-management/components/category-list/CategoryAvatar";

interface GetExpenseColumnsProps {
    setRowAction: Dispatch<SetStateAction<DataTableRowActionState<Expense> | null>>
}

export const getExpenseColumns = ({setRowAction}: GetExpenseColumnsProps): ColumnDef<Expense>[] => [
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
        accessorKey: "category",
        accessorFn: (original) => original.category.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Category"/>,
        cell: ({row: {original: {category}}}) => (
            <div className="">
                <div className="w-min flex items-center p-2 gap-2 rounded-lg border shadow-sm">
                    <CategoryAvatar avatar={category.color} className="w-4 h-4"/>
                    <p className="max-w-[8rem] overflow-hidden text-nowrap text-sm font-medium leading-none">{category.name}</p>
                </div>
            </div>
        ),
        filterFn: "arrIncludesSome",
        size: 20
    },
    {
        header: ({column}) => <DataTableColumnHeader column={column} title="Name"/>,
        accessorKey: 'name',
        cell: ({row}) => (
            <span className="truncate font-medium">
              {row.original.name}
            </span>
        ),
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
            <span className="max-w-[31.25rem] truncate font-medium">
              {row.original.description}
            </span>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Date"/>
        ),
        cell: ({row}) => <span>{moment(row.original.createdAt).format('DD MMM YYYY H:mm a')}</span>,
    },
    {
        id: "actions",
        cell: ({row}) => <DataTableRowAction setRowAction={setRowAction} row={row}/>,
        size: 40
    }
]