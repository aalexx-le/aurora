import {cn} from "@/lib/utils";
import {LucideProps} from "lucide-react";
import Link from "next/link";
import React, * as react from "react";

interface IProps {
    isActive?: boolean;
    title: string;
    Icon: react.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>
    >;
}

export default function DashBoardItem({
    isActive = false,
    title,
    Icon,
}: IProps) {
    return (
        <Link
            href="#"
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary",
            )}
        >
            <Icon className="h-4 w-4" />
            {title}
        </Link>
    );
}
