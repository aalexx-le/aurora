import authReducer from "@/state/slices/auth.slice";
import bankReducer from "@/state/slices/bank.slice";
import cryptoReducer from "@/state/slices/crypto.slice";
import {
    Action,
    combineSlices,
    configureStore,
    ThunkAction,
} from "@reduxjs/toolkit";

const rootReducer = combineSlices({
    auth: authReducer,
    crypto: cryptoReducer,
    bank: bankReducer,
});

export const makeStore = () =>
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddlewares) =>
            getDefaultMiddlewares().concat([]),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof rootReducer>;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
