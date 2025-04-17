import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { SentryGlobalFilter, SentryModule } from "@sentry/nestjs/setup";
import { PrismaModule } from "nestjs-prisma";
import { join } from "path";
import "src/instrument";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { BankModule } from "./modules/bank/bank.module";
import { CryptoModule } from "./modules/crypto/crypto.module";
import { EventModule } from "./modules/event/event.module";
import { ExpenseModule } from "./modules/expense/expense.module";
import { HealthModule } from "./modules/health/health.module";
import { UserModule } from "./modules/user/user.module";

@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: (configService: ConfigService) => {
                const subscription_path = configService.get(
                    "SUBSCRIPTION_PATH",
                    "/graphql",
                );

                let devVariables = {};
                if (process.env.NODE_ENV === "development") {
                    devVariables = {
                        autoSchemaFile: join(
                            process.cwd(),
                            "graphql/schema.gql",
                        ),
                        definitions: {
                            path: join(process.cwd(), "graphql/graphql.ts"),
                        },
                    };
                }
                return {
                    playground: false,
                    plugins: [ApolloServerPluginLandingPageLocalDefault()],
                    typePaths: ["./**/*.gql"],
                    ...devVariables,
                    subscriptions: {
                        "graphql-ws": {
                            path: subscription_path,
                            onConnect: (context) => {
                                const { connectionParams, extra } = context;
                                // user validation will remain the same as in the example above
                                // when using with graphql-ws, additional context value should be stored in the extra field
                                // extra.user = { user: {} };
                            },
                        },
                    },
                };
            },
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule.forRoot({
            isGlobal: true,
            prismaServiceOptions: {
                prismaOptions: {
                    log: ["info", "warn", "error"],
                },
                explicitConnect: true,
            },
        }),
        SentryModule.forRoot(),
        UserModule,
        AuthModule,
        CryptoModule,
        BankModule,
        ExpenseModule,
        EventModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
        },
    ],
})
export class AppModule {}
