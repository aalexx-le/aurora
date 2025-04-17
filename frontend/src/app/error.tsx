"use client";

import { CriticalError } from "@/components/error-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import { logError } from "@/lib/utils/error-utils";
import { useEffect } from "react";

/**
 * Global error page for the application
 * This is used by Next.js when an error occurs in a route
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error when it occurs
  useEffect(() => {
    logError(error, { source: "GlobalError", digest: error.digest });
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <CriticalError
              title="Something went wrong!"
              message="We've encountered an unexpected error."
              details={process.env.NODE_ENV === "development" ? error.message : undefined}
              onRetry={() => reset()}
            />
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
              >
                Go to Home Page
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
} 