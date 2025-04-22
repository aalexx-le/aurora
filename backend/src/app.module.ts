import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module, Scope } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
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
import { FeatureModule } from "./modules/feature/feature.module";
import { HealthModule } from "./modules/health/health.module";
import { MembershipModule } from "./modules/membership/membership.module";
import { PaddleModule } from "./modules/paddle/paddle.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { UserModule } from "./modules/user/user.module";
import { WinstonLoggerModule } from "./shared/logger/winston-logger.module";
import { LoggingInterceptor } from "./shared/logger/winston-logging.interceptor";

@Module({
    imports: [
        WinstonLoggerModule.forRoot(),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: (configService: ConfigService) => {
                const subscription_path = configService.get(
                    "SUBSCRIPTION_PATH",
                    "/graphql",
                );

                let devVariables = {};
                console.log("process.env.NODE_ENV", process.env.NODE_ENV);
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
                    // subscriptions: {
                    //     // "graphql-ws": {
                    //     //     path: subscription_path,
                    //     //     onConnect: (context) => {
                    //     //         const connectionParams = context.connectionParams;
                    //     //         const extra = context.extra as Record<string, any>;
                    //     //         const accessToken = connectionParams.accessToken;

                    //     //         if (!accessToken) {
                    //     //             throw new Error('Auth token missing!');
                    //     //         }
                    //     //         extra.accessToken = accessToken
                    //     //     },
                    //     // },
                    //     'subscriptions-transport-ws': {
                    //         path: subscription_path,
                    //         onConnect: (connectionParams) => {
                    //             const accessToken = connectionParams.accessToken;

                    //             if (!accessToken) {
                    //                 throw new Error('Auth token missing!');
                    //             }
                    //             return { authorization: `Bearer ${accessToken}` };
                    //         },
                    //     }
                    // },
                    // context: ({ req, connection }) => {
                    //     // For subscriptions
                    //     console.log("context", connection);
                    //     if (connection) {
                    //         return { req, ...connection.context };
                    //     }
                    //     // For queries and mutations
                    //     return { req };
                    // },

                    subscriptions: {
                        "graphql-ws": {
                            path: subscription_path,
                            onConnect: (context: any) => {
                                const { connectionParams } = context;
                                console.log("graphql-ws", { connectionParams });
                                return {
                                    req: {
                                        headers: {
                                            authorization:
                                                connectionParams.authorization,
                                        },
                                    },
                                };
                            },
                        },
                        "subscriptions-transport-ws": {
                            path: subscription_path,
                            onConnect: (connectionParams) => {
                                console.log("subscriptions-transport-ws", {
                                    connectionParams,
                                });
                                return {
                                    req: {
                                        headers: {
                                            authorization:
                                                connectionParams.authorization,
                                        },
                                    },
                                };
                            },
                        },
                    },
                    includeStacktraceInErrorResponses: true,
                    context: ({ req, res }) => ({ req, res }),
                    // Error
                    formatError: (error) => {
                        return {
                            message: error.message,
                            code:
                                error.extensions?.code ||
                                "INTERNAL_SERVER_ERROR",
                        };
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
        PaddleModule,
        MembershipModule,
        FeatureModule,
        PaymentModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
            scope: Scope.REQUEST,
        },
    ],
})
export class AppModule {}
