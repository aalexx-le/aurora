import { Trade } from "@/app/(dashboard)/finance/investment/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTable } from "@/lib/hooks/use-data-table";
import { DataTableAdvancedFilterField, DataTableRowActionState, } from "@/types";
import {
    ColumnFiltersState
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { getTradeColumns } from "./tradeColumns";
// import {TradeTableToolbarActions} from "./TradeTableToolbarActions";

interface IProps {
    trades: Trade[];
}

export default function TradeTable({trades}: IProps) {
    const [rowAction, setRowAction] = useState<DataTableRowActionState<Trade> | null>(null);

    const columns = useMemo(() => getTradeColumns({setRowAction}), [setRowAction]);

    const filterFields: DataTableAdvancedFilterField<Trade>[] = [
        {
            id: "time",
            label: "Time",
            type: "date",
            // options: Array.from(new Set(trades.map(t => t.cryptoPortfolio.name))).map(name => ({
            //     label: name,
            //     value: name
            // }))
        },
        {
            id: "price",
            label: "Price",
            type: "number",
        }
        // {
        //     id: "cryptoPortfolio",
        //     label: "Exchange",
        //     type: "multi-select",
        //     options: EXCHANGES_INFOS.map(exchange => ({
        //         label: exchange.name,
        //         value: exchange.id,
        //         icon: exchange.logo
        //     }))
        // },
        // {
        //     id: "commissionAsset",
        //     label: "Commission Asset",
        //     type: "multi-select",
        //     options: Array.from(new Set(trades.map(t => t.commissionAsset))).map(asset => ({
        //         label: asset,
        //         value: asset
        //     }))
        // }
    ];

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    // const table = useReactTable({
    //     data: trades,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     onColumnFiltersChange: setColumnFilters,
    //     initialState: {
    //         pagination: {
    //             pageSize: 50
    //         }
    //     },
    //     state: {
    //         columnFilters,
    //     },
    //     defaultColumn: {
    //         size: 10,
    //         minSize: 5,
    //         maxSize: 20
    //     }
    // });

    const { table } = useDataTable({
        data: trades,
        columns,
        pageCount: -1,
        filterFields,
        enableAdvancedFilter: false,
        initialState: {
            sorting: [{ id: "time", desc: true }],
            // columnPinning: { right: ["actions"] },
        },
        getRowId: (originalRow, i) => i + originalRow.time,
        shallow: false,
        clearOnDefault: true,
    })

    return (
        <>
            <DataTable table={table} pageSizeOptions={[10, 50, 100]}>
                {/*<DataTableToolbar table={table} filterFields={filterFields}>*/}
                {/*    /!*<TradeTableToolbarActions table={table}/>*!/*/}
                {/*    <DataTableViewOptions table={table} responsiveHideColumns={["commissionAsset", "time"]}/>*/}
                {/*</DataTableToolbar>*/}
                <DataTableAdvancedToolbar
                    table={table}
                    filterFields={filterFields}
                    shallow={false}
                >
                    <DataTableViewOptions table={table} responsiveHideColumns={["commissionAsset", "time"]}/>
                </DataTableAdvancedToolbar>
            </DataTable>

            {/*{rowAction && (*/}
            {/*    <>*/}
            {/*        <DuplicateTradeSheet*/}
            {/*            open={rowAction.type === DataTableRowActionType.CREATE}*/}
            {/*            onOpenChange={() => setRowAction(null)}*/}
            {/*            trade={rowAction.row.original}*/}
            {/*        />*/}
            {/*        <UpdateTradeSheet*/}
            {/*            open={rowAction.type === DataTableRowActionType.UPDATE}*/}
            {/*            onOpenChange={() => setRowAction(null)}*/}
            {/*            trade={rowAction.row.original}*/}
            {/*        />*/}
            {/*        <DeleteDialog*/}
            {/*            open={rowAction.type === DataTableRowActionType.DELETE}*/}
            {/*            onOpenChange={() => setRowAction(null)}*/}
            {/*            rows={[rowAction.row.original]}*/}
            {/*            showTrigger={false}*/}
            {/*            onDelete={() => handleDeleteTrade(rowAction.row.original.id)}*/}
            {/*            onSuccess={() => rowAction.row.toggleSelected(false)}*/}
            {/*        />*/}
            {/*    </>*/}
            {/*)}*/}
        </>
    );
}