
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum AutoBankManagerThirdParty {
    CASSO = "CASSO"
}

export enum PortfolioStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export enum Exchanges {
    ALL = "ALL",
    BINANCE = "BINANCE",
    MEXC = "MEXC",
    OKX = "OKX",
    COINBASE = "COINBASE",
    COINBASEEXCHANGE = "COINBASEEXCHANGE",
    COINBASEINTERNATIONAL = "COINBASEINTERNATIONAL",
    KRAKEN = "KRAKEN",
    KRAKENFUTURES = "KRAKENFUTURES",
    BYBIT = "BYBIT",
    BITGET = "BITGET",
    GATE = "GATE",
    HUOBI = "HUOBI",
    HTX = "HTX",
    KUCOIN = "KUCOIN",
    KUCOINFUTURES = "KUCOINFUTURES",
    CRYPTOCOM = "CRYPTOCOM",
    BITFINEX = "BITFINEX",
    BITMEX = "BITMEX",
    BITSTAMP = "BITSTAMP",
    GEMINI = "GEMINI",
    BITMART = "BITMART",
    BITRUE = "BITRUE",
    ASCENDEX = "ASCENDEX",
    PROBIT = "PROBIT",
    POLONIEX = "POLONIEX",
    LBANK = "LBANK",
    PHEMEX = "PHEMEX",
    WOO = "WOO",
    WOOFIPRO = "WOOFIPRO",
    DERIBIT = "DERIBIT",
    BINGX = "BINGX",
    HASHKEY = "HASHKEY",
    COINEX = "COINEX",
    WHITEBIT = "WHITEBIT",
    XT = "XT",
    MEXC3 = "MEXC3",
    P2B = "P2B",
    TRADEOGRE = "TRADEOGRE",
    NDAX = "NDAX",
    OXFUN = "OXFUN",
    BLOFIN = "BLOFIN",
    COINCATCH = "COINCATCH",
    BINANCEUS = "BINANCEUS",
    BINANCEUSDM = "BINANCEUSDM",
    BINANCECOINM = "BINANCECOINM",
    OKCOIN = "OKCOIN",
    MYOKX = "MYOKX",
    OKXUS = "OKXUS",
    BITHUMB = "BITHUMB",
    UPBIT = "UPBIT",
    COINONE = "COINONE",
    HUOBIJP = "HUOBIJP",
    BITFLYER = "BITFLYER",
    COINCHECK = "COINCHECK",
    BITBANK = "BITBANK",
    ZAIF = "ZAIF",
    BTCBOX = "BTCBOX",
    INDODAX = "INDODAX",
    TOKOCRYPTO = "TOKOCRYPTO",
    COINSPH = "COINSPH",
    NOVADAX = "NOVADAX",
    MERCADO = "MERCADO",
    BITSO = "BITSO",
    BTCTURK = "BTCTURK",
    BTCALPHA = "BTCALPHA",
    EXMO = "EXMO",
    BITTEAM = "BITTEAM",
    KUNA = "KUNA",
    LATOKEN = "LATOKEN",
    HYPERLIQUID = "HYPERLIQUID",
    VERTEX = "VERTEX",
    PARADEX = "PARADEX",
    DERIVE = "DERIVE",
    APEX = "APEX",
    DEFX = "DEFX",
    WOOFIPRO_DEX = "WOOFIPRO_DEX",
    IDEX = "IDEX",
    WAVESEXCHANGE = "WAVESEXCHANGE",
    MODETRADE = "MODETRADE",
    ALPACA = "ALPACA",
    BEQUANT = "BEQUANT",
    BIGONE = "BIGONE",
    BIT2C = "BIT2C",
    BITBNS = "BITBNS",
    BITOPRO = "BITOPRO",
    BITVAVO = "BITVAVO",
    BL3P = "BL3P",
    BLOCKCHAINCOM = "BLOCKCHAINCOM",
    BTCMARKETS = "BTCMARKETS",
    CEX = "CEX",
    COINLIST = "COINLIST",
    COINMATE = "COINMATE",
    COINMETRO = "COINMETRO",
    COINSPOT = "COINSPOT",
    CRYPTOMUS = "CRYPTOMUS",
    DELTA = "DELTA",
    DIGIFINEX = "DIGIFINEX",
    ELLIPX = "ELLIPX",
    FMFWIO = "FMFWIO",
    HOLLAEX = "HOLLAEX",
    INDEPENDENTRESERVE = "INDEPENDENTRESERVE",
    LUNO = "LUNO",
    OCEANEX = "OCEANEX",
    ONETRADING = "ONETRADING",
    PAYMIUM = "PAYMIUM",
    TIMEX = "TIMEX",
    YOBIT = "YOBIT",
    ZONDA = "ZONDA",
    HITBTC = "HITBTC",
    HUOBI_LEGACY = "HUOBI_LEGACY"
}

export enum TradingType {
    FUTURES = "FUTURES",
    SPOT = "SPOT"
}

export enum PortfolioCreationStep {
    VALIDATION = "VALIDATION",
    AUTHENTICATION = "AUTHENTICATION",
    BALANCE_RETRIEVAL = "BALANCE_RETRIEVAL",
    SYMBOL_DISCOVERY = "SYMBOL_DISCOVERY",
    TRADE_HISTORY_FETCH = "TRADE_HISTORY_FETCH",
    PRICE_HISTORY_FETCH = "PRICE_HISTORY_FETCH",
    PNL_CALCULATION = "PNL_CALCULATION",
    ANALYTICS_CALCULATION = "ANALYTICS_CALCULATION",
    COMPLETION = "COMPLETION"
}

