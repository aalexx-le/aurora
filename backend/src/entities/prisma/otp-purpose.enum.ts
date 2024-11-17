import { registerEnumType } from "@nestjs/graphql";

export enum OtpPurpose {
    VERIFY_ACCOUNT = "VERIFY_ACCOUNT",
    RESET_PASSWORD = "RESET_PASSWORD"
}


registerEnumType(OtpPurpose, { name: 'OtpPurpose', description: undefined })
