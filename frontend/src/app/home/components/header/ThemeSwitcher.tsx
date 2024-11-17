"use client";

import * as React from "react";
import {useEffect, useState} from "react";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {MoonIcon, SunIcon} from "lucide-react";

export function ThemeSwitcher() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const changeTheme = () => {
        setTheme(resolvedTheme == "dark" ? "light" : "dark");
    };

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button variant="ghost" size="icon" onClick={changeTheme}>
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
