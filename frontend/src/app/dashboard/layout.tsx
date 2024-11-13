"use client";

import DashBoardSidebar from "@/app/dashboard/components/sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/components/ui/sidebar";
import AuthGuard from "@/app/AuthGuard";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <DashBoardSidebar />
                <SidebarInset>
                    <div className="p-4 flex flex-col flex-1 gap-2">
                        <header className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger />
                            </div>
                        </header>
                        <div className="flex flex-col flex-grow gap-4 items-stretch">
                            {children}
                        </div>
                    </div>
                </SidebarInset>
                {/*<div className="h-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">*/}
                {/*    <div className="hidden border-r bg-muted/40 md:block">*/}
                {/*        <div className="flex h-full max-h-screen flex-col gap-2">*/}
                {/*            <DashboardSidebar/>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*</div>*/}
            </SidebarProvider>
        </AuthGuard>
    );
}
