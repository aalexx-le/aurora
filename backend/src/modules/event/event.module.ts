import { Module } from "@nestjs/common";
import { EventCategoryResolver } from "./category/event-category.resolver";
import { EventCategoryService } from "./category/event-category.service";
import { EventResolver } from "./event.resolver";
import { EventService } from "./event.service";
import { EventRecurrenceResolver } from "./recurrence/event-recurrence.resolver";
import { EventRecurrenceService } from "./recurrence/event-recurrence.service";

@Module({
    providers: [
        EventResolver,
        EventCategoryResolver,
        EventRecurrenceResolver,
        EventService,
        EventCategoryService,
        EventRecurrenceService,
    ],
})
export class EventModule {}
