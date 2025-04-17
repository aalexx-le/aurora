'use client';

import { ErrorDisplay } from "@/components/error-ui/ErrorDisplay";
import { Button } from "@/components/ui/button";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import BASE_ROUTE from "@/lib/routes/base.route";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Custom 404 page for the application
 * This is used by Next.js when a route is not found
 * 
 * @returns React component
 */
export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Decorative 404 number */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl font-bold text-muted/10 select-none">404</div>
          </div>
          <div className="relative">
            <ErrorDisplay
              title="Page Not Found"
              message="We couldn't find the page you're looking for."
              details="The page may have been moved, deleted, or never existed."
              severity="warning"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link href={BASE_ROUTE.home.value}>Go to Home Page</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={AUTH_ROUTE.value}>Sign In</Link>
          </Button>
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-muted-foreground">
          Need help? <Link href={BASE_ROUTE.contact.value} className="text-primary hover:underline">Contact support</Link>
        </p>
      </motion.div>
    </div>
  );
} 