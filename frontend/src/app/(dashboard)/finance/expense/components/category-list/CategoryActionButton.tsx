import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import React, {Dispatch, SetStateAction} from "react";
import {DotsHorizontalIcon, Pencil1Icon, TrashIcon} from "@radix-ui/react-icons";
import {DataTableRowActionType} from "@/types";
import {ChartSplineIcon} from "lucide-react";

interface IProps<RData> {
    row: RData,
    setAction: Dispatch<SetStateAction<DataTableRowActionType | null>>
}

export function CategoryActionButton<RData>({row, setAction}: IProps<RData>) {
    const [isUpdatePending, startUpdateTransition] = React.useTransition()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <DotsHorizontalIcon aria-hidden="true"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-10">
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(DataTableRowActionType.UPDATE)}
                >
                    <Pencil1Icon/>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(DataTableRowActionType.CREATE)}
                >
                    <ChartSplineIcon size="16"/>
                    Add Monthly Target
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                    className="flex gap-2"
                    onSelect={() => setAction(DataTableRowActionType.DELETE)}
                >
                    <TrashIcon/>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}