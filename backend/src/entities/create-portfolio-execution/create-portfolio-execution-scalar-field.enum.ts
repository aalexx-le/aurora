import { registerEnumType } from '@nestjs/graphql';

export enum CreatePortfolioExecutionScalarFieldEnum {
    id = "id",
    time = "time",
    userId = "userId",
    status = "status"
}


registerEnumType(CreatePortfolioExecutionScalarFieldEnum, { name: 'CreatePortfolioExecutionScalarFieldEnum', description: undefined })
