import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginArgs, LoginResDto } from "./dto/login.dto";
import { UseGuards } from "@nestjs/common";
import { LocalGuard } from "./guards/local.guard";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { User } from "src/entities/user";
import { SignupResDto } from "./dto/signup.dto";
import { VerifyArgs } from "./dto/verify.dto";
import { JwtGuard } from "./guards/jwt.guard";
import { CreateUserArgs } from "../user/dto/create-user.input";

@Resolver(() => LoginResDto)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginResDto)
    @UseGuards(LocalGuard)
    async login(
        @Args() args: LoginArgs,
        @AuthUser() user: User,
    ): Promise<LoginResDto> {
        const accessToken = await this.authService.getAccessToken(user);
        const refreshToken = await this.authService.getRefreshToken(user);
        return {
            accessToken,
            refreshToken,
        };
    }

    @Mutation(() => SignupResDto)
    async signup(@Args() signupArgs: CreateUserArgs) {
        const user = await this.authService.createAuthUser(signupArgs.data);
        return this.login(signupArgs, user);
    }

    @Mutation(() => LoginResDto)
    @UseGuards(JwtGuard)
    async verifyAccount(
        @Args() verifyArgs: VerifyArgs,
        @AuthUser() user: User,
    ): Promise<LoginResDto> {
        return this.authService.verifyRegisterAccount(user, verifyArgs.data);
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
