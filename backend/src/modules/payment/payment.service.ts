import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { GetPaymentMethodDto } from "./dtos/payment-method.dto";

@Injectable()
export class PaymentService {
    constructor(private readonly prisma: PrismaService) {}

    async getPaymentMethod(data: GetPaymentMethodDto) {
        return this.prisma.paymentMethod.findUnique({
            where: {
                id: data.id,
            },
            include: {
                paddlePaymentMethod: true,
            },
        });
    }

    async getPaymentMethods(userId: number) {
        return this.prisma.paymentMethod.findMany({
            where: {
                userId,
            },
            include: {
                paddlePaymentMethod: true,
            },
        });
    }
}
