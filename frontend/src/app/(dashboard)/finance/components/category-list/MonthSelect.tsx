"use client";

import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {GET_MONTHLY_TARGETS} from "@/api/expense-category";
import {useQuery} from "@apollo/client";
import {GetMonthlyTargetsQuery, QueryGetMonthlyTargetsArgs} from "@/gql/graphql";

interface MonthSelectProps {
    selectedMonth: number;
    setSelectedMonth: (month: number) => void;
    categoryId: string;
}

const MonthSelect: React.FC<MonthSelectProps> = ({ selectedMonth, setSelectedMonth, categoryId }) => {
    const { data } = useQuery<GetMonthlyTargetsQuery, QueryGetMonthlyTargetsArgs>(GET_MONTHLY_TARGETS, {
        variables: { categoryId, year: 2024 },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-min justify-between">
                    {selectedMonth ? new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' }) : "Select month"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-24" align="start">
                <DropdownMenuLabel>Select Month</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month, i) => (
                    <DropdownMenuCheckboxItem
                        key={month}
                        disabled={Boolean(data?.getMonthlyTargets.find((target) => target.month === month))}
                        onCheckedChange={() => setSelectedMonth(month)}
                        checked={selectedMonth === month}
                    >
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MonthSelect;