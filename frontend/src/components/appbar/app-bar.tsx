"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import * as React from "react";
import LogoWithText from "../logo/logo-with-text";
import { AppBarUserMenu } from "./app-bar-user-menu";
import { NavigationItem, NavItems } from "./nav-items";

export interface AppBarData {
  navigation: NavigationItem[];
  showUserMenu?: boolean;
  showMobileMenu?: boolean;
}

export interface AppBarProps {
  config: AppBarData;
  className?: string;
} 

export function AppBar({ config, className }: AppBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const {
    navigation,
    showUserMenu = true,
    showMobileMenu = true,
  } = config;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo and Brand */}
          <LogoWithText />

          {/* Center: Navigation (Desktop only) */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItems items={navigation} />
          </nav>

          {/* Right: User Menu and Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {showUserMenu && <AppBarUserMenu />}
            
            {showMobileMenu && (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Navigation</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 space-y-1">
                    <NavItems 
                      items={navigation} 
                      mobile 
                      onItemClick={() => setIsMobileMenuOpen(false)}
                    />
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 