export enum PortfolioCreationMilestone {
    INITIALIZED = "INITIALIZED",
    CREDENTIALS_VERIFIED = "CREDENTIALS_VERIFIED",
    EXCHANGE_CONNECTED = "EXCHANGE_CONNECTED",
    ACCOUNT_FETCHED = "ACCOUNT_FETCHED",
    BALANCES_FETCHED = "BALANCES_FETCHED",
    PORTFOLIO_STORED = "PORTFOLIO_STORED",
    COMPLETED = "COMPLETED",
    VALIDATION_FAILED = "VALIDATION_FAILED",
    CREDENTIALS_FAILED = "CREDENTIALS_FAILED",
    CONNECTION_FAILED = "CONNECTION_FAILED",
    FETCH_FAILED = "FETCH_FAILED",
    STORAGE_FAILED = "STORAGE_FAILED",
    TIMEOUT_FAILED = "TIMEOUT_FAILED",
    RATE_LIMITED = "RATE_LIMITED",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    FAILED = "FAILED"
}

export enum ErrorRecoveryAction {
    RETRY_AUTOMATIC = "RETRY_AUTOMATIC",
    RETRY_MANUAL = "RETRY_MANUAL",
    UPDATE_CREDENTIALS = "UPDATE_CREDENTIALS",
    WAIT_RATE_LIMIT = "WAIT_RATE_LIMIT",
    CHECK_PERMISSIONS = "CHECK_PERMISSIONS",
    CONTACT_SUPPORT = "CONTACT_SUPPORT",
    ABORT = "ABORT"
}

export enum RecurrenceType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}

export enum Interval {
    day = "day",
    week = "week",
    month = "month",
    year = "year"
}

export enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    FREE_TRIAL = "FREE_TRIAL"
}

export enum DiscountTargetType {
    PRICE_SPECIFIC = "PRICE_SPECIFIC",
    FIRST_TIME_USER = "FIRST_TIME_USER"
}

export enum PriceStatus {
    active = "active",
    archived = "archived"
}

export enum FeatureType {
    CRYPTO = "CRYPTO",
    EXPENSE = "EXPENSE"
}

export enum PaymentStatus {
    authorized = "authorized",
    authorized_flagged = "authorized_flagged",
    canceled = "canceled",
    captured = "captured",
    error = "error",
    action_required = "action_required",
    pending_no_action_required = "pending_no_action_required",
    created = "created",
    unknown = "unknown",
    dropped = "dropped"
}

export enum MembershipSubscriptionStatus {
    active = "active",
    canceled = "canceled",
    past_due = "past_due",
    paused = "paused",
    trialing = "trialing"
}

export enum PaymentProvider {
    PADDLE = "PADDLE",
    METAMASK = "METAMASK"
}

export enum OtpPurpose {
    VERIFY_ACCOUNT = "VERIFY_ACCOUNT",
    RESET_PASSWORD = "RESET_PASSWORD"
}

export enum DiscountErrorCode {
    DISCOUNT_NOT_FOUND = "DISCOUNT_NOT_FOUND",
    DISCOUNT_INACTIVE = "DISCOUNT_INACTIVE",
    DISCOUNT_EXPIRED = "DISCOUNT_EXPIRED",
    DISCOUNT_EXHAUSTED = "DISCOUNT_EXHAUSTED",
    USER_LIMIT_EXCEEDED = "USER_LIMIT_EXCEEDED",
    USAGE_LIMIT_REACHED = "USAGE_LIMIT_REACHED",
    USER_USAGE_LIMIT_REACHED = "USER_USAGE_LIMIT_REACHED",
    DISCOUNT_NOT_APPLICABLE = "DISCOUNT_NOT_APPLICABLE",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_CURRENCY = "INVALID_CURRENCY",
    ALREADY_APPLIED = "ALREADY_APPLIED"
}

export enum ExportFormat {
    PDF = "PDF",
    CSV = "CSV",
    EXCEL = "EXCEL"
}

export interface GetAssetInfoInput {
    id: string;
}

export interface GetAssetPriceInput {
    assetInfoId: string;
    timeFrame: string;
}

export interface PaginationInput {
    take: number;
    after?: Nullable<string>;
    before?: Nullable<string>;
}

export interface GetHistoricalBalanceInput {
    cryptoPortfolioId: string;
    timeFrame: string;
}

export interface GetHistoricalAssetProfitInput {
    assetInfoId: string;
    cryptoPortfolioId: string;
    timeFrame: string;
}

export interface GetTradeInput {
    cryptoPortfolioId?: Nullable<string>;
    assetInfoId?: Nullable<string>;
}

export interface SuggestExpenseInput {
    bankTransactionId: number;
}

export interface ValidateDiscountDto {
    code: string;
    priceId?: Nullable<string>;
    ipAddress?: Nullable<string>;
    userAgent?: Nullable<string>;
}

export interface GetPaymentMethodDto {
    id?: Nullable<number>;
}

export interface GetPaymentSessionDto {
    sessionId: string;
}

export interface CreateCryptoPortfolioInput {
    name: string;
    exchanges: Exchanges;
    apiKey: string;
    secretKey: string;
    passphrase?: Nullable<string>;
}

