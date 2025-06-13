import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { isPassphraseRequired } from "@/lib/constants/crypto-exchanges";
import { CreateCryptoPortfolioInput } from "@/lib/schema/cryptoPortfolio";
import { AlertTriangle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ExchangeSelect } from "./ExchangeSelect";

export function getPortfolioForm(form: UseFormReturn<CreateCryptoPortfolioInput>) {
  const selectedExchange = form.watch("exchanges");
  const requiresPassphrase = selectedExchange ? isPassphraseRequired(selectedExchange) : false;

  return (
    <>
      <FormField
        control={form.control}
        name="exchanges"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Exchanges
            </FormLabel>
            <FormControl>
              <ExchangeSelect
                selectedExchanges={form.getValues("exchanges")}
                setSelectedExchanges={(v) =>
                  form.setValue("exchanges", v)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Portfolio Name
              <span className="text-muted-foreground"> (optional)</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter portfolio name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="apiKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              API Key
              <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1">
                <AlertTriangle className="h-3 w-3" />
                Required
              </Badge>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your API key" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="secretKey"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              Secret Key
              <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1">
                <AlertTriangle className="h-3 w-3" />
                Required
              </Badge>
            </FormLabel>
            <FormControl>
              <Input {...field} type="password" placeholder="Enter your secret key" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Dynamic Passphrase Field with Consistent Badge System */}
      {requiresPassphrase && (
        <FormField
          control={form.control}
          name="passphrase"
          render={({ field }) => (
            <FormItem className="animate-in slide-in-from-top-2 duration-200">
              <FormLabel className="flex items-center gap-2">
                Passphrase
                <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1">
                  <AlertTriangle className="h-3 w-3" />
                  Required
                </Badge>
              </FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Enter your passphrase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}


    </>
  );
} 