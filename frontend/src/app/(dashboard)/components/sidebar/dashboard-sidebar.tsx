"use client";

import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/components/ui/logo";
import {SIDEBAR_DATA} from "@/app/(dashboard)/components/sidebar/sidebar-data";
import {NavMain} from "@/app/(dashboard)/components/sidebar/nav-main";
import {NavSecondary} from "@/app/(dashboard)/components/sidebar/nav-secondary";
import {NavUser} from "@/app/(dashboard)/components/sidebar/nav-user";

export default function DashBoardSidebar({
                                             ...props
                                         }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="sidebar" collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg"
                                           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            {/*<div className="flex gap-2 items-center">*/}
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Logo className="size-6"/>
                            </div>

                            {/*<div className="text-lg font-semibold truncate leading-tight">Xela</div>*/}
                            <div className="grid flex-1 text-left text-lg leading-tight">
                                <span className="truncate font-semibold">
                                    Xela
                                </span>
                            </div>
                            {/*</div>*/}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={SIDEBAR_DATA.navMain}/>
                {/*<NavProjects projects={SideBarData.projects} />*/}
                <NavSecondary
                    items={SIDEBAR_DATA.navSecondary}
                    className="mt-auto"
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
        </Sidebar>
    );
}
