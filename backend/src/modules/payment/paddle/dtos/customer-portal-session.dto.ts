import { ArgsType, Field, ObjectType } from "@nestjs/graphql";

@ArgsType()
export class CreateCustomerPortalSessionDto {
    @Field(() => [String], { nullable: true })
    subscriptionIds?: string[];
}

@ObjectType()
export class GeneralUrl {
    @Field()
    overview: string;
}

@ObjectType()
export class CustomerPortalUrls {
    @Field(() => GeneralUrl)
    general: GeneralUrl;
}

@ObjectType()
export class CustomerPortalSessionResponse {
    @Field()
    id: string;

    @Field()
    customerId: string;

    @Field(() => CustomerPortalUrls)
    urls: CustomerPortalUrls;

    @Field()
    createdAt: string;
}
