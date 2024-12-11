import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {usePathname, useRouter} from "next/navigation";
import React, {useLayoutEffect} from "react";
import AUTH_ROUTE from "@/lib/routes/auth.route";
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
    const currentPath = usePathname();
    const router = useRouter();

    useLayoutEffect(() => {
        const fn = async () => {
            const accessToken = getCookie(AuthParams.ACCESS_TOKEN);
            if (!loading) {
                if (!user && accessToken) {
                    await dispatch(authActions.loginWithToken());
                } else if (!user) {
                    router.push(AUTH_ROUTE.value);
                }
            }
        };

        fn().then(() => {});
    }, [loading, router, user, currentPath, dispatch, error]);

    return children;
}
