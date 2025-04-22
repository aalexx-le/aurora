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
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { EventCategory } from "./types";

interface EventCategoryActionButtonProps {
    row: EventCategory;
    setAction: Dispatch<SetStateAction<DataTableRowActionType | null>>;
    children?: ReactNode;
}

export function EventCategoryActionButton({ row, setAction, children }: EventCategoryActionButtonProps) {
    const [isUpdatePending, startUpdateTransition] = React.useTransition();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                {children ? (
                    <div className="cursor-pointer">
                        {children}
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                    >
                        <DotsHorizontalIcon aria-hidden="true" />
                    </Button>
                )}
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
                    className="flex gap-2 text-destructive"
                    onSelect={() => setAction(DataTableRowActionType.DELETE)}
                >
                    <TrashIcon />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 