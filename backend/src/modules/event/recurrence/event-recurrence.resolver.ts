import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Event } from "src/entities/event";
import { EventRecurrence } from "src/entities/event-recurrence";
import { User } from "src/entities/user";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { EventService } from "../event.service";
import { UpdateEventRecurrenceArgs } from "./dto/update-event-recurrence.input";
import { EventRecurrenceService } from "./event-recurrence.service";

@UseGuards(JwtGuard)
@Resolver(() => EventRecurrence)
export class EventRecurrenceResolver {
    constructor(
        private readonly eventRecurrenceService: EventRecurrenceService,
        private readonly eventService: EventService,
    ) {}

    @Query(() => [EventRecurrence], { name: "getRecurrenceTemplates" })
    findAll(@AuthUser() user: User) {
        return this.eventRecurrenceService.findAll(user.id);
    }

    @Query(() => EventRecurrence, { name: "getRecurrenceTemplate" })
    findOne(@Args("id", { type: () => Int }) id: number) {
        return this.eventRecurrenceService.findOne(id);
    }

    @Mutation(() => EventRecurrence, { name: "updateRecurrenceTemplate" })
    update(@Args() args: UpdateEventRecurrenceArgs) {
        return this.eventRecurrenceService.update(args.id, args.data);
    }

    @Mutation(() => EventRecurrence, { name: "deleteRecurrenceTemplate" })
    remove(@Args("id", { type: () => Int }) id: number) {
        return this.eventRecurrenceService.remove(id);
    }

    @ResolveField(() => [Event], { name: "events" })
    async getEvents(@Parent() eventRecurrence: EventRecurrence) {
        const event = await this.eventService.findOneByRecurrenceId(eventRecurrence.id);
        return event ? [event] : [];
    }
}
