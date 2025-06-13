import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

// DTO for updating portfolio credentials
@InputType()
export class UpdateCredentialsInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    apiKey: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    secretKey: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    passphrase?: string;
}

@ArgsType()
export class UpdatePortfolioCredentialsArgs {
    @Field(() => Int)
    executionId: number;

    @ValidateNested()
    @Field(() => UpdateCredentialsInput)
    @Type(() => UpdateCredentialsInput)
    credentials: UpdateCredentialsInput;
}

// DTO for creating support tickets
@InputType()
export class CreateSupportTicketInput {
    @Field(() => Int)
    executionId: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    subject: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    category?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    priority?: string;
}

@ArgsType()
export class CreateSupportTicketArgs {
    @ValidateNested()
    @Field(() => CreateSupportTicketInput)
    @Type(() => CreateSupportTicketInput)
    data: CreateSupportTicketInput;
}

// DTO for retry portfolio creation (simple, just needs execution ID)
@ArgsType()
export class RetryPortfolioCreationArgs {
    @Field(() => Int)
    executionId: number;
}
