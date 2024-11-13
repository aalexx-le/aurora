"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {LoginForm} from "@/app/auth/components/loginForm";
import {SignupForm} from "@/app/auth/components/signupForm";
import AuthGuard from "@/app/auth/AuthGuard";

const TABS = {
    LOGIN: "Login",
    SIGNUP: "Signup",
};

export default function AuthPage() {
    return (
        <AuthGuard>
            <Tabs defaultValue={TABS.LOGIN} className="w-[400px] space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={TABS.LOGIN} className="flex-grow">
                        {TABS.LOGIN}
                    </TabsTrigger>
                    <TabsTrigger value={TABS.SIGNUP} className="flex-grow">
                        {TABS.LOGIN}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value={TABS.LOGIN}>
                    <LoginForm />
                </TabsContent>
                <TabsContent value={TABS.SIGNUP}>
                    <SignupForm />
                </TabsContent>
            </Tabs>
        </AuthGuard>
    );
}
