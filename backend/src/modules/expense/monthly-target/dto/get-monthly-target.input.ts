import { ArgsType, PartialType, PickType } from "@nestjs/graphql";
import { MonthlyTarget } from "src/entities/monthly-target";

@ArgsType()
export class GetMonthlyTargetArgs extends PickType(
    PartialType(MonthlyTarget),
    ["month", "year"],
    ArgsType,
) {}
