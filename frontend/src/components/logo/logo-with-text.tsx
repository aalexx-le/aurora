import HOME_ROUTE from "@/lib/routes/home.route";
import Link from "next/link";
import LogoSvg from "./logo-svg";

interface IProps {
    className?: string;
}

export default function LogoWithText({ className }: IProps) {
    return (
        <Link
            href={HOME_ROUTE.value}
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
            <LogoSvg className="size-8" />
            <span className="hidden sm:block">Aurora</span>
        </Link>
    );
}
