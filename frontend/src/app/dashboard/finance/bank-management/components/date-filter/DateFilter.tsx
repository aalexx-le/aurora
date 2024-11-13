import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import React from "react";
import {useDateFilterContext} from "@/lib/context/date-range.context";

interface IProps {
}

export default function DateFilter({}: IProps) {
    const { dateRange, setDateRange } = useDateFilterContext();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !dateRange && "text-muted-foreground",
                    )}
                >
                    {dateRange ? (
                        dateRange.from?.toLocaleDateString() +
                        " - " +
                        dateRange.to?.toLocaleDateString()
                    ) : (
                        <span>Filter date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    // selected={date}
                    // initialFocus
                    onSelect={(v) => setDateRange(v!)}
                    className="rounded-md border"
                />
            </PopoverContent>
        </Popover>
    );
}
