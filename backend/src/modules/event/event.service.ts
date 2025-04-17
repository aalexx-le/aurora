import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateEventInput } from "./dto/create-event.input";
import { UpdateEventInput } from "./dto/update-event.input";
import { GetEventArgs } from "./dto/get-event.args";

@Injectable()
export class EventService {
    constructor(private readonly prisma: PrismaService) {}

    create(userId: number, data: CreateEventInput) {
        return this.prisma.event.create({
            data: {
                ...data,
                userId,
                recurrence: data.recurrence
                    ? {
                          create: data.recurrence,
                      }
                    : undefined,
            },
            include: { recurrence: true },
        });
    }

    findMany(userId: number, args: GetEventArgs) {
        return this.prisma.event.findMany({
            where: {
                userId,
                startDate: args.startDate ? { gte: args.startDate } : undefined,
                endDate: args.endDate ? { lte: args.endDate } : undefined,
            },
            include: { recurrence: true },
        });
    }

    update(id: number, data: UpdateEventInput) {
        return this.prisma.event.update({
            where: { id },
            data: {
                ...data,
                recurrence: data.recurrence
                    ? {
                          upsert: {
                              create: data.recurrence,
                              update: data.recurrence,
                          },
                      }
                    : undefined,
            },
            include: { recurrence: true },
        });
    }

    remove(id: number) {
        return this.prisma.event.delete({
            where: { id },
        });
    }
}
