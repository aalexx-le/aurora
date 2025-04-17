import {
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "src/modules/user/user.service";
import * as Bcrypt from "bcrypt";
import { LoginReqDto } from "../dto/login.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(private useService: UserService) {
        super({
            usernameField: "email",
            passwordField: "password",
        });
    }

    async validate(email: string, password: string): Promise<LoginReqDto> {
        const user = await this.useService.findByEmailWithPassword(email);

        console.log("user", user);
        this.logger.debug(`validate() email: ${email}, password: ${password}`);
        if (!user) throw new NotFoundException("Account not found");

        const isMatch = await Bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException("Password is incorrect");

        // if (user.registerVerifyCode) throw new UnauthorizedException();

        return user;
    }
}
