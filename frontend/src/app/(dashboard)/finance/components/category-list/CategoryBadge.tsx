import {cn} from "@/lib/utils";
import React, {HTMLAttributes, useMemo} from "react";
import {ExpenseCategory} from "@/app/(dashboard)/finance/components/category-list/types";
import CategoryAvatar from "@/app/(dashboard)/finance/components/category-list/CategoryAvatar";

interface IProps extends HTMLAttributes<HTMLDivElement> {
    category: ExpenseCategory;
    targetAmount?: number;
}

export function CategoryBadge({category, className, targetAmount}: IProps) {
    const percent = useMemo(() => {
        if (!targetAmount) return 0;
        if (Math.abs(category.totalAmount) > targetAmount) return 100;
        return Math.abs((category.totalAmount / targetAmount) * 100);
    }, [category.totalAmount, targetAmount]);

    return (
        <div
            className={cn("w-min p-2 rounded-full border-2 shadow-sm", "relative overflow-hidden rounded-full",)}
            style={{borderColor: category.color}}>
            {targetAmount && <div className="absolute top-0 left-0 h-full w-full flex-1 bg-primary transition-all"
                 style={{
                     transform: `translateX(-${100 - percent}%) translateY(0)`,
                     backgroundColor: category.color,
                     // filter: 'brightness(35%)',
                     opacity: 0.3
                 }}
            />}
            <div className="relative flex items-center gap-2">
                <CategoryAvatar avatar={category.color} className="size-2"/>
                <p className={cn("max-w-full truncate text-xs font-medium leading-none", className)}
                   style={{color: category.color}}>{category.name}</p>
            </div>
        </div>
    );
}