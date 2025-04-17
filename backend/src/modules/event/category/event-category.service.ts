import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateEventCategoryInput } from "./dto/create-event-category.input";
import { UpdateEventCategoryInput } from "./dto/update-event-category.input";

@Injectable()
export class EventCategoryService {
    constructor(private readonly prisma: PrismaService) {}

    create(userId: number, data: CreateEventCategoryInput) {
        return this.prisma.eventCategory.create({
            data: { ...data, userId },
        });
    }

    findOne(id: number) {
        return this.prisma.eventCategory.findUnique({
            where: { id },
        });
    }

    findMany(userId: number) {
        return this.prisma.eventCategory.findMany({
            where: { userId },
        });
    }

    update(id: number, data: UpdateEventCategoryInput) {
        return this.prisma.eventCategory.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.eventCategory.delete({
            where: { id },
        });
    }
}
