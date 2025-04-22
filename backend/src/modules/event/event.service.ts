import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateEventInput } from "./dto/create-event.input";
import { GetEventArgs } from "./dto/get-event.args";
import { UpdateEventInput } from "./dto/update-event.input";
import { EventRecurrenceService } from "./recurrence/event-recurrence.service";

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly eventRecurrenceService: EventRecurrenceService,
    ) {}

    async create(userId: number, data: CreateEventInput) {
        const { recurrence, ...eventData } = data;

        // If no recurrence, create a single event
        if (!data.recurrence) {
            return this.prisma.event.create({
                data: {
                    ...eventData,
                    userId,
                },
            });
        } else {
            return this.eventRecurrenceService.create(userId, data);
        }
    }

    findMany(userId: number, args: GetEventArgs) {
        return this.prisma.event.findMany({
            where: {
                userId,
                startDate: args.startDate ? { gte: args.startDate } : undefined,
                endDate: args.endDate ? { lte: args.endDate } : undefined,
            },
        });
    }

    findOneByRecurrenceId(recurrenceId: number) {
        return this.prisma.event.findFirst({
            where: {
                recurrenceId,
            },
        });
    }

    update(id: number, data: UpdateEventInput) {
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.event.delete({
            where: { id },
        });
    }
}
