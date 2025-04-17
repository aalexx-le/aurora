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
import { UseFormReturn } from "react-hook-form";
import { EventCategorySelect } from "../event-category-list/EventCategorySelect";
import { DateTimePicker } from "./date-picker";
import { Textarea } from "./ui/textarea";

export const getEventForm = (form: UseFormReturn<CreateEventInput>) => {
    return (
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Standup Meeting" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
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
          <FormField
            control={form.control}
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
          <FormField
            control={form.control}
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
          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-2 items-center">
                    <FormLabel>All Day</FormLabel>
                    <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({field}) => (
                <FormItem>
                    <FormControl>
                        <GradientPicker
                            popupAlign="start"
                            background={form.getValues("color")}
                            setBackground={(color) => form.setValue('color', color)}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <EventCategorySelect
                    selectedCategoryId={form.getValues("categoryId")}
                    setSelectedCategoryId={(id) => form.setValue("categoryId", id)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="reminderMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder Minutes</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurrence</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </>
    )
}
