import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user";
import { UserService } from "../user/user.service";
import * as Bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { VerifyDto } from "./dto/verify.dto";
import { OtpPurpose } from "../../entities/prisma";
import { TOTP as otpGenerator } from "totp-generator";
import { CreateUserInput } from "../user/dto/create-user.input";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    async getAccessToken(user: User): Promise<string> {
        return this.jwtService.sign(
            {
                userId: user.id,
            },
            { expiresIn: this.configService.get("JWT_AT_EXP_TIME") },
        );
    }

    async getRefreshToken(user: User): Promise<string> {
        return this.jwtService.sign(
            {
                userId: user.id,
            },
            { expiresIn: this.configService.get("JWT_RT_EXP_TIME") },
        );
    }

    async createAuthUser(signupDto: CreateUserInput) {
        const existingUser = await this.userService.findByAccount(
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

    async verifyRegisterAccount(user: User, verifyDto: VerifyDto) {
        if (!user.otp) throw new ForbiddenException();

        if (verifyDto.otpPurpose !== OtpPurpose.VERIFY_ACCOUNT)
            throw new UnauthorizedException();

        if (verifyDto.otp !== user.otp)
            throw new UnauthorizedException("Your input otp is not correct");

        const accessToken = await this.getAccessToken(user);
        const refreshToken = await this.getRefreshToken(user);

        await this.userService.update(user.id, { otp: null, otpPurpose: null });

        return {
            accessToken,
            refreshToken,
        };
    }
}
