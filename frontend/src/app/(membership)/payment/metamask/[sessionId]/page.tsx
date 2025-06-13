'use client';

import { useDiscountQuery } from '@/app/(membership)/hooks/useDiscount';
import { useSubscriptionPlans } from '@/app/(membership)/hooks/useSubscriptionPlans';
import { MetaMaskPaymentData } from '@/app/(membership)/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { GetPaymentSessionQuery } from '@/gql/graphql';
import MEMBERSHIP_ROUTE from '@/lib/routes/membership-plan.route';
import SETTING_ROUTE from '@/lib/routes/setting.route';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useGetPaymentSession } from '../../../hooks/payment/usePaymentSession';
import { MetaMaskPayment } from '../../components/metamask-payment/MetaMaskPayment';
import { PaymentContextCard } from '../../components/metamask-payment/PaymentContextCard';
import { PaymentHeader } from '../../components/metamask-payment/PaymentHeader';
import { PaymentPageSkeleton } from '../../components/skeletons';

interface MetaMaskSessionPaymentPageProps {
  sessionData?: GetPaymentSessionQuery['getPaymentSession'];
  sessionLoading: boolean;
  sessionError: any;
}

function MetaMaskSessionPaymentPage({ 
  sessionData, 
  sessionLoading, 
  sessionError 
}: MetaMaskSessionPaymentPageProps) {
  const router = useRouter();
  const { loading: plansLoading, getPlanById, getPlanPriceById } = useSubscriptionPlans();
  
  // Fetch discount data if discountId exists
  const { 
    data: discountData, 
    loading: discountLoading, 
  } = useDiscountQuery(sessionData?.discountId || '');

  const loading = sessionLoading || discountLoading || plansLoading;

  if (loading) {
    return <PaymentPageSkeleton />;
  }

  if (sessionError || !sessionData) { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {sessionError?.message || 'Failed to load payment session. Please try again.'}
              </AlertTitle>
              <AlertDescription>
                Please back to plans and try again.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => router.push(MEMBERSHIP_ROUTE.plan.value)}
                variant="outline"
              >
                Back to Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find the plan
  const plan = getPlanById(sessionData.planId);
  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Plan not found. Please select a valid plan.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => router.push(MEMBERSHIP_ROUTE.plan.value)}
                variant="outline"
              >
                Back to Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find the price
  const price = getPlanPriceById(sessionData.priceId);
  if (!price) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full max-w-2xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Price information not found. Please try again.
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => router.push(MEMBERSHIP_ROUTE.plan.value)}
                variant="outline"
              >
                Back to Plans
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = !!sessionData.discountId && !!sessionData.discountAmount;
  const sessionExpiresAt = new Date(sessionData.expiresAt);
  
  // Get the actual discount from the query
  const actualDiscount = discountData?.getDiscount;

  // Prepare payment data for MetaMaskPayment component
  const paymentData: MetaMaskPaymentData = {
    amount: sessionData.finalAmount,
    currency: price.unitPrice.currencyCode,
    plan: plan,
    discount: hasDiscount && actualDiscount ? actualDiscount : undefined,
    discountCode: hasDiscount && actualDiscount ? actualDiscount.code || undefined : undefined,
    sessionId: sessionData.sessionId,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto space-y-6">
          {/* Payment Header */}
          <PaymentHeader
            onBack={() => router.push(MEMBERSHIP_ROUTE.plan.value)}
            sessionExpiresAt={sessionExpiresAt.toISOString()}
            title="Complete Your Payment"
          />

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Context - Left Column (Mobile: Order 2, Desktop: Order 1) */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <PaymentContextCard
                plan={plan}
                price={price}
                originalAmount={hasDiscount ? sessionData.finalAmount + (sessionData.discountAmount || 0) : undefined}
                discountAmount={sessionData.discountAmount}
                finalAmount={sessionData.finalAmount}
                currency={price.unitPrice.currencyCode}
                hasDiscount={hasDiscount || false}
              />
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <MetaMaskPayment 
                paymentData={paymentData}
                onPaymentSuccess={() => {
                  router.push(SETTING_ROUTE.subscription.value);
                }}
              />
            </div>
          </div>

          {/* Footer Help Section */}
          <div className="mt-8 text-center border-t pt-6">
            <div className="inline-flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Need help?</span>
              <Button variant="link" className="h-auto p-0 text-sm">
                Contact Support
              </Button>
              <span className="h-1 w-1 bg-muted-foreground rounded-full"></span>
              <Button variant="link" className="h-auto p-0 text-sm">
                FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetaMaskSessionPaymentContainerProps {
  params: { sessionId: string };
}

function MetaMaskSessionPaymentContainer({ params }: MetaMaskSessionPaymentContainerProps) {
  const { data, loading, error } = useGetPaymentSession(params.sessionId);

  return (
    <MetaMaskSessionPaymentPage 
      sessionData={data}
      sessionLoading={loading}
      sessionError={error}
    />
  );
}

export default function MetaMaskSessionPaymentRoute({ params }: { params: { sessionId: string } }) {
  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <MetaMaskSessionPaymentContainer params={params} />
    </Suspense>
  );
} 