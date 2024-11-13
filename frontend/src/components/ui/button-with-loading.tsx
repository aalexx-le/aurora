import {Button, buttonVariants} from "@/components/ui/button";
import React from "react";
import {Loader2} from "lucide-react";
import type {VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";

interface IProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    loading: boolean;
    children: React.ReactNode;
}

export default function ButtonWithLoading({
    loading,
    children,
    className,
    variant,
    size,
    asChild = false,
    ...props
}: IProps) {
    return (
        <Button
            disabled={loading}
            className={cn(buttonVariants({ variant, size, className }))}
        >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {children}
        </Button>
    );
}
