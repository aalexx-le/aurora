"use client"

import * as React from "react"
import {useEffect, useState} from "react"
import type {Table} from "@tanstack/react-table"
import {Check, ChevronsUpDown, Settings2} from "lucide-react"

import {cn, toSentenceCase} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {useIsMobile} from "@/hooks/use-mobile";

interface DataTableViewOptionsProps<TData> {
    table: Table<TData>,
    responsiveHideColumns?: string[]
}

export function DataTableViewOptions<TData>({
                                                table,
                                                responsiveHideColumns
                                            }: DataTableViewOptionsProps<TData>) {
    const [open, setOpen] = useState(false)

    const isMobile = useIsMobile()

    useEffect(() => {
        if (!isMobile) return
        if (!table || !responsiveHideColumns) return

        const columns = table.getAllColumns()
        columns.forEach((column) => {
            if (responsiveHideColumns.includes(column.id)) {
                column.toggleVisibility(false)
            }
        })
    }, [isMobile, table, responsiveHideColumns]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    aria-label="Toggle columns"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    size="sm"
                    className="ml-auto h-8 gap-2 lg:flex"
                >
                    <Settings2 className="size-4"/>
                    View
                    <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-0">
                <Command>
                    <CommandInput placeholder="Search columns..."/>
                    <CommandList>
                        <CommandEmpty>No columns found.</CommandEmpty>
                        <CommandGroup>
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <CommandItem
                                            key={column.id}
                                            onSelect={() =>
                                                column.toggleVisibility(!column.getIsVisible())
                                            }
                                        >
                                            <span className="truncate">
                                                {toSentenceCase(column.id)}
                                            </span>
                                            <Check
                                                className={cn(
                                                    "ml-auto size-4 shrink-0",
                                                    column.getIsVisible() ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    )
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