export interface UpdateCredentialsInput {
    apiKey: string;
    secretKey: string;
    passphrase?: Nullable<string>;
}

export interface CreateSupportTicketInput {
    executionId: number;
    subject: string;
    description: string;
    category?: Nullable<string>;
    priority?: Nullable<string>;
}

export interface ExportPortfolioInput {
    portfolioId: string;
    format: ExportFormat;
    includeCharts: boolean;
    includeSummary: boolean;
    portfolioName?: Nullable<string>;
}

export interface LoginReqDto {
    email: string;
    password: string;
}

export interface CreateUserInput {
    email: string;
    name?: Nullable<string>;
    password: string;
    otp?: Nullable<string>;
    otpPurpose?: Nullable<OtpPurpose>;
}

export interface VerifyDto {
    otp: string;
    otpPurpose: OtpPurpose;
}

export interface RefreshTokenInputDto {
    refreshToken: string;
}

export interface CreateBankManagerInput {
    name: string;
    autoBankManager?: Nullable<CreateAutoBankManagerInput>;
}

export interface CreateAutoBankManagerInput {
    apiKey: string;
    thirdParty: AutoBankManagerThirdParty;
}

export interface CreateBankAccountInput {
    name: string;
    bankManagerId: string;
    accountName: string;
    accountNumber: string;
    balance: number;
    fullName: string;
}

export interface CreateBankTransactionInput {
    bankId: string;
    amount: number;
    description: string;
}

export interface CreateExpenseInput {
    categoryId: string;
    name: string;
    description?: Nullable<string>;
    amount: number;
    bankTransactionId: number;
    createdAt: DateTime;
}

export interface UpdateExpenseInput {
    categoryId?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    amount?: Nullable<number>;
    bankTransactionId?: Nullable<number>;
    createdAt?: Nullable<DateTime>;
}

export interface CreateExpenseCategoryInput {
    name: string;
    description?: Nullable<string>;
    color: string;
}

export interface UpdateExpenseCategoryInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
    color?: Nullable<string>;
}

export interface CreateMonthlyTargetInput {
    categoryId: string;
    month: number;
    year: number;
    target: number;
}

export interface UpdateMonthlyTargetInput {
    month?: Nullable<number>;
    year?: Nullable<number>;
    target?: Nullable<number>;
}

export interface CreateEventInput {
    name: string;
    description?: Nullable<string>;
    startDate: DateTime;
    endDate: DateTime;
    allDay: boolean;
    color?: Nullable<string>;
    recurrenceId?: Nullable<number>;
    categoryId: number;
    reminderMinutes?: Nullable<number>;
    recurrence?: Nullable<CreateRecurrenceInput>;
}

export interface CreateRecurrenceInput {
    type: RecurrenceType;
    interval: number;
    daysOfWeek?: Nullable<string>;
    dayOfMonth?: Nullable<number>;
    weekOfMonth?: Nullable<number>;
    dayOfWeek?: Nullable<number>;
    endDate?: Nullable<DateTime>;
    endCount?: Nullable<number>;
}

export interface UpdateEventInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
    allDay?: Nullable<boolean>;
    color?: Nullable<string>;
    recurrenceId?: Nullable<number>;
    categoryId?: Nullable<number>;
    reminderMinutes?: Nullable<number>;
}

export interface CreateEventCategoryInput {
    name: string;
    color: string;
}

export interface UpdateEventCategoryInput {
    name?: Nullable<string>;
    color?: Nullable<string>;
}

export interface UpdateEventRecurrenceInput {
    type?: Nullable<RecurrenceType>;
    interval?: Nullable<number>;
    daysOfWeek?: Nullable<string>;
    dayOfMonth?: Nullable<number>;
    weekOfMonth?: Nullable<number>;
    dayOfWeek?: Nullable<number>;
    endDate?: Nullable<DateTime>;
    endCount?: Nullable<number>;
    userId?: Nullable<number>;
}

export interface CreatePlanDto {
    name: string;
    description?: Nullable<string>;
    featureIds?: Nullable<number[]>;
}

export interface UpdatePlanDto {
    name?: Nullable<string>;
    description?: Nullable<string>;
}

export interface CreatePriceDto {
    planId: string;
    billingCycle?: Nullable<TimePeriodInput>;
    trialPeriod?: Nullable<TimePeriodInput>;
    unitPrice: UnitPriceInput;
    status: string;
}

export interface TimePeriodInput {
    interval: string;
    frequency: number;
}

export interface UnitPriceInput {
    amount: string;
    currencyCode: string;
}

export interface UpdatePriceDto {
    billingCycleId?: Nullable<number>;
    trialPeriodId?: Nullable<number>;
    unitPriceId?: Nullable<number>;
    status?: Nullable<string>;
}

export interface CreateSubscriptionDto {
    userId: number;
    planId: string;
    status: string;
    startDate?: Nullable<DateTime>;
    endDate: DateTime;
}

export interface UpdateSubscriptionDto {
    planId?: Nullable<string>;
    status?: Nullable<string>;
    endDate?: Nullable<DateTime>;
}

