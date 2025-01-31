import { useMemo } from "react";
import { GetAssetQuery } from "@/gql/graphql";
import { ChartConfig } from "@/components/ui/chart";
import { Trade } from "@/app/(dashboard)/finance/investment/types";
import moment from "moment";
import { ApexOptions } from "apexcharts";
import { useChartFormatter } from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartFormatter";

export const useChartConfig = (
    historicalPrice: GetAssetQuery["getAssetPrices"],
    trades: Trade[],
) => {
    const { balanceFormatter, timeFormatterForTooltip, timeFormatter } =
        useChartFormatter();

    const upColor = "#2eb88a";
    const downColor = "#e23670";
    // return useMemo(
    //     (): ChartConfig => ({
    //         trend:
    //             historicalPrice[historicalPrice.length - 1]?.openPrice >=
    //             historicalPrice[0]?.openPrice
    //                 ? {
    //                       label: "Up",
    //                       color: "hsl(var(--chart-2))",
    //                   }
    //                 : {
    //                       label: "Down",
    //                       color: "hsl(var(--chart-5))",
    //                   },
    //         buy: {
    //             label: "Buy",
    //             color: "hsl(var(--chart-2))",
    //         },
    //         sell: {
    //             label: "Sell",
    //             color: "hsl(var(--chart-5))",
    //         },
    //     }),
    //     [historicalPrice],
    // );

    const buyAvgPrice = useMemo<number>(() => {
        const totalBuyQty = trades.reduce((acc, trade) => {
            if (trade.isBuyer) {
                return acc + trade.qty;
            }
            return acc;
        }, 0);

        return (
            trades.reduce((acc, trade) => {
                if (trade.isBuyer) {
                    return acc + trade.price * trade.qty;
                }
                return acc;
            }, 0) / totalBuyQty
        );
    }, [trades]);

    const sellAvgPrice = useMemo<number>(() => {
        const totalSellQty = trades.reduce((acc, trade) => {
            if (!trade.isBuyer) {
                return acc + trade.qty;
            }
            return acc;
        }, 0);

        return (
            trades.reduce((acc, trade) => {
                if (!trade.isBuyer) {
                    return acc + trade.price * trade.qty;
                }
                return acc;
            }, 0) / totalSellQty
        );
    }, [trades]);

    const tradePoints = useMemo<PointAnnotations[]>(() => {
        return trades.map((trade) => {
            return {
                x: moment(trade.time).format("DD MMM"),
                y: trade.price,
                marker: {
                    size: 2,
                    fillColor: "transparent",
                    strokeColor: "transparent",
                },
                label: {
                    borderColor: trade.isBuyer ? upColor : downColor,
                    style: {
                        color: "#fff",
                        background: trade.isBuyer ? upColor : downColor,
                    },
                    text: trade.isBuyer ? "B" : "S",
                },
            };
        });
    }, [trades]);

    const config = useMemo<ApexOptions>(
        () => ({
            chart: {
                height: "100%",
                type: "line",
                toolbar: {
                    show: false,
                },
                zoom: {},
            },
            stroke: {
                width: 2,
                curve: "monotoneCubic",
            },
            markers: {
                size: 0,
                hover: {
                    size: 0,
                },
            },
            plotOptions: {
                line: {
                    colors: {
                        threshold: 0,
                        colorAboveThreshold: upColor,
                        colorBelowThreshold: downColor,
                    },
                },
                area: {
                    fillTo: "origin",
                    // colors: {
                    //     threshold: currentPrice,
                    //     colorAboveThreshold: upColor,
                    //     colorBelowThreshold: downColor,
                    // }
                },
                candlestick: {
                    colors: {
                        upward: upColor,
                        downward: downColor,
                    },
                },
            },
            annotations: {
                points: tradePoints,
                yaxis: [
                    {
                        y: buyAvgPrice,
                        borderColor: upColor,
                        label: {
                            borderColor: upColor,
                            style: {
                                color: "#fff",
                                background: upColor,
                            },
                            text: "Buy Avg. Price @ " + buyAvgPrice.toFixed(2),
                        },
                    },
                    {
                        y: sellAvgPrice,
                        borderColor: downColor,
                        label: {
                            borderColor: downColor,
                            style: {
                                color: "#fff",
                                background: downColor,
                            },
                            text:
                                "Sell Avg. Price @ " + sellAvgPrice.toFixed(2),
                        },
                    },
                ],
            },
            tooltip: {
                enabled: true,
                followCursor: false,
                marker: {
                    show: false,
                    fillColors: [upColor, downColor],
                },
                y: {
                    formatter: function (val) {
                        return balanceFormatter(val);
                    },
                },
                custom: function (opts) {
                    const open =
                        opts.series[opts.seriesIndex][opts.dataPointIndex];

                    let text =
                        "<div class='font-mono p-2 bg-background text-foreground border-foreground'>";
                    text += "Price : " + open + "<br>";
                    // text += "High : " + high + "<br>";
                    // text += "Low : " + low + "<br>";
                    // text += "Close : " + close;

                    const time = moment(
                        opts.ctx.w.config.series[opts.seriesIndex].data[
                            opts.dataPointIndex
                        ].x,
                    ).format("DD MMM");

                    for (const trade of trades) {
                        if (moment(trade.time).format("DD MMM") !== time) {
                            continue;
                        }

                        text += "<br>";
                        text += trade.isBuyer
                            ? "<span class='text-chart-2'>"
                            : "<span class='text-chart-5'>";
                        text += trade.isBuyer ? "Buy" : "Sell";
                        text += "<span class='text-muted-foreground'>";
                        text +=
                            " at " +
                            moment(trade.time).format("DD MMM YYYY HH:mm");
                        text += "</span>";
                        text += " : " + trade.qty;
                        text += " @ " + trade.price;
                        text += "</span>";
                    }
                    text += "</div>";

                    return text;
                },
            },
            xaxis: {
                type: "category",
                labels: {
                    rotate: 0,
                    formatter: function (val) {
                        return moment(val).format("DD MMM");
                    },
                },
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                tooltip: {
                    enabled: true,
                },
                tickAmount: 6,
            },
            yaxis: {
                tooltip: {
                    enabled: true,
                },
                labels: {
                    formatter(val: number, opts?: object): string | string[] {
                        return balanceFormatter(val);
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "var(--color-border)",
            },
        }),
        [tradePoints, buyAvgPrice, sellAvgPrice, trades, balanceFormatter],
    );

    return config;
};
