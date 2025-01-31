import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables,} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/script/expense-category";
import {useAppSelector} from "@/state/hooks";
import {useDateFilterContext,} from "@/lib/context/date-range.context";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {useTotalBankBalance} from "@/app/(dashboard)/finance/components/overview/useTotalBankBalance";
import {useEffect} from "react";
import DateFilter from "@/app/(dashboard)/finance/expense/components/date-filter/DateFilter";
import BankSummary from "@/app/(dashboard)/finance/expense/components/bank-summary/BankSummary";
import CategoryPieChart from "@/app/(dashboard)/finance/expense/components/category-pie-chart/CategoryPieChart";
import CategoryList from "@/app/(dashboard)/finance/expense/components/category-list/CategoryList";
import TransactionList from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionList";
import {ResetDateFilterButton} from "@/app/(dashboard)/finance/expense/components/date-filter/ResetDateFilterButton";

interface IProps {
    bankManagers: BankManager[];
}

export default function TransactionTab({bankManagers}: IProps) {
    const {user} = useAppSelector((state) => state.auth.state);
    const {dateRange} = useDateFilterContext();
    const totalBankBalance = useTotalBankBalance(bankManagers);
    const {loading, data, refetch} = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        variables: {
            userId: Number(user?.id ?? 0),
        },
    });

    useEffect(() => {
        refetch({
            userId: Number(user?.id),
            startDate: dateRange?.from,
            endDate: dateRange?.to,
            month: dateRange?.from?.getMonth(),
            year: dateRange?.from?.getFullYear()
        });
    }, [dateRange, user, refetch]);

    const categories = data?.getExpenseCategories ?? [];

    // if (loading) {
    //     return (
    //
    //     );
    // }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex gap-2">
                <DateFilter/>
                <ResetDateFilterButton />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
                <div className="col-span-1 h-min p-4 rounded-lg border shadow-sm mb-4 lg:mb-0">
                    <BankSummary totalBalance={totalBankBalance}/>
                    <CategoryPieChart categories={categories}/>
                    <CategoryList categories={categories}/>
                </div>
                {/*<div className="flex-1 flex-col flex gap-4">*/}
                <div className="col-span-2 p-4 rounded-lg border shadow-sm h-min">
                    <TransactionList/>
                </div>
                {/*</div>*/}
            </div>
        </div>
    );
}
