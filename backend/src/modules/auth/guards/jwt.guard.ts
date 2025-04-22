import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export class JwtGuard extends AuthGuard("jwt") {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const connectionParams = ctx.getContext().req.connectionParams;
        console.log("connectionParams", connectionParams);
        if (connectionParams?.authorization) {
            ctx.getContext().req.headers = {
                authorization: connectionParams.authorization,
            };
        }
        return ctx.getContext().req;
    }
}