export interface CreateDiscountDto {
    name: string;
    description?: Nullable<string>;
    code?: Nullable<string>;
    type: DiscountType;
    value: string;
    currencyCode?: Nullable<string>;
    maxAmount?: Nullable<string>;
    isActive: boolean;
    startDate?: Nullable<string>;
    endDate?: Nullable<string>;
    maxUses?: Nullable<number>;
    maxUsesPerUser?: Nullable<number>;
    isRecurring: boolean;
    targetType: DiscountTargetType;
}

export interface UpdateDiscountDto {
    name?: Nullable<string>;
    description?: Nullable<string>;
    code?: Nullable<string>;
    type?: Nullable<DiscountType>;
    value?: Nullable<string>;
    currencyCode?: Nullable<string>;
    maxAmount?: Nullable<string>;
    isActive?: Nullable<boolean>;
    startDate?: Nullable<string>;
    endDate?: Nullable<string>;
    maxUses?: Nullable<number>;
    maxUsesPerUser?: Nullable<number>;
    targetType?: Nullable<DiscountTargetType>;
}

export interface CreateMetaMaskPaymentMethodDto {
    walletAddress: string;
    ensName?: Nullable<string>;
}

export interface CreateMetaMaskSubscriptionFromSessionDto {
    sessionId: string;
    transactionHash: string;
    tokenAddress?: Nullable<string>;
    tokenSymbol: string;
    blockNumber?: Nullable<number>;
    gasUsed?: Nullable<string>;
    gasPrice?: Nullable<string>;
}

export interface CreatePaymentSessionDto {
    planId: string;
    priceId: string;
    discountId?: Nullable<string>;
}

export interface CreateFeatureDto {
    type: FeatureType;
    name: string;
}

export interface UpdateFeatureDto {
    type?: Nullable<FeatureType>;
}

export interface GetHistoricalBalancesInput {
    timeFrame: string;
    cryptoPortfolioIds: string[];
}

export interface MonthlyTarget {
    id: string;
    categoryId: string;
    month: number;
    year: number;
    target: number;
    category: ExpenseCategory;
}

export interface ExpenseCategory {
    id: string;
    userId: number;
    name: string;
    description?: Nullable<string>;
    color: string;
    expenses?: Nullable<Expense[]>;
    user: User;
    monthlyTargets?: Nullable<MonthlyTarget[]>;
    countExpenses: number;
    totalSpentAmounts?: TotalSpentAmountOutput[];
}

export interface Expense {
    id: string;
    userId: number;
    categoryId: string;
    name: string;
    description?: Nullable<string>;
    amount: number;
    bankTransactionId: number;
    createdAt: DateTime;
    bankTransaction: BankTransaction;
    category: ExpenseCategory;
    user: User;
    transaction: BankTransaction;
}

export interface BankTransaction {
    id: number;
    bankId: string;
    amount: number;
    description: string;
    createdAt: DateTime;
    spentAmount: number;
    bank: BankAccount;
    expense?: Nullable<Expense[]>;
}

export interface HistoricalBankBalance {
    time: DateTime;
    balance: number;
    bankAccountId: string;
    bankAccount: BankAccount;
}

export interface BankAccount {
    id: string;
    name: string;
    bankManagerId: string;
    accountName: string;
    accountNumber: string;
    balance: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    fullName: string;
    bankManager: BankManager;
    transactions: BankTransaction[];
    historicalBalances?: Nullable<HistoricalBankBalance[]>;
}

export interface AutoBankManager {
    id: string;
    apiKey: string;
    thirdParty: AutoBankManagerThirdParty;
    bankManagerId: string;
    bankManager: BankManager;
}

export interface BankManager {
    id: string;
    userId: number;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    banks: BankAccount[];
    user: User;
    autoBankManager?: Nullable<AutoBankManager>;
}

export interface AssetPrice {
    assetInfoId: string;
    interval: string;
    open_time: DateTime;
    close_time: DateTime;
    openPrice: number;
    closePrice: number;
    highPrice: number;
    lowPrice: number;
    volume: number;
    assetInfo: AssetInfo;
}

export interface HistoricalAssetProfit {
    time: DateTime;
    estimatedProfit: number;
    totalCostInQuoteQty: number;
    remainingQty: number;
    assetInfoId: string;
    cryptoPortfolioId: string;
    realizedPnl?: Nullable<number>;
    unrealizedPnl?: Nullable<number>;
    totalPnl?: Nullable<number>;
    averageCostBasis?: Nullable<number>;
    currentPrice?: Nullable<number>;
    percentageGain?: Nullable<number>;
    holdingPeriodDays?: Nullable<number>;
    assetInfo: AssetInfoOutput;
    cryptoPortfolio: CryptoPortfolio;
}

export interface Trade {
    id: number;
    cryptoPortfolioId: string;
    assetInfoId: string;
    price: number;
    qty: number;
    quoteQty: number;
    commission: number;
    commissionAsset: string;
    time: DateTime;
    isBuyer: boolean;
    orderId?: Nullable<string>;
    symbol?: Nullable<string>;
    side?: Nullable<string>;
    realizedPnl?: Nullable<number>;
    fees?: Nullable<number>;
    feeAsset?: Nullable<string>;
    cryptoPortfolio: CryptoPortfolio;
    assetInfo: AssetInfo;
}

export interface AssetInfo {
    id: string;
    name: string;
    symbol: string;
    category: string;
    desc: string;
    logo: string;
    tag: string;
    assetBalances?: Nullable<AssetBalance[]>;
    assetPrices?: Nullable<AssetPrice[]>;
    historicalProfits?: Nullable<HistoricalAssetProfit[]>;
    trades?: Nullable<Trade[]>;
}

