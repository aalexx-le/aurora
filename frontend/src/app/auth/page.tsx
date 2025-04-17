"use client";

// Force dynamic rendering to prevent static generation errors
export const dynamic = 'force-dynamic';

import AuthGuard from "@/app/auth/AuthGuard";
import { LoginForm } from "@/app/auth/components/loginForm";
import { SignupForm } from "@/app/auth/components/signupForm";
import { LoadingSpinner } from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense, useState } from "react";

export const TABS = {
    LOGIN: "Login",
    SIGNUP: "Sign up",
};

/**
 * Auth page client component with tabs for login and signup
 * 
 * @returns React component
 */
function AuthPageClient() {
    const [activeTab, setActiveTab] = useState(TABS.LOGIN);

    return (
        <AuthGuard>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px] space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={TABS.LOGIN} className="flex-grow">
                        {TABS.LOGIN}
                    </TabsTrigger>
                    <TabsTrigger value={TABS.SIGNUP} className="flex-grow">
                        {TABS.SIGNUP}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={TABS.LOGIN}>
                    <LoginForm setActiveTab={setActiveTab} />
                </TabsContent>
                <TabsContent value={TABS.SIGNUP}>
                    <SignupForm setActiveTab={setActiveTab} />
                </TabsContent>
            </Tabs>
        </AuthGuard>
    );
}

/**
 * Auth page component with Suspense boundary
 * 
 * @returns React component
 */
export default function AuthPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AuthPageClient />
        </Suspense>
    );
}
