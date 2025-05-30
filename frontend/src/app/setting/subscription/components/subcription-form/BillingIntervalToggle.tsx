import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Interval } from "@/gql/graphql";
import { SubscriptionFormData } from "@/lib/schema/subscription";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";

interface BillingIntervalToggleProps {
  control: Control<SubscriptionFormData>;
  onIntervalChange?: (interval: Interval) => void;
}

export function BillingIntervalToggle({ 
  control, 
  onIntervalChange 
}: BillingIntervalToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Choose Your Plan</h1>
      
      <FormField
        control={control}
        name="billingInterval"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <span 
                className={cn(
                  "text-base", 
                  field.value === Interval.Month ? "font-semibold" : "text-muted-foreground"
                )}
              > 
                Monthly
              </span>
              <FormControl>
                <Switch
                  checked={field.value === Interval.Year}
                  onCheckedChange={(checked) => {
                    const newInterval = checked ? Interval.Year : Interval.Month;
                    field.onChange(newInterval);
                    onIntervalChange?.(newInterval);
                  }}
                />
              </FormControl>
              <span 
                className={cn(
                  "text-base", 
                  field.value === Interval.Year ? "font-semibold" : "text-muted-foreground"
                )}
              > 
                Yearly
              </span>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
} 