import { Module } from "@nestjs/common";
import { EventCategoryResolver } from "./category/event-category.resolver";
import { EventCategoryService } from "./category/event-category.service";
import { EventResolver } from "./event.resolver";
import { EventService } from "./event.service";

@Module({
    providers: [
        EventResolver,
        EventCategoryResolver,
        EventService,
        EventCategoryService,
    ],
})
export class EventModule {}
