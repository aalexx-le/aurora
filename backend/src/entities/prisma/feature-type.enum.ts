import { registerEnumType } from '@nestjs/graphql';

export enum FeatureType {
    CRYPTO = "CRYPTO",
    EXPENSE = "EXPENSE"
}


registerEnumType(FeatureType, { name: 'FeatureType', description: undefined })
