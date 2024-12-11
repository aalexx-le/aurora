import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    GetMeQuery,
    LoginMutation,
    LoginReqDto,
    OtpPurpose,
    User,
    VerifyAccountMutation,
    VerifyDto,
} from "@/gql/graphql";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { AuthParams } from "@/lib/constants/params";
import client from "@/api";
import {
    GET_ME,
    LOGIN_MUTATION,
    VERIFY_ACCOUNT_MUTATION,
} from "@/api/script/auth";

interface IInitState {
    loading: boolean;
    error: string;
    state: {
        isVerified: boolean;
        status: "guess" | "logged";
        user?: User;
    };
}

const initialState: IInitState = {
    loading: false,
    error: "",
    state: {
        status: "guess",
        isVerified: false,
    },
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            const { otpPurpose, otp } = action.payload;
            const isVerified = otpPurpose === OtpPurpose.VerifyAccount && !otp;
            state.loading = false;
            state.state = {
                ...state.state,
                status: "logged",
                user: action.payload,
                isVerified,
            };
        },
        logout: (state) => {
            state.loading = false;
            deleteCookie(AuthParams.ACCESS_TOKEN);
            state.state = {
                ...state.state,
                status: "guess",
                user: undefined,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyAccount.pending, (state) => {
                state.error = "";
                state.loading = true;
            })
            .addCase(verifyAccount.rejected, (state, payload) => {
                state.loading = false;
                state.error = payload.error.message || "Something went wrong";
            })
            .addCase(verifyAccount.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(loginWithPassword.pending, (state) => {
                state.error = "";
                state.loading = true;
            })
            .addCase(loginWithPassword.rejected, (state, payload) => {
                state.loading = false;
                state.error = payload.error.message || "Something went wrong";
            })
            .addCase(loginWithPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(loginWithToken.pending, (state) => {
                state.error = "";
                state.loading = true;
            })
            .addCase(loginWithToken.rejected, (state, payload) => {
                state.loading = false;
                state.error = payload.error.message || "Something went wrong";
            })
            .addCase(loginWithToken.fulfilled, (state) => {
                state.loading = false;
            });
    },
});

const verifyAccount = createAsyncThunk(
    "auth/verifyAccount",
    async (verifyDto: VerifyDto) => {
        const { data } = await client.mutate<VerifyAccountMutation>({
            mutation: VERIFY_ACCOUNT_MUTATION,
            variables: { data: verifyDto },
        });
        if (!data?.verifyAccount) {
            throw new Error();
        }
        const { accessToken } = data.verifyAccount;
        setCookie(AuthParams.ACCESS_TOKEN, accessToken);
    },
);

const loginWithPassword = createAsyncThunk(
    "auth/loginWithPassword",
    async (loginDto: LoginReqDto, { dispatch }) => {
        const { data } = await client.mutate<LoginMutation>({
            mutation: LOGIN_MUTATION,
            variables: { data: loginDto },
        });
        if (!data?.login) throw new Error();
        const { accessToken } = data.login;
        setCookie(AuthParams.ACCESS_TOKEN, accessToken);
    },
);
const loginWithToken = createAsyncThunk(
    "auth/loginWithToken",
    async (_, { dispatch }) => {
        try {
            const accessToken = getCookie(AuthParams.ACCESS_TOKEN);
            if (!accessToken) {
                return;
            }
            const {
                data: { getMe },
            } = await client.query<GetMeQuery>({ query: GET_ME });
            dispatch(authActions.login(getMe as User));
        } catch (e) {
            dispatch(authActions.logout());
        }
    },
);

const { actions, reducer } = authSlice;

export const authActions = {
    ...actions,
    loginWithToken,
    loginWithPassword,
    verifyAccount,
};

export default reducer;