export interface AssetBalance {
    id: string;
    assetInfoId: string;
    balance: number;
    locked: number;
    cryptoPortfolioId: string;
    assetInfo: AssetInfoOutput;
    cryptoPortfolio: CryptoPortfolio;
}

export interface HistoricalCryptoBalance {
    time: DateTime;
    estimatedBalance: number;
    changePercent: number;
    changeBalance: number;
    cryptoPortfolioId: string;
    totalValue?: Nullable<number>;
    totalPnl?: Nullable<number>;
    totalRealizedPnl?: Nullable<number>;
    totalUnrealizedPnl?: Nullable<number>;
    assetCount?: Nullable<number>;
    diversificationScore?: Nullable<number>;
    riskScore?: Nullable<number>;
    cryptoPortfolio: CryptoPortfolio;
}

export interface PassphraseCryptoPortfolio {
    id: string;
    cryptoPortfolioId: string;
    passphrase: string;
    cryptoPortfolio: CryptoPortfolio;
}

export interface CryptoPortfolio {
    userId: number;
    name: string;
    status: PortfolioStatus;
    exchanges: Exchanges;
    tradingType: TradingType;
    apiKey: string;
    secretKey: string;
    updateTime?: Nullable<DateTime>;
    id: string;
    investmentCategoryName?: Nullable<string>;
    parentPortfolioId?: Nullable<string>;
    balances: AssetBalance[];
    user: User;
    historicalAssetProfits?: Nullable<HistoricalAssetProfit[]>;
    historicalBalances?: Nullable<HistoricalCryptoBalance[]>;
    trades?: Nullable<Trade[]>;
    passphrasePortfolio?: Nullable<PassphraseCryptoPortfolio>;
    parentPortfolio?: Nullable<CryptoPortfolio>;
    childPortfolios?: Nullable<CryptoPortfolio[]>;
    latestHistoricalBalances?: HistoricalCryptoBalance;
    latestAssetProfits: HistoricalAssetProfit[];
}

export interface CreatePortfolioExecution {
    id: number;
    userId: number;
    currentStep?: Nullable<PortfolioCreationStep>;
    currentMilestone?: Nullable<PortfolioCreationMilestone>;
    progressPercent: number;
    errorMessage?: Nullable<string>;
    recoveryAction?: Nullable<ErrorRecoveryAction>;
    retryCount: number;
    maxRetries: number;
    exchangeType?: Nullable<Exchanges>;
    executionContext?: Nullable<JSON>;
    createdAt: DateTime;
    updatedAt: DateTime;
    completedAt?: Nullable<DateTime>;
    user: User;
}

export interface EventRecurrence {
    id: number;
    type: RecurrenceType;
    interval: number;
    daysOfWeek?: Nullable<string>;
    dayOfMonth?: Nullable<number>;
    weekOfMonth?: Nullable<number>;
    dayOfWeek?: Nullable<number>;
    endDate?: Nullable<DateTime>;
    endCount?: Nullable<number>;
    userId: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    events: Event[];
    user: User;
}

export interface EventCategory {
    id: number;
    name: string;
    color: string;
    userId: number;
    user: User;
    events?: Nullable<Event[]>;
}

export interface Event {
    id: number;
    name: string;
    description?: Nullable<string>;
    startDate: DateTime;
    endDate: DateTime;
    allDay: boolean;
    color?: Nullable<string>;
    recurrenceId?: Nullable<number>;
    userId: number;
    categoryId: number;
    reminderMinutes?: Nullable<number>;
    createdAt: DateTime;
    updatedAt: DateTime;
    recurrence?: Nullable<EventRecurrence>;
    user: User;
    category: EventCategory;
}

export interface TimePeriod {
    id: number;
    interval: Interval;
    frequency: number;
    billingCycles?: Nullable<MembershipPrice[]>;
    trialPeriods?: Nullable<MembershipPrice[]>;
}

export interface UnitPrice {
    id: number;
    amount: string;
    currencyCode: string;
    prices?: Nullable<MembershipPrice[]>;
}

export interface MembershipDiscountUsage {
    discountId: string;
    membershipSubscriptionId: string;
    originalAmount: Decimal;
    discountAmount: Decimal;
    finalAmount: Decimal;
    currencyCode: string;
    usedAt: DateTime;
    ipAddress?: Nullable<string>;
    userAgent?: Nullable<string>;
    discount: MembershipDiscount;
    membershipSubscription: MembershipSubscription;
}

export interface MembershipDiscount {
    id: string;
    name: string;
    description?: Nullable<string>;
    code?: Nullable<string>;
    type: DiscountType;
    value: Decimal;
    currencyCode?: Nullable<string>;
    maxAmount?: Nullable<Decimal>;
    isActive: boolean;
    startDate?: Nullable<DateTime>;
    endDate?: Nullable<DateTime>;
    maxUses?: Nullable<number>;
    maxUsesPerUser?: Nullable<number>;
    currentUses: number;
    targetType: DiscountTargetType;
    createdAt: DateTime;
    updatedAt: DateTime;
    usageHistory: MembershipDiscountUsage[];
    prices: MembershipDiscountPrice[];
}

export interface MembershipDiscountPrice {
    discountId: string;
    priceId: string;
    discount: MembershipDiscount;
    price: MembershipPrice;
}

