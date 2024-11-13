"use client";

import {Menu, Package2, Search} from "lucide-react";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {ThemeSwitcher} from "@/app/home/components/header/ThemeSwitcher";
import Logo from "@/components/ui/logo";
import DASHBOARD_ROUTE from "@/lib/routes/dashboard.route";
import {useAppSelector} from "@/state/hooks";
import {ProfileDropdownMenu} from "@/app/home/components/header/ProfileDropdownMenu";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import LoginButton from "@/app/home/components/header/LoginButton";

const TABS = [
    {
        route: DASHBOARD_ROUTE.value,
        title: "Dashboard",
    },
    {
        route: "#",
        title: "Products",
    },
];

export default function Header() {
    const currentPath = usePathname();
    const {
        state: { user },
    } = useAppSelector((state) => state.auth);

    return (
        <header className="sticky top-0 flex items-center gap-4 border-b bg-background px-4 py-3 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Logo />
                {TABS.map((t) => (
                    <Link
                        key={t.route}
                        href={t.route}
                        className={cn(
                            "transition-colors hover:text-foreground",
                            t.route === currentPath
                                ? "text-foreground"
                                : "text-muted-foreground",
                        )}
                    >
                        {t.title}
                    </Link>
                ))}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Orders
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Products
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Customers
                        </Link>
                        <Link href="#" className="hover:text-foreground">
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                        />
                    </div>
                </form>
                <ThemeSwitcher />
                {user ? <ProfileDropdownMenu /> : <LoginButton />}

                {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
            </div>
        </header>
    );
}
