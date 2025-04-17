import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";
import { TokenPayload } from "../dto/token-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(
        configService: ConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET"),
        });
    }
    async validate(payload: TokenPayload) {
        this.logger.debug(`validate payload: ${JSON.stringify(payload)}`);
        const user = await this.userService.findById(payload.userId);
        if (!user) throw new NotFoundException("User not found");
        return user;
    }
}
