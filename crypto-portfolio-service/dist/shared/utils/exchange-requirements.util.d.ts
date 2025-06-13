import { Exchanges } from '../../entities/prisma';
export declare const PASSPHRASE_REQUIRED_EXCHANGES: Exchanges[];
export declare function isPassphraseRequired(exchange: string): boolean;
export declare function getPassphraseRequiredExchanges(): Exchanges[];
