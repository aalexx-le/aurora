import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { CexExchanges } from "@/gql/graphql";
import { CreateCryptoPortfolioInput } from "@/lib/schema/cryptoPortfolio";
import { UseFormReturn } from "react-hook-form";
import { ExchangeSelect } from "./ExchangeSelect";

export function getPortfolioForm(form: UseFormReturn<CreateCryptoPortfolioInput>) {
  const reviewExchanges = form.watch("exchanges");

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
              <Input {...field} />
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
            <FormLabel>
              API Key
              <span className="text-destructive"> (require)</span>
            </FormLabel>
            <FormControl>
              <Input {...field} />
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
            <FormLabel>
              Secret Key
              <span className="text-destructive"> (require)</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {reviewExchanges === CexExchanges.Okx && (
        <FormField
          control={form.control}
          name="passphrase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Passphrase
                <span className="text-destructive"> (require)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
} 