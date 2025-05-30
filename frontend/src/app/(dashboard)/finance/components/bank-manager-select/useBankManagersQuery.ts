import { GET_BANK_MANAGERS } from "@/api/bank/manager";
import {
    GetBankManagersQuery,
    GetBankManagersQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useBankManagersQuery = () => {
    const { data, loading } = useQuery<
        GetBankManagersQuery,
        GetBankManagersQueryVariables
    >(GET_BANK_MANAGERS);

    return {
        bankManagers: data?.getBankManagers || [],
        loading,
    };
};
