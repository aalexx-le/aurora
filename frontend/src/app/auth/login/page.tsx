'use client';

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

import { LoadingSpinner } from '@/components/ui/loading';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

/**
 * Login page client component that redirects to the main auth page
 * 
 * @returns React component
 */
function LoginPageClient(): JSX.Element {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main auth page
    router.push('/auth');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-muted-foreground">Redirecting to login...</p>
    </div>
  );
}

/**
 * Login page component with Suspense boundary
 * 
 * @returns React component
 */
export default function LoginPage(): JSX.Element {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginPageClient />
    </Suspense>
  );
} 