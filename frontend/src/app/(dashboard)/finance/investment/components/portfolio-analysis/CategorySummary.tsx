import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {
    CategorySummaryItem
} from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/CategorySummaryItem";
import {AnalyseData} from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysis";

interface IProps {
    cryptoPortfolioId: string;
    analyseData: AnalyseData[];
}

type GroupByTagValue = {
    invest: number;
    balance: number;
    profit: number;
    profitPercent: number;
}

export function CategorySummary({analyseData, cryptoPortfolioId}: IProps) {
    const [totalInvest, setTotalInvest] = useState(0);
    const [groupByTag, setGroupByTag] = useState<Map<string, GroupByTagValue>>(new Map());

    useEffect(() => {
        setTotalInvest(analyseData.reduce((sum, b) => sum + b.invest, 0));
        const _groupByTagKeys = Object.groupBy<string, AnalyseData>(analyseData, (b) => b.tag);
        const _groupByTag: Map<string, GroupByTagValue> = new Map();
        for (const [tag, balances] of Object.entries(_groupByTagKeys)) {
            const invest = balances?.reduce((sum, b) => sum + b.invest, 0) || 0;
            const balance = balances?.reduce((sum, b) => sum + b.remainingQty * b.price, 0) || 0;
            const profit = balance - invest
            const profitPercent = balances?.reduce((sum, b) => sum + (b.remainingQty * b.price - b.invest) / b.invest * 100, 0) || 0;

            _groupByTag.set(tag, {invest, balance, profit, profitPercent});
        }
        setGroupByTag(_groupByTag);
    }, [analyseData]);

    return (
        <div className="flex flex-col gap-4">
            {Array.from(groupByTag).map(([tag, value], index) => {
                const investPercent = value.invest / totalInvest * 100;
                const profitPercent = value.profit / value.invest * 100;

                return (
                    <Collapsible key={index + tag} className="space-y-2" defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                            <Button className="gap-2" variant="secondary" size="sm">
                                <p className="text-muted-foreground text-sm">{tag}</p>
                                <p
                                    className="text-sm font-bold">{investPercent.toFixed(2)}%
                                </p>
                                {/*<span*/}
                                {/*    className={cn("font-bold text-sm", value.profitPercent > 0 ? "text-chart-2" : "text-chart-5")}>*/}
                                {/*    ({value.profitPercent > 0 ? "+" : ""}*/}
                                {/*    <span>{value.profitPercent.toFixed(2)}%</span>*/}
                                {/*    )*/}
                                {/*</span>*/}
                                <p className="text-muted-foreground text-sm">
                                    <MoneyWithCurrency amount={value.invest}/>
                                </p>
                                {/*<span*/}
                                {/*    className={cn("font-bold text-sm", value.profit > 0 ? "text-chart-2" : "text-chart-5")}>*/}
                                {/*                        ({value.profit > 0 ? "+" : ""}*/}
                                {/*    <MoneyWithCurrency amount={value.profit}/>)*/}
                                {/*</span>*/}
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 px-4">
                            {analyseData.filter(b => b.tag === tag)
                                .map((data, index) =>
                                    <CategorySummaryItem
                                        data={data} key={index + data.tag + data.name}
                                        totalInvest={totalInvest}
                                        cryptoPortfolioId={cryptoPortfolioId}
                                    />
                                )}
                        </CollapsibleContent>
                    </Collapsible>
                )
            })}
        </div>
    )
}