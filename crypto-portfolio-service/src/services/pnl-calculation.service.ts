import { Queue } from "@datastructures-js/queue";
import { Injectable, Logger } from "@nestjs/common";
import {
    AssetPnLData,
    EnhancedTrade,
    PnLCalculationResult,
    SaleResult,
    TaxLot,
} from "../shared/interfaces/portfolio-types.interface";

@Injectable()
export class PnLCalculationService {
    private readonly logger = new Logger(PnLCalculationService.name);

    /**
     * Calculate P&L for a portfolio using FIFO cost basis method
     */
    async calculatePortfolioPnL(
        trades: EnhancedTrade[],
        currentPrices: Map<string, number>,
    ): Promise<PnLCalculationResult> {
        this.logger.log(
            `🧮 Starting P&L calculation for ${trades.length} trades`,
        );

        try {
            // Group trades by asset symbol
            const tradesByAsset = this.groupTradesByAsset(trades);
            const assetPnLData: AssetPnLData[] = [];

            let totalRealizedPnL = 0;
            let totalUnrealizedPnL = 0;

            // Calculate P&L for each asset
            for (const [assetSymbol, assetTrades] of Array.from(tradesByAsset.entries())) {
                const assetPnL = await this.calculateAssetPnL(
                    assetSymbol,
                    assetTrades,
                    currentPrices.get(assetSymbol) || 0,
                );

                assetPnLData.push(assetPnL);
                totalRealizedPnL += assetPnL.realizedPnL;
                totalUnrealizedPnL += assetPnL.unrealizedPnL;
            }

            const result: PnLCalculationResult = {
                assetPnL: assetPnLData,
                portfolioTotalPnL: totalRealizedPnL + totalUnrealizedPnL,
                totalRealizedPnL,
                totalUnrealizedPnL,
            };

            this.logger.log(
                `✅ P&L calculation completed. Total P&L: ${result.portfolioTotalPnL}`,
            );
            return result;
        } catch (error) {
            this.logger.error("❌ Failed to calculate portfolio P&L:", error);
            throw error;
        }
    }

    /**
     * Calculate P&L for a single asset using FIFO method
     */
    private async calculateAssetPnL(
        assetSymbol: string,
        trades: EnhancedTrade[],
        currentPrice: number,
    ): Promise<AssetPnLData> {
        this.logger.debug(
            `📊 Calculating P&L for ${assetSymbol} with ${trades.length} trades`,
        );

        // Sort trades by time (oldest first for FIFO)
        const sortedTrades = trades.sort(
            (a, b) => a.time.getTime() - b.time.getTime(),
        );

        // Initialize FIFO queue for tax lots
        const taxLotQueue = new Queue<TaxLot>();
        let totalRealizedPnL = 0;
        let totalQuantity = 0;
        let totalCostBasis = 0;

        // Process each trade
        for (const trade of sortedTrades) {
            if (trade.isBuyer) {
                // Buy trade - add to tax lot queue
                const taxLot: TaxLot = {
                    quantity: trade.qty,
                    costBasis: trade.price,
                    purchaseDate: trade.time,
                    assetSymbol: assetSymbol,
                };

                taxLotQueue.enqueue(taxLot);
                totalQuantity += trade.qty;
                totalCostBasis += trade.qty * trade.price;

                this.logger.debug(
                    `📈 Buy: ${trade.qty} ${assetSymbol} at ${trade.price}`,
                );
            } else {
                // Sell trade - process using FIFO
                const saleResult = this.processSale(
                    taxLotQueue,
                    trade.qty,
                    trade.price,
                );
                totalRealizedPnL += saleResult.realizedGain;
                totalQuantity -= saleResult.soldQuantity;
                totalCostBasis -= saleResult.totalCostBasis;

                this.logger.debug(
                    `📉 Sell: ${trade.qty} ${assetSymbol} at ${trade.price}, Realized P&L: ${saleResult.realizedGain}`,
                );
            }
        }

        // Calculate remaining position metrics
        const averageCostBasis =
            totalQuantity > 0 ? totalCostBasis / totalQuantity : 0;
        const unrealizedPnL = totalQuantity * (currentPrice - averageCostBasis);
        const totalPnL = totalRealizedPnL + unrealizedPnL;
        const percentageGain =
            averageCostBasis > 0
                ? ((currentPrice - averageCostBasis) / averageCostBasis) * 100
                : 0;

        // Calculate holding period (days since first purchase)
        const firstTrade = sortedTrades.find((t) => t.isBuyer);
        const holdingPeriodDays = firstTrade
            ? Math.floor(
                  (Date.now() - firstTrade.time.getTime()) /
                      (1000 * 60 * 60 * 24),
              )
            : 0;

        return {
            assetSymbol,
            assetInfoId: trades[0]?.assetInfoId || "",
            totalQuantity,
            averageCostBasis,
            currentPrice,
            realizedPnL: totalRealizedPnL,
            unrealizedPnL,
            totalPnL,
            percentageGain,
            holdingPeriodDays,
        };
    }

