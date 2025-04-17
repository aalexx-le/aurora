'use client';

import { Skeleton } from "@/components/ui/skeleton";

export const DashboardCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 p-6 bg-card backdrop-blur-sm rounded-xl border shadow-lg h-full">
      <Skeleton className="h-8 w-3/4 rounded-md" />
      <Skeleton className="h-24 w-full rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
  );
};
