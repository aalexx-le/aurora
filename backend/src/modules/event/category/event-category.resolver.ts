import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateEventCategoryArgs } from "./dto/create-event-category.input";
import { User } from "src/entities/user";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { EventCategory } from "src/entities/event-category";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { UpdateEventCategoryArgs } from "./dto/update-event-category.input";
import { EventCategoryService } from "./event-category.service";

@UseGuards(JwtGuard)
@Resolver(() => EventCategory)
export class EventCategoryResolver {
    constructor(private readonly eventCategoryService: EventCategoryService) {}

    @Query(() => [EventCategory], { name: "getEventCategories" })
    findMany(@AuthUser() user: User) {
        return this.eventCategoryService.findMany(user.id);
    }

    @Mutation(() => EventCategory, { name: "createEventCategory" })
    createOne(@AuthUser() user: User, @Args() args: CreateEventCategoryArgs) {
        return this.eventCategoryService.create(user.id, args.data);
    }

    @Mutation(() => EventCategory, { name: "updateEventCategory" })
    updateOne(@Args() args: UpdateEventCategoryArgs) {
        return this.eventCategoryService.update(args.id, args.data);
    }

    @Mutation(() => EventCategory, { name: "removeEventCategory" })
    removeOne(@Args("id", { type: () => Int }) id: number) {
        return this.eventCategoryService.remove(id);
    }
}
