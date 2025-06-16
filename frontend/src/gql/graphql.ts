/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AssetBalance = {
  __typename?: 'AssetBalance';
  assetInfo: AssetInfoOutput;
  assetInfoId: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  locked: Scalars['Float']['output'];
};

export type AssetInfo = {
  __typename?: 'AssetInfo';
  assetBalances?: Maybe<Array<AssetBalance>>;
  assetPrices?: Maybe<Array<AssetPrice>>;
  category: Scalars['String']['output'];
  desc: Scalars['String']['output'];
  historicalProfits?: Maybe<Array<HistoricalAssetProfit>>;
  id: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  trades?: Maybe<Array<Trade>>;
};

export type AssetInfoOutput = {
  __typename?: 'AssetInfoOutput';
  category: Scalars['String']['output'];
  desc: Scalars['String']['output'];
  historicalProfits?: Maybe<Array<HistoricalAssetProfit>>;
  id: Scalars['String']['output'];
  lastPrice: Scalars['Float']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  trades?: Maybe<Array<Trade>>;
};

export type AssetPrice = {
  __typename?: 'AssetPrice';
  assetInfo: AssetInfo;
  assetInfoId: Scalars['String']['output'];
  closePrice: Scalars['Float']['output'];
  close_time: Scalars['DateTime']['output'];
  highPrice: Scalars['Float']['output'];
  interval: Scalars['String']['output'];
  lowPrice: Scalars['Float']['output'];
  openPrice: Scalars['Float']['output'];
  open_time: Scalars['DateTime']['output'];
  volume: Scalars['Float']['output'];
};

export type AutoBankManager = {
  __typename?: 'AutoBankManager';
  apiKey: Scalars['String']['output'];
  bankManager: BankManager;
  bankManagerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  thirdParty: AutoBankManagerThirdParty;
};

export enum AutoBankManagerThirdParty {
  Casso = 'CASSO'
}

