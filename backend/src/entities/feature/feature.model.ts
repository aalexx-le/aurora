import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { FeatureType } from '../prisma/feature-type.enum';
import { MembershipFeature } from '../membership-feature/membership-feature.model';

@ObjectType()
export class Feature {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => FeatureType, {nullable:false})
    type!: `${FeatureType}`;

    @Field(() => String, {defaultValue:'',nullable:false})
    name!: string;

    @Field(() => [MembershipFeature], {nullable:true})
    membershipFeatures?: Array<MembershipFeature>;
}
