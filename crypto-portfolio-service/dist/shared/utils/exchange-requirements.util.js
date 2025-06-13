"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSPHRASE_REQUIRED_EXCHANGES = void 0;
exports.isPassphraseRequired = isPassphraseRequired;
exports.getPassphraseRequiredExchanges = getPassphraseRequiredExchanges;
const prisma_1 = require("../../entities/prisma");
exports.PASSPHRASE_REQUIRED_EXCHANGES = [
    prisma_1.Exchanges.OKX,
    prisma_1.Exchanges.OKCOIN,
    prisma_1.Exchanges.MYOKX,
    prisma_1.Exchanges.OKXUS,
    prisma_1.Exchanges.COINBASE,
    prisma_1.Exchanges.COINBASEEXCHANGE,
    prisma_1.Exchanges.COINBASEINTERNATIONAL,
    prisma_1.Exchanges.KUCOIN,
    prisma_1.Exchanges.KUCOINFUTURES,
    prisma_1.Exchanges.GATE,
    prisma_1.Exchanges.ASCENDEX,
    prisma_1.Exchanges.PROBIT,
];
function isPassphraseRequired(exchange) {
    return exports.PASSPHRASE_REQUIRED_EXCHANGES.includes(exchange);
}
function getPassphraseRequiredExchanges() {
    return exports.PASSPHRASE_REQUIRED_EXCHANGES;
}
//# sourceMappingURL=exchange-requirements.util.js.map