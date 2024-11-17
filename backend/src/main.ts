import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { PrismaClientExceptionFilter } from "nestjs-prisma";
import { ConfigService } from "@nestjs/config";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
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
    await app.listen(configService.get("SERVER_PORT"));
}
bootstrap();
