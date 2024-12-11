import { registerEnumType } from '@nestjs/graphql';

export enum AssetInfoScalarFieldEnum {
    id = "id",
    name = "name",
    symbol = "symbol",
    category = "category",
    desc = "desc",
    logo = "logo",
    tag = "tag"
}


registerEnumType(AssetInfoScalarFieldEnum, { name: 'AssetInfoScalarFieldEnum', description: undefined })
