import { GET_BANK_MANAGERS } from "@/api/bank/manager";

import { useQuery } from "@apollo/client";

export const useBankManagersQuery = () => {
    const { data, loading } = useQuery(GET_BANK_MANAGERS);

    return {
        bankManagers: data?.getBankManagers || [],
        loading,
    };
};
