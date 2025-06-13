import LogoSvg from "@/components/logo/logo-svg";
import { Exchanges } from "@/gql/graphql";

// Exchange guide interface for comprehensive user guidance
export interface ExchangeGuide {
    id: Exchanges;
    name: string;
    logo: string;
    requiresPassphrase: boolean;
    apiDocumentationUrl: string;
    apiCreateUrl: string;
    stepByStepGuide: {
        step: number;
        instruction: string;
        highlight?: boolean;
    }[];
    requirements: {
        permissions: string[];
        restrictions: string[];
    };
    securityNotes: string[];
}

// Comprehensive exchange guides with detailed instructions
export const EXCHANGE_GUIDES: Record<Exchanges, ExchangeGuide | null> = {
    [Exchanges.Binance]: {
        id: Exchanges.Binance,
        name: "Binance",
        logo: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png",
        requiresPassphrase: false,
        apiDocumentationUrl:
            "https://binance-docs.github.io/apidocs/spot/en/#general-info",
        apiCreateUrl:
            "https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to your Binance account and navigate to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API' and choose 'System Generated'",
            },
            {
                step: 3,
                instruction:
                    "Enter a label for your API key (e.g., 'Portfolio Tracker')",
            },
            {
                step: 4,
                instruction: "Enable 'Enable Reading' permission ONLY",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification and create the API key",
            },
            {
                step: 6,
                instruction:
                    "Copy both API Key and Secret Key for use in the portfolio",
            },
        ],
        requirements: {
            permissions: ["Enable Reading"],
            restrictions: [
                "Disable trading permissions",
                "Disable withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable 'Read' permissions for portfolio tracking",
            "Never enable trading or withdrawal permissions",
            "Keep your API credentials secure and never share them",
        ],
    },

    [Exchanges.Okx]: {
        id: Exchanges.Okx,
        name: "OKX",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo.jpg",
        requiresPassphrase: true,
        apiDocumentationUrl: "https://www.okx.com/docs-v5/en/#overview",
        apiCreateUrl: "https://www.okx.com/account/my-api",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to your OKX account and go to API Settings",
            },
            {
                step: 2,
                instruction: "Click 'Create V5 API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Name (e.g., 'Portfolio Tracker')",
            },
            {
                step: 4,
                instruction: "Set permissions to 'Read Only'",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Create a strong passphrase (required for OKX)",
                highlight: true,
            },
            {
                step: 6,
                instruction:
                    "Complete verification (email, SMS, Google Authenticator)",
            },
            {
                step: 7,
                instruction:
                    "Copy API Key, Secret Key, and Passphrase for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "OKX requires a passphrase in addition to API Key and Secret",
            "Use a strong, unique passphrase for your API",
            "Only grant 'Read Only' permissions for security",
        ],
    },

    [Exchanges.Mexc]: {
        id: Exchanges.Mexc,
        name: "MEXC",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/mexc-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl:
            "https://mexcdocs.github.io/apidocs/spot_v3_en/#introduction",
        apiCreateUrl: "https://www.mexc.com/user/api",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to MEXC and navigate to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Note (e.g., 'Portfolio Tracker')",
            },
            {
                step: 4,
                instruction:
                    "Select 'Spot Trading' permissions and enable 'Read' only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Spot Trading - Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable 'Read' permissions under Spot Trading",
            "Do not enable futures or withdrawal permissions",
            "Regularly monitor API usage in MEXC dashboard",
        ],
    },

    [Exchanges.Coinbase]: {
        id: Exchanges.Coinbase,
        name: "Coinbase",
        logo: "https://cryptologos.cc/logos/coinbase-coin-logo.png",
        requiresPassphrase: true,
        apiDocumentationUrl: "https://docs.cloud.coinbase.com/exchange/docs",
        apiCreateUrl:
            "https://help.coinbase.com/en/exchange/managing-my-account/how-to-create-an-api-key",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Coinbase Pro/Advanced Trade",
            },
            {
                step: 2,
                instruction: "Go to Portfolio → API Settings",
            },
            {
                step: 3,
                instruction: "Click 'New API Key'",
            },
            {
                step: 4,
                instruction:
                    "Enter nickname and select 'View' permissions only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Set a strong passphrase when prompted",
                highlight: true,
            },
            {
                step: 6,
                instruction: "Complete 2FA verification",
            },
            {
                step: 7,
                instruction:
                    "Copy API Key, Secret, and Passphrase for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["View"],
            restrictions: ["No trade permissions", "No transfer permissions"],
        },
        securityNotes: [
            "Coinbase requires a passphrase for API access",
            "Only grant 'View' permissions for portfolio tracking",
            "Store your passphrase securely alongside API credentials",
        ],
    },

    [Exchanges.Kucoin]: {
        id: Exchanges.Kucoin,
        name: "KuCoin",
        logo: "https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png",
        requiresPassphrase: true,
        apiDocumentationUrl: "https://docs.kucoin.com/#general",
        apiCreateUrl:
            "https://www.kucoin.com/support/360015102174-How-to-Create-an-API",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to KuCoin and go to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API'",
            },
            {
                step: 3,
                instruction: "Enter API Name and Description",
            },
            {
                step: 4,
                instruction: "Set API Passphrase (remember this for later)",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Select 'General' permissions only",
                highlight: true,
            },
            {
                step: 6,
                instruction: "Complete email and phone verification",
            },
            {
                step: 7,
                instruction:
                    "Copy API Key, Secret Key, and remember your Passphrase",
            },
        ],
        requirements: {
            permissions: ["General (Read-only)"],
            restrictions: ["No trade permissions", "No transfer permissions"],
        },
        securityNotes: [
            "KuCoin requires a custom passphrase you set during API creation",
            "Only enable 'General' permissions for portfolio tracking",
            "Remember the passphrase you create - it cannot be recovered",
        ],
    },

    [Exchanges.Gate]: {
        id: Exchanges.Gate,
        name: "Gate.io",
        logo: "https://cryptologos.cc/logos/gate-token-gt-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://www.gate.io/docs/developers/apiv4/en/",
        apiCreateUrl: "https://www.gate.io/myaccount/apiv4keys",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Gate.io and navigate to API v4 Keys",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Name and description",
            },
            {
                step: 4,
                instruction: "Select 'Spot Trading' and enable 'Read Only'",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Spot Trading - Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable read-only permissions for security",
            "Monitor API usage regularly in Gate.io dashboard",
            "Set IP restrictions if accessing from fixed locations",
        ],
    },

    [Exchanges.Kraken]: {
        id: Exchanges.Kraken,
        name: "Kraken",
        logo: "https://cryptologos.cc/logos/kraken-kraken-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://docs.kraken.com/rest/",
        apiCreateUrl:
            "https://support.kraken.com/hc/en-us/articles/360000919966-How-to-generate-an-API-key-pair",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Kraken and go to Settings → API",
            },
            {
                step: 2,
                instruction: "Click 'Generate New Key'",
            },
            {
                step: 3,
                instruction:
                    "Enter a Key Description (e.g., 'Portfolio Tracker')",
            },
            {
                step: 4,
                instruction:
                    "Select 'Query Funds' and 'Query Open Orders & Trades' permissions only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Private Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Query Funds", "Query Open Orders & Trades"],
            restrictions: ["No trade permissions", "No withdrawal permissions"],
        },
        securityNotes: [
            "Only grant query permissions for portfolio tracking",
            "Kraken uses strong security measures for API access",
            "Consider setting up API key with IP restrictions",
        ],
    },

    [Exchanges.Bitfinex]: {
        id: Exchanges.Bitfinex,
        name: "Bitfinex",
        logo: "https://cryptologos.cc/logos/bitfinex-leo-leo-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://docs.bitfinex.com/docs/introduction",
        apiCreateUrl:
            "https://support.bitfinex.com/hc/en-us/articles/115002349625-API-Key-Setup-Login",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Bitfinex and navigate to API section",
            },
            {
                step: 2,
                instruction: "Click 'Create New Key'",
            },
            {
                step: 3,
                instruction: "Enter a label for your API key",
            },
            {
                step: 4,
                instruction:
                    "Enable 'Account Info' and 'Orders' read permissions only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete email verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Account Info", "Orders (Read Only)"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable read permissions for portfolio tracking",
            "Bitfinex requires email verification for API creation",
            "Monitor API usage in your account dashboard",
        ],
    },

    [Exchanges.Bybit]: {
        id: Exchanges.Bybit,
        name: "Bybit",
        logo: "https://cryptologos.cc/logos/bybit-bit-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://bybit-exchange.github.io/docs/v5/intro",
        apiCreateUrl: "https://www.bybit.com/app/user/api-management",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Bybit and go to API Management",
            },
            {
                step: 2,
                instruction:
                    "Click 'Create New Key' and select 'System-generated API Keys'",
            },
            {
                step: 3,
                instruction: "Enter API name and select key type",
            },
            {
                step: 4,
                instruction:
                    "Enable 'Read Only' permissions for all account types",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete Google Authenticator verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable read-only permissions for all account types",
            "Bybit supports both spot and derivatives tracking",
            "Consider setting IP restrictions for enhanced security",
        ],
    },

    [Exchanges.Htx]: {
        id: Exchanges.Htx,
        name: "HTX (Huobi)",
        logo: "https://cryptologos.cc/logos/huobi-token-ht-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://www.htx.com/en-us/opend/newApiPages/",
        apiCreateUrl: "https://www.htx.com/en-us/apikey/",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to HTX and navigate to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Note and select permissions",
            },
            {
                step: 4,
                instruction: "Enable 'Read' permission only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification (SMS + Email)",
            },
            {
                step: 6,
                instruction:
                    "Copy Access Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Read"],
            restrictions: ["No trade permissions", "No withdrawal permissions"],
        },
        securityNotes: [
            "Only enable read permissions for portfolio tracking",
            "HTX requires both SMS and email verification",
            "API keys can be restricted by IP address",
        ],
    },

    [Exchanges.Gemini]: {
        id: Exchanges.Gemini,
        name: "Gemini",
        logo: "https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://docs.gemini.com/rest-api/",
        apiCreateUrl: "https://exchange.gemini.com/settings/api",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to Gemini Exchange and go to Settings → API",
            },
            {
                step: 2,
                instruction: "Click 'Create a New API Key'",
            },
            {
                step: 3,
                instruction: "Choose 'Primary' scope and enter a name",
            },
            {
                step: 4,
                instruction: "Select 'Fund Management' permissions only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and API Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Fund Management (Read Only)"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Gemini has strict security requirements for API access",
            "Only enable fund management permissions for balance tracking",
            "API keys are automatically restricted to read-only for fund management",
        ],
    },

    [Exchanges.Cryptocom]: {
        id: Exchanges.Cryptocom,
        name: "Crypto.com",
        logo: "https://cryptologos.cc/logos/cronos-cro-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://exchange-docs.crypto.com/",
        apiCreateUrl:
            "https://crypto.com/exchange/document/description?tab=api",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to Crypto.com Exchange and navigate to API section",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Label and description",
            },
            {
                step: 4,
                instruction: "Select 'Read Only' scope for all permissions",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable read-only permissions for portfolio tracking",
            "Crypto.com Exchange is separate from the main Crypto.com app",
            "Ensure you're using the Exchange API, not the App API",
        ],
    },

    [Exchanges.Poloniex]: {
        id: Exchanges.Poloniex,
        name: "Poloniex",
        logo: "https://cryptologos.cc/logos/poloniex-exchange-token-polo-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://docs.poloniex.com/",
        apiCreateUrl: "https://poloniex.com/apiKeys",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Poloniex and go to API Keys section",
            },
            {
                step: 2,
                instruction: "Click 'Create New Key'",
            },
            {
                step: 3,
                instruction: "Enter a name for your API key",
            },
            {
                step: 4,
                instruction: "Enable 'View balances and margin summary' only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["View balances and margin summary"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable balance viewing permissions",
            "Poloniex allows granular permission control",
            "Consider enabling IP restrictions for additional security",
        ],
    },

    [Exchanges.Bitget]: {
        id: Exchanges.Bitget,
        name: "Bitget",
        logo: "https://cryptologos.cc/logos/bitget-token-bgb-logo.png",
        requiresPassphrase: true,
        apiDocumentationUrl: "https://www.bitget.com/api-doc/common/intro",
        apiCreateUrl: "https://www.bitget.com/api-doc/common/intro",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Bitget and navigate to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API'",
            },
            {
                step: 3,
                instruction: "Enter API name and set a passphrase",
                highlight: true,
            },
            {
                step: 4,
                instruction: "Select 'Read Only' permissions",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction:
                    "Copy API Key, Secret Key, and remember your Passphrase",
            },
        ],
        requirements: {
            permissions: ["Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Bitget requires a passphrase for API access",
            "Only enable read-only permissions for portfolio tracking",
            "Store your passphrase securely - it cannot be recovered",
        ],
    },

    [Exchanges.Bitmart]: {
        id: Exchanges.Bitmart,
        name: "BitMart",
        logo: "https://cryptologos.cc/logos/bitmart-token-bmx-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://developer-pro.bitmart.com/en/",
        apiCreateUrl: "https://www.bitmart.com/api-doc/en/",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to BitMart and navigate to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Name and description",
            },
            {
                step: 4,
                instruction: "Select 'Read Only' permissions for Spot Trading",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Spot Trading - Read Only"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable read-only permissions for portfolio tracking",
            "BitMart allows granular permission settings",
            "Monitor API usage regularly in your account dashboard",
        ],
    },

    [Exchanges.Huobi]: {
        id: Exchanges.Huobi,
        name: "Huobi",
        logo: "https://cryptologos.cc/logos/huobi-token-ht-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://huobiapi.github.io/docs/spot/v1/en/",
        apiCreateUrl: "https://www.huobi.com/en-us/apikey/",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Huobi and navigate to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Note and description",
            },
            {
                step: 4,
                instruction: "Enable 'Read' permission only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification (SMS + Email)",
            },
            {
                step: 6,
                instruction:
                    "Copy Access Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Read"],
            restrictions: ["No trade permissions", "No withdrawal permissions"],
        },
        securityNotes: [
            "Only enable read permissions for portfolio tracking",
            "Huobi requires both SMS and email verification",
            "API keys can be restricted by IP address for security",
        ],
    },

    [Exchanges.Coincheck]: {
        id: Exchanges.Coincheck,
        name: "Coincheck",
        logo: "https://cryptologos.cc/logos/coincheck-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://coincheck.com/documents/exchange/api",
        apiCreateUrl: "https://coincheck.com/ja/exchange/api_settings",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to Coincheck and go to API Settings",
            },
            {
                step: 2,
                instruction: "Click 'Create New API Key'",
            },
            {
                step: 3,
                instruction: "Enter a name for your API key",
            },
            {
                step: 4,
                instruction: "Enable 'View' permissions only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["View"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable view permissions for portfolio tracking",
            "Coincheck is primarily focused on the Japanese market",
            "Ensure compliance with local regulations",
        ],
    },

    [Exchanges.Bitflyer]: {
        id: Exchanges.Bitflyer,
        name: "bitFlyer",
        logo: "https://cryptologos.cc/logos/bitflyer-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://lightning.bitflyer.com/docs",
        apiCreateUrl: "https://lightning.bitflyer.com/developer",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to bitFlyer Lightning and go to Developer section",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Label",
            },
            {
                step: 4,
                instruction: "Select 'Asset' permissions only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete email verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and API Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Asset"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable asset viewing permissions",
            "bitFlyer requires email verification for API creation",
            "Popular exchange in Japan with strong security measures",
        ],
    },

    [Exchanges.Bitstamp]: {
        id: Exchanges.Bitstamp,
        name: "Bitstamp",
        logo: "https://cryptologos.cc/logos/bitstamp-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://www.bitstamp.net/api/",
        apiCreateUrl: "https://www.bitstamp.net/account/security/api/",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to Bitstamp and navigate to Security → API Access",
            },
            {
                step: 2,
                instruction: "Click 'New API Key'",
            },
            {
                step: 3,
                instruction: "Enter a description for your API key",
            },
            {
                step: 4,
                instruction: "Select 'Account balance' permission only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete 2FA verification",
            },
            {
                step: 6,
                instruction: "Copy API Key and Secret for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Account balance"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable account balance viewing for portfolio tracking",
            "Bitstamp is one of the oldest and most trusted exchanges",
            "Strong regulatory compliance and security measures",
        ],
    },

    [Exchanges.Coinex]: {
        id: Exchanges.Coinex,
        name: "CoinEx",
        logo: "https://cryptologos.cc/logos/coinex-token-cet-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://docs.coinex.com/api/v1/",
        apiCreateUrl: "https://www.coinex.com/account/api_management",
        stepByStepGuide: [
            {
                step: 1,
                instruction: "Log in to CoinEx and go to API Management",
            },
            {
                step: 2,
                instruction: "Click 'Create API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Name and note",
            },
            {
                step: 4,
                instruction: "Enable 'Query Account' permission only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete Google Authenticator verification",
            },
            {
                step: 6,
                instruction:
                    "Copy Access ID and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["Query Account"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable query account permissions for balance tracking",
            "CoinEx allows IP restrictions for enhanced security",
            "Monitor API usage in your account dashboard",
        ],
    },

    [Exchanges.Upbit]: {
        id: Exchanges.Upbit,
        name: "Upbit",
        logo: "https://cryptologos.cc/logos/upbit-logo.png",
        requiresPassphrase: false,
        apiDocumentationUrl: "https://docs.upbit.com/",
        apiCreateUrl: "https://upbit.com/mypage/open_api_management",
        stepByStepGuide: [
            {
                step: 1,
                instruction:
                    "Log in to Upbit and navigate to Open API Management",
            },
            {
                step: 2,
                instruction: "Click 'Add API Key'",
            },
            {
                step: 3,
                instruction: "Enter API Key Name",
            },
            {
                step: 4,
                instruction: "Select 'View Assets' permission only",
                highlight: true,
            },
            {
                step: 5,
                instruction: "Complete SMS and email verification",
            },
            {
                step: 6,
                instruction:
                    "Copy Access Key and Secret Key for portfolio setup",
            },
        ],
        requirements: {
            permissions: ["View Assets"],
            restrictions: [
                "No trading permissions",
                "No withdrawal permissions",
            ],
        },
        securityNotes: [
            "Only enable asset viewing permissions",
            "Upbit is a major Korean exchange with strict security",
            "Requires both SMS and email verification for API creation",
        ],
    },

    // Placeholder for exchanges that don't have detailed guides yet
    [Exchanges.All]: null,
    [Exchanges.Alpaca]: null,
    [Exchanges.Apex]: null,
    [Exchanges.Ascendex]: null,
    [Exchanges.Bequant]: null,
    [Exchanges.Bigone]: null,
    [Exchanges.Binancecoinm]: null,
    [Exchanges.Binanceus]: null,
    [Exchanges.Binanceusdm]: null,
    [Exchanges.Bingx]: null,
    [Exchanges.Bit2C]: null,
    [Exchanges.Bitbank]: null,
    [Exchanges.Bitbns]: null,
    [Exchanges.Bithumb]: null,
    [Exchanges.Bitmex]: null,
    [Exchanges.Bitopro]: null,
    [Exchanges.Bitrue]: null,
    [Exchanges.Bitso]: null,
    [Exchanges.Bitteam]: null,
    [Exchanges.Bitvavo]: null,
    [Exchanges.Bl3P]: null,
    [Exchanges.Blockchaincom]: null,
    [Exchanges.Blofin]: null,
    [Exchanges.Btcalpha]: null,
    [Exchanges.Btcbox]: null,
    [Exchanges.Btcmarkets]: null,
    [Exchanges.Btcturk]: null,
    [Exchanges.Cex]: null,
    [Exchanges.Coinbaseexchange]: null,
    [Exchanges.Coinbaseinternational]: null,
    [Exchanges.Coincatch]: null,

    [Exchanges.Coinlist]: null,
    [Exchanges.Coinmate]: null,
    [Exchanges.Coinmetro]: null,
    [Exchanges.Coinone]: null,
    [Exchanges.Coinsph]: null,
    [Exchanges.Coinspot]: null,
    [Exchanges.Cryptomus]: null,
    [Exchanges.Defx]: null,
    [Exchanges.Delta]: null,
    [Exchanges.Deribit]: null,
    [Exchanges.Derive]: null,
    [Exchanges.Digifinex]: null,
    [Exchanges.Ellipx]: null,
    [Exchanges.Exmo]: null,
    [Exchanges.Fmfwio]: null,
    [Exchanges.Hashkey]: null,
    [Exchanges.Hitbtc]: null,
    [Exchanges.Hollaex]: null,
    [Exchanges.Huobijp]: null,
    [Exchanges.HuobiLegacy]: null,
    [Exchanges.Hyperliquid]: null,
    [Exchanges.Idex]: null,
    [Exchanges.Independentreserve]: null,
    [Exchanges.Indodax]: null,
    [Exchanges.Krakenfutures]: null,
    [Exchanges.Kucoinfutures]: null,
    [Exchanges.Kuna]: null,
    [Exchanges.Latoken]: null,
    [Exchanges.Lbank]: null,
    [Exchanges.Luno]: null,
    [Exchanges.Mercado]: null,
    [Exchanges.Mexc3]: null,
    [Exchanges.Modetrade]: null,
    [Exchanges.Myokx]: null,
    [Exchanges.Ndax]: null,
    [Exchanges.Novadax]: null,
    [Exchanges.Oceanex]: null,
    [Exchanges.Okcoin]: null,
    [Exchanges.Okxus]: null,
    [Exchanges.Onetrading]: null,
    [Exchanges.Oxfun]: null,
    [Exchanges.P2B]: null,
    [Exchanges.Paradex]: null,
    [Exchanges.Paymium]: null,
    [Exchanges.Phemex]: null,
    [Exchanges.Probit]: null,
    [Exchanges.Timex]: null,
    [Exchanges.Tokocrypto]: null,
    [Exchanges.Tradeogre]: null,

    [Exchanges.Vertex]: null,
    [Exchanges.Wavesexchange]: null,
    [Exchanges.Whitebit]: null,
    [Exchanges.Woo]: null,
    [Exchanges.Woofipro]: null,
    [Exchanges.WoofiproDex]: null,
    [Exchanges.Xt]: null,
    [Exchanges.Yobit]: null,
    [Exchanges.Zaif]: null,
    [Exchanges.Zonda]: null,
};

