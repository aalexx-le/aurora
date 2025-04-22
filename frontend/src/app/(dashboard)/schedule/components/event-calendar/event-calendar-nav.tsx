"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  changeCalendarView,
  generateDaysInMonth,
  goNext,
  goPrev,
  goToday,
  handleDayChange,
  handleMonthChange,
  handleYearChange,
  updateViewedDate
} from "@/lib/utils/calendar/calendar-utils";
import { calendarRef, CalendarView, months } from "@/lib/utils/calendar/data";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  GalleryVertical,
  Table,
  Tally3,
} from "lucide-react";
import { useState } from "react";
import { CreatEventDialog } from "./CreateEventDialog";
import { useEventCalendar } from "../../event-calendar-provider";

interface EventCalendarNavProps {
  calendarRef: calendarRef;
}

// View options configuration
const viewOptions = [
  {
    value: CalendarView.TimeGridDay,
    label: "Day",
    icon: <GalleryVertical className="h-5 w-5" />,
    todayLabel: "Today"
  },
  {
    value: CalendarView.TimeGridWeek,
    label: "Week",
    icon: <Tally3 className="h-5 w-5" />,
    todayLabel: "This Week"
  },
  {
    value: CalendarView.DayGridMonth,
    label: "Month",
    icon: <Table className="h-5 w-5 rotate-90" />,
    todayLabel: "This Month"
  }
];

export default function EventCalendarNav({ calendarRef }: EventCalendarNavProps) {
  const { currentView, setCurrentView, viewedDate, setViewedDate } = useEventCalendar();

  // Dropdown state
  const [daySelectOpen, setDaySelectOpen] = useState(false);
  const [monthSelectOpen, setMonthSelectOpen] = useState(false);

  // Date values
  const selectedMonth = viewedDate.getMonth() + 1;
  const selectedDay = viewedDate.getDate();
  const selectedYear = viewedDate.getFullYear();
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dayOptions = generateDaysInMonth(daysInMonth);

  const handleNavigation = (navFunction: (ref: calendarRef) => void) => {
    navFunction(calendarRef);
    updateViewedDate(calendarRef, setViewedDate);
  };
  
  const handleDateSelection = (
    handler: (ref: calendarRef, date: Date, value: string) => void,
    value: string,
    closeDropdown: () => void
  ) => {
    handler(calendarRef, viewedDate, value);
    updateViewedDate(calendarRef, setViewedDate);
    closeDropdown();
  };

  const handleViewChange = (view: CalendarView) => {
    changeCalendarView(calendarRef, view, setCurrentView);
    updateViewedDate(calendarRef, setViewedDate);
  };

  // Get current view configuration
  const currentViewConfig = viewOptions.find(v => v.value === currentView) || viewOptions[2];

  return (
    <div className="flex flex-wrap min-w-full gap-3">
      <div className="flex flex-row space-x-1">
        {/* Navigation buttons */}
        <Button variant="secondary" size="icon" onClick={() => handleNavigation(goPrev)}>
          <ChevronLeft/>
        </Button>

        {/* Day selector (only in day view) */}
        {currentView === CalendarView.TimeGridDay && (
          <Popover open={daySelectOpen} onOpenChange={setDaySelectOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-20 justify-between text-xs font-semibold"
              >
                {selectedDay ? dayOptions.find(d => d.value === String(selectedDay))?.label : "Select day..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search day..." />
                <CommandList>
                  <CommandEmpty>No day found.</CommandEmpty>
                  <CommandGroup>
                    {dayOptions.map(day => (
                      <CommandItem
                        key={day.value}
                        value={day.value}
                        onSelect={value => handleDateSelection(handleDayChange, value, () => setDaySelectOpen(false))}
                      >
                        <Check className={cn("mr-2 h-4 w-4", String(selectedDay) === day.value ? "opacity-100" : "opacity-0")} />
                        {day.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Month selector */}
        <Popover open={monthSelectOpen} onOpenChange={setMonthSelectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="flex w-[105px] justify-between overflow-hidden p-2 text-xs font-semibold md:text-sm md:w-[120px]"
            >
              {selectedMonth ? months.find(m => m.value === String(selectedMonth))?.label : "Select month..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search month..." />
              <CommandList>
                <CommandEmpty>No month found.</CommandEmpty>
                <CommandGroup>
                  {months.map(month => (
                    <CommandItem
                      key={month.value}
                      value={month.value}
                      onSelect={value => handleDateSelection(handleMonthChange, value, () => setMonthSelectOpen(false))}
                    >
                      <Check className={cn("mr-2 h-4 w-4", String(selectedMonth) === month.value ? "opacity-100" : "opacity-0")} />
                      {month.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Year input */}
        <Input
          className="w-[75px] md:w-[85px] text-xs md:text-sm font-semibold"
          type="number"
          value={selectedYear}
          onChange={event => {
            handleYearChange(calendarRef, viewedDate, event);
            updateViewedDate(calendarRef, setViewedDate);
          }}
        />

        {/* Next button */}
        <Button variant="secondary" size="icon" onClick={() => handleNavigation(goNext)}>
          <ChevronRight/>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* View selector tabs */}
        <Tabs defaultValue={CalendarView.DayGridMonth}>
          <TabsList>
            {viewOptions.map(view => (
              <TabsTrigger
                key={view.value}
                value={view.value}
                onClick={() => handleViewChange(view.value)}
                className={`space-x-1 flex-1`}
              >
                {view.icon}
                <p className="text-xs md:text-sm">{view.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Today/This Week/This Month button */}
        <Button
          className="w-[90px] text-xs md:text-sm"
          variant="outline"
          onClick={() => handleNavigation(goToday)}
        >
          {currentViewConfig.todayLabel}
        </Button>
      </div>

      <div className="ml-auto">
        <CreatEventDialog />
      </div>
    </div>
  );
}
