import DateFilter from "@/app/dashboard/finance/bank-management/components/date-filter/DateFilter";
import BankSummary from "@/app/dashboard/finance/bank-management/components/bank-summary/BankSummary";
import React from "react";
import {BankManager} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";
import {Expense} from "@/app/dashboard/finance/bank-management/components/expense-table/types";
import {
    IncomeExpenseRatioBarChart
} from "@/app/dashboard/finance/bank-management/components/income-expense-ratio-bar-chart/IncomeExpenseRatioBarChart";
import {useTotalBankBalance} from "@/app/dashboard/finance/bank-management/features/overview/useTotalBankBalance";
import {
    useTotalInvestmentBalance
} from "@/app/dashboard/finance/bank-management/features/overview/useTotalInvestmentBalance";

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

export default function Overview({ bankManagers, expenses }: IProps) {
    const totalBankBalance = useTotalBankBalance(bankManagers);
    const totalInvestmentBalance = useTotalInvestmentBalance();
    const totalBalance = totalBankBalance + totalInvestmentBalance;

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex gap-4 flex-1">
                <DateFilter />
            </div>
            <div className="flex gap-4">
                <div className="flex grow-0 flex-col gap-4">
                    <div className="p-4 rounded-lg border shadow-sm">
                        <BankSummary totalBalance={totalBalance} />
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <IncomeExpenseRatioBarChart />
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <IncomeExpenseRatioBarChart />
                </div>
            </div>
        </div>
    );
}
