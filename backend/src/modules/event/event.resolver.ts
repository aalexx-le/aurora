import { BadRequestException, UseGuards } from "@nestjs/common";
import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { Event } from "src/entities/event";
import { EventCategory } from "src/entities/event-category";
import { User } from "src/entities/user";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { EventCategoryService } from "./category/event-category.service";
import { CreateEventArgs } from "./dto/create-event.input";
import { GetEventArgs } from "./dto/get-event.args";
import { UpdateEventArgs } from "./dto/update-event.input";
import { EventService } from "./event.service";

@UseGuards(JwtGuard)
@Resolver(() => Event)
export class EventResolver {
    constructor(
        private readonly eventService: EventService,
        private readonly eventCategoryService: EventCategoryService,
    ) {}

    @ResolveField("category", () => EventCategory)
    category(@Parent() event: Event) {
        return this.eventCategoryService.findOne(event.categoryId);
    }

    @Query(() => [Event], { name: "getEvents" })
    findMany(@AuthUser() user: User, @Args() args: GetEventArgs) {
        return this.eventService.findMany(user.id, args);
    }

    @Mutation(() => Event, { name: "createEvent" })
    createOne(@AuthUser() user: User, @Args() args: CreateEventArgs) {
        const { startDate, endDate } = args.data;

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestException(
                "startDate must be less than endDate.",
            );
        }

        return this.eventService.create(user.id, args.data);
    }

    @Mutation(() => Event, { name: "updateEvent" })
    updateOne(@Args() args: UpdateEventArgs) {
        const { startDate, endDate } = args.data;

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestException(
                "startDate must be less than endDate.",
            );
        }

        return this.eventService.update(args.id, args.data);
    }

    @Mutation(() => Event, { name: "removeEvent" })
    removeOne(@Args("id", { type: () => Int }) id: number) {
        return this.eventService.remove(id);
    }
}
