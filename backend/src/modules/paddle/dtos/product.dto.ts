import { ArgsType, Field, ID, InputType, PartialType } from "@nestjs/graphql";
import {
    CatalogType,
    Status as ProductStatus,
    TaxCategory,
} from "@paddle/paddle-node-sdk";
import { Type as ClsType } from "class-transformer";
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested,
} from "class-validator";

@InputType()
export class CreateProductInputData {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field(() => String)
    @IsNotEmpty()
    taxCategory: TaxCategory;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    type?: CatalogType;

    @Field({ nullable: true })
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    // customData?: CustomData;
}

@ArgsType()
export class CreateProductArgs {
    @Field(() => CreateProductInputData)
    @ValidateNested()
    @ClsType(() => CreateProductInputData)
    data: CreateProductInputData;
}

@InputType()
export class UpdateProductInputData extends PartialType(
    CreateProductInputData,
) {
    @Field(() => String, { nullable: true })
    @IsOptional()
    status?: ProductStatus;
}

@ArgsType()
export class UpdateProductArgs {
    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => UpdateProductInputData)
    @ValidateNested()
    @ClsType(() => UpdateProductInputData)
    data: UpdateProductInputData;
}
