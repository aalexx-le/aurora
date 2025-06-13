import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SubscriptionListSkeleton = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        {Array(2).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" /> {/* Plan name */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-0 py-0">
                    <Skeleton className="h-4 w-16" /> {/* Status badge */}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" /> {/* Price */}
                <Skeleton className="h-8 w-8" /> {/* Menu button */}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" /> {/* Calendar icon */}
                <Skeleton className="h-4 w-40" /> {/* Next billing date */}
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" /> {/* Clock icon */}
                <Skeleton className="h-4 w-36" /> {/* Payment method */}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-9 w-24" /> {/* Action button 1 */}
              <Skeleton className="h-9 w-24" /> {/* Action button 2 */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

export const SubscriptionPageSkeleton = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <Skeleton className="h-7 w-32" /> {/* "Subscription" title */}
        <Skeleton className="h-4 w-80 mt-1" /> {/* Description */}
      </div>
      
      <Skeleton className="h-px w-full" /> {/* Separator */}
      
      {/* Tabs Section */}
      <div className="space-y-6">
        {/* Tab List */}
        <div className="flex space-x-1 rounded-md w-fit">
          <Skeleton className="h-9 w-44" /> {/* "Current Subscriptions" tab */}
          <Skeleton className="h-9 w-36" /> {/* "All Subscriptions" tab */}
        </div>
        
        {/* Tab Content - Default to Current Subscriptions view */}
        <div className="mt-6">
          <div className="space-y-4">
            {/* Subscription List */}
            <SubscriptionListSkeleton />
            
            {/* Manage Subscription Button */}
            <div className="pt-2">
              <Skeleton className="h-10 w-48" /> {/* Manage subscription button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );