import { useMemo } from "react";
import { BankManager } from "@/app/dashboard/finance/bank-management/components/transaction-table/types";

export const useTotalBankBalance = (bankManagers: BankManager[]) => {
    const totalBankBalance = useMemo(() => {
        const banks = bankManagers.map((m) => m.banks);
        return banks
            .reduce((acc, val) => acc.concat(val), [])
            .reduce((acc, val) => acc + val.balance, 0);
    }, [bankManagers]);

    return totalBankBalance;
};
