import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

export type PaymentMethodInfo = {
  id: string;
  label: string;
  avatarUrl?: string;
};

interface PaymentMethodSelectProps {
  methods: PaymentMethodInfo[];
  selectedMethodId: string;
  setSelectedMethodId: (id: string) => void;
  buttonClassName?: string;
}

export function PaymentMethodSelect({ methods, selectedMethodId, setSelectedMethodId, buttonClassName }: PaymentMethodSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = methods.find((m) => m.id === selectedMethodId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`justify-between w-full ${buttonClassName || ""}`}
          aria-expanded={open}
        >
          {selected ? (
            <div className="flex flex-row gap-2 items-center">
              {selected.avatarUrl && (
                <Avatar className="h-4 w-4 rounded-lg">
                  <AvatarImage src={selected.avatarUrl} alt={selected.label} />
                  <AvatarFallback>{selected.label[0]}</AvatarFallback>
                </Avatar>
              )}
              {selected.label}
            </div>
          ) : (
            <p className="text-muted-foreground">Select payment method...</p>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 popover-content-width-full">
        <Command>
          <CommandInput placeholder="Search methods..." />
          <CommandList>
            <CommandEmpty>No method found.</CommandEmpty>
            <CommandGroup>
              {methods.map((method) => (
                <CommandItem
                  key={method.id}
                  value={method.id}
                  onSelect={() => {
                    setSelectedMethodId(method.id);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {method.avatarUrl && (
                      <Avatar className="h-4 w-4 rounded-lg">
                        <AvatarImage src={method.avatarUrl} alt={method.label} />
                        <AvatarFallback>{method.label[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <span>{method.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 