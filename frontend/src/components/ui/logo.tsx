import HOME_ROUTE from "@/lib/routes/home.route";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface IProps {
    className?: string;
}

export default function Logo({ className }: IProps) {
    return (
        <Link
            href={HOME_ROUTE.value}
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
            <Image 
                src="/logo/logo-white.svg"
                alt="Aurora Logo"
                width={48}
                height={48}
                className={cn("h-12 w-12", className)}
            />
            <span className="sr-only">Aurora</span>
        </Link>
    );
}
