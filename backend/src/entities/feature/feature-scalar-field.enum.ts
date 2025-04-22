import { registerEnumType } from '@nestjs/graphql';

export enum FeatureScalarFieldEnum {
    id = "id",
    type = "type"
}


registerEnumType(FeatureScalarFieldEnum, { name: 'FeatureScalarFieldEnum', description: undefined })
