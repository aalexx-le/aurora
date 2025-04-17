import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { GoogleGuard } from "./guards/google.guard";
import { TokenPair } from "./token.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly configService: ConfigService) {}

    @Get("google")
    @UseGuards(GoogleGuard)
    async googleAuth() {
        // Guard will redirect to Google
    }

    @Get("google/callback")
    @UseGuards(GoogleGuard)
    async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
        const { accessToken, refreshToken } = req.user as TokenPair;
        const clientUrl = this.configService.get<string>("CLIENT_URL");

        // Redirect to frontend with tokens
        res.redirect(
            `${clientUrl}/auth/callback/google?access_token=${accessToken}&refresh_token=${refreshToken}`,
        );
    }
}
