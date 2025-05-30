'use client';

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyMembershipSubscriptionQuery } from "../../hooks/useMyMembershipSubscriptionQuery";
import { SubscriptionCard } from "./SubscriptionCard";

export function SubscriptionList() {
  const { 
    subscriptions, 
    loading, 
    error,
  } = useMyMembershipSubscriptionQuery();
  
  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        <Skeleton className="h-36 w-full rounded-md" />
        <Skeleton className="h-36 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          Error loading subscriptions: {error.message}
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>No Subscriptions</CardTitle>
            <CardDescription>
              You don&apos;t have any subscriptions yet.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {subscriptions.map((subscription) => (
        <SubscriptionCard 
          key={subscription.id}
          subscription={subscription}
        />
      ))}
    </div>
  );
} 