import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user";
import { PrismaService } from "nestjs-prisma";
import { LoginReqDto } from "../auth/dto/login.dto";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: CreateUserInput): Promise<User> {
        return this.prismaService.user.create({
            data,
        });
    }

    async update(userId: number, data: UpdateUserInput): Promise<User> {
        return this.prismaService.user.update({
            where: { id: userId },
            data,
        });
    }

    async findById(userId: number): Promise<User> {
        return this.prismaService.user.findUnique({ where: { id: userId } });
    }

    async findByAccount(email: string): Promise<LoginReqDto> {
        return this.prismaService.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true },
        });
    }
}
