import { UseGuards } from "@nestjs/common";
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver
} from "@nestjs/graphql";
import { PrismaService } from "nestjs-prisma";
import { MembershipDiscountPrice } from "src/entities/membership-discount-price/membership-discount-price.model";
import { MembershipDiscountUsage } from "src/entities/membership-discount-usage/membership-discount-usage.model";
import { MembershipDiscount } from "src/entities/membership-discount/membership-discount.model";
import { User } from "src/entities/user";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { CreateDiscountArgs } from "./dtos/create-discount.dto";
import { DeleteDiscountArgs } from "./dtos/delete-discount.dto";
import { GetDiscountArgs } from "./dtos/get-discount.dto";
import {
    LinkDiscountToPriceArgs,
    UnlinkDiscountFromPriceArgs,
} from "./dtos/link-discount-price.dto";
import { UpdateDiscountArgs } from "./dtos/update-discount.dto";
import {
    DiscountValidationResult,
    ValidateDiscountArgs,
} from "./dtos/validate-discount.dto";
import { MembershipDiscountService } from "./membership-discount.service";

@Resolver(() => MembershipDiscount)
export class MembershipDiscountResolver {
    constructor(
        private readonly discountService: MembershipDiscountService,
        private readonly prisma: PrismaService,
    ) {}

    @Query(() => [MembershipDiscount], { name: "getDiscounts" })
    async getDiscounts(): Promise<MembershipDiscount[]> {
        return this.discountService.findAll();
    }

    @Query(() => MembershipDiscount, { name: "getDiscount" })
    async getDiscount(
        @Args() args: GetDiscountArgs,
    ): Promise<MembershipDiscount> {
        return this.discountService.findOne(args.id);
    }

    @Query(() => DiscountValidationResult, { name: "validateDiscountCode" })
    @UseGuards(JwtGuard)
    async validateDiscountCode(
        @Args() args: ValidateDiscountArgs,
        @AuthUser() user: User,
    ): Promise<DiscountValidationResult> {
        return this.discountService.validateDiscount(args.data, user.id);
    }

    @Mutation(() => MembershipDiscount, { name: "createDiscount" })
    async createDiscount(
        @Args() args: CreateDiscountArgs,
    ): Promise<MembershipDiscount> {
        return this.discountService.create(args.data);
    }

    @Mutation(() => MembershipDiscount, { name: "updateDiscount" })
    async updateDiscount(
        @Args() args: UpdateDiscountArgs,
    ): Promise<MembershipDiscount> {
        return this.discountService.update(args.id, args.data);
    }

    @Mutation(() => Boolean, { name: "deleteDiscount" })
    async deleteDiscount(@Args() args: DeleteDiscountArgs): Promise<boolean> {
        return this.discountService.delete(args.id);
    }

    @Mutation(() => Boolean, { name: "linkDiscountToPrice" })
    async linkDiscountToPrice(
        @Args() args: LinkDiscountToPriceArgs,
    ): Promise<boolean> {
        return this.discountService.linkDiscountToPrice(args);
    }

    @Mutation(() => Boolean, { name: "unlinkDiscountFromPrice" })
    async unlinkDiscountFromPrice(
        @Args() args: UnlinkDiscountFromPriceArgs,
    ): Promise<boolean> {
        return this.discountService.unlinkDiscountFromPrice(args);
    }

    @ResolveField("usageHistory", () => [MembershipDiscountUsage])
    async getUsageHistory(
        @Parent() discount: MembershipDiscount,
    ): Promise<MembershipDiscountUsage[]> {
        return this.prisma.membershipDiscountUsage.findMany({
            where: { discountId: discount.id },
            orderBy: { usedAt: "desc" },
        });
    }

    @ResolveField("prices", () => [MembershipDiscountPrice])
    async getPrices(
        @Parent() discount: MembershipDiscount,
    ): Promise<MembershipDiscountPrice[]> {
        return this.prisma.membershipDiscountPrice.findMany({
            where: { discountId: discount.id },
        });
    }

    @Query(() => [MembershipDiscount])
    async getDiscountsForPrice(@Args('priceId') priceId: string): Promise<MembershipDiscount[]> {
        return this.discountService.findDiscountsForPrice(priceId);
    }
}
