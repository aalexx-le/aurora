import { Type } from "class-transformer";
import {
    IsArray,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from "class-validator";

class Record {
    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    tid: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    amount: number;

    @IsNumber()
    cusumBalance: number;

    @IsDateString()
    when: string;

    @IsOptional()
    @IsDateString()
    bookingDate: string | null;

    @IsString()
    @IsNotEmpty()
    bankSubAccId: string;

    @IsString()
    paymentChannel: string;

    @IsString()
    virtualAccount: string;

    @IsString()
    virtualAccountName: string;

    @IsString()
    corresponsiveName: string;

    @IsString()
    corresponsiveAccount: string;

    @IsString()
    corresponsiveBankId: string;

    @IsString()
    corresponsiveBankName: string;

    @IsInt()
    accountId: number;

    @IsString()
    bankCodeName: string;
}

class Data {
    @IsInt()
    @Min(1)
    page: number;

    @IsInt()
    @Min(1)
    pageSize: number;

    @IsInt()
    @Min(1)
    nextPage: number;

    @IsInt()
    @Min(1)
    prevPage: number;

    @IsInt()
    @Min(1)
    totalPages: number;

    @IsInt()
    @Min(0)
    totalRecords: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Record)
    records: Record[];
}

export class GetTransactionNetworkOutput {
    @ValidateNested()
    @Type(() => Data)
    data: Data;
}
