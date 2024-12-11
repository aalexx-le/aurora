import React from "react";
import {cn} from "@/lib/utils";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    avatar: string
}

export default function CategoryAvatar({avatar, className}: IProps) {
    return (
        // <div
        //     className={cn("rounded-full w-8 h-8 flex items-center justify-center animate-ripple", className)}
        //     style={{background: avatar}}
        // >
        // </div>
        <div className={cn("relative", className)}>
            <div
                className={cn("absolute rounded-full inset-0 w-full h-full flex items-center justify-center animate-ripple")}
                style={{background: avatar}}
            >
            </div>
            <div
                className={cn("absolute rounded-full inset-0 w-full h-full flex items-center justify-center")}
                style={{background: avatar}}
            >
            </div>
        </div>
    )
}