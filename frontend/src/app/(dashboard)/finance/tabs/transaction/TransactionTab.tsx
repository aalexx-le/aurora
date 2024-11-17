import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables,} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {Skeleton} from "@/components/ui/skeleton";
import {useAppSelector} from "@/state/hooks";
import {useDateFilterContext,} from "@/lib/context/date-range.context";
import {BankManager} from "@/app/(dashboard)/finance/components/transaction-table/types";
import {useTotalBankBalance} from "@/app/(dashboard)/finance/tabs/overview/useTotalBankBalance";
import {useEffect} from "react";
import DateFilter from "@/app/(dashboard)/finance/components/date-filter/DateFilter";
import BankSummary from "@/app/(dashboard)/finance/components/bank-summary/BankSummary";
import CategoryPieChart from "@/app/(dashboard)/finance/components/category-pie-chart/CategoryPieChart";
import CategoryList from "@/app/(dashboard)/finance/components/category-list/CategoryList";
import TransactionList from "@/app/(dashboard)/finance/components/transaction-list/TransactionList";

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

    if (loading) {
        return <Skeleton className="w-full h-full"/>;
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex gap-4">
                <DateFilter/>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex grow-0 flex-col gap-4">
                    <div className="p-4 rounded-lg border shadow-sm">
                        <BankSummary totalBalance={totalBankBalance}/>
                        <CategoryPieChart categories={categories}/>
                        <CategoryList categories={categories}/>
                    </div>
                </div>
                {/*<div className="flex-1 flex-col flex gap-4">*/}
                <div className="flex-1 p-4 rounded-lg border shadow-sm">
                    <TransactionList/>
                </div>
                {/*</div>*/}
            </div>
        </div>
    );
}
