import React from "react";
import {cn} from "@/lib/utils";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    avatar: string
}

export default function CategoryAvatar({avatar, className}: IProps) {
    return (
        <div
            className={cn("rounded-full w-8 h-8 flex items-center justify-center", className)}
            style={{background: avatar}}
        >
        </div>
    )
}