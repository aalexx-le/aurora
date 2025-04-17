import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "../../user/user.service";
import { TokenPair } from "../token.service";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(
        configService: ConfigService,
        private userService: UserService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
            scope: ["email", "profile"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
    ): Promise<TokenPair> {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new UnauthorizedException("No email provided from Google");
        }

        let user = await this.userService.findByEmail(email);

        if (!user) {
            user = await this.authService.createAuthUser({
                email,
                name: profile.displayName || email.split("@")[0],
                password: Math.random().toString(36).slice(-10),
            });
        }

        return await this.authService.getTokenPair(user);
    }
}
