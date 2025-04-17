import {InputType, ObjectType, OmitType} from "@nestjs/graphql";
import {User} from "./user.model";

@ObjectType()
export class UserWithoutSensitiveFields extends OmitType(
    User,
    [
        "password",
        "otp",
        "otpPurpose",

        "cryptoPortfolios",
        "expenseCategories",
        "bankManager",
        "expenses",
        "events",
        "eventCategories",
    ],
) {}