export type BankAccount = {
  __typename?: 'BankAccount';
  accountName: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  bankManager: BankManager;
  bankManagerId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fullName: Scalars['String']['output'];
  historicalBalances?: Maybe<Array<HistoricalBankBalance>>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  transactions: Array<BankTransaction>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BankManager = {
  __typename?: 'BankManager';
  autoBankManager?: Maybe<AutoBankManager>;
  banks: Array<BankAccount>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type BankTransaction = {
  __typename?: 'BankTransaction';
  amount: Scalars['Float']['output'];
  bank: BankAccount;
  bankId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  expense?: Maybe<Array<Expense>>;
  id: Scalars['Int']['output'];
  spentAmount: Scalars['Float']['output'];
};

export type CreateAutoBankManagerInput = {
  apiKey: Scalars['String']['input'];
  thirdParty?: AutoBankManagerThirdParty;
};

export type CreateBankAccountInput = {
  accountName: Scalars['String']['input'];
  accountNumber: Scalars['String']['input'];
  balance: Scalars['Float']['input'];
  bankManagerId: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateBankManagerInput = {
  autoBankManager?: InputMaybe<CreateAutoBankManagerInput>;
  name: Scalars['String']['input'];
};

export type CreateBankTransactionInput = {
  amount: Scalars['Float']['input'];
  bankId: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type CreateCryptoPortfolioInput = {
  apiKey: Scalars['String']['input'];
  exchanges?: Exchanges;
  name?: Scalars['String']['input'];
  passphrase?: InputMaybe<Scalars['String']['input']>;
  secretKey: Scalars['String']['input'];
};

export type CreateCryptoRes = {
  __typename?: 'CreateCryptoRes';
  userId: Scalars['Float']['output'];
};

export type CreateDiscountDto = {
  code?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isActive?: Scalars['Boolean']['input'];
  isRecurring?: Scalars['Boolean']['input'];
  maxAmount?: InputMaybe<Scalars['String']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  maxUsesPerUser?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  targetType?: DiscountTargetType;
  type: DiscountType;
  value: Scalars['String']['input'];
};

export type CreateEventCategoryInput = {
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateEventInput = {
  allDay?: Scalars['Boolean']['input'];
  categoryId: Scalars['Int']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  recurrence?: InputMaybe<CreateRecurrenceInput>;
  recurrenceId?: InputMaybe<Scalars['Int']['input']>;
  reminderMinutes?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['DateTime']['input'];
};

export type CreateExpenseCategoryInput = {
  color: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  bankTransactionId: Scalars['Int']['input'];
  categoryId: Scalars['String']['input'];
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateFeatureDto = {
  name?: Scalars['String']['input'];
  type: FeatureType;
};

export type CreateMetaMaskPaymentMethodDto = {
  ensName?: InputMaybe<Scalars['String']['input']>;
  walletAddress: Scalars['String']['input'];
};

export type CreateMetaMaskSubscriptionFromSessionDto = {
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  gasPrice?: InputMaybe<Scalars['String']['input']>;
  gasUsed?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenSymbol: Scalars['String']['input'];
  transactionHash: Scalars['String']['input'];
};

export type CreateMonthlyTargetInput = {
  categoryId: Scalars['String']['input'];
  month: Scalars['Int']['input'];
  target: Scalars['Float']['input'];
  year: Scalars['Int']['input'];
};

export type CreatePaymentSessionDto = {
  discountId?: InputMaybe<Scalars['String']['input']>;
  planId: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
};

export type CreatePlanDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  featureIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  name: Scalars['String']['input'];
};

export type CreatePortfolioExecution = {
  __typename?: 'CreatePortfolioExecution';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentMilestone?: Maybe<PortfolioCreationMilestone>;
  currentStep?: Maybe<PortfolioCreationStep>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  exchangeType?: Maybe<Exchanges>;
  executionContext?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  maxRetries: Scalars['Int']['output'];
  progressPercent: Scalars['Int']['output'];
  recoveryAction?: Maybe<ErrorRecoveryAction>;
  retryCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type CreatePriceDto = {
  billingCycle?: InputMaybe<TimePeriodInput>;
  planId: Scalars['String']['input'];
  status?: Scalars['String']['input'];
  trialPeriod?: InputMaybe<TimePeriodInput>;
  unitPrice: UnitPriceInput;
};

export type CreateRecurrenceInput = {
  dayOfMonth?: InputMaybe<Scalars['Int']['input']>;
  dayOfWeek?: InputMaybe<Scalars['Int']['input']>;
  daysOfWeek?: InputMaybe<Scalars['String']['input']>;
  endCount?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  interval?: Scalars['Int']['input'];
  type: RecurrenceType;
  weekOfMonth?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateSubscriptionDto = {
  endDate: Scalars['DateTime']['input'];
  planId: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateSupportTicketInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  executionId: Scalars['Int']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  otp?: InputMaybe<Scalars['String']['input']>;
  otpPurpose?: InputMaybe<OtpPurpose>;
  password: Scalars['String']['input'];
};

export type CryptoPortfolio = {
  __typename?: 'CryptoPortfolio';
  apiKey: Scalars['String']['output'];
  balances: Array<AssetBalance>;
  childPortfolios?: Maybe<Array<CryptoPortfolio>>;
  exchanges: Exchanges;
  historicalAssetProfits?: Maybe<Array<HistoricalAssetProfit>>;
  historicalBalances?: Maybe<Array<HistoricalCryptoBalance>>;
  id: Scalars['String']['output'];
  investmentCategoryName?: Maybe<Scalars['String']['output']>;
  latestAssetProfits: Array<HistoricalAssetProfit>;
  latestHistoricalBalances: HistoricalCryptoBalance;
  name: Scalars['String']['output'];
  parentPortfolio?: Maybe<CryptoPortfolio>;
  parentPortfolioId?: Maybe<Scalars['String']['output']>;
  passphrasePortfolio?: Maybe<PassphraseCryptoPortfolio>;
  secretKey: Scalars['String']['output'];
  status: PortfolioStatus;
  trades?: Maybe<Array<Trade>>;
  tradingType: TradingType;
  updateTime?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};


export type CryptoPortfolioLatestHistoricalBalancesArgs = {
  timeFrame: Scalars['String']['input'];
};

export type CryptoPriceResult = {
  __typename?: 'CryptoPriceResult';
  tokenAmount: Scalars['String']['output'];
  tokenSymbol: Scalars['String']['output'];
  usdPrice: Scalars['Float']['output'];
};

export type CustomerPortalSessionResponse = {
  __typename?: 'CustomerPortalSessionResponse';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  urls: CustomerPortalUrls;
};

export type CustomerPortalUrls = {
  __typename?: 'CustomerPortalUrls';
  general: GeneralUrl;
};

export enum DiscountErrorCode {
  AlreadyApplied = 'ALREADY_APPLIED',
  DiscountExhausted = 'DISCOUNT_EXHAUSTED',
  DiscountExpired = 'DISCOUNT_EXPIRED',
  DiscountInactive = 'DISCOUNT_INACTIVE',
  DiscountNotApplicable = 'DISCOUNT_NOT_APPLICABLE',
  DiscountNotFound = 'DISCOUNT_NOT_FOUND',
  InvalidCurrency = 'INVALID_CURRENCY',
  UsageLimitReached = 'USAGE_LIMIT_REACHED',
  UserLimitExceeded = 'USER_LIMIT_EXCEEDED',
  UserUsageLimitReached = 'USER_USAGE_LIMIT_REACHED',
  ValidationError = 'VALIDATION_ERROR'
}

export enum DiscountTargetType {
  FirstTimeUser = 'FIRST_TIME_USER',
  PriceSpecific = 'PRICE_SPECIFIC'
}

export enum DiscountType {
  FixedAmount = 'FIXED_AMOUNT',
  FreeTrial = 'FREE_TRIAL',
  Percentage = 'PERCENTAGE'
}

export type DiscountValidationResult = {
  __typename?: 'DiscountValidationResult';
  discount?: Maybe<MembershipDiscount>;
  discountAmount?: Maybe<Scalars['String']['output']>;
  errorCode?: Maybe<DiscountErrorCode>;
  finalAmount?: Maybe<Scalars['String']['output']>;
  isValid: Scalars['Boolean']['output'];
  originalAmount?: Maybe<Scalars['String']['output']>;
};

export enum ErrorRecoveryAction {
  Abort = 'ABORT',
  CheckPermissions = 'CHECK_PERMISSIONS',
  ContactSupport = 'CONTACT_SUPPORT',
  RetryAutomatic = 'RETRY_AUTOMATIC',
  RetryManual = 'RETRY_MANUAL',
  UpdateCredentials = 'UPDATE_CREDENTIALS',
  WaitRateLimit = 'WAIT_RATE_LIMIT'
}

export type Event = {
  __typename?: 'Event';
  allDay: Scalars['Boolean']['output'];
  category: EventCategory;
  categoryId: Scalars['Int']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  recurrence?: Maybe<EventRecurrence>;
  recurrenceId?: Maybe<Scalars['Int']['output']>;
  reminderMinutes?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type EventCategory = {
  __typename?: 'EventCategory';
  color: Scalars['String']['output'];
  events?: Maybe<Array<Event>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type EventRecurrence = {
  __typename?: 'EventRecurrence';
  createdAt: Scalars['DateTime']['output'];
  dayOfMonth?: Maybe<Scalars['Int']['output']>;
  dayOfWeek?: Maybe<Scalars['Int']['output']>;
  daysOfWeek?: Maybe<Scalars['String']['output']>;
  endCount?: Maybe<Scalars['Int']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  events: Array<Event>;
  id: Scalars['Int']['output'];
  interval: Scalars['Int']['output'];
  type: RecurrenceType;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
  weekOfMonth?: Maybe<Scalars['Int']['output']>;
};

export enum Exchanges {
  All = 'ALL',
  Alpaca = 'ALPACA',
  Apex = 'APEX',
  Ascendex = 'ASCENDEX',
  Bequant = 'BEQUANT',
  Bigone = 'BIGONE',
  Binance = 'BINANCE',
  Binancecoinm = 'BINANCECOINM',
  Binanceus = 'BINANCEUS',
  Binanceusdm = 'BINANCEUSDM',
  Bingx = 'BINGX',
  Bit2C = 'BIT2C',
  Bitbank = 'BITBANK',
  Bitbns = 'BITBNS',
  Bitfinex = 'BITFINEX',
  Bitflyer = 'BITFLYER',
  Bitget = 'BITGET',
  Bithumb = 'BITHUMB',
  Bitmart = 'BITMART',
  Bitmex = 'BITMEX',
  Bitopro = 'BITOPRO',
  Bitrue = 'BITRUE',
  Bitso = 'BITSO',
  Bitstamp = 'BITSTAMP',
  Bitteam = 'BITTEAM',
  Bitvavo = 'BITVAVO',
  Bl3P = 'BL3P',
  Blockchaincom = 'BLOCKCHAINCOM',
  Blofin = 'BLOFIN',
  Btcalpha = 'BTCALPHA',
  Btcbox = 'BTCBOX',
  Btcmarkets = 'BTCMARKETS',
  Btcturk = 'BTCTURK',
  Bybit = 'BYBIT',
  Cex = 'CEX',
  Coinbase = 'COINBASE',
  Coinbaseexchange = 'COINBASEEXCHANGE',
  Coinbaseinternational = 'COINBASEINTERNATIONAL',
  Coincatch = 'COINCATCH',
  Coincheck = 'COINCHECK',
  Coinex = 'COINEX',
  Coinlist = 'COINLIST',
  Coinmate = 'COINMATE',
  Coinmetro = 'COINMETRO',
  Coinone = 'COINONE',
  Coinsph = 'COINSPH',
  Coinspot = 'COINSPOT',
  Cryptocom = 'CRYPTOCOM',
  Cryptomus = 'CRYPTOMUS',
  Defx = 'DEFX',
  Delta = 'DELTA',
  Deribit = 'DERIBIT',
  Derive = 'DERIVE',
  Digifinex = 'DIGIFINEX',
  Ellipx = 'ELLIPX',
  Exmo = 'EXMO',
  Fmfwio = 'FMFWIO',
  Gate = 'GATE',
  Gemini = 'GEMINI',
  Hashkey = 'HASHKEY',
  Hitbtc = 'HITBTC',
  Hollaex = 'HOLLAEX',
  Htx = 'HTX',
  Huobi = 'HUOBI',
  Huobijp = 'HUOBIJP',
  HuobiLegacy = 'HUOBI_LEGACY',
  Hyperliquid = 'HYPERLIQUID',
  Idex = 'IDEX',
  Independentreserve = 'INDEPENDENTRESERVE',
  Indodax = 'INDODAX',
  Kraken = 'KRAKEN',
  Krakenfutures = 'KRAKENFUTURES',
  Kucoin = 'KUCOIN',
  Kucoinfutures = 'KUCOINFUTURES',
  Kuna = 'KUNA',
  Latoken = 'LATOKEN',
  Lbank = 'LBANK',
  Luno = 'LUNO',
  Mercado = 'MERCADO',
  Mexc = 'MEXC',
  Mexc3 = 'MEXC3',
  Modetrade = 'MODETRADE',
  Myokx = 'MYOKX',
  Ndax = 'NDAX',
  Novadax = 'NOVADAX',
  Oceanex = 'OCEANEX',
  Okcoin = 'OKCOIN',
  Okx = 'OKX',
  Okxus = 'OKXUS',
  Onetrading = 'ONETRADING',
  Oxfun = 'OXFUN',
  P2B = 'P2B',
  Paradex = 'PARADEX',
  Paymium = 'PAYMIUM',
  Phemex = 'PHEMEX',
  Poloniex = 'POLONIEX',
  Probit = 'PROBIT',
  Timex = 'TIMEX',
  Tokocrypto = 'TOKOCRYPTO',
  Tradeogre = 'TRADEOGRE',
  Upbit = 'UPBIT',
  Vertex = 'VERTEX',
  Wavesexchange = 'WAVESEXCHANGE',
  Whitebit = 'WHITEBIT',
  Woo = 'WOO',
  Woofipro = 'WOOFIPRO',
  WoofiproDex = 'WOOFIPRO_DEX',
  Xt = 'XT',
  Yobit = 'YOBIT',
  Zaif = 'ZAIF',
  Zonda = 'ZONDA'
}

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float']['output'];
  bankTransaction: BankTransaction;
  bankTransactionId: Scalars['Int']['output'];
  category: ExpenseCategory;
  categoryId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  transaction: BankTransaction;
  user: User;
  userId: Scalars['Int']['output'];
};

export type ExpenseCategory = {
  __typename?: 'ExpenseCategory';
  color: Scalars['String']['output'];
  countExpenses: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['String']['output'];
  monthlyTargets?: Maybe<Array<MonthlyTarget>>;
  name: Scalars['String']['output'];
  totalSpentAmounts: Array<TotalSpentAmountOutput>;
  user: User;
  userId: Scalars['Int']['output'];
};


export type ExpenseCategoryMonthlyTargetsArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type ExpenseCategoryTotalSpentAmountsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Available export formats for portfolio analysis */
export enum ExportFormat {
  Csv = 'CSV',
  Excel = 'EXCEL',
  Pdf = 'PDF'
}

export type ExportPortfolioInput = {
  format: ExportFormat;
  includeCharts?: Scalars['Boolean']['input'];
  includeSummary?: Scalars['Boolean']['input'];
  portfolioId: Scalars['String']['input'];
  portfolioName?: InputMaybe<Scalars['String']['input']>;
};

export type ExportResult = {
  __typename?: 'ExportResult';
  downloadUrl: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Float']['output'];
  mimeType: Scalars['String']['output'];
};

export type Feature = {
  __typename?: 'Feature';
  id: Scalars['Int']['output'];
  membershipFeatures?: Maybe<Array<MembershipFeature>>;
  name: Scalars['String']['output'];
  type: FeatureType;
};

export enum FeatureType {
  Crypto = 'CRYPTO',
  Expense = 'EXPENSE'
}

export type GeneralUrl = {
  __typename?: 'GeneralUrl';
  overview: Scalars['String']['output'];
};

export type GetAssetInfoInput = {
  id: Scalars['String']['input'];
};

export type GetAssetPriceInput = {
  assetInfoId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetHistoricalAssetProfitInput = {
  assetInfoId: Scalars['String']['input'];
  cryptoPortfolioId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetHistoricalBalanceInput = {
  cryptoPortfolioId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetHistoricalBalancesInput = {
  cryptoPortfolioIds: Array<Scalars['String']['input']>;
  timeFrame: Scalars['String']['input'];
};

export type GetPaymentMethodDto = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type GetPaymentSessionDto = {
  sessionId: Scalars['String']['input'];
};

export type GetTradeInput = {
  assetInfoId?: InputMaybe<Scalars['String']['input']>;
  cryptoPortfolioId?: InputMaybe<Scalars['String']['input']>;
};

export type HistoricalAssetProfit = {
  __typename?: 'HistoricalAssetProfit';
  assetInfo: AssetInfoOutput;
  assetInfoId: Scalars['String']['output'];
  averageCostBasis?: Maybe<Scalars['Float']['output']>;
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  currentPrice?: Maybe<Scalars['Float']['output']>;
  estimatedProfit: Scalars['Float']['output'];
  holdingPeriodDays?: Maybe<Scalars['Int']['output']>;
  percentageGain?: Maybe<Scalars['Float']['output']>;
  realizedPnl?: Maybe<Scalars['Float']['output']>;
  remainingQty: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
  totalCostInQuoteQty: Scalars['Float']['output'];
  totalPnl?: Maybe<Scalars['Float']['output']>;
  unrealizedPnl?: Maybe<Scalars['Float']['output']>;
};

export type HistoricalBankBalance = {
  __typename?: 'HistoricalBankBalance';
  balance: Scalars['Float']['output'];
  bankAccount: BankAccount;
  bankAccountId: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
};

export type HistoricalCryptoBalance = {
  __typename?: 'HistoricalCryptoBalance';
  assetCount?: Maybe<Scalars['Int']['output']>;
  changeBalance: Scalars['Float']['output'];
  changePercent: Scalars['Float']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  diversificationScore?: Maybe<Scalars['Float']['output']>;
  estimatedBalance: Scalars['Float']['output'];
  riskScore?: Maybe<Scalars['Float']['output']>;
  time: Scalars['DateTime']['output'];
  totalPnl?: Maybe<Scalars['Float']['output']>;
  totalRealizedPnl?: Maybe<Scalars['Float']['output']>;
  totalUnrealizedPnl?: Maybe<Scalars['Float']['output']>;
  totalValue?: Maybe<Scalars['Float']['output']>;
};

export enum Interval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export type LoginReqDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResDto = {
  __typename?: 'LoginResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type MembershipDiscount = {
  __typename?: 'MembershipDiscount';
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode?: Maybe<Scalars['String']['output']>;
  currentUses: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  maxAmount?: Maybe<Scalars['Decimal']['output']>;
  maxUses?: Maybe<Scalars['Int']['output']>;
  maxUsesPerUser?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  prices: Array<MembershipDiscountPrice>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  targetType: DiscountTargetType;
  type: DiscountType;
  updatedAt: Scalars['DateTime']['output'];
  usageHistory: Array<MembershipDiscountUsage>;
  value: Scalars['Decimal']['output'];
};

export type MembershipDiscountPrice = {
  __typename?: 'MembershipDiscountPrice';
  discount: MembershipDiscount;
  discountId: Scalars['String']['output'];
  price: MembershipPrice;
  priceId: Scalars['String']['output'];
};

export type MembershipDiscountUsage = {
  __typename?: 'MembershipDiscountUsage';
  currencyCode: Scalars['String']['output'];
  discount: MembershipDiscount;
  discountAmount: Scalars['Decimal']['output'];
  discountId: Scalars['String']['output'];
  finalAmount: Scalars['Decimal']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  membershipSubscription: MembershipSubscription;
  membershipSubscriptionId: Scalars['String']['output'];
  originalAmount: Scalars['Decimal']['output'];
  usedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type MembershipFeature = {
  __typename?: 'MembershipFeature';
  feature: Feature;
  featureId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  plan: MembershipPlan;
  planId: Scalars['String']['output'];
};

export type MembershipPlan = {
  __typename?: 'MembershipPlan';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  membershipFeatures: Array<MembershipFeature>;
  name: Scalars['String']['output'];
  prices: Array<MembershipPrice>;
  subscriptions?: Maybe<Array<MembershipSubscription>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MembershipPrice = {
  __typename?: 'MembershipPrice';
  billingCycle?: Maybe<TimePeriod>;
  billingCycleId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  discounts?: Maybe<Array<MembershipDiscountPrice>>;
  id: Scalars['String']['output'];
  plan: MembershipPlan;
  planId: Scalars['String']['output'];
  status: PriceStatus;
  trialPeriod?: Maybe<TimePeriod>;
  trialPeriodId?: Maybe<Scalars['Int']['output']>;
  unitPrice: UnitPrice;
  unitPriceId: Scalars['Int']['output'];
};

export type MembershipSubscription = {
  __typename?: 'MembershipSubscription';
  createdAt: Scalars['DateTime']['output'];
  discountUsages?: Maybe<Array<MembershipDiscountUsage>>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  paymentTransactions: Array<PaymentTransaction>;
  plan: MembershipPlan;
  planId: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: MembershipSubscriptionStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export enum MembershipSubscriptionStatus {
  Active = 'active',
  Canceled = 'canceled',
  PastDue = 'past_due',
  Paused = 'paused',
  Trialing = 'trialing'
}

export type MetaMaskPaymentMethod = {
  __typename?: 'MetaMaskPaymentMethod';
  ensName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  paymentMethod: PaymentMethod;
  paymentMethodId: Scalars['Int']['output'];
  walletAddress: Scalars['String']['output'];
};

export type MetaMaskPaymentTransaction = {
  __typename?: 'MetaMaskPaymentTransaction';
  blockNumber?: Maybe<Scalars['Int']['output']>;
  gasPrice?: Maybe<Scalars['String']['output']>;
  gasUsed?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  paymentTransaction: PaymentTransaction;
  paymentTransactionId: Scalars['Int']['output'];
  tokenAddress?: Maybe<Scalars['String']['output']>;
  tokenSymbol: Scalars['String']['output'];
  transactionHash: Scalars['String']['output'];
};

export type MonthlyTarget = {
  __typename?: 'MonthlyTarget';
  category: ExpenseCategory;
  categoryId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  month: Scalars['Int']['output'];
  target: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelPaddleSubscription: MembershipSubscription;
  createBankAccount: BankAccount;
  createBankManager: BankManager;
  createBankTransaction: BankTransaction;
  createCryptoPortfolio: CreateCryptoRes;
  createCustomerPortalSession: CustomerPortalSessionResponse;
  createDiscount: MembershipDiscount;
  createEvent: Event;
  createEventCategory: EventCategory;
  createExpense: Expense;
  createExpenseCategory: ExpenseCategory;
  createFeature: Feature;
  createMembershipPlan: MembershipPlan;
  createMembershipPrice: MembershipPrice;
  createMembershipSubscription: MembershipSubscription;
  createMetaMaskPaymentMethod: Scalars['Boolean']['output'];
  createMetaMaskSubscriptionFromSession: Scalars['Boolean']['output'];
  createMonthlyTarget: MonthlyTarget;
  createPaymentSession: PaymentSession;
  createSupportTicket: Scalars['Boolean']['output'];
  deleteDiscount: Scalars['Boolean']['output'];
  deleteFeature: Feature;
  deleteMembershipPlan: Scalars['Boolean']['output'];
  deleteMembershipPrice: Scalars['Boolean']['output'];
  deleteRecurrenceTemplate: EventRecurrence;
  exportPortfolio: ExportResult;
  linkDiscountToPrice: Scalars['Boolean']['output'];
  login: LoginResDto;
  logout: Scalars['Boolean']['output'];
  reactivatePaddleSubscription: MembershipSubscription;
  refreshToken: RefreshTokenResponseDto;
  removeBankTransaction: BankTransaction;
  removeEvent: Event;
  removeEventCategory: EventCategory;
  removeExpense: Expense;
  removeExpenseCategory: ExpenseCategory;
  removeExpenses: Scalars['Int']['output'];
  retryPortfolioCreation: CreatePortfolioExecution;
  signup: SignupResDto;
  unlinkDiscountFromPrice: Scalars['Boolean']['output'];
  updateDiscount: MembershipDiscount;
  updateEvent: Event;
  updateEventCategory: EventCategory;
  updateExpense: Expense;
  updateExpenseCategory: ExpenseCategory;
  updateFeature: Feature;
  updateMembershipPlan: MembershipPlan;
  updateMembershipPrice: MembershipPrice;
  updateMembershipSubscription: MembershipSubscription;
  updateMonthlyTarget: MonthlyTarget;
  updatePortfolioCredentials: CreatePortfolioExecution;
  updateRecurrenceTemplate: EventRecurrence;
  verifyAccount: LoginResDto;
};


export type MutationCancelPaddleSubscriptionArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateBankAccountArgs = {
  data: CreateBankAccountInput;
};


export type MutationCreateBankManagerArgs = {
  data: CreateBankManagerInput;
};


export type MutationCreateBankTransactionArgs = {
  data: CreateBankTransactionInput;
};


export type MutationCreateCryptoPortfolioArgs = {
  data: CreateCryptoPortfolioInput;
};


export type MutationCreateCustomerPortalSessionArgs = {
  subscriptionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationCreateDiscountArgs = {
  data: CreateDiscountDto;
};


export type MutationCreateEventArgs = {
  data: CreateEventInput;
};


export type MutationCreateEventCategoryArgs = {
  data: CreateEventCategoryInput;
};


export type MutationCreateExpenseArgs = {
  data: CreateExpenseInput;
};


export type MutationCreateExpenseCategoryArgs = {
  data: CreateExpenseCategoryInput;
};


export type MutationCreateFeatureArgs = {
  data: CreateFeatureDto;
};


export type MutationCreateMembershipPlanArgs = {
  data: CreatePlanDto;
};


export type MutationCreateMembershipPriceArgs = {
  data: CreatePriceDto;
};


export type MutationCreateMembershipSubscriptionArgs = {
  data: CreateSubscriptionDto;
};


export type MutationCreateMetaMaskPaymentMethodArgs = {
  input: CreateMetaMaskPaymentMethodDto;
};


export type MutationCreateMetaMaskSubscriptionFromSessionArgs = {
  input: CreateMetaMaskSubscriptionFromSessionDto;
};


export type MutationCreateMonthlyTargetArgs = {
  data: CreateMonthlyTargetInput;
};


export type MutationCreatePaymentSessionArgs = {
  data: CreatePaymentSessionDto;
};


export type MutationCreateSupportTicketArgs = {
  data: CreateSupportTicketInput;
};


export type MutationDeleteDiscountArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFeatureArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteMembershipPlanArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMembershipPriceArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRecurrenceTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationExportPortfolioArgs = {
  input: ExportPortfolioInput;
};


export type MutationLinkDiscountToPriceArgs = {
  discountId: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: LoginReqDto;
};


export type MutationReactivatePaddleSubscriptionArgs = {
  handlePastDueTransactions?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  data: RefreshTokenInputDto;
};


export type MutationRemoveBankTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveEventArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveEventCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveExpenseArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveExpenseCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveExpensesArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationRetryPortfolioCreationArgs = {
  executionId: Scalars['Int']['input'];
};


export type MutationSignupArgs = {
  data: CreateUserInput;
};


export type MutationUnlinkDiscountFromPriceArgs = {
  discountId: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
};


export type MutationUpdateDiscountArgs = {
  data: UpdateDiscountDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateEventArgs = {
  data: UpdateEventInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateEventCategoryArgs = {
  data: UpdateEventCategoryInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateExpenseArgs = {
  data: UpdateExpenseInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateExpenseCategoryArgs = {
  data: UpdateExpenseCategoryInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateFeatureArgs = {
  data: UpdateFeatureDto;
  id: Scalars['Int']['input'];
};


export type MutationUpdateMembershipPlanArgs = {
  data: UpdatePlanDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateMembershipPriceArgs = {
  data: UpdatePriceDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateMembershipSubscriptionArgs = {
  data: UpdateSubscriptionDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateMonthlyTargetArgs = {
  data: UpdateMonthlyTargetInput;
  id: Scalars['String']['input'];
};


export type MutationUpdatePortfolioCredentialsArgs = {
  credentials: UpdateCredentialsInput;
  executionId: Scalars['Int']['input'];
};


export type MutationUpdateRecurrenceTemplateArgs = {
  data: UpdateEventRecurrenceInput;
  id: Scalars['Int']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerifyDto;
};

export enum OtpPurpose {
  ResetPassword = 'RESET_PASSWORD',
  VerifyAccount = 'VERIFY_ACCOUNT'
}

export type PaddlePaymentMethod = {
  __typename?: 'PaddlePaymentMethod';
  addressId?: Maybe<Scalars['String']['output']>;
  businessId?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  paymentMethod: PaymentMethod;
  paymentMethodId: Scalars['Int']['output'];
};

export type PaddlePaymentTransaction = {
  __typename?: 'PaddlePaymentTransaction';
  id: Scalars['Int']['output'];
  paymentTransaction: PaymentTransaction;
  paymentTransactionId: Scalars['Int']['output'];
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type PassphraseCryptoPortfolio = {
  __typename?: 'PassphraseCryptoPortfolio';
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  passphrase: Scalars['String']['output'];
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  id: Scalars['Int']['output'];
  metaMaskPaymentMethod?: Maybe<MetaMaskPaymentMethod>;
  paddlePaymentMethod?: Maybe<PaddlePaymentMethod>;
  provider: PaymentProvider;
  user: User;
  userId: Scalars['Int']['output'];
};

export enum PaymentProvider {
  Metamask = 'METAMASK',
  Paddle = 'PADDLE'
}

export type PaymentSession = {
  __typename?: 'PaymentSession';
  createdAt: Scalars['DateTime']['output'];
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountId?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  finalAmount: Scalars['Float']['output'];
  planId: Scalars['String']['output'];
  priceId: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export enum PaymentStatus {
  ActionRequired = 'action_required',
  Authorized = 'authorized',
  AuthorizedFlagged = 'authorized_flagged',
  Canceled = 'canceled',
  Captured = 'captured',
  Created = 'created',
  Dropped = 'dropped',
  Error = 'error',
  PendingNoActionRequired = 'pending_no_action_required',
  Unknown = 'unknown'
}

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  membershipSubscription: MembershipSubscription;
  membershipSubscriptionId: Scalars['String']['output'];
  metaMaskPaymentTransaction?: Maybe<MetaMaskPaymentTransaction>;
  paddlePaymentTransaction?: Maybe<PaddlePaymentTransaction>;
  status: PaymentStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
};

export enum PortfolioCreationMilestone {
  AccountFetched = 'ACCOUNT_FETCHED',
  BalancesFetched = 'BALANCES_FETCHED',
  Completed = 'COMPLETED',
  ConnectionFailed = 'CONNECTION_FAILED',
  CredentialsFailed = 'CREDENTIALS_FAILED',
  CredentialsVerified = 'CREDENTIALS_VERIFIED',
  ExchangeConnected = 'EXCHANGE_CONNECTED',
  Failed = 'FAILED',
  FetchFailed = 'FETCH_FAILED',
  Initialized = 'INITIALIZED',
  InsufficientPermissions = 'INSUFFICIENT_PERMISSIONS',
  PortfolioStored = 'PORTFOLIO_STORED',
  RateLimited = 'RATE_LIMITED',
  StorageFailed = 'STORAGE_FAILED',
  TimeoutFailed = 'TIMEOUT_FAILED',
  ValidationFailed = 'VALIDATION_FAILED'
}

export enum PortfolioCreationStep {
  AnalyticsCalculation = 'ANALYTICS_CALCULATION',
  Authentication = 'AUTHENTICATION',
  BalanceRetrieval = 'BALANCE_RETRIEVAL',
  Completion = 'COMPLETION',
  PnlCalculation = 'PNL_CALCULATION',
  PriceHistoryFetch = 'PRICE_HISTORY_FETCH',
  SymbolDiscovery = 'SYMBOL_DISCOVERY',
  TradeHistoryFetch = 'TRADE_HISTORY_FETCH',
  Validation = 'VALIDATION'
}

export enum PortfolioStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum PriceStatus {
  Active = 'active',
  Archived = 'archived'
}

export type Query = {
  __typename?: 'Query';
  getAssetInfo: AssetInfo;
  getAssetPrices: Array<AssetPrice>;
  getBankAccounts: Array<BankAccount>;
  getBankManagers: Array<BankManager>;
  getBankTransactions: Array<BankTransaction>;
  getCreatePortfolioExecutions: Array<CreatePortfolioExecution>;
  getCryptoPortfolios: Array<CryptoPortfolio>;
  getCryptoPrice: CryptoPriceResult;
  getDiscount: MembershipDiscount;
  getDiscounts: Array<MembershipDiscount>;
  getDiscountsForPrice: Array<MembershipDiscount>;
  getEventCategories: Array<EventCategory>;
  getEvents: Array<Event>;
  getExpenseCategories: Array<ExpenseCategory>;
  getExpenses: Array<Expense>;
  getFeature: Feature;
  getFeatures: Array<Feature>;
  getHistoricalAssetProfits: Array<HistoricalAssetProfit>;
  getHistoricalBalances: Array<HistoricalCryptoBalance>;
  getMe: User;
  getMembershipPlan: MembershipPlan;
  getMembershipPlans: Array<MembershipPlan>;
  getMembershipPrice: MembershipPrice;
  getMembershipPrices: Array<MembershipPrice>;
  getMembershipPricesByPlan: Array<MembershipPrice>;
  getMonthlyTargets: Array<MonthlyTarget>;
  getPaymentMethod?: Maybe<PaymentMethod>;
  getPaymentMethods: Array<PaymentMethod>;
  getPaymentSession: PaymentSession;
  getRecurrenceTemplate: EventRecurrence;
  getRecurrenceTemplates: Array<EventRecurrence>;
  getSuggestedExpenses: Array<Expense>;
  getTrades: Array<Trade>;
  myActiveMembershipSubscriptions: Array<MembershipSubscription>;
  myMembershipFeatures: Array<MembershipFeature>;
  myMembershipSubscriptions: Array<MembershipSubscription>;
  validateDiscountCode: DiscountValidationResult;
};


export type QueryGetAssetInfoArgs = {
  data: GetAssetInfoInput;
};


export type QueryGetAssetPricesArgs = {
  data: GetAssetPriceInput;
  pagination: PaginationInput;
};


export type QueryGetCryptoPriceArgs = {
  tokenSymbol: Scalars['String']['input'];
  usdAmount: Scalars['Float']['input'];
};


export type QueryGetDiscountArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetDiscountsForPriceArgs = {
  priceId: Scalars['String']['input'];
};


export type QueryGetEventsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetExpenseCategoriesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetExpensesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetFeatureArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetHistoricalAssetProfitsArgs = {
  data: GetHistoricalAssetProfitInput;
  pagination: PaginationInput;
};


export type QueryGetHistoricalBalancesArgs = {
  data: GetHistoricalBalanceInput;
  pagination: PaginationInput;
};


export type QueryGetMembershipPlanArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMembershipPriceArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMembershipPricesByPlanArgs = {
  planId: Scalars['String']['input'];
};


export type QueryGetMonthlyTargetsArgs = {
  categoryId: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPaymentMethodArgs = {
  data: GetPaymentMethodDto;
};


export type QueryGetPaymentSessionArgs = {
  data: GetPaymentSessionDto;
};


export type QueryGetRecurrenceTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSuggestedExpensesArgs = {
  data: SuggestExpenseInput;
};


export type QueryGetTradesArgs = {
  data: GetTradeInput;
};


export type QueryValidateDiscountCodeArgs = {
  data: ValidateDiscountDto;
};

export enum RecurrenceType {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type RefreshTokenInputDto = {
  refreshToken: Scalars['String']['input'];
};

export type RefreshTokenResponseDto = {
  __typename?: 'RefreshTokenResponseDto';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Float']['output'];
  refreshToken: Scalars['String']['output'];
};

export type SignupResDto = {
  __typename?: 'SignupResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newAssetPrice: AssetPrice;
  newHistoricalAssetProfit: HistoricalAssetProfit;
  newHistoricalCryptoBalance: HistoricalCryptoBalance;
  onCreatePortfolioExecution: CreatePortfolioExecution;
  onMembershipSubscriptionUpdated: MembershipSubscription;
};


export type SubscriptionNewAssetPriceArgs = {
  data: GetAssetPriceInput;
};


export type SubscriptionNewHistoricalAssetProfitArgs = {
  data: GetHistoricalAssetProfitInput;
};


export type SubscriptionNewHistoricalCryptoBalanceArgs = {
  data: GetHistoricalBalancesInput;
};

export type SuggestExpenseInput = {
  bankTransactionId: Scalars['Int']['input'];
};

export type TimePeriod = {
  __typename?: 'TimePeriod';
  billingCycles?: Maybe<Array<MembershipPrice>>;
  frequency: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  interval: Interval;
  trialPeriods?: Maybe<Array<MembershipPrice>>;
};

export type TimePeriodInput = {
  frequency: Scalars['Int']['input'];
  interval: Scalars['String']['input'];
};

export type TotalSpentAmountOutput = {
  __typename?: 'TotalSpentAmountOutput';
  amount: Scalars['Float']['output'];
  month: Scalars['Float']['output'];
  year: Scalars['Float']['output'];
};

export type Trade = {
  __typename?: 'Trade';
  assetInfo: AssetInfo;
  assetInfoId: Scalars['String']['output'];
  commission: Scalars['Float']['output'];
  commissionAsset: Scalars['String']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  feeAsset?: Maybe<Scalars['String']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  isBuyer: Scalars['Boolean']['output'];
  orderId?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  qty: Scalars['Float']['output'];
  quoteQty: Scalars['Float']['output'];
  realizedPnl?: Maybe<Scalars['Float']['output']>;
  side?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  time: Scalars['DateTime']['output'];
};

export enum TradingType {
  Futures = 'FUTURES',
  Spot = 'SPOT'
}

export type UnitPrice = {
  __typename?: 'UnitPrice';
  amount: Scalars['String']['output'];
  currencyCode: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  prices?: Maybe<Array<MembershipPrice>>;
};

export type UnitPriceInput = {
  amount: Scalars['String']['input'];
  currencyCode: Scalars['String']['input'];
};

export type UpdateCredentialsInput = {
  apiKey: Scalars['String']['input'];
  passphrase?: InputMaybe<Scalars['String']['input']>;
  secretKey: Scalars['String']['input'];
};

export type UpdateDiscountDto = {
  code?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxAmount?: InputMaybe<Scalars['String']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  maxUsesPerUser?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  targetType?: InputMaybe<DiscountTargetType>;
  type?: InputMaybe<DiscountType>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventInput = {
  allDay?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  recurrenceId?: InputMaybe<Scalars['Int']['input']>;
  reminderMinutes?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateEventRecurrenceInput = {
  dayOfMonth?: InputMaybe<Scalars['Int']['input']>;
  dayOfWeek?: InputMaybe<Scalars['Int']['input']>;
  daysOfWeek?: InputMaybe<Scalars['String']['input']>;
  endCount?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  interval?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<RecurrenceType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  weekOfMonth?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateExpenseCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  bankTransactionId?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFeatureDto = {
  type?: InputMaybe<FeatureType>;
};

export type UpdateMonthlyTargetInput = {
  month?: InputMaybe<Scalars['Int']['input']>;
  target?: InputMaybe<Scalars['Float']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePlanDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePriceDto = {
  billingCycleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  trialPeriodId?: InputMaybe<Scalars['Int']['input']>;
  unitPriceId?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSubscriptionDto = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  planId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  bankManager?: Maybe<Array<BankManager>>;
  createPortfolioExecutions?: Maybe<Array<CreatePortfolioExecution>>;
  cryptoPortfolios?: Maybe<Array<CryptoPortfolio>>;
  cryptoProfiles: CryptoPortfolio;
  email: Scalars['String']['output'];
  eventCategories?: Maybe<Array<EventCategory>>;
  eventRecurrences?: Maybe<Array<EventRecurrence>>;
  events?: Maybe<Array<Event>>;
  expenseCategories?: Maybe<Array<ExpenseCategory>>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['Int']['output'];
  memberships?: Maybe<Array<MembershipSubscription>>;
  name?: Maybe<Scalars['String']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  otpPurpose?: Maybe<OtpPurpose>;
  password: Scalars['String']['output'];
  paymentMethods?: Maybe<Array<PaymentMethod>>;
};

export type ValidateDiscountDto = {
  code: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  priceId?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type VerifyDto = {
  otp: Scalars['String']['input'];
  otpPurpose: OtpPurpose;
};

export type LoginMutationVariables = Exact<{
  data: LoginReqDto;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResDto', accessToken: string, refreshToken: string } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getMe: { __typename?: 'User', email: string, id: number, name?: string | null, otp?: string | null, otpPurpose?: OtpPurpose | null } };

export type SignupMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupResDto', accessToken: string, refreshToken: string } };

export type VerifyAccountMutationVariables = Exact<{
  data: VerifyDto;
}>;


export type VerifyAccountMutation = { __typename?: 'Mutation', verifyAccount: { __typename?: 'LoginResDto', accessToken: string, refreshToken: string } };

export type RefreshTokenMutationVariables = Exact<{
  data: RefreshTokenInputDto;
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'RefreshTokenResponseDto', accessToken: string, refreshToken: string, expiresIn: number } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateBankAccountMutationVariables = Exact<{
  data: CreateBankAccountInput;
}>;


export type CreateBankAccountMutation = { __typename?: 'Mutation', createBankAccount: { __typename?: 'BankAccount', id: string, name: string, accountNumber: string, balance: number, createdAt: any } };

export type GetBankAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBankAccountsQuery = { __typename?: 'Query', getBankAccounts: Array<{ __typename?: 'BankAccount', id: string, name: string, accountNumber: string, balance: number, fullName: string, createdAt: any, updatedAt: any }> };

export type CreateBankManagerMutationVariables = Exact<{
  data: CreateBankManagerInput;
}>;


export type CreateBankManagerMutation = { __typename?: 'Mutation', createBankManager: { __typename?: 'BankManager', id: string, name: string, createdAt: any } };

export type GetBankManagersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBankManagersQuery = { __typename?: 'Query', getBankManagers: Array<{ __typename?: 'BankManager', id: string, name: string, createdAt: any, updatedAt: any, autoBankManager?: { __typename?: 'AutoBankManager', thirdParty: AutoBankManagerThirdParty } | null, banks: Array<{ __typename?: 'BankAccount', name: string, accountName: string, accountNumber: string, balance: number, createdAt: any, updatedAt: any, historicalBalances?: Array<{ __typename?: 'HistoricalBankBalance', balance: number, time: any }> | null }> }> };

export type CreateBankTransactionMutationVariables = Exact<{
  data: CreateBankTransactionInput;
}>;


export type CreateBankTransactionMutation = { __typename?: 'Mutation', createBankTransaction: { __typename?: 'BankTransaction', id: number, amount: number, description: string, createdAt: any, bankId: string } };

export type GetBankTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBankTransactionsQuery = { __typename?: 'Query', getBankTransactions: Array<{ __typename?: 'BankTransaction', id: number, amount: number, spentAmount: number, createdAt: any, description: string, bank: { __typename?: 'BankAccount', name: string } }> };

export type RemoveBankTransactionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RemoveBankTransactionMutation = { __typename?: 'Mutation', removeBankTransaction: { __typename?: 'BankTransaction', id: number } };

export type NewHistoricalAssetProfitSubscriptionVariables = Exact<{
  data: GetHistoricalAssetProfitInput;
}>;


export type NewHistoricalAssetProfitSubscription = { __typename?: 'Subscription', newHistoricalAssetProfit: { __typename?: 'HistoricalAssetProfit', time: any, totalCostInQuoteQty: number, remainingQty: number, estimatedProfit: number } };

export type CreateCryptoPortfolioMutationVariables = Exact<{
  data: CreateCryptoPortfolioInput;
}>;


export type CreateCryptoPortfolioMutation = { __typename?: 'Mutation', createCryptoPortfolio: { __typename?: 'CreateCryptoRes', userId: number } };

export type GetCryptoPortfoliosQueryVariables = Exact<{
  timeFrame: Scalars['String']['input'];
}>;


export type GetCryptoPortfoliosQuery = { __typename?: 'Query', getCryptoPortfolios: Array<{ __typename?: 'CryptoPortfolio', id: string, name: string, exchanges: Exchanges, tradingType: TradingType, investmentCategoryName?: string | null, latestHistoricalBalances: { __typename?: 'HistoricalCryptoBalance', changeBalance: number, changePercent: number, estimatedBalance: number }, latestAssetProfits: Array<{ __typename?: 'HistoricalAssetProfit', estimatedProfit: number, remainingQty: number, totalCostInQuoteQty: number, cryptoPortfolio: { __typename?: 'CryptoPortfolio', id: string, exchanges: Exchanges, name: string }, assetInfo: { __typename?: 'AssetInfoOutput', id: string, logo: string, lastPrice: number, symbol: string, tag: string } }>, balances: Array<{ __typename?: 'AssetBalance', id: string, balance: number, cryptoPortfolio: { __typename?: 'CryptoPortfolio', id: string, exchanges: Exchanges, name: string }, assetInfo: { __typename?: 'AssetInfoOutput', id: string, logo: string, lastPrice: number, symbol: string, tag: string } }> }> };

export type GetHistoricalAssetProfitsQueryVariables = Exact<{
  data: GetHistoricalAssetProfitInput;
  pagination: PaginationInput;
}>;


export type GetHistoricalAssetProfitsQuery = { __typename?: 'Query', getHistoricalAssetProfits: Array<{ __typename?: 'HistoricalAssetProfit', time: any, estimatedProfit: number, remainingQty: number, totalCostInQuoteQty: number }> };

export type GetHistoricalBalancesQueryVariables = Exact<{
  data: GetHistoricalBalanceInput;
  pagination: PaginationInput;
}>;


export type GetHistoricalBalancesQuery = { __typename?: 'Query', getHistoricalBalances: Array<{ __typename?: 'HistoricalCryptoBalance', time: any, estimatedBalance: number, changePercent: number, changeBalance: number }> };

export type GetAssetQueryVariables = Exact<{
  pagination: PaginationInput;
  getAssetPriceData: GetAssetPriceInput;
  getAssetProfitData: GetHistoricalAssetProfitInput;
  getAssetInfoData: GetAssetInfoInput;
}>;


export type GetAssetQuery = { __typename?: 'Query', getHistoricalAssetProfits: Array<{ __typename?: 'HistoricalAssetProfit', time: any, estimatedProfit: number, remainingQty: number, totalCostInQuoteQty: number }>, getAssetPrices: Array<{ __typename?: 'AssetPrice', open_time: any, openPrice: number, closePrice: number, highPrice: number, lowPrice: number }>, getAssetInfo: { __typename?: 'AssetInfo', logo: string, desc: string, category: string, symbol: string, name: string } };

export type NewAssetPriceSubscriptionVariables = Exact<{
  data: GetAssetPriceInput;
}>;


export type NewAssetPriceSubscription = { __typename?: 'Subscription', newAssetPrice: { __typename?: 'AssetPrice', assetInfoId: string, open_time: any, openPrice: number, closePrice: number, highPrice: number, lowPrice: number } };

export type NewHistoricalCryptoBalanceSubscriptionVariables = Exact<{
  data: GetHistoricalBalancesInput;
}>;


export type NewHistoricalCryptoBalanceSubscription = { __typename?: 'Subscription', newHistoricalCryptoBalance: { __typename?: 'HistoricalCryptoBalance', cryptoPortfolioId: string, time: any, estimatedBalance: number, changeBalance: number, changePercent: number } };

export type GetCreatePortfolioExecutionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCreatePortfolioExecutionsQuery = { __typename?: 'Query', getCreatePortfolioExecutions: Array<{ __typename?: 'CreatePortfolioExecution', id: number, userId: number, currentStep?: PortfolioCreationStep | null, currentMilestone?: PortfolioCreationMilestone | null, progressPercent: number, errorMessage?: string | null, recoveryAction?: ErrorRecoveryAction | null, retryCount: number, maxRetries: number, exchangeType?: Exchanges | null, executionContext?: any | null, createdAt: any, updatedAt: any, completedAt?: any | null }> };

export type RetryPortfolioCreationMutationVariables = Exact<{
  executionId: Scalars['Int']['input'];
}>;


export type RetryPortfolioCreationMutation = { __typename?: 'Mutation', retryPortfolioCreation: { __typename?: 'CreatePortfolioExecution', id: number, userId: number, currentStep?: PortfolioCreationStep | null, currentMilestone?: PortfolioCreationMilestone | null, progressPercent: number, errorMessage?: string | null, recoveryAction?: ErrorRecoveryAction | null, retryCount: number, maxRetries: number, exchangeType?: Exchanges | null, executionContext?: any | null, createdAt: any, updatedAt: any, completedAt?: any | null } };

export type UpdatePortfolioCredentialsMutationVariables = Exact<{
  executionId: Scalars['Int']['input'];
  credentials: UpdateCredentialsInput;
}>;


export type UpdatePortfolioCredentialsMutation = { __typename?: 'Mutation', updatePortfolioCredentials: { __typename?: 'CreatePortfolioExecution', id: number, userId: number, currentStep?: PortfolioCreationStep | null, currentMilestone?: PortfolioCreationMilestone | null, progressPercent: number, errorMessage?: string | null, recoveryAction?: ErrorRecoveryAction | null, retryCount: number, maxRetries: number, exchangeType?: Exchanges | null, executionContext?: any | null, createdAt: any, updatedAt: any, completedAt?: any | null } };

export type CreateSupportTicketMutationVariables = Exact<{
  data: CreateSupportTicketInput;
}>;


export type CreateSupportTicketMutation = { __typename?: 'Mutation', createSupportTicket: boolean };

export type OnPortfolioCreationStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnPortfolioCreationStatusSubscription = { __typename?: 'Subscription', onCreatePortfolioExecution: { __typename?: 'CreatePortfolioExecution', id: number, userId: number, currentStep?: PortfolioCreationStep | null, currentMilestone?: PortfolioCreationMilestone | null, progressPercent: number, errorMessage?: string | null, recoveryAction?: ErrorRecoveryAction | null, retryCount: number, maxRetries: number, exchangeType?: Exchanges | null, executionContext?: any | null, createdAt: any, updatedAt: any, completedAt?: any | null } };

export type ExportPortfolioMutationVariables = Exact<{
  input: ExportPortfolioInput;
}>;


export type ExportPortfolioMutation = { __typename?: 'Mutation', exportPortfolio: { __typename?: 'ExportResult', downloadUrl: string, fileName: string, mimeType: string, fileSize: number, expiresAt: any } };

export type GetTradesQueryVariables = Exact<{
  data: GetTradeInput;
}>;


export type GetTradesQuery = { __typename?: 'Query', getTrades: Array<{ __typename?: 'Trade', time: any, price: number, qty: number, quoteQty: number, commission: number, commissionAsset: string, isBuyer: boolean, cryptoPortfolio: { __typename?: 'CryptoPortfolio', id: string, name: string, exchanges: Exchanges } }> };

export type GetExpenseCategoriesQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetExpenseCategoriesQuery = { __typename?: 'Query', getExpenseCategories: Array<{ __typename?: 'ExpenseCategory', color: string, description?: string | null, name: string, id: string, countExpenses: number, totalSpentAmounts: Array<{ __typename?: 'TotalSpentAmountOutput', amount: number, month: number, year: number }>, monthlyTargets?: Array<{ __typename?: 'MonthlyTarget', month: number, year: number, target: number }> | null }> };

export type CreateExpenseCategoryMutationVariables = Exact<{
  data: CreateExpenseCategoryInput;
}>;


export type CreateExpenseCategoryMutation = { __typename?: 'Mutation', createExpenseCategory: { __typename?: 'ExpenseCategory', color: string, description?: string | null, name: string, id: string } };

export type UpdateExpenseCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateExpenseCategoryInput;
}>;


export type UpdateExpenseCategoryMutation = { __typename?: 'Mutation', updateExpenseCategory: { __typename?: 'ExpenseCategory', color: string, description?: string | null, name: string, id: string } };

export type RemoveExpenseCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveExpenseCategoryMutation = { __typename?: 'Mutation', removeExpenseCategory: { __typename?: 'ExpenseCategory', id: string } };

export type GetMonthlyTargetsQueryVariables = Exact<{
  categoryId: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMonthlyTargetsQuery = { __typename?: 'Query', getMonthlyTargets: Array<{ __typename?: 'MonthlyTarget', target: number, month: number, year: number }> };

export type CreateMonthlyTargetMutationVariables = Exact<{
  data: CreateMonthlyTargetInput;
}>;


export type CreateMonthlyTargetMutation = { __typename?: 'Mutation', createMonthlyTarget: { __typename?: 'MonthlyTarget', categoryId: string } };

export type UpdateMonthlyTargetMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateMonthlyTargetInput;
}>;


export type UpdateMonthlyTargetMutation = { __typename?: 'Mutation', updateMonthlyTarget: { __typename?: 'MonthlyTarget', categoryId: string } };

export type GetExpensesQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetExpensesQuery = { __typename?: 'Query', getExpenses: Array<{ __typename?: 'Expense', id: string, createdAt: any, description?: string | null, amount: number, name: string, category: { __typename?: 'ExpenseCategory', id: string, color: string, name: string }, transaction: { __typename?: 'BankTransaction', id: number, amount: number, spentAmount: number, description: string, createdAt: any, bank: { __typename?: 'BankAccount', name: string } } }> };

export type GetSuggestedExpensesQueryVariables = Exact<{
  data: SuggestExpenseInput;
}>;


export type GetSuggestedExpensesQuery = { __typename?: 'Query', getSuggestedExpenses: Array<{ __typename?: 'Expense', amount: number, name: string, bankTransactionId: number, categoryId: string, description?: string | null }> };

export type CreateExpenseMutationVariables = Exact<{
  data: CreateExpenseInput;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'Expense', id: string, description?: string | null, amount: number, name: string } };

export type UpdateExpenseMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateExpenseInput;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'Expense', id: string, description?: string | null, amount: number, name: string } };

export type RemoveExpenseMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RemoveExpenseMutation = { __typename?: 'Mutation', removeExpense: { __typename?: 'Expense', id: string, description?: string | null, amount: number, name: string } };

export type RemoveExpensesMutationVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type RemoveExpensesMutation = { __typename?: 'Mutation', removeExpenses: number };

export type GetDiscountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDiscountsQuery = { __typename?: 'Query', getDiscounts: Array<{ __typename?: 'MembershipDiscount', id: string, name: string, description?: string | null, code?: string | null, type: DiscountType, value: any, currencyCode?: string | null, maxAmount?: any | null, isActive: boolean, startDate?: any | null, endDate?: any | null, maxUses?: number | null, currentUses: number, maxUsesPerUser?: number | null, targetType: DiscountTargetType, createdAt: any, updatedAt: any, prices: Array<{ __typename?: 'MembershipDiscountPrice', priceId: string }>, usageHistory: Array<{ __typename?: 'MembershipDiscountUsage', discountId: string, membershipSubscriptionId: string, originalAmount: any, discountAmount: any, finalAmount: any, currencyCode: string, usedAt: any, ipAddress?: string | null, userAgent?: string | null }> }> };

export type GetDiscountQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetDiscountQuery = { __typename?: 'Query', getDiscount: { __typename?: 'MembershipDiscount', id: string, name: string, description?: string | null, code?: string | null, type: DiscountType, value: any, currencyCode?: string | null, maxAmount?: any | null, isActive: boolean, startDate?: any | null, endDate?: any | null, maxUses?: number | null, currentUses: number, maxUsesPerUser?: number | null, targetType: DiscountTargetType, createdAt: any, updatedAt: any, prices: Array<{ __typename?: 'MembershipDiscountPrice', priceId: string }>, usageHistory: Array<{ __typename?: 'MembershipDiscountUsage', discountId: string, membershipSubscriptionId: string, originalAmount: any, discountAmount: any, finalAmount: any, currencyCode: string, usedAt: any, ipAddress?: string | null, userAgent?: string | null }> } };

export type CreateDiscountMutationVariables = Exact<{
  data: CreateDiscountDto;
}>;


export type CreateDiscountMutation = { __typename?: 'Mutation', createDiscount: { __typename?: 'MembershipDiscount', id: string, name: string, description?: string | null, code?: string | null, type: DiscountType, value: any, currencyCode?: string | null, maxAmount?: any | null, isActive: boolean, startDate?: any | null, endDate?: any | null, maxUses?: number | null, currentUses: number, maxUsesPerUser?: number | null, targetType: DiscountTargetType, createdAt: any, updatedAt: any } };

export type UpdateDiscountMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateDiscountDto;
}>;


export type UpdateDiscountMutation = { __typename?: 'Mutation', updateDiscount: { __typename?: 'MembershipDiscount', id: string, name: string, description?: string | null, code?: string | null, type: DiscountType, value: any, currencyCode?: string | null, maxAmount?: any | null, isActive: boolean, startDate?: any | null, endDate?: any | null, maxUses?: number | null, currentUses: number, maxUsesPerUser?: number | null, targetType: DiscountTargetType, createdAt: any, updatedAt: any } };

export type DeleteDiscountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteDiscountMutation = { __typename?: 'Mutation', deleteDiscount: boolean };

export type ValidateDiscountCodeQueryVariables = Exact<{
  data: ValidateDiscountDto;
}>;


export type ValidateDiscountCodeQuery = { __typename?: 'Query', validateDiscountCode: { __typename?: 'DiscountValidationResult', isValid: boolean, originalAmount?: string | null, discountAmount?: string | null, finalAmount?: string | null, errorCode?: DiscountErrorCode | null, discount?: { __typename?: 'MembershipDiscount', id: string, name: string, description?: string | null, code?: string | null, type: DiscountType, value: any, currencyCode?: string | null, maxAmount?: any | null, targetType: DiscountTargetType } | null } };

export type GetDiscountsForPriceQueryVariables = Exact<{
  priceId: Scalars['String']['input'];
}>;


export type GetDiscountsForPriceQuery = { __typename?: 'Query', getDiscountsForPrice: Array<{ __typename?: 'MembershipDiscount', id: string, name: string, description?: string | null, code?: string | null, type: DiscountType, value: any, currencyCode?: string | null, maxAmount?: any | null, isActive: boolean, startDate?: any | null, endDate?: any | null, maxUses?: number | null, currentUses: number, maxUsesPerUser?: number | null, targetType: DiscountTargetType, createdAt: any, updatedAt: any }> };

export type GetFeaturesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFeaturesQuery = { __typename?: 'Query', getFeatures: Array<{ __typename?: 'Feature', id: number, name: string, type: FeatureType }> };

export type GetMyMembershipFeaturesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyMembershipFeaturesQuery = { __typename?: 'Query', myMembershipFeatures: Array<{ __typename?: 'MembershipFeature', feature: { __typename?: 'Feature', id: number, type: FeatureType, name: string } }> };

export type GetMembershipPlansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMembershipPlansQuery = { __typename?: 'Query', getMembershipPlans: Array<{ __typename?: 'MembershipPlan', id: string, name: string, description?: string | null, createdAt: any, updatedAt: any, prices: Array<{ __typename?: 'MembershipPrice', id: string, billingCycle?: { __typename?: 'TimePeriod', frequency: number, interval: Interval } | null, trialPeriod?: { __typename?: 'TimePeriod', frequency: number, interval: Interval } | null, unitPrice: { __typename?: 'UnitPrice', amount: string, currencyCode: string } }>, membershipFeatures: Array<{ __typename?: 'MembershipFeature', feature: { __typename?: 'Feature', name: string, type: FeatureType } }> }> };

export type GetMyMembershipSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyMembershipSubscriptionsQuery = { __typename?: 'Query', myMembershipSubscriptions: Array<{ __typename?: 'MembershipSubscription', id: string, userId: number, planId: string, status: MembershipSubscriptionStatus, startDate: any, endDate: any, createdAt: any, updatedAt: any, plan: { __typename?: 'MembershipPlan', id: string, name: string, description?: string | null }, paymentTransactions: Array<{ __typename?: 'PaymentTransaction', id: number, amount: any, currency: string, status: PaymentStatus, createdAt: any }> }> };

export type GetMyActiveMembershipSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyActiveMembershipSubscriptionsQuery = { __typename?: 'Query', myActiveMembershipSubscriptions: Array<{ __typename?: 'MembershipSubscription', id: string, userId: number, planId: string, status: MembershipSubscriptionStatus, startDate: any, endDate: any, createdAt: any, updatedAt: any, plan: { __typename?: 'MembershipPlan', id: string, name: string, description?: string | null } }> };

export type CancelMembershipSubscriptionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type CancelMembershipSubscriptionMutation = { __typename?: 'Mutation', cancelPaddleSubscription: { __typename?: 'MembershipSubscription', id: string, status: MembershipSubscriptionStatus, endDate: any } };

export type ReactivatePaddleSubscriptionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ReactivatePaddleSubscriptionMutation = { __typename?: 'Mutation', reactivatePaddleSubscription: { __typename?: 'MembershipSubscription', id: string, userId: number, planId: string, status: MembershipSubscriptionStatus, startDate: any, endDate: any, createdAt: any, updatedAt: any } };

export type CreateCustomerPortalSessionMutationVariables = Exact<{
  subscriptionIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateCustomerPortalSessionMutation = { __typename?: 'Mutation', createCustomerPortalSession: { __typename?: 'CustomerPortalSessionResponse', id: string, customerId: string, createdAt: string, urls: { __typename?: 'CustomerPortalUrls', general: { __typename?: 'GeneralUrl', overview: string } } } };

export type OnMembershipSubscriptionUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnMembershipSubscriptionUpdatedSubscription = { __typename?: 'Subscription', onMembershipSubscriptionUpdated: { __typename?: 'MembershipSubscription', id: string, userId: number, planId: string, status: MembershipSubscriptionStatus, startDate: any, endDate: any, createdAt: any, updatedAt: any } };

export type CreatePaymentSessionMutationVariables = Exact<{
  data: CreatePaymentSessionDto;
}>;


export type CreatePaymentSessionMutation = { __typename?: 'Mutation', createPaymentSession: { __typename?: 'PaymentSession', sessionId: string, planId: string, priceId: string, discountId?: string | null, discountAmount?: number | null, finalAmount: number, expiresAt: any } };

export type GetPaymentSessionQueryVariables = Exact<{
  data: GetPaymentSessionDto;
}>;


export type GetPaymentSessionQuery = { __typename?: 'Query', getPaymentSession: { __typename?: 'PaymentSession', sessionId: string, planId: string, priceId: string, discountId?: string | null, discountAmount?: number | null, finalAmount: number, expiresAt: any } };

export type GetPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPaymentMethodsQuery = { __typename?: 'Query', getPaymentMethods: Array<{ __typename?: 'PaymentMethod', id: number, provider: PaymentProvider, paddlePaymentMethod?: { __typename?: 'PaddlePaymentMethod', id: number, customerId: string, addressId?: string | null, businessId?: string | null } | null, metaMaskPaymentMethod?: { __typename?: 'MetaMaskPaymentMethod', id: number, walletAddress: string, ensName?: string | null } | null }> };

export type CreateMetaMaskPaymentMethodMutationVariables = Exact<{
  input: CreateMetaMaskPaymentMethodDto;
}>;


export type CreateMetaMaskPaymentMethodMutation = { __typename?: 'Mutation', createMetaMaskPaymentMethod: boolean };

export type CreateMetaMaskSubscriptionFromSessionMutationVariables = Exact<{
  input: CreateMetaMaskSubscriptionFromSessionDto;
}>;


export type CreateMetaMaskSubscriptionFromSessionMutation = { __typename?: 'Mutation', createMetaMaskSubscriptionFromSession: boolean };

export type GetCryptoPriceQueryVariables = Exact<{
  tokenSymbol: Scalars['String']['input'];
  usdAmount: Scalars['Float']['input'];
}>;


export type GetCryptoPriceQuery = { __typename?: 'Query', getCryptoPrice: { __typename?: 'CryptoPriceResult', tokenAmount: string, tokenSymbol: string, usdPrice: number } };

export type GetEventCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventCategoriesQuery = { __typename?: 'Query', getEventCategories: Array<{ __typename?: 'EventCategory', id: number, name: string, color: string }> };

export type CreateEventCategoryMutationVariables = Exact<{
  data: CreateEventCategoryInput;
}>;


export type CreateEventCategoryMutation = { __typename?: 'Mutation', createEventCategory: { __typename?: 'EventCategory', id: number, name: string, color: string } };

export type UpdateEventCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateEventCategoryInput;
}>;


export type UpdateEventCategoryMutation = { __typename?: 'Mutation', updateEventCategory: { __typename?: 'EventCategory', id: number, name: string, color: string } };

export type RemoveEventCategoryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RemoveEventCategoryMutation = { __typename?: 'Mutation', removeEventCategory: { __typename?: 'EventCategory', id: number } };

export type GetRecurrenceTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecurrenceTemplatesQuery = { __typename?: 'Query', getRecurrenceTemplates: Array<{ __typename?: 'EventRecurrence', id: number, type: RecurrenceType, interval: number, daysOfWeek?: string | null, dayOfMonth?: number | null, weekOfMonth?: number | null, dayOfWeek?: number | null, endDate?: any | null, endCount?: number | null, userId: number, createdAt: any, updatedAt: any, events: Array<{ __typename?: 'Event', id: number, name: string, description?: string | null, startDate: any, endDate: any, allDay: boolean, color?: string | null, categoryId: number, reminderMinutes?: number | null, category: { __typename?: 'EventCategory', id: number, name: string, color: string } }> }> };

export type GetRecurrenceTemplateQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetRecurrenceTemplateQuery = { __typename?: 'Query', getRecurrenceTemplate: { __typename?: 'EventRecurrence', id: number, type: RecurrenceType, interval: number, daysOfWeek?: string | null, dayOfMonth?: number | null, weekOfMonth?: number | null, dayOfWeek?: number | null, endDate?: any | null, endCount?: number | null, userId: number, createdAt: any, updatedAt: any } };

export type UpdateRecurrenceTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateEventRecurrenceInput;
}>;


export type UpdateRecurrenceTemplateMutation = { __typename?: 'Mutation', updateRecurrenceTemplate: { __typename?: 'EventRecurrence', id: number, type: RecurrenceType, interval: number, daysOfWeek?: string | null, dayOfMonth?: number | null, weekOfMonth?: number | null, dayOfWeek?: number | null, endDate?: any | null, endCount?: number | null, userId: number, createdAt: any, updatedAt: any } };

export type DeleteRecurrenceTemplateMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteRecurrenceTemplateMutation = { __typename?: 'Mutation', deleteRecurrenceTemplate: { __typename?: 'EventRecurrence', id: number } };

export type GetEventsQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetEventsQuery = { __typename?: 'Query', getEvents: Array<{ __typename?: 'Event', id: number, name: string, startDate: any, endDate: any, allDay: boolean, color?: string | null, description?: string | null, category: { __typename?: 'EventCategory', id: number, name: string, color: string }, recurrence?: { __typename?: 'EventRecurrence', type: RecurrenceType, interval: number, daysOfWeek?: string | null, dayOfMonth?: number | null, weekOfMonth?: number | null, dayOfWeek?: number | null, endDate?: any | null, endCount?: number | null } | null }> };

export type CreateEventMutationVariables = Exact<{
  data: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: number, name: string, startDate: any, endDate: any, category: { __typename?: 'EventCategory', id: number }, recurrence?: { __typename?: 'EventRecurrence', id: number } | null } };

export type UpdateEventMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdateEventInput;
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: { __typename?: 'Event', id: number, name: string, startDate: any, endDate: any } };

export type RemoveEventMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RemoveEventMutation = { __typename?: 'Mutation', removeEvent: { __typename?: 'Event', id: number } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginReqDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"otpPurpose"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const VerifyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<VerifyAccountMutation, VerifyAccountMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RefreshTokenInputDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"expiresIn"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const CreateBankAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBankAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBankAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBankAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateBankAccountMutation, CreateBankAccountMutationVariables>;
export const GetBankAccountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBankAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBankAccounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetBankAccountsQuery, GetBankAccountsQueryVariables>;
export const CreateBankManagerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBankManager"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBankManagerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBankManager"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateBankManagerMutation, CreateBankManagerMutationVariables>;
export const GetBankManagersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBankManagers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBankManagers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"autoBankManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thirdParty"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"accountName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"historicalBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetBankManagersQuery, GetBankManagersQueryVariables>;
export const CreateBankTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBankTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBankTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBankTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"bankId"}}]}}]}}]} as unknown as DocumentNode<CreateBankTransactionMutation, CreateBankTransactionMutationVariables>;
export const GetBankTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBankTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBankTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"spentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"bank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetBankTransactionsQuery, GetBankTransactionsQueryVariables>;
export const RemoveBankTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBankTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBankTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveBankTransactionMutation, RemoveBankTransactionMutationVariables>;
export const NewHistoricalAssetProfitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewHistoricalAssetProfit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newHistoricalAssetProfit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}}]}}]}}]} as unknown as DocumentNode<NewHistoricalAssetProfitSubscription, NewHistoricalAssetProfitSubscriptionVariables>;
export const CreateCryptoPortfolioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCryptoPortfolio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCryptoPortfolioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCryptoPortfolio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CreateCryptoPortfolioMutation, CreateCryptoPortfolioMutationVariables>;
export const GetCryptoPortfoliosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCryptoPortfolios"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeFrame"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCryptoPortfolios"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}},{"kind":"Field","name":{"kind":"Name","value":"tradingType"}},{"kind":"Field","name":{"kind":"Name","value":"investmentCategoryName"}},{"kind":"Field","name":{"kind":"Name","value":"latestHistoricalBalances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timeFrame"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeFrame"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestAssetProfits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCryptoPortfoliosQuery, GetCryptoPortfoliosQueryVariables>;
export const GetHistoricalAssetProfitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHistoricalAssetProfits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHistoricalAssetProfits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}}]}}]}}]} as unknown as DocumentNode<GetHistoricalAssetProfitsQuery, GetHistoricalAssetProfitsQueryVariables>;
export const GetHistoricalBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHistoricalBalances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalBalanceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHistoricalBalances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}}]}}]}}]} as unknown as DocumentNode<GetHistoricalBalancesQuery, GetHistoricalBalancesQueryVariables>;
export const GetAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAssetPriceData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetPriceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAssetProfitData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAssetInfoData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHistoricalAssetProfits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAssetProfitData"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAssetPrices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAssetPriceData"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"open_time"}},{"kind":"Field","name":{"kind":"Name","value":"openPrice"}},{"kind":"Field","name":{"kind":"Name","value":"closePrice"}},{"kind":"Field","name":{"kind":"Name","value":"highPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lowPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAssetInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAssetInfoData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetAssetQuery, GetAssetQueryVariables>;
export const NewAssetPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewAssetPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetPriceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newAssetPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetInfoId"}},{"kind":"Field","name":{"kind":"Name","value":"open_time"}},{"kind":"Field","name":{"kind":"Name","value":"openPrice"}},{"kind":"Field","name":{"kind":"Name","value":"closePrice"}},{"kind":"Field","name":{"kind":"Name","value":"highPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lowPrice"}}]}}]}}]} as unknown as DocumentNode<NewAssetPriceSubscription, NewAssetPriceSubscriptionVariables>;
export const NewHistoricalCryptoBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewHistoricalCryptoBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalBalancesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newHistoricalCryptoBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}}]}}]}}]} as unknown as DocumentNode<NewHistoricalCryptoBalanceSubscription, NewHistoricalCryptoBalanceSubscriptionVariables>;
export const GetCreatePortfolioExecutionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreatePortfolioExecutions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCreatePortfolioExecutions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"currentMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryAction"}},{"kind":"Field","name":{"kind":"Name","value":"retryCount"}},{"kind":"Field","name":{"kind":"Name","value":"maxRetries"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeType"}},{"kind":"Field","name":{"kind":"Name","value":"executionContext"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]} as unknown as DocumentNode<GetCreatePortfolioExecutionsQuery, GetCreatePortfolioExecutionsQueryVariables>;
export const RetryPortfolioCreationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RetryPortfolioCreation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"retryPortfolioCreation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"currentMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryAction"}},{"kind":"Field","name":{"kind":"Name","value":"retryCount"}},{"kind":"Field","name":{"kind":"Name","value":"maxRetries"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeType"}},{"kind":"Field","name":{"kind":"Name","value":"executionContext"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]} as unknown as DocumentNode<RetryPortfolioCreationMutation, RetryPortfolioCreationMutationVariables>;
export const UpdatePortfolioCredentialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePortfolioCredentials"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCredentialsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePortfolioCredentials"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"executionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"executionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"credentials"},"value":{"kind":"Variable","name":{"kind":"Name","value":"credentials"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"currentMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryAction"}},{"kind":"Field","name":{"kind":"Name","value":"retryCount"}},{"kind":"Field","name":{"kind":"Name","value":"maxRetries"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeType"}},{"kind":"Field","name":{"kind":"Name","value":"executionContext"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]} as unknown as DocumentNode<UpdatePortfolioCredentialsMutation, UpdatePortfolioCredentialsMutationVariables>;
export const CreateSupportTicketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSupportTicket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSupportTicketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSupportTicket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<CreateSupportTicketMutation, CreateSupportTicketMutationVariables>;
export const OnPortfolioCreationStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnPortfolioCreationStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCreatePortfolioExecution"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"currentStep"}},{"kind":"Field","name":{"kind":"Name","value":"currentMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"progressPercent"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"recoveryAction"}},{"kind":"Field","name":{"kind":"Name","value":"retryCount"}},{"kind":"Field","name":{"kind":"Name","value":"maxRetries"}},{"kind":"Field","name":{"kind":"Name","value":"exchangeType"}},{"kind":"Field","name":{"kind":"Name","value":"executionContext"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]} as unknown as DocumentNode<OnPortfolioCreationStatusSubscription, OnPortfolioCreationStatusSubscriptionVariables>;
export const ExportPortfolioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExportPortfolio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExportPortfolioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exportPortfolio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"downloadUrl"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<ExportPortfolioMutation, ExportPortfolioMutationVariables>;
export const GetTradesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrades"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetTradeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrades"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"quoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"commission"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAsset"}},{"kind":"Field","name":{"kind":"Name","value":"isBuyer"}}]}}]}}]} as unknown as DocumentNode<GetTradesQuery, GetTradesQueryVariables>;
export const GetExpenseCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpenseCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getExpenseCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"countExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpentAmounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthlyTargets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"target"}}]}}]}}]}}]} as unknown as DocumentNode<GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables>;
export const CreateExpenseCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpenseCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpenseCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateExpenseCategoryMutation, CreateExpenseCategoryMutationVariables>;
export const UpdateExpenseCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpenseCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpenseCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseCategoryMutation, UpdateExpenseCategoryMutationVariables>;
export const RemoveExpenseCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpenseCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpenseCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveExpenseCategoryMutation, RemoveExpenseCategoryMutationVariables>;
export const GetMonthlyTargetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMonthlyTargets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMonthlyTargets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]} as unknown as DocumentNode<GetMonthlyTargetsQuery, GetMonthlyTargetsQueryVariables>;
export const CreateMonthlyTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMonthlyTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMonthlyTargetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMonthlyTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}}]}}]}}]} as unknown as DocumentNode<CreateMonthlyTargetMutation, CreateMonthlyTargetMutationVariables>;
export const UpdateMonthlyTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMonthlyTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMonthlyTargetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMonthlyTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}}]}}]}}]} as unknown as DocumentNode<UpdateMonthlyTargetMutation, UpdateMonthlyTargetMutationVariables>;
export const GetExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"spentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"bank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const GetSuggestedExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSuggestedExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SuggestExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSuggestedExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bankTransactionId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetSuggestedExpensesQuery, GetSuggestedExpensesQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const RemoveExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<RemoveExpenseMutation, RemoveExpenseMutationVariables>;
export const RemoveExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<RemoveExpensesMutation, RemoveExpensesMutationVariables>;
export const GetDiscountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDiscounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDiscounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"maxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxUses"}},{"kind":"Field","name":{"kind":"Name","value":"currentUses"}},{"kind":"Field","name":{"kind":"Name","value":"maxUsesPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usageHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discountId"}},{"kind":"Field","name":{"kind":"Name","value":"membershipSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"finalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"usedAt"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}}]}}]}}]}}]} as unknown as DocumentNode<GetDiscountsQuery, GetDiscountsQueryVariables>;
export const GetDiscountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDiscount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"maxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxUses"}},{"kind":"Field","name":{"kind":"Name","value":"currentUses"}},{"kind":"Field","name":{"kind":"Name","value":"maxUsesPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priceId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usageHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discountId"}},{"kind":"Field","name":{"kind":"Name","value":"membershipSubscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"finalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"usedAt"}},{"kind":"Field","name":{"kind":"Name","value":"ipAddress"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}}]}}]}}]}}]} as unknown as DocumentNode<GetDiscountQuery, GetDiscountQueryVariables>;
export const CreateDiscountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDiscount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDiscountDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"maxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxUses"}},{"kind":"Field","name":{"kind":"Name","value":"currentUses"}},{"kind":"Field","name":{"kind":"Name","value":"maxUsesPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateDiscountMutation, CreateDiscountMutationVariables>;
export const UpdateDiscountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDiscount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDiscountDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"maxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxUses"}},{"kind":"Field","name":{"kind":"Name","value":"currentUses"}},{"kind":"Field","name":{"kind":"Name","value":"maxUsesPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateDiscountMutation, UpdateDiscountMutationVariables>;
export const DeleteDiscountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDiscount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDiscount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteDiscountMutation, DeleteDiscountMutationVariables>;
export const ValidateDiscountCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ValidateDiscountCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ValidateDiscountDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"validateDiscountCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isValid"}},{"kind":"Field","name":{"kind":"Name","value":"discount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"maxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"originalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"finalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"errorCode"}}]}}]}}]} as unknown as DocumentNode<ValidateDiscountCodeQuery, ValidateDiscountCodeQueryVariables>;
export const GetDiscountsForPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDiscountsForPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDiscountsForPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"priceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"maxAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"maxUses"}},{"kind":"Field","name":{"kind":"Name","value":"currentUses"}},{"kind":"Field","name":{"kind":"Name","value":"maxUsesPerUser"}},{"kind":"Field","name":{"kind":"Name","value":"targetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetDiscountsForPriceQuery, GetDiscountsForPriceQueryVariables>;
export const GetFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<GetFeaturesQuery, GetFeaturesQueryVariables>;
export const GetMyMembershipFeaturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyMembershipFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myMembershipFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feature"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyMembershipFeaturesQuery, GetMyMembershipFeaturesQueryVariables>;
export const GetMembershipPlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMembershipPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMembershipPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"prices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"billingCycle"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}}]}},{"kind":"Field","name":{"kind":"Name","value":"trialPeriod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"frequency"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}}]}},{"kind":"Field","name":{"kind":"Name","value":"unitPrice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"membershipFeatures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feature"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMembershipPlansQuery, GetMembershipPlansQueryVariables>;
export const GetMyMembershipSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyMembershipSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myMembershipSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paymentTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyMembershipSubscriptionsQuery, GetMyMembershipSubscriptionsQueryVariables>;
export const GetMyActiveMembershipSubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyActiveMembershipSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myActiveMembershipSubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetMyActiveMembershipSubscriptionsQuery, GetMyActiveMembershipSubscriptionsQueryVariables>;
export const CancelMembershipSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelMembershipSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelPaddleSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<CancelMembershipSubscriptionMutation, CancelMembershipSubscriptionMutationVariables>;
export const ReactivatePaddleSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReactivatePaddleSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reactivatePaddleSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ReactivatePaddleSubscriptionMutation, ReactivatePaddleSubscriptionMutationVariables>;
export const CreateCustomerPortalSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomerPortalSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionIds"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomerPortalSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"subscriptionIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subscriptionIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"general"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"overview"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateCustomerPortalSessionMutation, CreateCustomerPortalSessionMutationVariables>;
export const OnMembershipSubscriptionUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnMembershipSubscriptionUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onMembershipSubscriptionUpdated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<OnMembershipSubscriptionUpdatedSubscription, OnMembershipSubscriptionUpdatedSubscriptionVariables>;
export const CreatePaymentSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePaymentSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePaymentSessionDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPaymentSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"priceId"}},{"kind":"Field","name":{"kind":"Name","value":"discountId"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"finalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<CreatePaymentSessionMutation, CreatePaymentSessionMutationVariables>;
export const GetPaymentSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetPaymentSessionDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPaymentSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessionId"}},{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"priceId"}},{"kind":"Field","name":{"kind":"Name","value":"discountId"}},{"kind":"Field","name":{"kind":"Name","value":"discountAmount"}},{"kind":"Field","name":{"kind":"Name","value":"finalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<GetPaymentSessionQuery, GetPaymentSessionQueryVariables>;
export const GetPaymentMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getPaymentMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"paddlePaymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerId"}},{"kind":"Field","name":{"kind":"Name","value":"addressId"}},{"kind":"Field","name":{"kind":"Name","value":"businessId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metaMaskPaymentMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"walletAddress"}},{"kind":"Field","name":{"kind":"Name","value":"ensName"}}]}}]}}]}}]} as unknown as DocumentNode<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>;
export const CreateMetaMaskPaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMetaMaskPaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMetaMaskPaymentMethodDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMetaMaskPaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateMetaMaskPaymentMethodMutation, CreateMetaMaskPaymentMethodMutationVariables>;
export const CreateMetaMaskSubscriptionFromSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMetaMaskSubscriptionFromSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMetaMaskSubscriptionFromSessionDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMetaMaskSubscriptionFromSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateMetaMaskSubscriptionFromSessionMutation, CreateMetaMaskSubscriptionFromSessionMutationVariables>;
export const GetCryptoPriceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCryptoPrice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tokenSymbol"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"usdAmount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCryptoPrice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"tokenSymbol"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tokenSymbol"}}},{"kind":"Argument","name":{"kind":"Name","value":"usdAmount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"usdAmount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenAmount"}},{"kind":"Field","name":{"kind":"Name","value":"tokenSymbol"}},{"kind":"Field","name":{"kind":"Name","value":"usdPrice"}}]}}]}}]} as unknown as DocumentNode<GetCryptoPriceQuery, GetCryptoPriceQueryVariables>;
export const GetEventCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEventCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEventCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<GetEventCategoriesQuery, GetEventCategoriesQueryVariables>;
export const CreateEventCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEventCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEventCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<CreateEventCategoryMutation, CreateEventCategoryMutationVariables>;
export const UpdateEventCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEventCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEventCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UpdateEventCategoryMutation, UpdateEventCategoryMutationVariables>;
export const RemoveEventCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveEventCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeEventCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveEventCategoryMutation, RemoveEventCategoryMutationVariables>;
export const GetRecurrenceTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecurrenceTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRecurrenceTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"daysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"weekOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"endCount"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"allDay"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"reminderMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetRecurrenceTemplatesQuery, GetRecurrenceTemplatesQueryVariables>;
export const GetRecurrenceTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRecurrenceTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRecurrenceTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"daysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"weekOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"endCount"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetRecurrenceTemplateQuery, GetRecurrenceTemplateQueryVariables>;
export const UpdateRecurrenceTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRecurrenceTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventRecurrenceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateRecurrenceTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"daysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"weekOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"endCount"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateRecurrenceTemplateMutation, UpdateRecurrenceTemplateMutationVariables>;
export const DeleteRecurrenceTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRecurrenceTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteRecurrenceTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteRecurrenceTemplateMutation, DeleteRecurrenceTemplateMutationVariables>;
export const GetEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getEvents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"allDay"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"daysOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"weekOfMonth"}},{"kind":"Field","name":{"kind":"Name","value":"dayOfWeek"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"endCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"recurrence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const UpdateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<UpdateEventMutation, UpdateEventMutationVariables>;
export const RemoveEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveEventMutation, RemoveEventMutationVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** An arbitrary-precision Decimal type */
  Decimal: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AssetBalance = {
  __typename?: 'AssetBalance';
  assetInfo: AssetInfoOutput;
  assetInfoId: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  locked: Scalars['Float']['output'];
};

