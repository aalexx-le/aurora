import {cn} from "@/lib/utils";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/script/expense-category";
import {useAppSelector} from "@/state/hooks";
import {useEffect, useState} from "react";
import {Convert} from "easy-currencies";
import {useConvertCurrency} from "@/lib/hooks/use-convert-currency";
import {MoneyUpDownAnimated} from "@/components/money/money-up-down-animated";
import {MoneyAnimated} from "@/components/money/money-animated";

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
    const depositBalance = (data?.getExpenseCategories || [])
        .reduce((acc, balance) => acc + balance.totalSpentAmounts.reduce((acc, curr) => acc + Math.abs(curr.amount), 0), 0);
    const totalPnl = currentBalance - convertedDepositBalance;
    const totalPnlPercent = totalPnl / convertedDepositBalance * 100;

    useEffect(() => {
        const convertCurrency = async (balance: number) => {
            return await Convert(balance).from("VND").to("USD");
        }
        convertCurrency(depositBalance).then(setConvertedDepositBalance)
    }, [depositBalance])

    return (
        <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-1 justify-between">
                <p className="text-sm text-muted-foreground">Deposited</p>
                <p className="text-sm text-muted-foreground">Total PnL</p>
            </div>

            <div className="flex flex-col gap-1 justify-between items-start">
                <MoneyAnimated className="p-0 text-muted-foreground text-sm" number={convertedDepositBalance}/>
                <div className="flex flex-row items-center gap-2">
                    <MoneyUpDownAnimated className="p-0 text-sm" number={totalPnl}/>
                    <MoneyUpDownAnimated className="p-0 text-xs" number={totalPnlPercent} isPercent={true}/>
                </div>
            </div>
        </div>
    )
}

