import { RedisModule } from "@liaoliaots/nestjs-redis";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "src/modules/user/user.service";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { TokenService } from "./token.service";
import { AuthController } from "./auth.controller";

const GoogleHttpModule = HttpModule.registerAsync({
    useFactory: () => ({
        baseURL: "https://www.googleapis.com",
    }),
});

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
            }),
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                config: {
                    url: configService.get<string>(
                        "REDIS_URL",
                        "redis://localhost:6379",
                    ),
                    password: configService.get<string>("REDIS_PASSWORD", ""),
                    keyPrefix: "auth:",
                },
            }),
            inject: [ConfigService],
        }),
        GoogleHttpModule,
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        AuthResolver,
        AuthService,
        TokenService,
        UserService,
    ],
    controllers: [AuthController],
    exports: [TokenService, GoogleHttpModule],
})
export class AuthModule {}
