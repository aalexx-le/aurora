import { useCreatePortfolio } from "@/app/(dashboard)/finance/investment/components/portfolio/useCreatePortfolio";
import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { Button } from "@/components/ui/button";
import { Exchanges } from "@/gql/graphql";
import { EXCHANGE_GUIDES } from "@/lib/constants/crypto-exchanges";
import { CreateCryptoPortfolioInput, createCryptoPortfolioSchema } from "@/lib/schema/cryptoPortfolio";
import { AlertTriangle, ExternalLink, Plus, Shield } from "lucide-react";
import { getPortfolioForm } from "./getPortfolioForm";

const defaultValues: CreateCryptoPortfolioInput = {
  apiKey: "",
  secretKey: "",
  exchanges: Exchanges.Binance,
}

// Dynamic description component that reacts to form changes
function CreatePortfolioDescription({ exchanges }: { exchanges: Exchanges }) {
  const exchangeGuide = EXCHANGE_GUIDES[exchanges];

  return (
    <div className="space-y-4">
      {/* Exchange-Specific Guide */}
      {exchangeGuide && (
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm flex items-center gap-2">
              {exchangeGuide.name} API Setup Guide
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => window.open(exchangeGuide.apiCreateUrl, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              API Settings
            </Button>
          </div>

          {/* Quick Steps */}
          <div className="space-y-1.5">
            <h5 className="text-xs font-medium">Quick Setup Steps:</h5>
            <ol className="text-xs text-muted-foreground space-y-1">
              {exchangeGuide.stepByStepGuide.slice(0, 4).map((step) => (
                <li key={step.step} className="flex gap-2">
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded h-min">
                    {step.step}
                  </span>
                  <span className={step.highlight ? "font-medium text-yellow-500" : ""}>
                    {step.instruction}
                  </span>
                </li>
              ))}
              {exchangeGuide.stepByStepGuide.length > 4 && (
                <li className="text-xs text-blue-600 cursor-pointer" 
                    onClick={() => window.open(exchangeGuide.apiCreateUrl, '_blank')}>
                  → View complete guide on {exchangeGuide.name}
                </li>
              )}
            </ol>
          </div>
        </div>
      )}

      {/* Exchanges without guides */}
      {!exchangeGuide && exchanges !== Exchanges.All && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Limited Support
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {exchanges} is supported but doesn&apos;t have a detailed setup guide yet. 
                Please refer to the exchange&apos;s official API documentation for setup instructions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatePortfolioDialog() {
  const { createPortfolio, loading } = useCreatePortfolio();

  const handleSubmit = async (data: CreateCryptoPortfolioInput) => {
    try {
      await createPortfolio({
        variables: {
          data: {
            ...data,
            exchanges: data.exchanges as Exchanges,
          },
        },
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };

  return (
    <CreateOrUpdateDialog<CreateCryptoPortfolioInput>
      triggerButton={
        <Button variant="default" className="space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Portfolio</span>
        </Button>
      }
      title="Create Crypto Portfolio"
      description="Connect your crypto exchange to automatically track your portfolio balance and performance."
      formSchema={createCryptoPortfolioSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      loading={loading}
    >
      {(form) => (
        <>
          <CreatePortfolioDescription exchanges={form.watch("exchanges")} />
          {getPortfolioForm(form)}
        </>
      )}
    </CreateOrUpdateDialog>
  );
}
