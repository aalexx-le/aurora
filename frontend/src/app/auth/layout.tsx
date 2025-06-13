'use client'

import AppBar from "@/components/appbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen">
            <AppBar />
            <main className="w-screen px-4 py-8 flex justify-center items-center">
                {children}
            </main>
        </div>
    );
}