export type AssetInfo = {
  __typename?: 'AssetInfo';
  assetBalances?: Maybe<Array<AssetBalance>>;
  assetPrices?: Maybe<Array<AssetPrice>>;
  category: Scalars['String']['output'];
  desc: Scalars['String']['output'];
  historicalProfits?: Maybe<Array<HistoricalAssetProfit>>;
  id: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  trades?: Maybe<Array<Trade>>;
};

export type AssetInfoOutput = {
  __typename?: 'AssetInfoOutput';
  category: Scalars['String']['output'];
  desc: Scalars['String']['output'];
  historicalProfits?: Maybe<Array<HistoricalAssetProfit>>;
  id: Scalars['String']['output'];
  lastPrice: Scalars['Float']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  trades?: Maybe<Array<Trade>>;
};

export type AssetPrice = {
  __typename?: 'AssetPrice';
  assetInfo: AssetInfo;
  assetInfoId: Scalars['String']['output'];
  closePrice: Scalars['Float']['output'];
  close_time: Scalars['DateTime']['output'];
  highPrice: Scalars['Float']['output'];
  interval: Scalars['String']['output'];
  lowPrice: Scalars['Float']['output'];
  openPrice: Scalars['Float']['output'];
  open_time: Scalars['DateTime']['output'];
  volume: Scalars['Float']['output'];
};

