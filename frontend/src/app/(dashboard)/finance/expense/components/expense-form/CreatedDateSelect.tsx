import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import React, {useState} from "react";
import moment from "moment/moment";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";

interface IProps {
    selectedCreatedDate: Date;
    setSelectedCreatedDate: (createdDate: Date) => void;
}

const TimeComponent = () => {
    return (
        <ScrollArea className="h-[15rem]">
            {Array.from({ length: 96 }).map((_, i) => {
                const hour = Math.floor(i / 4)
                    .toString()
                    .padStart(2, "0");
                const minute = ((i % 4) * 15)
                    .toString()
                    .padStart(2, "0");
                return (
                    <SelectItem key={i} value={`${hour}:${minute}`}>
                        {hour}:{minute}
                    </SelectItem>
                );
            })}
        </ScrollArea>
    )
}

export function CreatedDateSelect({
                                      selectedCreatedDate,
                                      setSelectedCreatedDate,
                                  }: IProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [time, setTime] = useState<string>("05:00");

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full font-normal",
                        !selectedCreatedDate && "text-muted-foreground",
                    )}
                >
                    {selectedCreatedDate ? (
                        moment(selectedCreatedDate).format("DD MMM YYYY, h:mm a")
                    ) : (
                        <span>Select created date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 flex items-start" align="end">
                <Calendar
                    // mode="single"
                    // selected={selectedCreatedDate}
                    // // selected={date}
                    // // initialFocus
                    // onSelect={(v) => setSelectedCreatedDate(v!)}
                    // className="rounded-md border"
                    onDayClick={() => setIsOpen(false)}
                    mode="single"
                    captionLayout="dropdown"
                    selected={selectedCreatedDate}
                    onSelect={(selectedDate) => {
                        const [hours, minutes] = time?.split(":");
                        selectedDate?.setHours(
                            parseInt(hours),
                            parseInt(minutes)
                        );
                        setSelectedCreatedDate(selectedDate!);
                    }}
                    // onDayClick={() => setIsOpen(false)}
                    // fromYear={2000}
                    // toYear={new Date().getFullYear()}
                    // disabled={(date) =>
                    //     Number(date) < Date.now() - 1000 * 60 * 60 * 24 ||
                    //     Number(date) > Date.now() + 1000 * 60 * 60 * 24 * 30
                    // }
                />

                {/*<Select*/}
                {/*    defaultValue={time!}*/}
                {/*    onValueChange={(e) => {*/}
                {/*        setTime(e);*/}
                {/*        if (selectedCreatedDate) {*/}
                {/*            const [hours, minutes] = e.split(":");*/}
                {/*            const newDate = new Date(selectedCreatedDate.getTime());*/}
                {/*            newDate.setHours(parseInt(hours), parseInt(minutes));*/}
                {/*            setSelectedCreatedDate(newDate);*/}
                {/*        }*/}
                {/*    }}*/}
                {/*    open={true}*/}
                {/*>*/}
                {/*    <SelectTrigger className="font-normal focus:ring-0 w-[120px] my-4 mr-2">*/}
                {/*        <SelectValue />*/}
                {/*    </SelectTrigger>*/}
                {/*    <SelectContent className="border-none shadow-none mr-2 fixed top-2 left-0">*/}
                {/*        <TimeComponent/>*/}
                {/*    </SelectContent>*/}
                {/*</Select>*/}
            </PopoverContent>
        </Popover>
    )
}