export interface MembershipPrice {
    id: string;
    planId: string;
    billingCycleId?: Nullable<number>;
    trialPeriodId?: Nullable<number>;
    unitPriceId: number;
    status: PriceStatus;
    createdAt: DateTime;
    billingCycle?: Nullable<TimePeriod>;
    trialPeriod?: Nullable<TimePeriod>;
    unitPrice: UnitPrice;
    plan: MembershipPlan;
    discounts?: Nullable<MembershipDiscountPrice[]>;
}

export interface Feature {
    id: number;
    type: FeatureType;
    name: string;
    membershipFeatures?: Nullable<MembershipFeature[]>;
}

export interface MembershipFeature {
    id: number;
    planId: string;
    featureId: number;
    plan: MembershipPlan;
    feature: Feature;
}

export interface MembershipPlan {
    id: string;
    name: string;
    description?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
    subscriptions?: Nullable<MembershipSubscription[]>;
    prices: MembershipPrice[];
    membershipFeatures: MembershipFeature[];
}

export interface PaddlePaymentTransaction {
    id: number;
    paymentTransactionId: number;
    paymentTransaction: PaymentTransaction;
}

export interface MetaMaskPaymentTransaction {
    id: number;
    paymentTransactionId: number;
    transactionHash: string;
    tokenAddress?: Nullable<string>;
    tokenSymbol: string;
    blockNumber?: Nullable<number>;
    gasUsed?: Nullable<string>;
    gasPrice?: Nullable<string>;
    paymentTransaction: PaymentTransaction;
}

export interface PaymentTransaction {
    id: number;
    membershipSubscriptionId: string;
    userId: number;
    amount: Decimal;
    currency: string;
    status: PaymentStatus;
    createdAt: DateTime;
    updatedAt: DateTime;
    paddlePaymentTransaction?: Nullable<PaddlePaymentTransaction>;
    metaMaskPaymentTransaction?: Nullable<MetaMaskPaymentTransaction>;
    membershipSubscription: MembershipSubscription;
}

export interface MembershipSubscription {
    id: string;
    userId: number;
    planId: string;
    status: MembershipSubscriptionStatus;
    startDate: DateTime;
    endDate: DateTime;
    createdAt: DateTime;
    updatedAt: DateTime;
    user: User;
    plan: MembershipPlan;
    paymentTransactions: PaymentTransaction[];
    discountUsages?: Nullable<MembershipDiscountUsage[]>;
}

export interface PaddlePaymentMethod {
    id: number;
    paymentMethodId: number;
    customerId: string;
    addressId?: Nullable<string>;
    businessId?: Nullable<string>;
    paymentMethod: PaymentMethod;
}

export interface MetaMaskPaymentMethod {
    id: number;
    paymentMethodId: number;
    walletAddress: string;
    ensName?: Nullable<string>;
    paymentMethod: PaymentMethod;
}

export interface PaymentMethod {
    id: number;
    userId: number;
    provider: PaymentProvider;
    user: User;
    paddlePaymentMethod?: Nullable<PaddlePaymentMethod>;
    metaMaskPaymentMethod?: Nullable<MetaMaskPaymentMethod>;
}

export interface User {
    id: number;
    email: string;
    name?: Nullable<string>;
    password: string;
    otp?: Nullable<string>;
    otpPurpose?: Nullable<OtpPurpose>;
    bankManager?: Nullable<BankManager[]>;
    cryptoPortfolios?: Nullable<CryptoPortfolio[]>;
    createPortfolioExecutions?: Nullable<CreatePortfolioExecution[]>;
    expenses?: Nullable<Expense[]>;
    expenseCategories?: Nullable<ExpenseCategory[]>;
    events?: Nullable<Event[]>;
    eventRecurrences?: Nullable<EventRecurrence[]>;
    eventCategories?: Nullable<EventCategory[]>;
    memberships?: Nullable<MembershipSubscription[]>;
    paymentMethods?: Nullable<PaymentMethod[]>;
    cryptoProfiles: CryptoPortfolio;
}

