import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import DashBoardSidebar from "@/app/(dashboard)/components/sidebar/dashboard-sidebar";
import {ThemeSwitcher} from "@/app/home/components/header/ThemeSwitcher";
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
                            <ThemeSwitcher/>
                        </div>
                    </header>
                    <div className="flex flex-col gap-2 md:gap-4 flex-grow items-stretch">
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
    )
}