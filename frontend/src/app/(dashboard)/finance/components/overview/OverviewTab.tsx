import { GET_EXPENSE_CATEGORIES } from "@/api/expense/expense-category";
import BankSummary from "@/app/(dashboard)/finance/components/bank-summary/BankSummary";
import InvestmentSummary from "@/app/(dashboard)/finance/components/investment-summary/InvestmentSummary";
import {
    ExpenseRatioBarChart
} from "@/app/(dashboard)/finance/expense/components/income-expense-ratio-bar-chart/ExpenseRatioBarChart";
import { useCryptoPortfoliosQuery } from "@/app/(dashboard)/finance/investment/hooks/useCryptoPortfoliosQuery";
import { BankManager, Exchanges, GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables } from "@/gql/graphql";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { useQuery } from "@apollo/client";

interface IProps {
    bankManagers: BankManager[];
}

export default function OverviewTab({bankManagers}: IProps) {
    const {
        data,
    } = useQuery<GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables>(GET_EXPENSE_CATEGORIES);
    const categories = data?.getExpenseCategories ?? [];

    const {loading, portfolios} = useCryptoPortfoliosQuery()

    const aggregatedPortfolio = portfolios.find(p => p.exchanges == Exchanges.All)

    if (!aggregatedPortfolio) {
        return null
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            {/*<div className="flex gap-4 flex-1">*/}
            {/*    <DateFilter />*/}
            {/*    <ResetDateFilterButton />*/}
            {/*</div>*/}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex flex-1 flex-col gap-4">
                    <BankSummary bankManagers={bankManagers}/>
                    <ConvertCurrencyProvider baseCurrency="USD">
                        <InvestmentSummary portfolio={aggregatedPortfolio}/>
                    </ConvertCurrencyProvider>
                </div>
                <div className="flex flex-1 flex-col gap-4">
                    <ExpenseRatioBarChart categories={categories}/>
                </div>
                {/*<div className="flex flex-1 flex-col gap-4">*/}
                {/*    <IncomeExpenseRatioBarChart />*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
