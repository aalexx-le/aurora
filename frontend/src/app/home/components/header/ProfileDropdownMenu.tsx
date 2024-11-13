import {Button} from "@/components/ui/button";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import {useAppSelector} from "@/state/hooks";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {CircleUser} from "lucide-react";
import {authActions} from "@/state/slices/auth.slice";

export function ProfileDropdownMenu() {
    const {
        loading,
        state: { status },
    } = useAppSelector((state) => state.auth);

    // if (loading) {
    //     return <Button disabled>
    //         <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
    //         Please wait
    //     </Button>O
    // }
    const onLogout = () => {
        dispatch(authActions.logout());
        router.push(AUTH_ROUTE.value);
    };

    if (loading || status !== "guess") {
        return <></>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
