import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/user";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { CreateUserArgs } from "../user/dto/create-user.input";
import { AuthService } from "./auth.service";
import { LoginArgs, LoginResDto } from "./dto/login.dto";
import {
    RefreshTokenArgs,
    RefreshTokenResponseDto,
} from "./dto/refresh-token.dto";
import { SignupResDto } from "./dto/signup.dto";
import { VerifyArgs } from "./dto/verify.dto";
import { JwtGuard } from "./guards/jwt.guard";
import { LocalGuard } from "./guards/local.guard";

@Resolver(() => LoginResDto)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginResDto)
    @UseGuards(LocalGuard)
    async login(
        @Args() args: LoginArgs,
        @AuthUser() user: User,
    ): Promise<LoginResDto> {
        const tokens = await this.authService.getTokenPair(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    @Mutation(() => SignupResDto)
    async signup(@Args() signupArgs: CreateUserArgs) {
        const user = await this.authService.createAuthUser(signupArgs.data);
        const tokens = await this.authService.getTokenPair(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    @Mutation(() => LoginResDto)
    @UseGuards(JwtGuard)
    async verifyAccount(
        @Args() verifyArgs: VerifyArgs,
        @AuthUser() user: User,
    ): Promise<LoginResDto> {
        return this.authService.verifyRegisterAccount(user, verifyArgs.data);
    }

    @Mutation(() => RefreshTokenResponseDto)
    async refreshToken(
        @Args() args: RefreshTokenArgs,
    ): Promise<RefreshTokenResponseDto> {
        return this.authService.refreshTokens(args.data.refreshToken);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async logout(@AuthUser() user: User): Promise<boolean> {
        await this.authService.logout(user.id);
        return true;
    }

    // @Query(() => [Auth], { name: 'auth' })
    // findAll() {
    //   return this.authService.findAll();
    // }

    // @Query(() => Auth, { name: 'auth' })
    // findOne(@Args('id', { type: () => Int }) id: number) {
    //   return this.authService.findOne(id);
    // }

    // @Mutation(() => Auth)
    // removeAuth(@Args('id', { type: () => Int }) id: number) {
    //   return this.authService.remove(id);
    // }
}
