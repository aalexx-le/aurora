import { graphql } from "@/gql";

export const LOGIN_MUTATION = graphql(`
    mutation Login($data: LoginReqDto!) {
        login(data: $data) {
            accessToken
            refreshToken
        }
    }
`);

export const GET_ME = graphql(`
    query GetMe {
        getMe {
            email
            id
            name
            otp
            otpPurpose
        }
    }
`);

export const SIGNUP_MUTATION = graphql(`
    mutation Signup($data: CreateUserInput!) {
        signup(data: $data) {
            accessToken
            refreshToken
        }
    }
`);

export const VERIFY_ACCOUNT_MUTATION = graphql(`
    mutation VerifyAccount($data: VerifyDto!) {
        verifyAccount(data: $data) {
            accessToken
            refreshToken
        }
    }
`);

export const REFRESH_TOKEN_MUTATION = graphql(`
    mutation RefreshToken($data: RefreshTokenInputDto!) {
        refreshToken(data: $data) {
            accessToken
            refreshToken
            expiresIn
        }
    }
`);

export const LOGOUT_MUTATION = graphql(`
    mutation Logout {
        logout
    }
`);
