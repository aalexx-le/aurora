"use client";

import * as React from "react";

import Logo from "@/components/logo/logo";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_DATA } from "./sidebar-data";

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
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Logo className="size-6"/>
                            </div>

                            <div className="grid flex-1 text-left text-lg leading-tight">
                                <span className="truncate font-semibold">
                                    Aurora
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={SIDEBAR_DATA.navMain}/>
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
