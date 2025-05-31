import { useCreatePortfolio } from "@/app/(dashboard)/finance/investment/components/portfolio/useCreatePortfolio";
import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@/components/ui/dialog";
import { CexExchanges } from "@/gql/graphql";
import { CreateCryptoPortfolioInput, createCryptoPortfolioSchema } from "@/lib/schema/cryptoPortfolio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { getPortfolioForm } from "./getPortfolioForm";

const defaultValues: CreateCryptoPortfolioInput = {
  apiKey: "",
  secretKey: "",
  exchanges: CexExchanges.Binance,
}

const CreatePortfolioDialog = () => {
  const { createPortfolio, createOKXPortfolio, loading: createPortfolioLoading } = useCreatePortfolio();
  
  const form = useForm<CreateCryptoPortfolioInput>({
    resolver: zodResolver(createCryptoPortfolioSchema),
    defaultValues
  });

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
    <CreateOrUpdateDialog<CreateCryptoPortfolioInput>
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
      loading={createPortfolioLoading}
      triggerButton={
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      }
    >
      {(form) => getPortfolioForm(form)}
    </CreateOrUpdateDialog>
  );
};

export default CreatePortfolioDialog;
