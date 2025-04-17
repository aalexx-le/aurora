'use client';

// Add this line to force dynamic rendering
export const dynamic = 'force-dynamic';

import { LoadingSpinner } from '@/components/ui/loading';
import { Cookie } from '@/lib/utils/cookie';
import { useAppDispatch } from '@/state/hooks';
import { authActions } from '@/state/slices/auth.slice';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Create a client component that uses useSearchParams
function GoogleAuthCallbackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken && refreshToken) {
            // Store tokens
            Cookie.saveTokens({
                accessToken,
                refreshToken
            });
            
            // Fetch user data
            dispatch(authActions.loginWithToken())
                .unwrap()
                .then(() => {
                    // Redirect to home on success
                    router.push('/');
                })
                .catch((err) => {
                    setError('Failed to fetch user data');
                    console.error('Error fetching user data:', err);
                    router.push('/auth?error=user_fetch_failed');
                });
        } else {
            setError('Authentication failed - missing tokens');
            router.push('/auth?error=auth_failed');
        }
    }, [searchParams, dispatch, router]);

    if (error) {
        return <div className="flex flex-1 justify-center items-center">
            <div className="text-red-500">{error}</div>
        </div>;
    }

    return <LoadingSpinner />;
}

// Export the main component with Suspense boundary
export default function GoogleAuthCallback() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <GoogleAuthCallbackClient />
        </Suspense>
    );
} 