export interface LoginResDto {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponseDto {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface SignupResDto {
    accessToken: string;
    refreshToken: string;
}

export interface ExportResult {
    downloadUrl: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    expiresAt: DateTime;
}

export interface AssetInfoOutput {
    id: string;
    name: string;
    symbol: string;
    category: string;
    desc: string;
    logo: string;
    tag: string;
    historicalProfits?: Nullable<HistoricalAssetProfit[]>;
    trades?: Nullable<Trade[]>;
    lastPrice: number;
}

export interface CreateCryptoRes {
    userId: number;
}

export interface TotalSpentAmountOutput {
    amount: number;
    month: number;
    year: number;
}

export interface CryptoPriceResult {
    tokenSymbol: string;
    usdPrice: number;
    tokenAmount: string;
}

export interface DiscountValidationResult {
    isValid: boolean;
    discount?: Nullable<MembershipDiscount>;
    originalAmount?: Nullable<string>;
    discountAmount?: Nullable<string>;
    finalAmount?: Nullable<string>;
    errorCode?: Nullable<DiscountErrorCode>;
}

export interface GeneralUrl {
    overview: string;
}

export interface CustomerPortalUrls {
    general: GeneralUrl;
}

export interface CustomerPortalSessionResponse {
    id: string;
    customerId: string;
    urls: CustomerPortalUrls;
    createdAt: string;
}

export interface PaymentSession {
    sessionId: string;
    userId: number;
    planId: string;
    priceId: string;
    discountId?: Nullable<string>;
    discountAmount?: Nullable<number>;
    finalAmount: number;
    expiresAt: DateTime;
    createdAt: DateTime;
}

export interface IQuery {
    getMe(): User | Promise<User>;
    getCryptoPortfolios(): CryptoPortfolio[] | Promise<CryptoPortfolio[]>;
    getCreatePortfolioExecutions(): CreatePortfolioExecution[] | Promise<CreatePortfolioExecution[]>;
    getAssetInfo(data: GetAssetInfoInput): AssetInfo | Promise<AssetInfo>;
    getAssetPrices(data: GetAssetPriceInput, pagination: PaginationInput): AssetPrice[] | Promise<AssetPrice[]>;
    getHistoricalBalances(data: GetHistoricalBalanceInput, pagination: PaginationInput): HistoricalCryptoBalance[] | Promise<HistoricalCryptoBalance[]>;
    getHistoricalAssetProfits(data: GetHistoricalAssetProfitInput, pagination: PaginationInput): HistoricalAssetProfit[] | Promise<HistoricalAssetProfit[]>;
    getTrades(data: GetTradeInput): Trade[] | Promise<Trade[]>;
    getBankManagers(): BankManager[] | Promise<BankManager[]>;
    getBankAccounts(): BankAccount[] | Promise<BankAccount[]>;
    getBankTransactions(): BankTransaction[] | Promise<BankTransaction[]>;
    getExpenses(startDate?: Nullable<DateTime>, endDate?: Nullable<DateTime>): Expense[] | Promise<Expense[]>;
    getSuggestedExpenses(data: SuggestExpenseInput): Expense[] | Promise<Expense[]>;
    getExpenseCategories(name?: Nullable<string>, startDate?: Nullable<DateTime>, endDate?: Nullable<DateTime>): ExpenseCategory[] | Promise<ExpenseCategory[]>;
    getMonthlyTargets(categoryId: string, month?: Nullable<number>, year?: Nullable<number>): MonthlyTarget[] | Promise<MonthlyTarget[]>;
    getEvents(startDate?: Nullable<DateTime>, endDate?: Nullable<DateTime>): Event[] | Promise<Event[]>;
    getEventCategories(): EventCategory[] | Promise<EventCategory[]>;
    getRecurrenceTemplates(): EventRecurrence[] | Promise<EventRecurrence[]>;
    getRecurrenceTemplate(id: number): EventRecurrence | Promise<EventRecurrence>;
    getMembershipPlans(): MembershipPlan[] | Promise<MembershipPlan[]>;
    getMembershipPlan(id: string): MembershipPlan | Promise<MembershipPlan>;
    getMembershipPrices(): MembershipPrice[] | Promise<MembershipPrice[]>;
    getMembershipPrice(id: string): MembershipPrice | Promise<MembershipPrice>;
    getMembershipPricesByPlan(planId: string): MembershipPrice[] | Promise<MembershipPrice[]>;
    myActiveMembershipSubscriptions(): MembershipSubscription[] | Promise<MembershipSubscription[]>;
    myMembershipSubscriptions(): MembershipSubscription[] | Promise<MembershipSubscription[]>;
    myMembershipFeatures(): MembershipFeature[] | Promise<MembershipFeature[]>;
    getDiscounts(): MembershipDiscount[] | Promise<MembershipDiscount[]>;
    getDiscount(id: string): MembershipDiscount | Promise<MembershipDiscount>;
    validateDiscountCode(data: ValidateDiscountDto): DiscountValidationResult | Promise<DiscountValidationResult>;
    getDiscountsForPrice(priceId: string): MembershipDiscount[] | Promise<MembershipDiscount[]>;
    getPaymentMethod(data: GetPaymentMethodDto): Nullable<PaymentMethod> | Promise<Nullable<PaymentMethod>>;
    getPaymentMethods(): PaymentMethod[] | Promise<PaymentMethod[]>;
    getCryptoPrice(tokenSymbol: string, usdAmount: number): CryptoPriceResult | Promise<CryptoPriceResult>;
    getPaymentSession(data: GetPaymentSessionDto): PaymentSession | Promise<PaymentSession>;
    getFeatures(): Feature[] | Promise<Feature[]>;
    getFeature(id: number): Feature | Promise<Feature>;
}

export interface IMutation {
    createCryptoPortfolio(data: CreateCryptoPortfolioInput): CreateCryptoRes | Promise<CreateCryptoRes>;
    retryPortfolioCreation(executionId: number): CreatePortfolioExecution | Promise<CreatePortfolioExecution>;
    updatePortfolioCredentials(executionId: number, credentials: UpdateCredentialsInput): CreatePortfolioExecution | Promise<CreatePortfolioExecution>;
    createSupportTicket(data: CreateSupportTicketInput): boolean | Promise<boolean>;
    exportPortfolio(input: ExportPortfolioInput): ExportResult | Promise<ExportResult>;
    login(data: LoginReqDto): LoginResDto | Promise<LoginResDto>;
    signup(data: CreateUserInput): SignupResDto | Promise<SignupResDto>;
    verifyAccount(data: VerifyDto): LoginResDto | Promise<LoginResDto>;
    refreshToken(data: RefreshTokenInputDto): RefreshTokenResponseDto | Promise<RefreshTokenResponseDto>;
    logout(): boolean | Promise<boolean>;
    createBankManager(data: CreateBankManagerInput): BankManager | Promise<BankManager>;
    createBankAccount(data: CreateBankAccountInput): BankAccount | Promise<BankAccount>;
    createBankTransaction(data: CreateBankTransactionInput): BankTransaction | Promise<BankTransaction>;
    removeBankTransaction(id: number): BankTransaction | Promise<BankTransaction>;
    createExpense(data: CreateExpenseInput): Expense | Promise<Expense>;
    updateExpense(id: string, data: UpdateExpenseInput): Expense | Promise<Expense>;
    removeExpense(id: string): Expense | Promise<Expense>;
    removeExpenses(ids: string[]): number | Promise<number>;
    createExpenseCategory(data: CreateExpenseCategoryInput): ExpenseCategory | Promise<ExpenseCategory>;
    updateExpenseCategory(id: string, data: UpdateExpenseCategoryInput): ExpenseCategory | Promise<ExpenseCategory>;
    removeExpenseCategory(id: string): ExpenseCategory | Promise<ExpenseCategory>;
    createMonthlyTarget(data: CreateMonthlyTargetInput): MonthlyTarget | Promise<MonthlyTarget>;
    updateMonthlyTarget(id: string, data: UpdateMonthlyTargetInput): MonthlyTarget | Promise<MonthlyTarget>;
    createEvent(data: CreateEventInput): Event | Promise<Event>;
    updateEvent(id: number, data: UpdateEventInput): Event | Promise<Event>;
    removeEvent(id: number): Event | Promise<Event>;
    createEventCategory(data: CreateEventCategoryInput): EventCategory | Promise<EventCategory>;
    updateEventCategory(id: number, data: UpdateEventCategoryInput): EventCategory | Promise<EventCategory>;
    removeEventCategory(id: number): EventCategory | Promise<EventCategory>;
    updateRecurrenceTemplate(id: number, data: UpdateEventRecurrenceInput): EventRecurrence | Promise<EventRecurrence>;
    deleteRecurrenceTemplate(id: number): EventRecurrence | Promise<EventRecurrence>;
    createMembershipPlan(data: CreatePlanDto): MembershipPlan | Promise<MembershipPlan>;
    updateMembershipPlan(id: string, data: UpdatePlanDto): MembershipPlan | Promise<MembershipPlan>;
    deleteMembershipPlan(id: string): boolean | Promise<boolean>;
    createMembershipPrice(data: CreatePriceDto): MembershipPrice | Promise<MembershipPrice>;
    updateMembershipPrice(id: string, data: UpdatePriceDto): MembershipPrice | Promise<MembershipPrice>;
    deleteMembershipPrice(id: string): boolean | Promise<boolean>;
    createMembershipSubscription(data: CreateSubscriptionDto): MembershipSubscription | Promise<MembershipSubscription>;
    updateMembershipSubscription(id: string, data: UpdateSubscriptionDto): MembershipSubscription | Promise<MembershipSubscription>;
    createDiscount(data: CreateDiscountDto): MembershipDiscount | Promise<MembershipDiscount>;
    updateDiscount(id: string, data: UpdateDiscountDto): MembershipDiscount | Promise<MembershipDiscount>;
    deleteDiscount(id: string): boolean | Promise<boolean>;
    linkDiscountToPrice(discountId: string, priceId: string): boolean | Promise<boolean>;
    unlinkDiscountFromPrice(discountId: string, priceId: string): boolean | Promise<boolean>;
    createMetaMaskPaymentMethod(input: CreateMetaMaskPaymentMethodDto): boolean | Promise<boolean>;
    createMetaMaskSubscriptionFromSession(input: CreateMetaMaskSubscriptionFromSessionDto): boolean | Promise<boolean>;
    cancelPaddleSubscription(id: string): MembershipSubscription | Promise<MembershipSubscription>;
    reactivatePaddleSubscription(id: string, handlePastDueTransactions?: Nullable<string>): MembershipSubscription | Promise<MembershipSubscription>;
    createCustomerPortalSession(subscriptionIds?: Nullable<string[]>): CustomerPortalSessionResponse | Promise<CustomerPortalSessionResponse>;
    createPaymentSession(data: CreatePaymentSessionDto): PaymentSession | Promise<PaymentSession>;
    createFeature(data: CreateFeatureDto): Feature | Promise<Feature>;
    updateFeature(id: number, data: UpdateFeatureDto): Feature | Promise<Feature>;
    deleteFeature(id: number): Feature | Promise<Feature>;
}

export interface ISubscription {
    onCreatePortfolioExecution(): CreatePortfolioExecution | Promise<CreatePortfolioExecution>;
    newAssetPrice(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
    newHistoricalCryptoBalance(data: GetHistoricalBalancesInput): HistoricalCryptoBalance | Promise<HistoricalCryptoBalance>;
    newHistoricalAssetProfit(data: GetHistoricalAssetProfitInput): HistoricalAssetProfit | Promise<HistoricalAssetProfit>;
    onMembershipSubscriptionUpdated(): MembershipSubscription | Promise<MembershipSubscription>;
}

export type DateTime = any;
export type JSON = any;
export type Decimal = any;
type Nullable<T> = T | null;
