// import { CassandraModule, InjectCassandra } from '@mich4l/nestjs-cassandra';
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
} from "nest-winston";
import * as path from "path";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { LogstashTransport } from "winston-logstash-ts";

@Module({})
export class WinstonLoggerModule {
    static forRoot(): DynamicModule {
        return {
            module: WinstonLoggerModule,
            imports: [
                WinstonModule.forRootAsync({
                    useFactory: (configService: ConfigService) => {
                        // Define log directory
                        const logDir = path.join(process.cwd(), "logs");

                        // Configure winston with cassandra transport
                        return {
                            // Winston level hierarchy: error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
                            level:
                                process.env.NODE_ENV === "production"
                                    ? "error"
                                    : "debug",
                            format: winston.format.combine(
                                winston.format.json(),
                                winston.format.timestamp(),
                                winston.format.ms(),
                                nestWinstonModuleUtilities.format.nestLike(
                                    "Xela",
                                    {
                                        colors: true,
                                        prettyPrint: true,
                                    },
                                ),
                            ),
                            transports: [
                                // Console transport with colors
                                new winston.transports.Console(),

                                // File transport for all logs
                                new winston.transports.DailyRotateFile({
                                    level: "info",
                                    filename: "application-%DATE%.log",
                                    datePattern: "YYYY-MM-DD-HH",
                                    zippedArchive: true,
                                    maxSize: "20m",
                                    maxFiles: "30d",
                                    dirname: logDir,
                                }),

                                // Separate file for error logs
                                new winston.transports.File({
                                    level: "error",
                                    dirname: logDir,
                                    filename: "error.log",
                                    maxsize: 20 * 1024 * 1024, // 20MB
                                    maxFiles: 14,
                                    tailable: true,
                                    format: winston.format.combine(
                                        winston.format.timestamp(),
                                        winston.format.json(),
                                    ),
                                }),

                                // Logstash transport
                                new LogstashTransport({
                                    hostname: "localhost",
                                    host: configService.get("LOGSTASH_HOST"),
                                    port: configService.get("LOGSTASH_PORT"),
                                    protocol:
                                        configService.get("LOGSTASH_PROTOCOL"),
                                    format: winston.format.combine(
                                        winston.format.timestamp(),
                                        winston.format.logstash(),
                                    ),
                                }),
                            ],
                        };
                    },
                    inject: [ConfigService],
                }),
            ],
            exports: [WinstonModule],
        };
    }
}
