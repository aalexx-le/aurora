import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {useRouter} from "next/navigation";
import {useLayoutEffect} from "react";
import {authActions} from "@/state/slices/auth.slice";
import {getCookie} from "cookies-next";
import {AuthParams} from "@/lib/constants/params";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const {
        loading,
        error,
        state: { user },
    } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useLayoutEffect(() => {
        const accessToken = getCookie(AuthParams.ACCESS_TOKEN);
        if (!loading) {
            if (!user && accessToken) {
                dispatch(authActions.loginWithToken());
            } else if (user) {
                router.back();
            }
        }
    }, [user, router, dispatch, loading]);

    if (loading && !error) {
        return <div>Loading ...</div>;
    }

    return children;
}