    /**
     * Process a sale using FIFO method
     */
    private processSale(
        taxLotQueue: Queue<TaxLot>,
        saleQuantity: number,
        salePrice: number,
    ): SaleResult {
        let remainingToSell = saleQuantity;
        let totalCostBasis = 0;
        let realizedGain = 0;
        const soldLots: TaxLot[] = [];

        while (remainingToSell > 0 && !taxLotQueue.isEmpty()) {
            const currentLot = taxLotQueue.front();

            if (currentLot.quantity <= remainingToSell) {
                // Sell entire lot
                const lot = taxLotQueue.dequeue();
                const lotCostBasis = lot.quantity * lot.costBasis;
                const lotSaleValue = lot.quantity * salePrice;

                totalCostBasis += lotCostBasis;
                realizedGain += lotSaleValue - lotCostBasis;
                remainingToSell -= lot.quantity;
                soldLots.push(lot);
            } else {
                // Partial sale of lot
                const partialQuantity = remainingToSell;
                const partialCostBasis = partialQuantity * currentLot.costBasis;
                const partialSaleValue = partialQuantity * salePrice;

                totalCostBasis += partialCostBasis;
                realizedGain += partialSaleValue - partialCostBasis;

                // Update the lot with remaining quantity
                currentLot.quantity -= partialQuantity;
                remainingToSell = 0;

                soldLots.push({
                    quantity: partialQuantity,
                    costBasis: currentLot.costBasis,
                    purchaseDate: currentLot.purchaseDate,
                    assetSymbol: currentLot.assetSymbol,
                });
            }
        }

        return {
            soldQuantity: saleQuantity - remainingToSell,
            totalCostBasis,
            realizedGain,
            soldLots,
            remainingLots: this.queueToArray(taxLotQueue),
        };
    }

    /**
     * Group trades by asset symbol
     */
    private groupTradesByAsset(
        trades: EnhancedTrade[],
    ): Map<string, EnhancedTrade[]> {
        const grouped = new Map<string, EnhancedTrade[]>();

        for (const trade of trades) {
            const symbol = trade.symbol;
            if (!grouped.has(symbol)) {
                grouped.set(symbol, []);
            }
            grouped.get(symbol)!.push(trade);
        }

        return grouped;
    }

    /**
     * Convert queue to array for inspection
     */
    private queueToArray<T>(queue: Queue<T>): T[] {
        const items: T[] = [];
        const tempQueue = new Queue<T>();

        // Dequeue all items to array and re-enqueue
        while (!queue.isEmpty()) {
            const item = queue.dequeue();
            items.push(item);
            tempQueue.enqueue(item);
        }

        // Restore original queue
        while (!tempQueue.isEmpty()) {
            queue.enqueue(tempQueue.dequeue());
        }

        return items;
    }

    /**
     * Calculate tax lots for a specific asset (for reporting purposes)
     */
    async calculateTaxLots(
        assetSymbol: string,
        trades: EnhancedTrade[],
    ): Promise<TaxLot[]> {
        const sortedTrades = trades
            .filter((t) => (t.symbol || "UNKNOWN") === assetSymbol)
            .sort((a, b) => a.time.getTime() - b.time.getTime());

        const taxLotQueue = new Queue<TaxLot>();

        for (const trade of sortedTrades) {
            if (trade.isBuyer) {
                taxLotQueue.enqueue({
                    quantity: trade.qty,
                    costBasis: trade.price,
                    purchaseDate: trade.time,
                    assetSymbol: assetSymbol,
                });
            } else {
                this.processSale(taxLotQueue, trade.qty, trade.price);
            }
        }

        return this.queueToArray(taxLotQueue);
    }
}
