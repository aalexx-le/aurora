import { registerEnumType } from "@nestjs/graphql";

export enum UserScalarFieldEnum {
    id = "id",
    email = "email",
    name = "name",
    password = "password",
    otp = "otp",
    otpPurpose = "otpPurpose"
}


registerEnumType(UserScalarFieldEnum, { name: 'UserScalarFieldEnum', description: undefined })
