import { registerEnumType } from "@nestjs/graphql";

export enum TagsScalarFieldEnum {
    id = "id",
    name = "name"
}


registerEnumType(TagsScalarFieldEnum, { name: 'TagsScalarFieldEnum', description: undefined })
