import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MonthlyTarget } from "src/entities/monthly-target";
import { CreateMonthlyTargetArgs } from "./dto/create-monthly-target.input";
import { MonthlyTargetService } from "./monthly-target.service";
import { UpdateMonthlyTargetArgs } from "./dto/update-monthly-target.input";
import { GetMonthlyTargetArgs } from "./dto/get-monthly-target.input";

@Resolver(() => MonthlyTarget)
export class MonthlyTargetResolver {
    constructor(private readonly monthlyTargetService: MonthlyTargetService) {}

    @Query(() => [MonthlyTarget], { name: "getMonthlyTargets" })
    async findMany(
        @Args("categoryId") categoryId: string,
        @Args() args: GetMonthlyTargetArgs,
    ) {
        return this.monthlyTargetService.findMany(categoryId, args);
    }

    @Mutation(() => MonthlyTarget, { name: "createMonthlyTarget" })
    async createOne(@Args() args: CreateMonthlyTargetArgs) {
        return this.monthlyTargetService.createOne(args.data);
    }

    @Mutation(() => MonthlyTarget, { name: "updateMonthlyTarget" })
    async updateOne(@Args() args: UpdateMonthlyTargetArgs) {
        return this.monthlyTargetService.update(args.id, args.data);
    }
}
