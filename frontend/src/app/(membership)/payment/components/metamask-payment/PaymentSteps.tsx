'use client'

import { Badge } from '@/components/ui/badge';
import { usePayment } from '@/hooks/usePayment';
import { PaymentStepStatus } from '@/lib/utils/metamask-payment';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import React from 'react';

export const PaymentSteps: React.FC = () => {
  const { state } = usePayment();

  const getStepIcon = (status: PaymentStepStatus) => {
    switch (status) {
      case PaymentStepStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case PaymentStepStatus.ERROR:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case PaymentStepStatus.ACTIVE:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Payment Progress</h4>
      <div className="space-y-3">
        {state.paymentSteps.map((step) => (
          <div key={step.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            <Badge variant={
              step.status === PaymentStepStatus.COMPLETED ? "default" :
              step.status === PaymentStepStatus.ERROR ? "destructive" :
              step.status === PaymentStepStatus.ACTIVE ? "secondary" : "outline"
            }>
              {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}; 