import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
    mutation Login($data: LoginReqDto!) {
        login(data: $data) {
            accessToken
            refreshToken
        }
    }
`;

export const GET_ME = gql`
    query GetMe {
        getMe {
            email
            id
            name
            otp
            otpPurpose
        }
    }
`;

export const SIGNUP_MUTATION = gql`
    mutation Signup($data: CreateUserInput!) {
        signup(data: $data) {
            accessToken
            refreshToken
        }
    }
`;

export const VERIFY_ACCOUNT_MUTATION = gql`
    mutation VerifyAccount($data: VerifyDto!) {
        verifyAccount(data: $data) {
            accessToken
            refreshToken
        }
    }
`;

export const REFRESH_TOKEN_MUTATION = gql`
    mutation RefreshToken($data: RefreshTokenInputDto!) {
        refreshToken(data: $data) {
            accessToken
            refreshToken
            expiresIn
        }
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout
    }
`;
