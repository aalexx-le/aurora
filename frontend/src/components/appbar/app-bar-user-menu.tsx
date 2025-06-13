"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { authActions } from "@/state/slices/auth.slice";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export function AppBarUserMenu() {
  const {
    state: { user },
    loading,
  } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onLogout = async () => {
    await dispatch(authActions.logoutUser());
    router.push(AUTH_ROUTE.value);
  };

  if (!user || loading) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href={AUTH_ROUTE.value}>Sign In</a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto"
          aria-label="User menu"
        >
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 