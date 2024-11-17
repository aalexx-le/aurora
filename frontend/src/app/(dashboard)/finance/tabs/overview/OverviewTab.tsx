import {useTotalBankBalance} from "@/app/(dashboard)/finance/tabs/overview/useTotalBankBalance";
import {BankManager} from "@/app/(dashboard)/finance/components/transaction-table/types";
import {useTotalInvestmentBalance} from "@/app/(dashboard)/finance/tabs/overview/useTotalInvestmentBalance";
import DateFilter from "@/app/(dashboard)/finance/components/date-filter/DateFilter";
import {
    IncomeExpenseRatioBarChart
} from "@/app/(dashboard)/finance/components/income-expense-ratio-bar-chart/IncomeExpenseRatioBarChart";
import FinanceSummary from "@/app/(dashboard)/finance/components/finance-summary/FinanceSummary";

interface IProps {
    bankManagers: BankManager[];
}

export default function OverviewTab({ bankManagers }: IProps) {
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
                        <FinanceSummary totalBalance={totalBalance} />
                    </div>
                </div>
                {/*<div className="flex flex-1 flex-col gap-4">*/}
                {/*    <IncomeExpenseRatioBarChart />*/}
                {/*</div>*/}
                {/*<div className="flex flex-1 flex-col gap-4">*/}
                {/*    <IncomeExpenseRatioBarChart />*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
