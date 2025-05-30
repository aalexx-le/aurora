import client from "@/api";
import {
    GET_ME,
    LOGIN_MUTATION,
    LOGOUT_MUTATION,
    REFRESH_TOKEN_MUTATION,
    VERIFY_ACCOUNT_MUTATION,
} from "@/api/auth/auth";
import {
    GetMeQuery,
    LoginMutation,
    LoginReqDto,
    LogoutMutation,
    OtpPurpose,
    RefreshTokenMutation,
    User,
    VerifyAccountMutation,
    VerifyDto,
} from "@/gql/graphql";
import { Cookie } from "@/lib/utils/cookie";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
            Cookie.clearTokens();
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
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.error = "";
                state.loading = true;
            })
            .addCase(refreshAccessToken.rejected, (state, payload) => {
                state.loading = false;
                state.error = payload.error.message || "Something went wrong";
                // On refresh failure, logout the user
                Cookie.clearTokens();
                state.state = {
                    ...state.state,
                    status: "guess",
                    user: undefined,
                };
            })
            .addCase(refreshAccessToken.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                Cookie.clearTokens();
                state.state = {
                    ...state.state,
                    status: "guess",
                    user: undefined,
                };
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                // Even if the server request fails, we still want to clear local state
                Cookie.clearTokens();
                state.state = {
                    ...state.state,
                    status: "guess",
                    user: undefined,
                };
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
        const { accessToken, refreshToken } = data.verifyAccount;
        Cookie.saveTokens({ accessToken, refreshToken });
    },
);

const loginWithPassword = createAsyncThunk(
    "auth/loginWithPassword",
    async (loginDto: LoginReqDto) => {
        const { data } = await client.mutate<LoginMutation>({
            mutation: LOGIN_MUTATION,
            variables: { data: loginDto },
        });
        if (!data?.login) throw new Error();
        const { accessToken, refreshToken } = data.login;
        Cookie.saveTokens({ accessToken, refreshToken });
    },
);

const loginWithToken = createAsyncThunk(
    "auth/loginWithToken",
    async (_, { dispatch }) => {
        try {
            const accessToken = Cookie.getAccessToken();
            if (!accessToken) {
                return;
            }
            const {
                data: { getMe },
            } = await client.query<GetMeQuery>({ query: GET_ME });
            dispatch(authActions.login(getMe as User));
        } catch (e) {
            // If getting user profile fails, try refreshing the token once
            const refreshToken = Cookie.getRefreshToken();
            console.log("refreshToken", refreshToken);
            if (refreshToken) {
                try {
                    await dispatch(refreshAccessToken());
                    // Retry getting the user profile after refresh
                    const {
                        data: { getMe },
                    } = await client.query<GetMeQuery>({ query: GET_ME });
                    dispatch(authActions.login(getMe as User));
                } catch (refreshError) {
                    dispatch(authActions.logout());
                }
            } else {
                dispatch(authActions.logout());
            }
        }
    },
);

const refreshAccessToken = createAsyncThunk("auth/refreshToken", async () => {
    const refreshToken = Cookie.getRefreshToken();
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    const { data } = await client.mutate<RefreshTokenMutation>({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
            data: { refreshToken },
        },
    });

    if (!data?.refreshToken) {
        throw new Error("Failed to refresh token");
    }

    Cookie.saveTokens({
        accessToken: data.refreshToken.accessToken,
        refreshToken: data.refreshToken.refreshToken,
        expiresIn: data.refreshToken.expiresIn,
    });
});

const logoutUser = createAsyncThunk("auth/logout", async () => {
    try {
        await client.mutate<LogoutMutation>({
            mutation: LOGOUT_MUTATION,
        });
    } finally {
        // Clear tokens regardless of the server response
        Cookie.clearTokens();
    }
});

interface GoogleLoginParams {
    idToken: string;
}

const { actions, reducer } = authSlice;

export const authActions = {
    ...actions,
    loginWithToken,
    loginWithPassword,
    verifyAccount,
    refreshAccessToken,
    logoutUser,
};

export default reducer;
