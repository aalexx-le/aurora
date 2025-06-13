import DashBoardSidebar from "@/components/sidebar/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export function Sidebar({
                            children,
                        }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <DashBoardSidebar />
            <SidebarInset>
                <div className="p-2 md:p-4 flex flex-col flex-1 gap-2">
                    <header className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                        </div>
                    </header>
                    <div className="flex flex-col gap-2 md:gap-4 flex-grow items-stretch">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}