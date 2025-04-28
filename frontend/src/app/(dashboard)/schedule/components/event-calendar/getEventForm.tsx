"use client";

import { GradientPicker } from "@/components/ui/color-picker";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CreateEventInput } from "@/lib/schema/event";
import { RecurrenceInput } from "@/lib/schema/eventRecurrence";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { EventCategorySelect } from "../event-category-list/EventCategorySelect";
import { RecurrenceForm } from "../event-recurrence-list/RecurrenceForm";
import { DateTimePicker } from "./date-picker";
import { Textarea } from "./ui/textarea";


// If recurrenceForm is not provided, the recurrence options will not be shown
export const GetEventForm = (eventForm: UseFormReturn<CreateEventInput>, recurrenceForm?: UseFormReturn<RecurrenceInput>) => {
    const [recurrenceSummary, setRecurrenceSummary] = useState("");

    // Helper to create form field groups
    const FormGroup = ({ children }: { children: React.ReactNode }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    );

    // Get the current hasRecurrence value from form
    const hasRecurrence = eventForm.watch("hasRecurrence");

    return (
        <div className="space-y-6">
          {/* Event details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Event Details</h3>
            
            <FormGroup>
              {/* Name field */}
              <FormField
                control={eventForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Standup Meeting" {...field} autoFocus/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category field */}
              <FormField
                control={eventForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <EventCategorySelect
                        selectedCategoryId={field.value}
                        setSelectedCategoryId={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormGroup>
            
            {/* Description field */}
            <FormField
              control={eventForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Daily session" className="max-h-36" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormGroup>
              {/* Start Date field */}
              <FormField
                control={eventForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
                        weekStartsOn={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* End Date field */}
              <FormField
                control={eventForm.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        granularity="minute"
                        weekStartsOn={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormGroup>
            
            <FormGroup>
              <div className="flex flex-col gap-2">
                {/* All Day switch */}
                <FormField
                  control={eventForm.control}
                  name="allDay"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2 items-center">
                          <FormControl>
                          <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                          />
                          </FormControl>
                          <FormLabel>All Day</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recurrence Toggle */}
                {recurrenceForm && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <FormField
                        control={eventForm.control}
                        name="hasRecurrence"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex flex-row gap-2 items-center">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  id="recurrence-toggle"
                                />
                              </FormControl>
                              <FormLabel htmlFor="recurrence-toggle">Repeat this event</FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {hasRecurrence && (
                      <div className="text-sm text-muted-foreground">
                        {recurrenceSummary}
                      </div>
                    )}
                  </div> 
                )}
              </div>
              
              {/* Color field */}
              <FormField
                control={eventForm.control}
                name="color"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <GradientPicker
                        popupAlign="start"
                        background={field.value}
                        setBackground={field.onChange}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </FormGroup>
          </div>
          
          {/* Recurrence Options section - only shown when recurrence is enabled */}
          {recurrenceForm && hasRecurrence && (
            <div className="w-full space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">Recurrence Options</h3>
              <RecurrenceForm 
                form={recurrenceForm} 
                setRecurrenceSummary={setRecurrenceSummary}
              />
            </div>
          )}
        </div>
    );
};
