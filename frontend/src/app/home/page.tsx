"use client";

import {useEffect} from "react";
import {useAppDispatch} from "@/state/hooks";
import {authActions} from "@/state/slices/auth.slice";

const HomePage = () => {
    // const { details, loading } = useQuery<IQuery>(GET_ME);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(authActions.loginWithToken());
    }, [dispatch]);

    // if (!details || !details.getMe) {
    //     return (
    //         <div className="flex flex-col space-y-3">
    //             <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
    //             <div className="space-y-2">
    //                 <Skeleton className="h-4 w-[250px]"/>
    //                 <Skeleton className="h-4 w-[200px]"/>
    //             </div>
    //         </div>
    //     )
    // }

    return <></>;
};

export default HomePage;
