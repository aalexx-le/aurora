import { CREATE_CRYPTO_PORTFOLIO, GET_CRYPTO_PORTFOLIOS } from "@/api/script/crypto/crypto";
import { CreateDialog } from "@/components/create-dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { CexExchanges } from "@/gql/graphql";
import { CreateCryptoPortfolioInput, createCryptoPortfolioSchema } from "@/lib/schema/cryptoPortfolio";
import { useAppSelector } from "@/state/hooks";
import { useMutation } from '@apollo/client';
import { useForm } from "react-hook-form";
import { ExchangeSelect } from "./ExchangeSelect";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useCreatePortfolio} from "@/app/(dashboard)/finance/investment/components/portfolio/useCreatePortfolio";
import {DialogDescription} from "@/components/ui/dialog";

const defaultValues: CreateCryptoPortfolioInput = {
  apiKey: "",
  secretKey: "",
  exchanges: CexExchanges.Binance,
}

const CreatePortfolioDialog = () => {
  const form = useForm<CreateCryptoPortfolioInput>({
    resolver: zodResolver(createCryptoPortfolioSchema),
    defaultValues
  });
  const reviewExchanges = form.watch("exchanges");

  const {createPortfolio, createOKXPortfolio, loading} = useCreatePortfolio()

  const handleSubmit = async (data: CreateCryptoPortfolioInput) => {
    if (data.exchanges == CexExchanges.Okx) {
      await createOKXPortfolio({
        variables: {
          data: {
            ...data,
            exchanges: data.exchanges as CexExchanges,
            passphrase: data.passphrase as string,
          },
        },
      });
    }
    else {
      await createPortfolio({
        variables: {
          data: {
            ...data,
            exchanges: data.exchanges as CexExchanges,
          },
        },
      });
    }
  };

  return (
    <CreateDialog<CreateCryptoPortfolioInput>
      title="New Portfolio"
      description={
        <DialogDescription className="flex items-center">
          How get API keys?
          <Button asChild variant="link">
            <a
                target="_blank"
                href={
                  "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
                }
            >
              binance
            </a>
          </Button>
        </DialogDescription>
      }
      form={form}
      formSchema={createCryptoPortfolioSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      loading={loading}
      triggerButton={
        <Button
            variant="outline"
            size="icon"
        >
          <Plus className="h-4 w-4"/>
        </Button>
      }
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Name</FormLabel>
                <FormControl>
                  <Input placeholder="Portfolio name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
              control={form.control}
              name="exchanges"
              render={({field}) => (
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
                    <FormMessage/>
                  </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Portfolio Name
                      <span className="text-muted-foreground"> (optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="apiKey"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      API Key
                      <span className="text-destructive"> (require)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
          />
          <FormField
              control={form.control}
              name="secretKey"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Secret Key
                      <span className="text-destructive"> (require)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
          />
          {reviewExchanges === CexExchanges.Okx && <FormField
              control={form.control}
              name="passphrase"
              render={({field}) => (
                  <FormItem>
                    <FormLabel>
                      Passphrase
                      <span className="text-destructive"> (require)</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password"/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
              )}
          />}
        </>
      )}
    </CreateDialog>
  );
};

export default CreatePortfolioDialog;
