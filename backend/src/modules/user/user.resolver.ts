import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "../../entities/user";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { AuthUser } from "../../shared/decorators/auth-user.decorator";
import { CryptoPortfolioService } from "../crypto/profile/portfolio.service";
import { CryptoPortfolio } from "../../entities/crypto-portfolio";

@UseGuards(JwtGuard)
@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly cryptoProfileService: CryptoPortfolioService,
    ) {}
    @Query(() => User, { nullable: false })
    getMe(@AuthUser() user: User) {
        return user;
    }

    @ResolveField("cryptoProfiles", () => CryptoPortfolio)
    async getCryptoProfile(@Parent() user: User) {
        const { id } = user;
        return this.cryptoProfileService.findPortfolios(id);
    }
}