// Helper function to check if an exchange requires passphrase
export const isPassphraseRequired = (exchange: Exchanges): boolean => {
    const guide = EXCHANGE_GUIDES[exchange];
    return guide?.requiresPassphrase ?? false;
};

// Helper function to get supported exchanges (those with guides)
export const getSupportedExchanges = (): Exchanges[] => {
    return Object.keys(EXCHANGE_GUIDES).filter(
        (exchange) => EXCHANGE_GUIDES[exchange as Exchanges] !== null,
    ) as Exchanges[];
};

// Legacy export for backward compatibility
export const CRYPTO_EXCHANGES_INFOS = [
    {
        id: Exchanges.Binance,
        name: "Binance",
        logo: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png",
    },
    {
        id: Exchanges.Mexc,
        name: "MEXC",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/mexc-logo.png",
    },
    {
        id: Exchanges.Okx,
        name: "OKX",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo.jpg",
    },
    {
        id: Exchanges.Coinbase,
        name: "Coinbase",
        logo: "https://cryptologos.cc/logos/coinbase-coin-logo.png",
    },
    {
        id: Exchanges.Kucoin,
        name: "KuCoin",
        logo: "https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png",
    },
    {
        id: Exchanges.Gate,
        name: "Gate.io",
        logo: "https://cryptologos.cc/logos/gate-token-gt-logo.png",
    },
    {
        id: Exchanges.Kraken,
        name: "Kraken",
        logo: "https://cryptologos.cc/logos/kraken-kraken-logo.png",
    },
    {
        id: Exchanges.Bitfinex,
        name: "Bitfinex",
        logo: "https://cryptologos.cc/logos/bitfinex-leo-leo-logo.png",
    },
    {
        id: Exchanges.Bybit,
        name: "Bybit",
        logo: "https://cryptologos.cc/logos/bybit-bit-logo.png",
    },
    {
        id: Exchanges.Htx,
        name: "HTX (Huobi)",
        logo: "https://cryptologos.cc/logos/huobi-token-ht-logo.png",
    },
    {
        id: Exchanges.Gemini,
        name: "Gemini",
        logo: "https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png",
    },
    {
        id: Exchanges.Cryptocom,
        name: "Crypto.com",
        logo: "https://cryptologos.cc/logos/cronos-cro-logo.png",
    },
    {
        id: Exchanges.Poloniex,
        name: "Poloniex",
        logo: "https://cryptologos.cc/logos/poloniex-exchange-token-polo-logo.png",
    },
    {
        id: Exchanges.Bitget,
        name: "Bitget",
        logo: "https://cryptologos.cc/logos/bitget-token-bgb-logo.png",
    },
    {
        id: Exchanges.Bitmart,
        name: "BitMart",
        logo: "https://cryptologos.cc/logos/bitmart-token-bmx-logo.png",
    },
    {
        id: Exchanges.Bitmex,
        name: "BitMEX",
        logo: "https://cryptologos.cc/logos/bitmex-bmex-logo.png",
    },
    {
        id: Exchanges.Bitstamp,
        name: "Bitstamp",
        logo: "https://cryptologos.cc/logos/bitstamp-logo.png",
    },
    {
        id: Exchanges.Bitflyer,
        name: "bitFlyer",
        logo: "https://cryptologos.cc/logos/bitflyer-logo.png",
    },
    {
        id: Exchanges.Coinex,
        name: "CoinEx",
        logo: "https://cryptologos.cc/logos/coinex-token-cet-logo.png",
    },
    {
        id: Exchanges.Deribit,
        name: "Deribit",
        logo: "https://cryptologos.cc/logos/deribit-logo.png",
    },
    {
        id: Exchanges.Huobi,
        name: "Huobi",
        logo: "https://cryptologos.cc/logos/huobi-token-ht-logo.png",
    },
    {
        id: Exchanges.Lbank,
        name: "LBank",
        logo: "https://cryptologos.cc/logos/lbank-lbank-logo.png",
    },
    {
        id: Exchanges.Phemex,
        name: "Phemex",
        logo: "https://cryptologos.cc/logos/phemex-logo.png",
    },
    {
        id: Exchanges.Upbit,
        name: "Upbit",
        logo: "https://cryptologos.cc/logos/upbit-logo.png",
    },
    {
        id: Exchanges.Whitebit,
        name: "WhiteBIT",
        logo: "https://cryptologos.cc/logos/whitebit-wbt-logo.png",
    },
    {
        id: Exchanges.All,
        name: "All",
        logo: 'dummy-logo',
    },
] as const;

export type CryptoExchangeInfo = (typeof CRYPTO_EXCHANGES_INFOS)[number];
