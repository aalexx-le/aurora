import { UseGuards } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CryptoPortfolio } from "../../entities/crypto-portfolio";
import { User } from "../../entities/user";
import { AuthUser } from "../../shared/decorators/auth-user.decorator";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { CryptoPortfolioService } from "../crypto/portfolio/portfolio.service";
import { UserService } from "./user.service";

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
