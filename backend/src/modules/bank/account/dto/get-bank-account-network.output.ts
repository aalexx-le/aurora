import { Type } from "class-transformer";
import {
    ArrayMinSize,
    IsArray,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    ValidateNested,
} from "class-validator";

class Bank {
    @IsInt()
    id: number;

    @IsInt()
    bin: number;

    @IsString()
    swift: string;

    @IsString()
    codeName: string;

    @IsString()
    fullName: string;

    @IsString()
    bankType: string;
}

enum ConnectStatus {
    Connected = 1,
    Disconnected = 0,
}

enum PlanStatus {
    Active = 1,
    Inactive = 0,
}

class BankAccount {
    @IsInt()
    id: number;

    @Type(() => Bank)
    @ValidateNested()
    bank: Bank;

    @IsString()
    @IsNotEmpty()
    bankAccountName: string;

    @IsString()
    @IsNotEmpty()
    bankSubAccId: string;

    @IsNumber()
    @Min(0)
    balance: number;

    @IsString()
    memo: string;

    @IsEnum(ConnectStatus)
    connectStatus: ConnectStatus;

    @IsEnum(PlanStatus)
    planStatus: PlanStatus;

    @IsDateString()
    beginDate: string;
}

class Data {
    @Type(() => Object)
    user: {
        id: number;
        email: string;
    };
    @Type(() => Object)
    business: {
        id: number;
        name: string;
    };
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => BankAccount)
    bankAccs: BankAccount[];
}

export class GetBankAccountNetworkOutput {
    @Type(() => Data)
    @ValidateNested()
    data: Data;
}
