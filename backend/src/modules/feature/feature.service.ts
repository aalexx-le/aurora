import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { Feature } from "src/entities/feature/feature.model";
import { CreateFeatureDto } from "./dtos/create-feature.dto";
import { UpdateFeatureDto } from "./dtos/update-feature.dto";

@Injectable()
export class FeatureService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<Feature[]> {
        return this.prisma.feature.findMany();
    }

    async findOne(id: number): Promise<Feature> {
        return this.prisma.feature.findUniqueOrThrow({
            where: { id },
        });
    }

    async create(data: CreateFeatureDto): Promise<Feature> {
        return this.prisma.feature.create({
            data,
        });
    }

    async update(id: number, data: UpdateFeatureDto): Promise<Feature> {
        return this.prisma.feature.update({
            where: { id },
            data,
        });
    }

    async delete(id: number): Promise<Feature> {
        return this.prisma.feature.delete({
            where: { id },
        });
    }
}
