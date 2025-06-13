import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import helmet from "helmet";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true,
    });
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.enableCors({
        origin: "*",
    });
    app.use(
        helmet({
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
                directives: {
                    imgSrc: [
                        `'self'`,
                        "transaction:",
                        "apollo-server-landing-page.cdn.apollographql.com",
                    ],
                    scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
                    manifestSrc: [
                        `'self'`,
                        "apollo-server-landing-page.cdn.apollographql.com",
                    ],
                    frameSrc: [`'self'`, "sandbox.embed.apollographql.com"],
                },
            },
        }),
    );
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            // whitelist: true,
            // forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    );
    app.useGlobalFilters(new PrismaClientExceptionFilter());

    const configService = app.get(ConfigService);
    const kafkaOptions = {
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: "backend-consumer",
                brokers: [
                    configService.get("MESSAGE_BROKER_URL") || "localhost:9092",
                ],
            },
            consumer: {
                groupId: "backend-consumer-group",
                allowAutoTopicCreation: true,
            },
        },
    };

    app.connectMicroservice(kafkaOptions);

    await app.startAllMicroservices();
    await app.listen(configService.get("SERVER_PORT"));

    console.log(`🚀 Backend running as hybrid service:`);
    console.log(
        `   📡 HTTP/GraphQL: ${configService.get("SERVER_HOST")}:${configService.get("SERVER_PORT")}`,
    );
    console.log(
        `   📨 Kafka Consumer: ${configService.get("MESSAGE_BROKER_URL")}`,
    );
}
bootstrap();
