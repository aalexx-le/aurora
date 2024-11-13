import { Module } from "@nestjs/common";
import { ExpenseCategoryService } from "./expense-category.service";
import { ExpenseCategoryResolver } from "./expense-category.resolver";

@Module({
    providers: [ExpenseCategoryResolver, ExpenseCategoryService],
})
export class ExpenseCategoryModule {}
