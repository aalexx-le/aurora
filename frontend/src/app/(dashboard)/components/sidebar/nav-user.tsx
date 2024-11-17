"use client";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {authActions} from "@/state/slices/auth.slice";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import {useRouter} from "next/navigation";
import {CaretSortIcon, ExitIcon} from "@radix-ui/react-icons";

export function NavUser() {
    const { isMobile } = useSidebar();
    const {
        state: { user },
    } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const onLogout = async () => {
        await dispatch(authActions.logout());
        router.push(AUTH_ROUTE.value);
    };

    if (!user) return <></>;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {/*<AvatarImage alt={user.name} />*/}
                                <AvatarFallback className="rounded-lg">
                                    {user.name?.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <CaretSortIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {/*<AvatarImage*/}
                                    {/*    src={user.avatar}*/}
                                    {/*    alt={user.name}*/}
                                    {/*/>*/}
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/*<DropdownMenuGroup>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <Sparkles />*/}
                        {/*        Upgrade to Pro*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*</DropdownMenuGroup>*/}
                        {/*<DropdownMenuSeparator />*/}
                        {/*<DropdownMenuGroup>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <BadgeCheck />*/}
                        {/*        Account*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <CreditCard />*/}
                        {/*        Billing*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem>*/}
                        {/*        <Bell />*/}
                        {/*        Notifications*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*</DropdownMenuGroup>*/}
                        {/*<DropdownMenuSeparator />*/}
                        <DropdownMenuItem className="gap-2" onClick={onLogout}>
                            <ExitIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
