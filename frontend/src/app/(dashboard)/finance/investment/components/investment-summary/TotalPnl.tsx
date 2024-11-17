import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {useAppSelector} from "@/state/hooks";
import {useEffect, useState} from "react";
import {Convert} from "easy-currencies";

interface IProps {
    currentBalance: number;
    investmentCategoryName?: string | null;
}

export function TotalPnl({currentBalance, investmentCategoryName}: IProps) {
    const {user} = useAppSelector((state) => state.auth.state);
    const [convertedDepositBalance, setConvertedDepositBalance] = useState<number>(0);
    const {data} = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        variables: {
            userId: Number(user?.id),
            name: investmentCategoryName
        },
    });
    const depositBalance = (data?.getExpenseCategories || []).reduce((acc, balance) => acc + Math.abs(balance.totalAmount), 0);
    const totalPnl = currentBalance - convertedDepositBalance;

    useEffect(() => {
        const convertCurrency = async (balance: number) => {
            return await Convert(balance).from("VND").to("USD");
        }
        convertCurrency(depositBalance).then(setConvertedDepositBalance)
    }, [depositBalance])

    return (
        <div className="flex flex-row gap-1 items-center">
            <p className="text-sm text-muted-foreground">(Total PnL</p>
            <span
                className={cn("font-bold", totalPnl > 0 ? "text-chart-2" : "text-chart-5")}>
                {totalPnl > 0 ? "+" : ""}
                <MoneyWithCurrency amount={totalPnl}/>
            </span>
            <p className="text-sm text-muted-foreground">)</p>
        </div>
    )
}