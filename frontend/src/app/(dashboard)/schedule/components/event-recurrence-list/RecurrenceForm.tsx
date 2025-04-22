"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { RecurrenceType } from "@/gql/graphql";
import { RecurrenceInput } from "@/lib/schema/eventRecurrence";
import { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { DateTimePicker } from "../event-calendar/date-picker";

interface RecurrenceFormProps {
  form: UseFormReturn<RecurrenceInput>;
  setRecurrenceSummary: (summary: string) => void;
}

// Constants
const WEEKDAYS = [
  { value: "0", label: "Mon" },
  { value: "1", label: "Tue" },
  { value: "2", label: "Wed" },
  { value: "3", label: "Thu" },
  { value: "4", label: "Fri" },
  { value: "5", label: "Sat" },
  { value: "6", label: "Sun" },
];

const FREQUENCY_OPTIONS = [
  { value: RecurrenceType.Daily, label: "Daily", unit: "day(s)" },
  { value: RecurrenceType.Weekly, label: "Weekly", unit: "week(s)" },
  { value: RecurrenceType.Monthly, label: "Monthly", unit: "month(s)" },
  { value: RecurrenceType.Yearly, label: "Yearly", unit: "year(s)" }
];

enum EndType {
  DATE = "date",
  COUNT = "count"
}

export const RecurrenceForm = ({ form, setRecurrenceSummary }: RecurrenceFormProps) => {
  // Watch form values
  const [type, interval, daysOfWeek, endDate, endCount] = form.watch([
    "type", 
    "interval", 
    "daysOfWeek",
    "endDate",
    "endCount"
  ]);
  
  // Derived state
  const recurrenceType = type || RecurrenceType.Daily;
  const currentFrequency = FREQUENCY_OPTIONS.find(f => f.value === recurrenceType);
  
  // Determine end type based on watched values
  const endType = endDate ? EndType.DATE : endCount ? EndType.COUNT : EndType.DATE;
  
  // Derived UI state
  const showWeeklyOptions = recurrenceType === RecurrenceType.Weekly;
  const showMonthlyOptions = recurrenceType === RecurrenceType.Monthly;
  const showDatePicker = endType === EndType.DATE;
  const showCountInput = endType === EndType.COUNT;

  // Create default end date (1 year from now)
  const getDefaultEndDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  };
  
  // Generate summary text for recurrence
  const getSummary = useMemo(() => {
    if (!type) return "";
    
    let summary = `Repeats every ${interval || 1} ${currentFrequency?.unit || ""}`;
    
    if (endType === EndType.DATE && endDate) {
      summary += ` until ${endDate instanceof Date ? endDate.toLocaleDateString() : new Date(endDate).toLocaleDateString()}`;
    } else if (endType === EndType.COUNT && endCount) {
      summary += ` for ${endCount} occurrences`;
    }
    
    return summary;
  }, [type, interval, endDate, endCount, endType, currentFrequency]);
  
  // Update summary when it changes
  useEffect(() => {
    setRecurrenceSummary(getSummary);
  }, [getSummary, setRecurrenceSummary]);
  
  // Initialize form with defaults if needed
  useEffect(() => {
    if (!type) {
      form.setValue("type", RecurrenceType.Daily);
    }
    
    if (!interval) {
      form.setValue("interval", 1);
    }
    
    if (!endDate && !endCount) {
      form.setValue("endDate", getDefaultEndDate());
    }
  }, [form, type, interval, endDate, endCount]);

  // Handler for frequency type change
  const handleFrequencyChange = (value: RecurrenceType) => {
    form.setValue("type", value);
    
    // Clear irrelevant fields
    if (value !== RecurrenceType.Weekly) {
      form.setValue("daysOfWeek", undefined);
    }
    if (value !== RecurrenceType.Monthly) {
      form.setValue("dayOfMonth", undefined);
      form.setValue("weekOfMonth", undefined);
      form.setValue("dayOfWeek", undefined);
    }
  };

  // Handler for end type change
  const handleEndTypeChange = (value: EndType) => {    
    if (value === EndType.DATE) {
      form.setValue("endCount", undefined);
      
      // Set default end date if needed
      if (!endDate) {
        form.setValue("endDate", getDefaultEndDate());
      }
    } else {
      form.setValue("endDate", undefined);
      
      // Set default count if needed
      if (!endCount) {
        form.setValue("endCount", 10);
      }
    }
  };

  // Handler for weekday selection
  const handleWeekdayChange = (checked: boolean, day: string) => {
    const currentDaysOfWeek = daysOfWeek || "";
    const daysArray = currentDaysOfWeek.split(",").filter(d => d !== "");
    
    if (checked && !daysArray.includes(day)) {
      daysArray.push(day);
    } else if (!checked && daysArray.includes(day)) {
      daysArray.splice(daysArray.indexOf(day), 1);
    }
    
    form.setValue("daysOfWeek", daysArray.join(","));
  };

  return (
    <Accordion 
      type="single" 
      defaultValue="recurrence-options" 
      collapsible 
      className="w-full mt-2"
    >
      <AccordionItem value="recurrence-options">
        <AccordionTrigger className="text-sm font-medium">
          Recurrence Details
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2 px-1">
            {/* Frequency Selection */}
            <div>
              <FormLabel>Repeat frequency</FormLabel>
              <RadioGroup
                value={recurrenceType}
                onValueChange={(value) => handleFrequencyChange(value as RecurrenceType)}
                className="grid grid-cols-2 gap-2 mt-2"
              >
                {FREQUENCY_OPTIONS.map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value.toLowerCase()} />
                    <FormLabel htmlFor={value.toLowerCase()}>{label}</FormLabel>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Interval Input */}
            <div className="flex items-center space-x-2">
              <FormLabel className="min-w-24">Repeat every</FormLabel>
              <FormField
                control={form.control}
                name="interval"
                defaultValue={1}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="w-16"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || 1);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span>{currentFrequency?.unit}</span>
            </div>

            {/* Weekly Options */}
            {showWeeklyOptions && (
              <div className="space-y-2">
                <FormLabel>Repeat on</FormLabel>
                <div className="grid grid-cols-4 gap-2">
                  {WEEKDAYS.map((day) => {
                    const daysArray = (daysOfWeek || "").split(",").filter(d => d !== "");
                    const isChecked = daysArray.includes(day.value);
                    return (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            handleWeekdayChange(!!checked, day.value)
                          }
                        />
                        <label htmlFor={`day-${day.value}`}>{day.label}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly Options */}
            {showMonthlyOptions && (
              <div className="flex items-center space-x-2">
                <FormLabel className="min-w-24">Day of month</FormLabel>
                <FormField
                  control={form.control}
                  name="dayOfMonth"
                  defaultValue={1}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={31}
                          className="w-16"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Separator />

            {/* End Options */}
            <div>
              <FormLabel className="mb-2 block">Ends</FormLabel>
              <RadioGroup
                value={endType}
                onValueChange={(value) => handleEndTypeChange(value as EndType)}
                className="space-y-4"
              >                    
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={EndType.DATE} id="on-date" />
                  <FormLabel htmlFor="on-date" className="min-w-20">On date</FormLabel>
                  {showDatePicker && (
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormControl>
                          <DateTimePicker
                            value={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : undefined}
                            onChange={field.onChange}
                            granularity="day"
                          />
                        </FormControl>
                      )}
                    />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={EndType.COUNT} id="after-occurrences" />
                  <FormLabel htmlFor="after-occurrences" className="min-w-20">After</FormLabel>
                  {showCountInput && (
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="endCount"
                        defaultValue={10}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                className="w-16"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <span>occurrences</span>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}; 