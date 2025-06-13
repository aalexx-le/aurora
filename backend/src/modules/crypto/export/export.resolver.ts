import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../../../entities/user/user.model";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { ExportPortfolioInput, ExportResult } from "./dto/export.dto";
import { ExportService } from "./export.service";

@Resolver()
@UseGuards(JwtGuard)
export class ExportResolver {
    constructor(private readonly exportService: ExportService) {}

    @Mutation(() => ExportResult, { name: "exportPortfolio" })
    async exportPortfolio(
        @Args("input") input: ExportPortfolioInput,
        @AuthUser() user: User,
    ): Promise<ExportResult> {
        return this.exportService.exportPortfolio(input, user.id);
    }
}
