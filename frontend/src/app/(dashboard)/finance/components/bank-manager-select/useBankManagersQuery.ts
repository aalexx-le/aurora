import {useQuery} from "@apollo/client";
import {GetBankManagersQuery, GetBankManagersQueryVariables} from "@/gql/graphql";
import {GET_BANK_MANAGERS} from "@/api/script/bank/manager";

export const useBankManagersQuery = () => {
    const {data, loading} = useQuery<
        GetBankManagersQuery,
        GetBankManagersQueryVariables
    >(GET_BANK_MANAGERS);

    return {
        bankManagers: data?.getBankManagers || [],
        loading,
    };
}