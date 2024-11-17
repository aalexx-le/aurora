import {ColumnDef} from "@tanstack/react-table";
import moment from "moment";
import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableRowAction} from "@/components/data-table/data-table-row-action";
import React, {Dispatch, SetStateAction} from "react";
import {DataTableRowActionState} from "@/types";
import {Expense} from "@/app/(dashboard)/finance/components/expense-table/types";
import {CategoryBadge} from "@/app/(dashboard)/finance/components/category-list/CategoryBadge";

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
        size: 40
    },
    {
        accessorKey: "category",
        accessorFn: (original) => original.category.name,
        header: ({column}) => <DataTableColumnHeader column={column} title="Category"/>,
        cell: ({row: {original: {category}}}) => (
            <CategoryBadge category={category as ExpenseCategory} className="max-w-[3rem] sm:max-w-[8rem] lg:max-w-[16rem]"/>
        ),
        filterFn: "arrIncludesSome",
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
            <span className="md:max-w-[32rem] max-w-[10rem] truncate font-medium">
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