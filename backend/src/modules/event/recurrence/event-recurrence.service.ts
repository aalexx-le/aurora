import { Injectable, Logger } from "@nestjs/common";
import { RecurrenceType } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { Options, RRule } from "rrule";
import { CreateEventInput } from "../dto/create-event.input";

// Import our DTO types
type CreateEventRecurrenceInput = {
    type: RecurrenceType;
    interval?: number;
    daysOfWeek?: string;
    dayOfMonth?: number;
    weekOfMonth?: number;
    dayOfWeek?: number;
    endDate?: Date;
    endCount?: number;
};

type UpdateEventRecurrenceInput = Partial<CreateEventRecurrenceInput>;

@Injectable()
export class EventRecurrenceService {
    private readonly logger = new Logger(EventRecurrenceService.name);

    constructor(private readonly prisma: PrismaService) {}

    async create(userId: number, data: CreateEventInput) {
        const { recurrence, ...eventData } = data;

        // Create RRule instance to generate occurrences
        const options: Partial<Options> = {
            freq: this.mapRecurrenceTypeToRRuleFreq(data.recurrence.type),
            interval: data.recurrence.interval || 1,
            dtstart: new Date(data.startDate),
            wkst: RRule.MO,
        };

        // Add end date or count if provided
        if (data.recurrence.endDate) {
            options.until = new Date(data.recurrence.endDate);
        } else if (data.recurrence.endCount) {
            options.count = data.recurrence.endCount;
        } else {
            // Default to generating events for 1 year if no end specified
            const untilDate = new Date(data.startDate);
            untilDate.setFullYear(untilDate.getFullYear() + 1);
            options.until = untilDate;
        }

        // Add byweekday if specified
        if (data.recurrence.daysOfWeek) {
            options.byweekday = this.parseDaysOfWeek(
                data.recurrence.daysOfWeek,
            );
        }

        // Add bymonthday if specified
        if (data.recurrence.dayOfMonth) {
            options.bymonthday = data.recurrence.dayOfMonth;
        }

        const rule = new RRule(options);

        // Generate all occurrence dates
        const occurrences = rule.all();

        this.logger.log(`Generated ${occurrences.length} event occurrences`);

        // Create events for each occurrence
        let firstEvent = null;

        const createdRecurrence = await this.prisma.eventRecurrence.create({
            data: {
                ...data.recurrence,
                userId: userId,
            },
        });

        for (const date of occurrences) {
            // Calculate end date based on the duration of the original event
            const eventDuration =
                new Date(data.endDate).getTime() -
                new Date(data.startDate).getTime();
            const endDate = new Date(date.getTime() + eventDuration);

            console.log(date);

            const event = await this.prisma.event.create({
                data: {
                    name: data.name,
                    description: data.description,
                    startDate: date,
                    endDate: endDate,
                    allDay: data.allDay,
                    color: data.color,
                    userId,
                    categoryId: data.categoryId,
                    reminderMinutes: data.reminderMinutes,
                    recurrenceId: createdRecurrence.id,
                },
            });

            if (!firstEvent) {
                firstEvent = event;
            }
        }

        // Return dummy event to satisfy the resolver
        return firstEvent;
    }

    // Helper methods
    private mapRecurrenceTypeToRRuleFreq(type: string): number {
        switch (type) {
            case "DAILY":
                return RRule.DAILY;
            case "WEEKLY":
                return RRule.WEEKLY;
            case "MONTHLY":
                return RRule.MONTHLY;
            case "YEARLY":
                return RRule.YEARLY;
            default:
                return RRule.DAILY;
        }
    }

    private parseDaysOfWeek(daysOfWeek: string): number[] {
        if (!daysOfWeek) return [];

        const dayList = [
            RRule.MO,
            RRule.TU,
            RRule.WE,
            RRule.TH,
            RRule.FR,
            RRule.SA,
            RRule.SU,
        ];

        return daysOfWeek.split(",").map((day) => dayList[day]);
    }

    async findAll(userId: number) {
        this.logger.log(`Finding all recurrence templates for user ${userId}`);
        // Use a join to find recurrences for events owned by this user
        return this.prisma.eventRecurrence.findMany({
            where: {
                userId,
            },
        });
    }

    async findOne(id: number) {
        this.logger.log(`Finding recurrence template with id ${id}`);
        return this.prisma.eventRecurrence.findUnique({
            where: {
                id,
            },
        });
    }

    async update(id: number, data: UpdateEventRecurrenceInput) {
        this.logger.log(`Updating recurrence template with id ${id}`);
        return this.prisma.eventRecurrence.update({
            where: {
                id,
            },
            data,
        });
    }

    async remove(id: number) {
        this.logger.log(`Removing recurrence template with id ${id}`);
        return this.prisma.eventRecurrence.delete({
            where: {
                id,
            },
        });
    }
}
