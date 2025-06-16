"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PnLCalculationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnLCalculationService = void 0;
const queue_1 = require("@datastructures-js/queue");
const common_1 = require("@nestjs/common");
let PnLCalculationService = PnLCalculationService_1 = class PnLCalculationService {
    constructor() {
        this.logger = new common_1.Logger(PnLCalculationService_1.name);
    }
    async calculatePortfolioPnL(trades, currentPrices) {
        this.logger.log(`🧮 Starting P&L calculation for ${trades.length} trades`);
        try {
            const tradesByAsset = this.groupTradesByAsset(trades);
            const assetPnLData = [];
            let totalRealizedPnL = 0;
            let totalUnrealizedPnL = 0;
            for (const [assetSymbol, assetTrades] of Array.from(tradesByAsset.entries())) {
                const assetPnL = await this.calculateAssetPnL(assetSymbol, assetTrades, currentPrices.get(assetSymbol) || 0);
                assetPnLData.push(assetPnL);
                totalRealizedPnL += assetPnL.realizedPnL;
                totalUnrealizedPnL += assetPnL.unrealizedPnL;
            }
            const result = {
                assetPnL: assetPnLData,
                portfolioTotalPnL: totalRealizedPnL + totalUnrealizedPnL,
                totalRealizedPnL,
                totalUnrealizedPnL,
            };
            this.logger.log(`✅ P&L calculation completed. Total P&L: ${result.portfolioTotalPnL}`);
            return result;
        }
        catch (error) {
            this.logger.error("❌ Failed to calculate portfolio P&L:", error);
            throw error;
        }
    }
    async calculateAssetPnL(assetSymbol, trades, currentPrice) {
        this.logger.debug(`📊 Calculating P&L for ${assetSymbol} with ${trades.length} trades`);
        const sortedTrades = trades.sort((a, b) => a.time.getTime() - b.time.getTime());
        const taxLotQueue = new queue_1.Queue();
        let totalRealizedPnL = 0;
        let totalQuantity = 0;
        let totalCostBasis = 0;
        for (const trade of sortedTrades) {
            if (trade.isBuyer) {
                const taxLot = {
                    quantity: trade.qty,
                    costBasis: trade.price,
                    purchaseDate: trade.time,
                    assetSymbol: assetSymbol,
                };
                taxLotQueue.enqueue(taxLot);
                totalQuantity += trade.qty;
                totalCostBasis += trade.qty * trade.price;
                this.logger.debug(`📈 Buy: ${trade.qty} ${assetSymbol} at ${trade.price}`);
            }
            else {
                const saleResult = this.processSale(taxLotQueue, trade.qty, trade.price);
                totalRealizedPnL += saleResult.realizedGain;
                totalQuantity -= saleResult.soldQuantity;
                totalCostBasis -= saleResult.totalCostBasis;
                this.logger.debug(`📉 Sell: ${trade.qty} ${assetSymbol} at ${trade.price}, Realized P&L: ${saleResult.realizedGain}`);
            }
        }
        const averageCostBasis = totalQuantity > 0 ? totalCostBasis / totalQuantity : 0;
        const unrealizedPnL = totalQuantity * (currentPrice - averageCostBasis);
        const totalPnL = totalRealizedPnL + unrealizedPnL;
        const percentageGain = averageCostBasis > 0
            ? ((currentPrice - averageCostBasis) / averageCostBasis) * 100
            : 0;
        const firstTrade = sortedTrades.find((t) => t.isBuyer);
        const holdingPeriodDays = firstTrade
            ? Math.floor((Date.now() - firstTrade.time.getTime()) /
                (1000 * 60 * 60 * 24))
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
    processSale(taxLotQueue, saleQuantity, salePrice) {
        let remainingToSell = saleQuantity;
        let totalCostBasis = 0;
        let realizedGain = 0;
        const soldLots = [];
        while (remainingToSell > 0 && !taxLotQueue.isEmpty()) {
            const currentLot = taxLotQueue.front();
            if (currentLot.quantity <= remainingToSell) {
                const lot = taxLotQueue.dequeue();
                const lotCostBasis = lot.quantity * lot.costBasis;
                const lotSaleValue = lot.quantity * salePrice;
                totalCostBasis += lotCostBasis;
                realizedGain += lotSaleValue - lotCostBasis;
                remainingToSell -= lot.quantity;
                soldLots.push(lot);
            }
            else {
                const partialQuantity = remainingToSell;
                const partialCostBasis = partialQuantity * currentLot.costBasis;
                const partialSaleValue = partialQuantity * salePrice;
                totalCostBasis += partialCostBasis;
                realizedGain += partialSaleValue - partialCostBasis;
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
    groupTradesByAsset(trades) {
        const grouped = new Map();
        for (const trade of trades) {
            const symbol = trade.symbol;
            if (!grouped.has(symbol)) {
                grouped.set(symbol, []);
            }
            grouped.get(symbol).push(trade);
        }
        return grouped;
    }
    queueToArray(queue) {
        const items = [];
        const tempQueue = new queue_1.Queue();
        while (!queue.isEmpty()) {
            const item = queue.dequeue();
            items.push(item);
            tempQueue.enqueue(item);
        }
        while (!tempQueue.isEmpty()) {
            queue.enqueue(tempQueue.dequeue());
        }
        return items;
    }
    async calculateTaxLots(assetSymbol, trades) {
        const sortedTrades = trades
            .filter((t) => (t.symbol || "UNKNOWN") === assetSymbol)
            .sort((a, b) => a.time.getTime() - b.time.getTime());
        const taxLotQueue = new queue_1.Queue();
        for (const trade of sortedTrades) {
            if (trade.isBuyer) {
                taxLotQueue.enqueue({
                    quantity: trade.qty,
                    costBasis: trade.price,
                    purchaseDate: trade.time,
                    assetSymbol: assetSymbol,
                });
            }
            else {
                this.processSale(taxLotQueue, trade.qty, trade.price);
            }
        }
        return this.queueToArray(taxLotQueue);
    }
};
exports.PnLCalculationService = PnLCalculationService;
exports.PnLCalculationService = PnLCalculationService = PnLCalculationService_1 = __decorate([
    (0, common_1.Injectable)()
], PnLCalculationService);
//# sourceMappingURL=pnl-calculation.service.js.map