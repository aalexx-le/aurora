import {Button} from "@/components/ui/button";
import Link from "next/link";
import AUTH_ROUTE from "@/lib/routes/auth.route";

export default function LoginButton() {
    return (
        <div className="flex flex-row gap-4 md:gap-2 lg:gap-4">
            <Button variant="outline" asChild>
                <Link href={AUTH_ROUTE.value}>Login</Link>
            </Button>
        </div>
    );
}
