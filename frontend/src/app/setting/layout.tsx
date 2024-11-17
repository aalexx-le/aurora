"use client";

import AuthGuard from "@/app/AuthGuard";
import {Sidebar} from "@/components/sidebar/sidebar";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <Sidebar>
                {children}
            </Sidebar>
        </AuthGuard>
    );
}
