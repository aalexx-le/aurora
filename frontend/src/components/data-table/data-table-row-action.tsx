import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import React from "react";
import {DataTableRowActionState, DataTableRowActionType} from "@/types";
import {Row} from "@tanstack/react-table";
import { CopyIcon, DotsHorizontalIcon, TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";

interface IProps<RData> {
    row: Row<RData>,
    setRowAction: React.Dispatch<React.SetStateAction<DataTableRowActionState<RData> | null>>
}

export function DataTableRowAction<RData>({row, setRowAction}: IProps<RData>) {
    const [isUpdatePending, startUpdateTransition] = React.useTransition()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Open menu"
                    variant="ghost"
                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="size-4" aria-hidden="true"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                    onSelect={() => setRowAction({row, type: DataTableRowActionType.CREATE})}
                >
                    Duplicate
                    <DropdownMenuShortcut>
                        <CopyIcon/>
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => setRowAction({row, type: DataTableRowActionType.UPDATE})}
                >
                    Edit
                    <DropdownMenuShortcut>
                        <Pencil1Icon/>
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    onSelect={() => setRowAction({row, type: DataTableRowActionType.DELETE})}
                >
                    Delete
                    <DropdownMenuShortcut>
                        <TrashIcon/>
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}