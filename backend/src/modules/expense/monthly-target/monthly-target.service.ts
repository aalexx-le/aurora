import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateMonthlyTargetInput } from "./dto/create-monthly-target.input";
import { UpdateMonthlyTargetInput } from "./dto/update-monthly-target.input";
import { GetMonthlyTargetArgs } from "./dto/get-monthly-target.input";
import { Prisma } from "@prisma/client";

@Injectable()
export class MonthlyTargetService {
    constructor(private readonly prismaService: PrismaService) {}

    createOne(data: CreateMonthlyTargetInput) {
        return this.prismaService.monthlyTarget.create({
            data,
        });
    }

    update(id: string, data: UpdateMonthlyTargetInput) {
        return this.prismaService.monthlyTarget.update({
            where: { id },
            data,
        });
    }

    findMany(categoryId: string, input: GetMonthlyTargetArgs) {
        const args: Prisma.MonthlyTargetFindManyArgs = {
            where: {
                categoryId,
            },
        };

        if (input.year) {
            args.where.year = input.year;
        }

        if (input.month) {
            args.where.month = input.month;
        }

        return this.prismaService.monthlyTarget.findMany(args);
    }
}
