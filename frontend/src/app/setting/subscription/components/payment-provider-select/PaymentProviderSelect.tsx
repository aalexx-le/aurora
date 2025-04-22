import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PaymentProvider } from "@/gql/graphql";
import { ChevronsUpDown } from "lucide-react";
import React from "react";

export type PaymentProviderInfo = {
  value: string;
  label: string;
  avatarUrl: string;
};

interface PaymentProviderSelectProps {
  selectedProvider: PaymentProvider;
  setSelectedProvider: (provider: PaymentProvider) => void;
  buttonClassName?: string;
}

const paymentProviders: PaymentProviderInfo[] = [
  {
    value: PaymentProvider.Paddle,
    label: 'Paddle',
    avatarUrl: 'https://media.licdn.com/dms/image/v2/C4D0BAQGJ3Hn5Sq_ZsA/company-logo_200_200/company-logo_200_200/0/1645019600366/paddle_logo?e=2147483647&v=beta&t=nbWAnjYglJFpsZhUKI2tgkrES5i53T0wSYZIKV070IY',
  },
  // Add more providers here
];

export function PaymentProviderSelect({ selectedProvider, setSelectedProvider, buttonClassName }: PaymentProviderSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = paymentProviders.find((p) => p.value === selectedProvider);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`justify-between w-[10rem] ${buttonClassName || ""}`}
          aria-expanded={open}
        >
          {selected ? (
            <div className="flex flex-row gap-2 items-center">
              <Avatar className="h-4 w-4 rounded-lg">
                <AvatarImage src={selected.avatarUrl} alt={selected.label} />
                <AvatarFallback>{selected.label[0]}</AvatarFallback>
              </Avatar>
              {selected.label}
            </div>
          ) : (
            <p className="text-muted-foreground">Select payment provider...</p>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 popover-content-width-full">
        <Command>
          <CommandList>
            <CommandEmpty>No provider found.</CommandEmpty>
            <CommandGroup>
              {paymentProviders.map((provider) => (
                <CommandItem
                  key={provider.value}
                  value={provider.value}
                  onSelect={() => {
                    setSelectedProvider(provider.value as PaymentProvider);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-4 w-4 rounded-lg">
                      <AvatarImage src={provider.avatarUrl} alt={provider.label} />
                      <AvatarFallback>{provider.label[0]}</AvatarFallback>
                    </Avatar>
                    <span>{provider.label}</span>
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