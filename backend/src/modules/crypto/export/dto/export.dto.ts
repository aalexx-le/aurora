import {
    Field,
    InputType,
    ObjectType,
    registerEnumType,
} from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export enum ExportFormat {
    PDF = "pdf",
    CSV = "csv",
    EXCEL = "excel",
}

registerEnumType(ExportFormat, {
    name: "ExportFormat",
    description: "Available export formats for portfolio analysis",
});

@InputType()
export class ExportPortfolioInput {
    @Field(() => String)
    @IsString()
    portfolioId: string;

    @Field(() => ExportFormat)
    @IsEnum(ExportFormat)
    format: ExportFormat;

    @Field(() => Boolean, { defaultValue: true })
    @IsBoolean()
    @IsOptional()
    includeCharts?: boolean = true;

    @Field(() => Boolean, { defaultValue: true })
    @IsBoolean()
    @IsOptional()
    includeSummary?: boolean = true;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    portfolioName?: string;
}

@ObjectType()
export class ExportResult {
    @Field(() => String)
    downloadUrl: string;

    @Field(() => String)
    fileName: string;

    @Field(() => String)
    mimeType: string;

    @Field(() => Number)
    fileSize: number;

    @Field(() => Date)
    expiresAt: Date;
}
