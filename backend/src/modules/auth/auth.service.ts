import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Bcrypt from "bcrypt";
import { User } from "src/entities/user";
import { TOTP as otpGenerator } from "totp-generator";
import { OtpPurpose } from "../../entities/prisma";
import {
    CreateUserInput,
    CreateUserInputWithoutOTP,
} from "../user/dto/create-user.input";
import { UserService } from "../user/user.service";
import { VerifyDto } from "./dto/verify.dto";
import { TokenPair, TokenService } from "./token.service";
import { LoginReqDto } from "./dto/login.dto";
import { UserWithoutSensitiveFields } from "../../entities/user/user-without-sensitive-fields";

@Injectable()
export class AuthService {
    constructor(
        private tokenService: TokenService,
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    async getTokenPair(user: UserWithoutSensitiveFields): Promise<TokenPair> {
        return this.tokenService.generateTokenPair(user);
    }

    /**
     * Generate a new token pair using a refresh token
     *
     * @param refreshToken - The refresh token to use
     * @returns A new token pair
     */
    async refreshTokens(refreshToken: string): Promise<TokenPair> {
        const userId =
            await this.tokenService.validateRefreshToken(refreshToken);
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        // Revoke the old refresh token
        await this.tokenService.revokeRefreshToken(userId, refreshToken);

        // Generate a new token pair
        return this.tokenService.generateTokenPair(user);
    }

    /**
     * Create a new user account
     *
     * @param signupDto - The data for the new user
     * @returns The created user
     */
    async createAuthUser(signupDto: CreateUserInputWithoutOTP): Promise<User> {
        const existingUser = await this.userService.findByEmailWithPassword(
            signupDto.email,
        );
        if (existingUser)
            throw new ForbiddenException("Account already exists");
        const salt = await Bcrypt.genSalt();
        signupDto.password = await Bcrypt.hash(signupDto.password, salt);
        const { otp, expires } = otpGenerator.generate(
            this.configService.get("OTP_KEY"),
        );

        const newUser = await this.userService.create({
            ...signupDto,
            otp,
            otpPurpose: OtpPurpose.VERIFY_ACCOUNT,
        });
        return newUser;
    }

    /**
     * Verify a user account using an OTP
     *
     * @param user - The user to verify
     * @param verifyDto - The verification data
     * @returns A token pair
     */
    async verifyRegisterAccount(user: User, verifyDto: VerifyDto) {
        if (!user.otp) throw new ForbiddenException();

        if (verifyDto.otpPurpose !== OtpPurpose.VERIFY_ACCOUNT)
            throw new UnauthorizedException();

        if (verifyDto.otp !== user.otp)
            throw new UnauthorizedException("Your input otp is not correct");

        const tokens = await this.tokenService.generateTokenPair(user);

        await this.userService.update(user.id, { otp: null, otpPurpose: null });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    /**
     * Logout a user by revoking all their tokens
     *
     * @param userId - The ID of the user to logout
     */
    async logout(userId: number): Promise<void> {
        await this.tokenService.revokeAllUserTokens(userId);
    }
}