export type AutoBankManager = {
  __typename?: 'AutoBankManager';
  apiKey: Scalars['String']['output'];
  bankManager: BankManager;
  bankManagerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  thirdParty: AutoBankManagerThirdParty;
};

export enum AutoBankManagerThirdParty {
  Casso = 'CASSO'
}

export type BankAccount = {
  __typename?: 'BankAccount';
  accountName: Scalars['String']['output'];
  accountNumber: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  bankManager: BankManager;
  bankManagerId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fullName: Scalars['String']['output'];
  historicalBalances?: Maybe<Array<HistoricalBankBalance>>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  transactions: Array<BankTransaction>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BankManager = {
  __typename?: 'BankManager';
  autoBankManager?: Maybe<AutoBankManager>;
  banks: Array<BankAccount>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type BankTransaction = {
  __typename?: 'BankTransaction';
  amount: Scalars['Float']['output'];
  bank: BankAccount;
  bankId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  expense?: Maybe<Array<Expense>>;
  id: Scalars['Int']['output'];
  spentAmount: Scalars['Float']['output'];
};

export type CreateAutoBankManagerInput = {
  apiKey: Scalars['String']['input'];
  thirdParty?: AutoBankManagerThirdParty;
};

export type CreateBankAccountInput = {
  accountName: Scalars['String']['input'];
  accountNumber: Scalars['String']['input'];
  balance: Scalars['Float']['input'];
  bankManagerId: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateBankManagerInput = {
  autoBankManager?: InputMaybe<CreateAutoBankManagerInput>;
  name: Scalars['String']['input'];
};

export type CreateBankTransactionInput = {
  amount: Scalars['Float']['input'];
  bankId: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type CreateCryptoPortfolioInput = {
  apiKey: Scalars['String']['input'];
  exchanges?: Exchanges;
  name?: Scalars['String']['input'];
  passphrase?: InputMaybe<Scalars['String']['input']>;
  secretKey: Scalars['String']['input'];
};

export type CreateCryptoRes = {
  __typename?: 'CreateCryptoRes';
  userId: Scalars['Float']['output'];
};

export type CreateDiscountDto = {
  code?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isActive?: Scalars['Boolean']['input'];
  isRecurring?: Scalars['Boolean']['input'];
  maxAmount?: InputMaybe<Scalars['String']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  maxUsesPerUser?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['String']['input']>;
  targetType?: DiscountTargetType;
  type: DiscountType;
  value: Scalars['String']['input'];
};

export type CreateEventCategoryInput = {
  color: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateEventInput = {
  allDay?: Scalars['Boolean']['input'];
  categoryId: Scalars['Int']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  name: Scalars['String']['input'];
  recurrence?: InputMaybe<CreateRecurrenceInput>;
  recurrenceId?: InputMaybe<Scalars['Int']['input']>;
  reminderMinutes?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['DateTime']['input'];
};

export type CreateExpenseCategoryInput = {
  color: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  bankTransactionId: Scalars['Int']['input'];
  categoryId: Scalars['String']['input'];
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateFeatureDto = {
  name?: Scalars['String']['input'];
  type: FeatureType;
};

export type CreateMetaMaskPaymentMethodDto = {
  ensName?: InputMaybe<Scalars['String']['input']>;
  walletAddress: Scalars['String']['input'];
};

export type CreateMetaMaskSubscriptionFromSessionDto = {
  blockNumber?: InputMaybe<Scalars['Int']['input']>;
  gasPrice?: InputMaybe<Scalars['String']['input']>;
  gasUsed?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
  tokenAddress?: InputMaybe<Scalars['String']['input']>;
  tokenSymbol: Scalars['String']['input'];
  transactionHash: Scalars['String']['input'];
};

export type CreateMonthlyTargetInput = {
  categoryId: Scalars['String']['input'];
  month: Scalars['Int']['input'];
  target: Scalars['Float']['input'];
  year: Scalars['Int']['input'];
};

export type CreatePaymentSessionDto = {
  discountId?: InputMaybe<Scalars['String']['input']>;
  planId: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
};

export type CreatePlanDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  featureIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  name: Scalars['String']['input'];
};

export type CreatePortfolioExecution = {
  __typename?: 'CreatePortfolioExecution';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currentMilestone?: Maybe<PortfolioCreationMilestone>;
  currentStep?: Maybe<PortfolioCreationStep>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  exchangeType?: Maybe<Exchanges>;
  executionContext?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  maxRetries: Scalars['Int']['output'];
  progressPercent: Scalars['Int']['output'];
  recoveryAction?: Maybe<ErrorRecoveryAction>;
  retryCount: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type CreatePriceDto = {
  billingCycle?: InputMaybe<TimePeriodInput>;
  planId: Scalars['String']['input'];
  status?: Scalars['String']['input'];
  trialPeriod?: InputMaybe<TimePeriodInput>;
  unitPrice: UnitPriceInput;
};

export type CreateRecurrenceInput = {
  dayOfMonth?: InputMaybe<Scalars['Int']['input']>;
  dayOfWeek?: InputMaybe<Scalars['Int']['input']>;
  daysOfWeek?: InputMaybe<Scalars['String']['input']>;
  endCount?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  interval?: Scalars['Int']['input'];
  type: RecurrenceType;
  weekOfMonth?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateSubscriptionDto = {
  endDate: Scalars['DateTime']['input'];
  planId: Scalars['String']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateSupportTicketInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  executionId: Scalars['Int']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  otp?: InputMaybe<Scalars['String']['input']>;
  otpPurpose?: InputMaybe<OtpPurpose>;
  password: Scalars['String']['input'];
};

export type CryptoPortfolio = {
  __typename?: 'CryptoPortfolio';
  apiKey: Scalars['String']['output'];
  balances: Array<AssetBalance>;
  childPortfolios?: Maybe<Array<CryptoPortfolio>>;
  exchanges: Exchanges;
  historicalAssetProfits?: Maybe<Array<HistoricalAssetProfit>>;
  historicalBalances?: Maybe<Array<HistoricalCryptoBalance>>;
  id: Scalars['String']['output'];
  investmentCategoryName?: Maybe<Scalars['String']['output']>;
  latestAssetProfits: Array<HistoricalAssetProfit>;
  latestHistoricalBalances: HistoricalCryptoBalance;
  name: Scalars['String']['output'];
  parentPortfolio?: Maybe<CryptoPortfolio>;
  parentPortfolioId?: Maybe<Scalars['String']['output']>;
  passphrasePortfolio?: Maybe<PassphraseCryptoPortfolio>;
  secretKey: Scalars['String']['output'];
  status: PortfolioStatus;
  trades?: Maybe<Array<Trade>>;
  tradingType: TradingType;
  updateTime?: Maybe<Scalars['DateTime']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};


export type CryptoPortfolioLatestHistoricalBalancesArgs = {
  timeFrame: Scalars['String']['input'];
};

export type CryptoPriceResult = {
  __typename?: 'CryptoPriceResult';
  tokenAmount: Scalars['String']['output'];
  tokenSymbol: Scalars['String']['output'];
  usdPrice: Scalars['Float']['output'];
};

export type CustomerPortalSessionResponse = {
  __typename?: 'CustomerPortalSessionResponse';
  createdAt: Scalars['String']['output'];
  customerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  urls: CustomerPortalUrls;
};

export type CustomerPortalUrls = {
  __typename?: 'CustomerPortalUrls';
  general: GeneralUrl;
};

export enum DiscountErrorCode {
  AlreadyApplied = 'ALREADY_APPLIED',
  DiscountExhausted = 'DISCOUNT_EXHAUSTED',
  DiscountExpired = 'DISCOUNT_EXPIRED',
  DiscountInactive = 'DISCOUNT_INACTIVE',
  DiscountNotApplicable = 'DISCOUNT_NOT_APPLICABLE',
  DiscountNotFound = 'DISCOUNT_NOT_FOUND',
  InvalidCurrency = 'INVALID_CURRENCY',
  UsageLimitReached = 'USAGE_LIMIT_REACHED',
  UserLimitExceeded = 'USER_LIMIT_EXCEEDED',
  UserUsageLimitReached = 'USER_USAGE_LIMIT_REACHED',
  ValidationError = 'VALIDATION_ERROR'
}

export enum DiscountTargetType {
  FirstTimeUser = 'FIRST_TIME_USER',
  PriceSpecific = 'PRICE_SPECIFIC'
}

export enum DiscountType {
  FixedAmount = 'FIXED_AMOUNT',
  FreeTrial = 'FREE_TRIAL',
  Percentage = 'PERCENTAGE'
}

export type DiscountValidationResult = {
  __typename?: 'DiscountValidationResult';
  discount?: Maybe<MembershipDiscount>;
  discountAmount?: Maybe<Scalars['String']['output']>;
  errorCode?: Maybe<DiscountErrorCode>;
  finalAmount?: Maybe<Scalars['String']['output']>;
  isValid: Scalars['Boolean']['output'];
  originalAmount?: Maybe<Scalars['String']['output']>;
};

export enum ErrorRecoveryAction {
  Abort = 'ABORT',
  CheckPermissions = 'CHECK_PERMISSIONS',
  ContactSupport = 'CONTACT_SUPPORT',
  RetryAutomatic = 'RETRY_AUTOMATIC',
  RetryManual = 'RETRY_MANUAL',
  UpdateCredentials = 'UPDATE_CREDENTIALS',
  WaitRateLimit = 'WAIT_RATE_LIMIT'
}

export type Event = {
  __typename?: 'Event';
  allDay: Scalars['Boolean']['output'];
  category: EventCategory;
  categoryId: Scalars['Int']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  recurrence?: Maybe<EventRecurrence>;
  recurrenceId?: Maybe<Scalars['Int']['output']>;
  reminderMinutes?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['DateTime']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type EventCategory = {
  __typename?: 'EventCategory';
  color: Scalars['String']['output'];
  events?: Maybe<Array<Event>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type EventRecurrence = {
  __typename?: 'EventRecurrence';
  createdAt: Scalars['DateTime']['output'];
  dayOfMonth?: Maybe<Scalars['Int']['output']>;
  dayOfWeek?: Maybe<Scalars['Int']['output']>;
  daysOfWeek?: Maybe<Scalars['String']['output']>;
  endCount?: Maybe<Scalars['Int']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  events: Array<Event>;
  id: Scalars['Int']['output'];
  interval: Scalars['Int']['output'];
  type: RecurrenceType;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
  weekOfMonth?: Maybe<Scalars['Int']['output']>;
};

export enum Exchanges {
  All = 'ALL',
  Alpaca = 'ALPACA',
  Apex = 'APEX',
  Ascendex = 'ASCENDEX',
  Bequant = 'BEQUANT',
  Bigone = 'BIGONE',
  Binance = 'BINANCE',
  Binancecoinm = 'BINANCECOINM',
  Binanceus = 'BINANCEUS',
  Binanceusdm = 'BINANCEUSDM',
  Bingx = 'BINGX',
  Bit2C = 'BIT2C',
  Bitbank = 'BITBANK',
  Bitbns = 'BITBNS',
  Bitfinex = 'BITFINEX',
  Bitflyer = 'BITFLYER',
  Bitget = 'BITGET',
  Bithumb = 'BITHUMB',
  Bitmart = 'BITMART',
  Bitmex = 'BITMEX',
  Bitopro = 'BITOPRO',
  Bitrue = 'BITRUE',
  Bitso = 'BITSO',
  Bitstamp = 'BITSTAMP',
  Bitteam = 'BITTEAM',
  Bitvavo = 'BITVAVO',
  Bl3P = 'BL3P',
  Blockchaincom = 'BLOCKCHAINCOM',
  Blofin = 'BLOFIN',
  Btcalpha = 'BTCALPHA',
  Btcbox = 'BTCBOX',
  Btcmarkets = 'BTCMARKETS',
  Btcturk = 'BTCTURK',
  Bybit = 'BYBIT',
  Cex = 'CEX',
  Coinbase = 'COINBASE',
  Coinbaseexchange = 'COINBASEEXCHANGE',
  Coinbaseinternational = 'COINBASEINTERNATIONAL',
  Coincatch = 'COINCATCH',
  Coincheck = 'COINCHECK',
  Coinex = 'COINEX',
  Coinlist = 'COINLIST',
  Coinmate = 'COINMATE',
  Coinmetro = 'COINMETRO',
  Coinone = 'COINONE',
  Coinsph = 'COINSPH',
  Coinspot = 'COINSPOT',
  Cryptocom = 'CRYPTOCOM',
  Cryptomus = 'CRYPTOMUS',
  Defx = 'DEFX',
  Delta = 'DELTA',
  Deribit = 'DERIBIT',
  Derive = 'DERIVE',
  Digifinex = 'DIGIFINEX',
  Ellipx = 'ELLIPX',
  Exmo = 'EXMO',
  Fmfwio = 'FMFWIO',
  Gate = 'GATE',
  Gemini = 'GEMINI',
  Hashkey = 'HASHKEY',
  Hitbtc = 'HITBTC',
  Hollaex = 'HOLLAEX',
  Htx = 'HTX',
  Huobi = 'HUOBI',
  Huobijp = 'HUOBIJP',
  HuobiLegacy = 'HUOBI_LEGACY',
  Hyperliquid = 'HYPERLIQUID',
  Idex = 'IDEX',
  Independentreserve = 'INDEPENDENTRESERVE',
  Indodax = 'INDODAX',
  Kraken = 'KRAKEN',
  Krakenfutures = 'KRAKENFUTURES',
  Kucoin = 'KUCOIN',
  Kucoinfutures = 'KUCOINFUTURES',
  Kuna = 'KUNA',
  Latoken = 'LATOKEN',
  Lbank = 'LBANK',
  Luno = 'LUNO',
  Mercado = 'MERCADO',
  Mexc = 'MEXC',
  Mexc3 = 'MEXC3',
  Modetrade = 'MODETRADE',
  Myokx = 'MYOKX',
  Ndax = 'NDAX',
  Novadax = 'NOVADAX',
  Oceanex = 'OCEANEX',
  Okcoin = 'OKCOIN',
  Okx = 'OKX',
  Okxus = 'OKXUS',
  Onetrading = 'ONETRADING',
  Oxfun = 'OXFUN',
  P2B = 'P2B',
  Paradex = 'PARADEX',
  Paymium = 'PAYMIUM',
  Phemex = 'PHEMEX',
  Poloniex = 'POLONIEX',
  Probit = 'PROBIT',
  Timex = 'TIMEX',
  Tokocrypto = 'TOKOCRYPTO',
  Tradeogre = 'TRADEOGRE',
  Upbit = 'UPBIT',
  Vertex = 'VERTEX',
  Wavesexchange = 'WAVESEXCHANGE',
  Whitebit = 'WHITEBIT',
  Woo = 'WOO',
  Woofipro = 'WOOFIPRO',
  WoofiproDex = 'WOOFIPRO_DEX',
  Xt = 'XT',
  Yobit = 'YOBIT',
  Zaif = 'ZAIF',
  Zonda = 'ZONDA'
}

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float']['output'];
  bankTransaction: BankTransaction;
  bankTransactionId: Scalars['Int']['output'];
  category: ExpenseCategory;
  categoryId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  transaction: BankTransaction;
  user: User;
  userId: Scalars['Int']['output'];
};

export type ExpenseCategory = {
  __typename?: 'ExpenseCategory';
  color: Scalars['String']['output'];
  countExpenses: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['String']['output'];
  monthlyTargets?: Maybe<Array<MonthlyTarget>>;
  name: Scalars['String']['output'];
  totalSpentAmounts: Array<TotalSpentAmountOutput>;
  user: User;
  userId: Scalars['Int']['output'];
};


export type ExpenseCategoryMonthlyTargetsArgs = {
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type ExpenseCategoryTotalSpentAmountsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Available export formats for portfolio analysis */
export enum ExportFormat {
  Csv = 'CSV',
  Excel = 'EXCEL',
  Pdf = 'PDF'
}

export type ExportPortfolioInput = {
  format: ExportFormat;
  includeCharts?: Scalars['Boolean']['input'];
  includeSummary?: Scalars['Boolean']['input'];
  portfolioId: Scalars['String']['input'];
  portfolioName?: InputMaybe<Scalars['String']['input']>;
};

export type ExportResult = {
  __typename?: 'ExportResult';
  downloadUrl: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Float']['output'];
  mimeType: Scalars['String']['output'];
};

export type Feature = {
  __typename?: 'Feature';
  id: Scalars['Int']['output'];
  membershipFeatures?: Maybe<Array<MembershipFeature>>;
  name: Scalars['String']['output'];
  type: FeatureType;
};

export enum FeatureType {
  Crypto = 'CRYPTO',
  Expense = 'EXPENSE'
}

export type GeneralUrl = {
  __typename?: 'GeneralUrl';
  overview: Scalars['String']['output'];
};

export type GetAssetInfoInput = {
  id: Scalars['String']['input'];
};

export type GetAssetPriceInput = {
  assetInfoId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetHistoricalAssetProfitInput = {
  assetInfoId: Scalars['String']['input'];
  cryptoPortfolioId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetHistoricalBalanceInput = {
  cryptoPortfolioId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetHistoricalBalancesInput = {
  cryptoPortfolioIds: Array<Scalars['String']['input']>;
  timeFrame: Scalars['String']['input'];
};

export type GetPaymentMethodDto = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type GetPaymentSessionDto = {
  sessionId: Scalars['String']['input'];
};

export type GetTradeInput = {
  assetInfoId?: InputMaybe<Scalars['String']['input']>;
  cryptoPortfolioId?: InputMaybe<Scalars['String']['input']>;
};

export type HistoricalAssetProfit = {
  __typename?: 'HistoricalAssetProfit';
  assetInfo: AssetInfoOutput;
  assetInfoId: Scalars['String']['output'];
  averageCostBasis?: Maybe<Scalars['Float']['output']>;
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  currentPrice?: Maybe<Scalars['Float']['output']>;
  estimatedProfit: Scalars['Float']['output'];
  holdingPeriodDays?: Maybe<Scalars['Int']['output']>;
  percentageGain?: Maybe<Scalars['Float']['output']>;
  realizedPnl?: Maybe<Scalars['Float']['output']>;
  remainingQty: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
  totalCostInQuoteQty: Scalars['Float']['output'];
  totalPnl?: Maybe<Scalars['Float']['output']>;
  unrealizedPnl?: Maybe<Scalars['Float']['output']>;
};

export type HistoricalBankBalance = {
  __typename?: 'HistoricalBankBalance';
  balance: Scalars['Float']['output'];
  bankAccount: BankAccount;
  bankAccountId: Scalars['String']['output'];
  time: Scalars['DateTime']['output'];
};

export type HistoricalCryptoBalance = {
  __typename?: 'HistoricalCryptoBalance';
  assetCount?: Maybe<Scalars['Int']['output']>;
  changeBalance: Scalars['Float']['output'];
  changePercent: Scalars['Float']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  diversificationScore?: Maybe<Scalars['Float']['output']>;
  estimatedBalance: Scalars['Float']['output'];
  riskScore?: Maybe<Scalars['Float']['output']>;
  time: Scalars['DateTime']['output'];
  totalPnl?: Maybe<Scalars['Float']['output']>;
  totalRealizedPnl?: Maybe<Scalars['Float']['output']>;
  totalUnrealizedPnl?: Maybe<Scalars['Float']['output']>;
  totalValue?: Maybe<Scalars['Float']['output']>;
};

export enum Interval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export type LoginReqDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResDto = {
  __typename?: 'LoginResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type MembershipDiscount = {
  __typename?: 'MembershipDiscount';
  code?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode?: Maybe<Scalars['String']['output']>;
  currentUses: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  maxAmount?: Maybe<Scalars['Decimal']['output']>;
  maxUses?: Maybe<Scalars['Int']['output']>;
  maxUsesPerUser?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  prices: Array<MembershipDiscountPrice>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  targetType: DiscountTargetType;
  type: DiscountType;
  updatedAt: Scalars['DateTime']['output'];
  usageHistory: Array<MembershipDiscountUsage>;
  value: Scalars['Decimal']['output'];
};

export type MembershipDiscountPrice = {
  __typename?: 'MembershipDiscountPrice';
  discount: MembershipDiscount;
  discountId: Scalars['String']['output'];
  price: MembershipPrice;
  priceId: Scalars['String']['output'];
};

export type MembershipDiscountUsage = {
  __typename?: 'MembershipDiscountUsage';
  currencyCode: Scalars['String']['output'];
  discount: MembershipDiscount;
  discountAmount: Scalars['Decimal']['output'];
  discountId: Scalars['String']['output'];
  finalAmount: Scalars['Decimal']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  membershipSubscription: MembershipSubscription;
  membershipSubscriptionId: Scalars['String']['output'];
  originalAmount: Scalars['Decimal']['output'];
  usedAt: Scalars['DateTime']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type MembershipFeature = {
  __typename?: 'MembershipFeature';
  feature: Feature;
  featureId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  plan: MembershipPlan;
  planId: Scalars['String']['output'];
};

export type MembershipPlan = {
  __typename?: 'MembershipPlan';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  membershipFeatures: Array<MembershipFeature>;
  name: Scalars['String']['output'];
  prices: Array<MembershipPrice>;
  subscriptions?: Maybe<Array<MembershipSubscription>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type MembershipPrice = {
  __typename?: 'MembershipPrice';
  billingCycle?: Maybe<TimePeriod>;
  billingCycleId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  discounts?: Maybe<Array<MembershipDiscountPrice>>;
  id: Scalars['String']['output'];
  plan: MembershipPlan;
  planId: Scalars['String']['output'];
  status: PriceStatus;
  trialPeriod?: Maybe<TimePeriod>;
  trialPeriodId?: Maybe<Scalars['Int']['output']>;
  unitPrice: UnitPrice;
  unitPriceId: Scalars['Int']['output'];
};

export type MembershipSubscription = {
  __typename?: 'MembershipSubscription';
  createdAt: Scalars['DateTime']['output'];
  discountUsages?: Maybe<Array<MembershipDiscountUsage>>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  paymentTransactions: Array<PaymentTransaction>;
  plan: MembershipPlan;
  planId: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  status: MembershipSubscriptionStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export enum MembershipSubscriptionStatus {
  Active = 'active',
  Canceled = 'canceled',
  PastDue = 'past_due',
  Paused = 'paused',
  Trialing = 'trialing'
}

export type MetaMaskPaymentMethod = {
  __typename?: 'MetaMaskPaymentMethod';
  ensName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  paymentMethod: PaymentMethod;
  paymentMethodId: Scalars['Int']['output'];
  walletAddress: Scalars['String']['output'];
};

export type MetaMaskPaymentTransaction = {
  __typename?: 'MetaMaskPaymentTransaction';
  blockNumber?: Maybe<Scalars['Int']['output']>;
  gasPrice?: Maybe<Scalars['String']['output']>;
  gasUsed?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  paymentTransaction: PaymentTransaction;
  paymentTransactionId: Scalars['Int']['output'];
  tokenAddress?: Maybe<Scalars['String']['output']>;
  tokenSymbol: Scalars['String']['output'];
  transactionHash: Scalars['String']['output'];
};

export type MonthlyTarget = {
  __typename?: 'MonthlyTarget';
  category: ExpenseCategory;
  categoryId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  month: Scalars['Int']['output'];
  target: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelPaddleSubscription: MembershipSubscription;
  createBankAccount: BankAccount;
  createBankManager: BankManager;
  createBankTransaction: BankTransaction;
  createCryptoPortfolio: CreateCryptoRes;
  createCustomerPortalSession: CustomerPortalSessionResponse;
  createDiscount: MembershipDiscount;
  createEvent: Event;
  createEventCategory: EventCategory;
  createExpense: Expense;
  createExpenseCategory: ExpenseCategory;
  createFeature: Feature;
  createMembershipPlan: MembershipPlan;
  createMembershipPrice: MembershipPrice;
  createMembershipSubscription: MembershipSubscription;
  createMetaMaskPaymentMethod: Scalars['Boolean']['output'];
  createMetaMaskSubscriptionFromSession: Scalars['Boolean']['output'];
  createMonthlyTarget: MonthlyTarget;
  createPaymentSession: PaymentSession;
  createSupportTicket: Scalars['Boolean']['output'];
  deleteDiscount: Scalars['Boolean']['output'];
  deleteFeature: Feature;
  deleteMembershipPlan: Scalars['Boolean']['output'];
  deleteMembershipPrice: Scalars['Boolean']['output'];
  deleteRecurrenceTemplate: EventRecurrence;
  exportPortfolio: ExportResult;
  linkDiscountToPrice: Scalars['Boolean']['output'];
  login: LoginResDto;
  logout: Scalars['Boolean']['output'];
  reactivatePaddleSubscription: MembershipSubscription;
  refreshToken: RefreshTokenResponseDto;
  removeBankTransaction: BankTransaction;
  removeEvent: Event;
  removeEventCategory: EventCategory;
  removeExpense: Expense;
  removeExpenseCategory: ExpenseCategory;
  removeExpenses: Scalars['Int']['output'];
  retryPortfolioCreation: CreatePortfolioExecution;
  signup: SignupResDto;
  unlinkDiscountFromPrice: Scalars['Boolean']['output'];
  updateDiscount: MembershipDiscount;
  updateEvent: Event;
  updateEventCategory: EventCategory;
  updateExpense: Expense;
  updateExpenseCategory: ExpenseCategory;
  updateFeature: Feature;
  updateMembershipPlan: MembershipPlan;
  updateMembershipPrice: MembershipPrice;
  updateMembershipSubscription: MembershipSubscription;
  updateMonthlyTarget: MonthlyTarget;
  updatePortfolioCredentials: CreatePortfolioExecution;
  updateRecurrenceTemplate: EventRecurrence;
  verifyAccount: LoginResDto;
};


export type MutationCancelPaddleSubscriptionArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateBankAccountArgs = {
  data: CreateBankAccountInput;
};


export type MutationCreateBankManagerArgs = {
  data: CreateBankManagerInput;
};


export type MutationCreateBankTransactionArgs = {
  data: CreateBankTransactionInput;
};


export type MutationCreateCryptoPortfolioArgs = {
  data: CreateCryptoPortfolioInput;
};


export type MutationCreateCustomerPortalSessionArgs = {
  subscriptionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationCreateDiscountArgs = {
  data: CreateDiscountDto;
};


export type MutationCreateEventArgs = {
  data: CreateEventInput;
};


export type MutationCreateEventCategoryArgs = {
  data: CreateEventCategoryInput;
};


export type MutationCreateExpenseArgs = {
  data: CreateExpenseInput;
};


export type MutationCreateExpenseCategoryArgs = {
  data: CreateExpenseCategoryInput;
};


export type MutationCreateFeatureArgs = {
  data: CreateFeatureDto;
};


export type MutationCreateMembershipPlanArgs = {
  data: CreatePlanDto;
};


export type MutationCreateMembershipPriceArgs = {
  data: CreatePriceDto;
};


export type MutationCreateMembershipSubscriptionArgs = {
  data: CreateSubscriptionDto;
};


export type MutationCreateMetaMaskPaymentMethodArgs = {
  input: CreateMetaMaskPaymentMethodDto;
};


export type MutationCreateMetaMaskSubscriptionFromSessionArgs = {
  input: CreateMetaMaskSubscriptionFromSessionDto;
};


export type MutationCreateMonthlyTargetArgs = {
  data: CreateMonthlyTargetInput;
};


export type MutationCreatePaymentSessionArgs = {
  data: CreatePaymentSessionDto;
};


export type MutationCreateSupportTicketArgs = {
  data: CreateSupportTicketInput;
};


export type MutationDeleteDiscountArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFeatureArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteMembershipPlanArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMembershipPriceArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRecurrenceTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type MutationExportPortfolioArgs = {
  input: ExportPortfolioInput;
};


export type MutationLinkDiscountToPriceArgs = {
  discountId: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: LoginReqDto;
};


export type MutationReactivatePaddleSubscriptionArgs = {
  handlePastDueTransactions?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  data: RefreshTokenInputDto;
};


export type MutationRemoveBankTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveEventArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveEventCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveExpenseArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveExpenseCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveExpensesArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type MutationRetryPortfolioCreationArgs = {
  executionId: Scalars['Int']['input'];
};


export type MutationSignupArgs = {
  data: CreateUserInput;
};


export type MutationUnlinkDiscountFromPriceArgs = {
  discountId: Scalars['String']['input'];
  priceId: Scalars['String']['input'];
};


export type MutationUpdateDiscountArgs = {
  data: UpdateDiscountDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateEventArgs = {
  data: UpdateEventInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateEventCategoryArgs = {
  data: UpdateEventCategoryInput;
  id: Scalars['Int']['input'];
};


export type MutationUpdateExpenseArgs = {
  data: UpdateExpenseInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateExpenseCategoryArgs = {
  data: UpdateExpenseCategoryInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateFeatureArgs = {
  data: UpdateFeatureDto;
  id: Scalars['Int']['input'];
};


export type MutationUpdateMembershipPlanArgs = {
  data: UpdatePlanDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateMembershipPriceArgs = {
  data: UpdatePriceDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateMembershipSubscriptionArgs = {
  data: UpdateSubscriptionDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateMonthlyTargetArgs = {
  data: UpdateMonthlyTargetInput;
  id: Scalars['String']['input'];
};


export type MutationUpdatePortfolioCredentialsArgs = {
  credentials: UpdateCredentialsInput;
  executionId: Scalars['Int']['input'];
};


export type MutationUpdateRecurrenceTemplateArgs = {
  data: UpdateEventRecurrenceInput;
  id: Scalars['Int']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerifyDto;
};

export enum OtpPurpose {
  ResetPassword = 'RESET_PASSWORD',
  VerifyAccount = 'VERIFY_ACCOUNT'
}

export type PaddlePaymentMethod = {
  __typename?: 'PaddlePaymentMethod';
  addressId?: Maybe<Scalars['String']['output']>;
  businessId?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  paymentMethod: PaymentMethod;
  paymentMethodId: Scalars['Int']['output'];
};

export type PaddlePaymentTransaction = {
  __typename?: 'PaddlePaymentTransaction';
  id: Scalars['Int']['output'];
  paymentTransaction: PaymentTransaction;
  paymentTransactionId: Scalars['Int']['output'];
};

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type PassphraseCryptoPortfolio = {
  __typename?: 'PassphraseCryptoPortfolio';
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  passphrase: Scalars['String']['output'];
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  id: Scalars['Int']['output'];
  metaMaskPaymentMethod?: Maybe<MetaMaskPaymentMethod>;
  paddlePaymentMethod?: Maybe<PaddlePaymentMethod>;
  provider: PaymentProvider;
  user: User;
  userId: Scalars['Int']['output'];
};

export enum PaymentProvider {
  Metamask = 'METAMASK',
  Paddle = 'PADDLE'
}

export type PaymentSession = {
  __typename?: 'PaymentSession';
  createdAt: Scalars['DateTime']['output'];
  discountAmount?: Maybe<Scalars['Float']['output']>;
  discountId?: Maybe<Scalars['String']['output']>;
  expiresAt: Scalars['DateTime']['output'];
  finalAmount: Scalars['Float']['output'];
  planId: Scalars['String']['output'];
  priceId: Scalars['String']['output'];
  sessionId: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export enum PaymentStatus {
  ActionRequired = 'action_required',
  Authorized = 'authorized',
  AuthorizedFlagged = 'authorized_flagged',
  Canceled = 'canceled',
  Captured = 'captured',
  Created = 'created',
  Dropped = 'dropped',
  Error = 'error',
  PendingNoActionRequired = 'pending_no_action_required',
  Unknown = 'unknown'
}

export type PaymentTransaction = {
  __typename?: 'PaymentTransaction';
  amount: Scalars['Decimal']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  membershipSubscription: MembershipSubscription;
  membershipSubscriptionId: Scalars['String']['output'];
  metaMaskPaymentTransaction?: Maybe<MetaMaskPaymentTransaction>;
  paddlePaymentTransaction?: Maybe<PaddlePaymentTransaction>;
  status: PaymentStatus;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
};

export enum PortfolioCreationMilestone {
  AccountFetched = 'ACCOUNT_FETCHED',
  BalancesFetched = 'BALANCES_FETCHED',
  Completed = 'COMPLETED',
  ConnectionFailed = 'CONNECTION_FAILED',
  CredentialsFailed = 'CREDENTIALS_FAILED',
  CredentialsVerified = 'CREDENTIALS_VERIFIED',
  ExchangeConnected = 'EXCHANGE_CONNECTED',
  Failed = 'FAILED',
  FetchFailed = 'FETCH_FAILED',
  Initialized = 'INITIALIZED',
  InsufficientPermissions = 'INSUFFICIENT_PERMISSIONS',
  PortfolioStored = 'PORTFOLIO_STORED',
  RateLimited = 'RATE_LIMITED',
  StorageFailed = 'STORAGE_FAILED',
  TimeoutFailed = 'TIMEOUT_FAILED',
  ValidationFailed = 'VALIDATION_FAILED'
}

export enum PortfolioCreationStep {
  AnalyticsCalculation = 'ANALYTICS_CALCULATION',
  Authentication = 'AUTHENTICATION',
  BalanceRetrieval = 'BALANCE_RETRIEVAL',
  Completion = 'COMPLETION',
  PnlCalculation = 'PNL_CALCULATION',
  PriceHistoryFetch = 'PRICE_HISTORY_FETCH',
  SymbolDiscovery = 'SYMBOL_DISCOVERY',
  TradeHistoryFetch = 'TRADE_HISTORY_FETCH',
  Validation = 'VALIDATION'
}

export enum PortfolioStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum PriceStatus {
  Active = 'active',
  Archived = 'archived'
}

export type Query = {
  __typename?: 'Query';
  getAssetInfo: AssetInfo;
  getAssetPrices: Array<AssetPrice>;
  getBankAccounts: Array<BankAccount>;
  getBankManagers: Array<BankManager>;
  getBankTransactions: Array<BankTransaction>;
  getCreatePortfolioExecutions: Array<CreatePortfolioExecution>;
  getCryptoPortfolios: Array<CryptoPortfolio>;
  getCryptoPrice: CryptoPriceResult;
  getDiscount: MembershipDiscount;
  getDiscounts: Array<MembershipDiscount>;
  getDiscountsForPrice: Array<MembershipDiscount>;
  getEventCategories: Array<EventCategory>;
  getEvents: Array<Event>;
  getExpenseCategories: Array<ExpenseCategory>;
  getExpenses: Array<Expense>;
  getFeature: Feature;
  getFeatures: Array<Feature>;
  getHistoricalAssetProfits: Array<HistoricalAssetProfit>;
  getHistoricalBalances: Array<HistoricalCryptoBalance>;
  getMe: User;
  getMembershipPlan: MembershipPlan;
  getMembershipPlans: Array<MembershipPlan>;
  getMembershipPrice: MembershipPrice;
  getMembershipPrices: Array<MembershipPrice>;
  getMembershipPricesByPlan: Array<MembershipPrice>;
  getMonthlyTargets: Array<MonthlyTarget>;
  getPaymentMethod?: Maybe<PaymentMethod>;
  getPaymentMethods: Array<PaymentMethod>;
  getPaymentSession: PaymentSession;
  getRecurrenceTemplate: EventRecurrence;
  getRecurrenceTemplates: Array<EventRecurrence>;
  getSuggestedExpenses: Array<Expense>;
  getTrades: Array<Trade>;
  myActiveMembershipSubscriptions: Array<MembershipSubscription>;
  myMembershipFeatures: Array<MembershipFeature>;
  myMembershipSubscriptions: Array<MembershipSubscription>;
  validateDiscountCode: DiscountValidationResult;
};


export type QueryGetAssetInfoArgs = {
  data: GetAssetInfoInput;
};


export type QueryGetAssetPricesArgs = {
  data: GetAssetPriceInput;
  pagination: PaginationInput;
};


export type QueryGetCryptoPriceArgs = {
  tokenSymbol: Scalars['String']['input'];
  usdAmount: Scalars['Float']['input'];
};


export type QueryGetDiscountArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetDiscountsForPriceArgs = {
  priceId: Scalars['String']['input'];
};


export type QueryGetEventsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetExpenseCategoriesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetExpensesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetFeatureArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetHistoricalAssetProfitsArgs = {
  data: GetHistoricalAssetProfitInput;
  pagination: PaginationInput;
};


export type QueryGetHistoricalBalancesArgs = {
  data: GetHistoricalBalanceInput;
  pagination: PaginationInput;
};


export type QueryGetMembershipPlanArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMembershipPriceArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMembershipPricesByPlanArgs = {
  planId: Scalars['String']['input'];
};


export type QueryGetMonthlyTargetsArgs = {
  categoryId: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetPaymentMethodArgs = {
  data: GetPaymentMethodDto;
};


export type QueryGetPaymentSessionArgs = {
  data: GetPaymentSessionDto;
};


export type QueryGetRecurrenceTemplateArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSuggestedExpensesArgs = {
  data: SuggestExpenseInput;
};


export type QueryGetTradesArgs = {
  data: GetTradeInput;
};


export type QueryValidateDiscountCodeArgs = {
  data: ValidateDiscountDto;
};

export enum RecurrenceType {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type RefreshTokenInputDto = {
  refreshToken: Scalars['String']['input'];
};

export type RefreshTokenResponseDto = {
  __typename?: 'RefreshTokenResponseDto';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Float']['output'];
  refreshToken: Scalars['String']['output'];
};

export type SignupResDto = {
  __typename?: 'SignupResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newAssetPrice: AssetPrice;
  newHistoricalAssetProfit: HistoricalAssetProfit;
  newHistoricalCryptoBalance: HistoricalCryptoBalance;
  onCreatePortfolioExecution: CreatePortfolioExecution;
  onMembershipSubscriptionUpdated: MembershipSubscription;
};


export type SubscriptionNewAssetPriceArgs = {
  data: GetAssetPriceInput;
};


export type SubscriptionNewHistoricalAssetProfitArgs = {
  data: GetHistoricalAssetProfitInput;
};


export type SubscriptionNewHistoricalCryptoBalanceArgs = {
  data: GetHistoricalBalancesInput;
};

export type SuggestExpenseInput = {
  bankTransactionId: Scalars['Int']['input'];
};

export type TimePeriod = {
  __typename?: 'TimePeriod';
  billingCycles?: Maybe<Array<MembershipPrice>>;
  frequency: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  interval: Interval;
  trialPeriods?: Maybe<Array<MembershipPrice>>;
};

export type TimePeriodInput = {
  frequency: Scalars['Int']['input'];
  interval: Scalars['String']['input'];
};

export type TotalSpentAmountOutput = {
  __typename?: 'TotalSpentAmountOutput';
  amount: Scalars['Float']['output'];
  month: Scalars['Float']['output'];
  year: Scalars['Float']['output'];
};

export type Trade = {
  __typename?: 'Trade';
  assetInfo: AssetInfo;
  assetInfoId: Scalars['String']['output'];
  commission: Scalars['Float']['output'];
  commissionAsset: Scalars['String']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  feeAsset?: Maybe<Scalars['String']['output']>;
  fees?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  isBuyer: Scalars['Boolean']['output'];
  orderId?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  qty: Scalars['Float']['output'];
  quoteQty: Scalars['Float']['output'];
  realizedPnl?: Maybe<Scalars['Float']['output']>;
  side?: Maybe<Scalars['String']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
  time: Scalars['DateTime']['output'];
};

export enum TradingType {
  Futures = 'FUTURES',
  Spot = 'SPOT'
}

export type UnitPrice = {
  __typename?: 'UnitPrice';
  amount: Scalars['String']['output'];
  currencyCode: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  prices?: Maybe<Array<MembershipPrice>>;
};

export type UnitPriceInput = {
  amount: Scalars['String']['input'];
  currencyCode: Scalars['String']['input'];
};

export type UpdateCredentialsInput = {
  apiKey: Scalars['String']['input'];
  passphrase?: InputMaybe<Scalars['String']['input']>;
  secretKey: Scalars['String']['input'];
};

export type UpdateDiscountDto = {
  code?: InputMaybe<Scalars['String']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxAmount?: InputMaybe<Scalars['String']['input']>;
  maxUses?: InputMaybe<Scalars['Int']['input']>;
  maxUsesPerUser?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  targetType?: InputMaybe<DiscountTargetType>;
  type?: InputMaybe<DiscountType>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateEventInput = {
  allDay?: InputMaybe<Scalars['Boolean']['input']>;
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  recurrenceId?: InputMaybe<Scalars['Int']['input']>;
  reminderMinutes?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UpdateEventRecurrenceInput = {
  dayOfMonth?: InputMaybe<Scalars['Int']['input']>;
  dayOfWeek?: InputMaybe<Scalars['Int']['input']>;
  daysOfWeek?: InputMaybe<Scalars['String']['input']>;
  endCount?: InputMaybe<Scalars['Int']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  interval?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<RecurrenceType>;
  userId?: InputMaybe<Scalars['Int']['input']>;
  weekOfMonth?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateExpenseCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  bankTransactionId?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFeatureDto = {
  type?: InputMaybe<FeatureType>;
};

export type UpdateMonthlyTargetInput = {
  month?: InputMaybe<Scalars['Int']['input']>;
  target?: InputMaybe<Scalars['Float']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePlanDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePriceDto = {
  billingCycleId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  trialPeriodId?: InputMaybe<Scalars['Int']['input']>;
  unitPriceId?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSubscriptionDto = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  planId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  bankManager?: Maybe<Array<BankManager>>;
  createPortfolioExecutions?: Maybe<Array<CreatePortfolioExecution>>;
  cryptoPortfolios?: Maybe<Array<CryptoPortfolio>>;
  cryptoProfiles: CryptoPortfolio;
  email: Scalars['String']['output'];
  eventCategories?: Maybe<Array<EventCategory>>;
  eventRecurrences?: Maybe<Array<EventRecurrence>>;
  events?: Maybe<Array<Event>>;
  expenseCategories?: Maybe<Array<ExpenseCategory>>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['Int']['output'];
  memberships?: Maybe<Array<MembershipSubscription>>;
  name?: Maybe<Scalars['String']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  otpPurpose?: Maybe<OtpPurpose>;
  password: Scalars['String']['output'];
  paymentMethods?: Maybe<Array<PaymentMethod>>;
};

export type ValidateDiscountDto = {
  code: Scalars['String']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  priceId?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type VerifyDto = {
  otp: Scalars['String']['input'];
  otpPurpose: OtpPurpose;
};
