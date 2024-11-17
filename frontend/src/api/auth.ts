import gql from "graphql-tag";

export const LOGIN_MUTATION = gql`
    mutation Login($data: LoginReqDto!) {
        login(data: $data) {
            accessToken
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
        }
    }
`;
