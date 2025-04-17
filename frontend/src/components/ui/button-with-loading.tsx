import {Button} from "@/components/ui/button";
import React from "react";
import {Loader2} from "lucide-react";
import type {ButtonProps} from "@/components/ui/button";

interface ButtonWithLoadingProps extends ButtonProps {
    readonly loading: boolean;
}

export default function ButtonWithLoading({
    loading,
    children,
    className,
    disabled,
    ...props
}: ButtonWithLoadingProps) {
    return (
        <Button
            disabled={disabled || loading}
            className={className}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {children}
        </Button>
    );
}
