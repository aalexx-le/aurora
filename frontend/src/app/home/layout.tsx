"use client";

import AppBar from "@/components/appbar";

export default function HomeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AppBar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
