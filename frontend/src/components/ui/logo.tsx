import {BrainCircuit} from "lucide-react";
import Link from "next/link";
import HOME_ROUTE from "@/lib/routes/home.route";
import {cn} from "@/lib/utils";

interface IProps {
    className?: string;
}

export default function Logo({ className }: IProps) {
    return (
        <Link
            href={HOME_ROUTE.value}
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
            <BrainCircuit className={cn("h-6", "w-6", className)} />
            <span className="sr-only">Xela</span>
        </Link>
    );
}
