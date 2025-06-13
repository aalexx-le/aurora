import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MetaMaskPaymentLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      
      {/* Payment steps skeleton */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center space-x-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Token selection skeleton */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((token) => (
              <Skeleton key={token} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Action buttons skeleton */}
      <div className="flex space-x-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
} 