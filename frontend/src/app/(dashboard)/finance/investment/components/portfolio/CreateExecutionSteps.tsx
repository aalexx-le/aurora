import Timeline from "@/components/ui/timeline";
import {GET_CREATE_PORTFOLIO_EXECUTIONS} from "@/api/script/crypto/execution";
import {useQuery} from "@apollo/client";
import {GetCreatePortfolioExecutionsQuery, GetCreatePortfolioExecutionsQueryVariables} from "@/gql/graphql";
import {useAppSelector} from "@/state/hooks";
import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";


export function CreateExecutionSteps() {
    const {user} = useAppSelector((state) => state.auth.state);
    const {
        data
    } = useQuery<GetCreatePortfolioExecutionsQuery, GetCreatePortfolioExecutionsQueryVariables>(GET_CREATE_PORTFOLIO_EXECUTIONS, {
        variables: {userId: Number(user?.id || 0)},
    });
    const executions = data?.getCreatePortfolioExecutions.filter(e => e.status != "SUCCESS") || [];

    const statuses = ['queue', 'processing', 'success'];

    return (
        executions.length > 0 && (
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                        Create Portfolio Requests
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-nowrap gap-2">
                    <div className="flex flex-col gap-10">
                        {executions.map((execution) => (
                            <Timeline
                                key={execution.id}
                                statuses={statuses}
                                currentStatus={execution.status.toLowerCase()}
                                time={execution.time}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    )
}