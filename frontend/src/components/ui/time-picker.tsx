"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TimePickerDemoProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePickerDemo({ date, setDate }: TimePickerDemoProps) {
  // Get hours and minutes from the date
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format hours and minutes to have leading zeros
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Update the date when hours or minutes change
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(e.target.value, 10);
    if (!isNaN(newHours) && newHours >= 0 && newHours <= 23) {
      const newDate = new Date(date);
      newDate.setHours(newHours);
      setDate(newDate);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(e.target.value, 10);
    if (!isNaN(newMinutes) && newMinutes >= 0 && newMinutes <= 59) {
      const newDate = new Date(date);
      newDate.setMinutes(newMinutes);
      setDate(newDate);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <Label htmlFor="hours" className="text-xs text-muted-foreground">
            Hours
          </Label>
          <Input
            id="hours"
            className="h-8"
            value={formattedHours}
            onChange={handleHoursChange}
            min={0}
            max={23}
            type="number"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="minutes" className="text-xs text-muted-foreground">
            Minutes
          </Label>
          <Input
            id="minutes"
            className="h-8"
            value={formattedMinutes}
            onChange={handleMinutesChange}
            min={0}
            max={59}
            type="number"
          />
        </div>
      </div>
    </div>
  );
}