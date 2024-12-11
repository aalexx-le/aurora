import { User } from "@/gql/graphql";
import { CryptoPortfolio } from "@/app/(dashboard)/finance/investment/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitState {
    loading: boolean;
    error: string;
    state: {
        portfolio: CryptoPortfolio | null;
    };
}

const initialState: IInitState = {
    loading: false,
    error: "",
    state: {
        portfolio: null,
    },
};

export const cryptoSlice = createSlice({
    name: "crypto",
    initialState,
    reducers: {
        setPortfolio: (state, action: PayloadAction<CryptoPortfolio>) => {
            state.state.portfolio = action.payload;
        },
    },
});

const { actions, reducer } = cryptoSlice;

export const cryptoActions = {
    ...actions,
};

export default reducer;
