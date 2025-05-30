import { registerEnumType } from '@nestjs/graphql';

export enum FeatureScalarFieldEnum {
    id = "id",
    type = "type",
    name = "name"
}


registerEnumType(FeatureScalarFieldEnum, { name: 'FeatureScalarFieldEnum', description: undefined })
