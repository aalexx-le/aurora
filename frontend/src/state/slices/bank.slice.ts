import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankManager } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";

interface BankState {
    bankManager: BankManager | null;
}

const initialState: BankState = {
    bankManager: null,
};

export const bankSlice = createSlice({
    name: "bank",
    initialState,
    reducers: {
        setBankManager: (state, action: PayloadAction<BankManager>) => {
            state.bankManager = action.payload;
        },
    },
});

const { actions, reducer } = bankSlice;

export const bankActions = actions;

export default reducer;
