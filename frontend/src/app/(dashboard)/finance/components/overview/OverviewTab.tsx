import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {
    ExpenseRatioBarChart
} from "@/app/(dashboard)/finance/expense/components/income-expense-ratio-bar-chart/ExpenseRatioBarChart";
import BankSummary from "@/app/(dashboard)/finance/components/bank-summary/BankSummary";
import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/script/expense-category";
import {useAppSelector} from "@/state/hooks";
import InvestmentSummary from "@/app/(dashboard)/finance/components/investment-summary/InvestmentSummary";
import {useCryptoPortfoliosQuery} from "@/app/(dashboard)/finance/investment/useCryptoPortfoliosQuery";
import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";

interface IProps {
    bankManagers: BankManager[];
}

export default function OverviewTab({bankManagers}: IProps) {
    const {user} = useAppSelector((state) => state.auth.state);

    const {
        data,
    } = useQuery<GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables>(GET_EXPENSE_CATEGORIES, {
        variables: {
            userId: Number(user?.id),
        },
    });
    const categories = data?.getExpenseCategories ?? [];

    const portfolios = useCryptoPortfoliosQuery()

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
                        <InvestmentSummary portfolios={portfolios}/>
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
