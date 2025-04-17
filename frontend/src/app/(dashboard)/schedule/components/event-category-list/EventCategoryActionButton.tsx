import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DataTableRowActionType } from "@/types";
import { DotsHorizontalIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import React, { Dispatch, SetStateAction } from "react";
import { EventCategory } from "./types";

interface IProps {
    row: EventCategory;
    setAction: Dispatch<SetStateAction<DataTableRowActionType | null>>;
}

export function EventCategoryActionButton({ row, setAction }: IProps) {
    const [isUpdatePending, startUpdateTransition] = React.useTransition();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <DotsHorizontalIcon aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-10">
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(DataTableRowActionType.UPDATE)}
                >
                    <Pencil1Icon />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(DataTableRowActionType.DELETE)}
                >
                    <TrashIcon />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 