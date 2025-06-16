import { Exchanges } from "../../entities/prisma";

/**
 * List of exchanges that require passphrase authentication
 * Based on CCXT documentation and API requirements
 */
export const PASSPHRASE_REQUIRED_EXCHANGES: Exchanges[] = [
    Exchanges.OKX,
    Exchanges.OKCOIN,
    Exchanges.MYOKX,
    Exchanges.OKXUS,
    Exchanges.COINBASE,
    Exchanges.COINBASEEXCHANGE,
    Exchanges.COINBASEINTERNATIONAL,
    Exchanges.KUCOIN,
    Exchanges.KUCOINFUTURES,
    Exchanges.GATE, // Gate.io requires passphrase for some operations
    Exchanges.ASCENDEX, // AscendEX (formerly BitMax) requires passphrase
    Exchanges.PROBIT, // ProBit requires passphrase for some operations
];

/**
 * Check if an exchange requires passphrase authentication
 * @param exchange - The exchange to check
 * @returns true if the exchange requires passphrase
 */
export function isPassphraseRequired(exchange: string): boolean {
    return PASSPHRASE_REQUIRED_EXCHANGES.includes(exchange as Exchanges);
}

/**
 * Get all exchanges that require passphrase authentication
 * @returns Array of exchanges that require passphrase
 */
export function getPassphraseRequiredExchanges(): Exchanges[] {
    return PASSPHRASE_REQUIRED_EXCHANGES;
}
