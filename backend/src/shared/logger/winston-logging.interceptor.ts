import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    LoggerService,
    NestInterceptor,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER)
        private readonly logger: LoggerService,
    ) {
        // Set context for all logs from this interceptor
        (this.logger as any).setContext("HTTP");
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const contextType = context.getType<GqlContextType>();

        console.log(contextType);

        if (contextType === "graphql") {
            // Set context to GraphQL for GraphQL requests
            (this.logger as any).setContext("GraphQL");
            return this.handleGraphQLRequest(context, next, now);
        } else {
            // Set context to HTTP for REST requests
            (this.logger as any).setContext("HTTP");
            return this.handleRESTRequest(context, next, now);
        }
    }

    private handleGraphQLRequest(
        context: ExecutionContext,
        next: CallHandler,
        startTime: number,
    ): Observable<any> {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        const ctx = gqlContext.getContext();
        const args = gqlContext.getArgs();
        const operation = info.operation;
        const operationType = operation.operation; // 'query', 'mutation', or 'subscription'
        const operationName = info.fieldName;
        const parentType = info.parentType.name;

        // Generate a request ID - safely check for headers
        const requestId =
            (ctx.req && ctx.req.headers && ctx.req.headers["x-request-id"]) ||
            `gql-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

        // Safe access to headers and IP
        const headers = ctx.req && ctx.req.headers ? ctx.req.headers : {};
        const ip = ctx.req && ctx.req.ip ? ctx.req.ip : "unknown";

        // Log more details at debug level
        this.logger.debug(
            JSON.stringify({
                type: "graphql-request",
                args: this.sanitizeBody(args),
                ip,
                userAgent: headers["user-agent"] || "",
                requestId,
            }),
        );

        return next.handle().pipe(
            tap({
                next: (data: any) => {
                    const responseTime = Date.now() - startTime;

                    // Log the GraphQL response
                    this.logger.log(
                        `${operationType} '${operationName}' - ${responseTime}ms`,
                    );

                    // Log more details at debug level
                    this.logger.debug(
                        JSON.stringify({
                            type: "graphql-response",
                            responseTime,
                            data: this.sanitizeResponse(data),
                            requestId,
                        }),
                    );
                },
                error: (error: Error) => {
                    const responseTime = Date.now() - startTime;

                    // Log the error
                    this.logger.error(
                        `${operationType} '${operationName}' on '${parentType}' - ${responseTime}ms - ${error.message} - Request ID: ${requestId}`,
                        error.stack,
                    );
                },
            }),
        );
    }

    private handleRESTRequest(
        context: ExecutionContext,
        next: CallHandler,
        startTime: number,
    ): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, headers, ip } = request;
        const userAgent = headers["user-agent"] || "";
        const requestId =
            headers["x-request-id"] ||
            `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

        // Log the request
        this.logger.log(`${method} ${url} - Request ID: ${requestId}`);

        // Add more detailed info at debug level
        this.logger.debug(
            JSON.stringify({
                type: "request",
                method,
                url,
                body: this.sanitizeBody(body),
                ip,
                userAgent,
                requestId,
            }),
        );

        return next.handle().pipe(
            tap({
                next: (data: any) => {
                    const responseTime = Date.now() - startTime;

                    // Log the response
                    this.logger.log(
                        `${method} ${url} - ${responseTime}ms - Request ID: ${requestId}`,
                    );

                    // Add more detailed info at debug level
                    this.logger.debug(
                        JSON.stringify({
                            type: "response",
                            method,
                            url,
                            responseTime,
                            data: this.sanitizeResponse(data),
                            requestId,
                        }),
                    );
                },
                error: (error: Error) => {
                    const responseTime = Date.now() - startTime;

                    // Log the error
                    this.logger.error(
                        `${method} ${url} - ${responseTime}ms - ${error.message} - Request ID: ${requestId}`,
                        error.stack,
                    );
                },
            }),
        );
    }

    /**
     * Sanitize the request body to remove sensitive information
     */
    private sanitizeBody(body: any): any {
        if (!body) return body;

        const sanitized = { ...body };

        // Remove sensitive fields
        const sensitiveFields = [
            "password",
            "token",
            "authorization",
            "secret",
            "key",
        ];
        sensitiveFields.forEach((field) => {
            if (sanitized[field]) {
                sanitized[field] = "***REDACTED***";
            }
        });

        return sanitized;
    }

    /**
     * Sanitize the response data to prevent logging excessive data
     */
    private sanitizeResponse(data: any): any {
        if (!data) return data;

        // For large objects or arrays, just log the structure
        if (typeof data === "object") {
            if (Array.isArray(data)) {
                return `Array with ${data.length} items`;
            }

            return Object.keys(data).reduce((acc, key) => {
                // Include small data, but summarize large nested objects
                if (typeof data[key] === "object" && data[key] !== null) {
                    acc[key] = Array.isArray(data[key])
                        ? `Array with ${data[key].length} items`
                        : `Object with keys: ${Object.keys(data[key]).join(", ")}`;
                } else {
                    acc[key] = data[key];
                }
                return acc;
            }, {});
        }

        return data;
    }
}
