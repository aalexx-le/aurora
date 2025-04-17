
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

export enum CEXExchanges {
    BINANCE = "BINANCE",
    MEXC = "MEXC",
    OKX = "OKX",
    ALL = "ALL"
}

export enum TradingType {
    FUTURES = "FUTURES",
    SPOT = "SPOT"
}

export enum RecurrenceType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}

export enum OtpPurpose {
    VERIFY_ACCOUNT = "VERIFY_ACCOUNT",
    RESET_PASSWORD = "RESET_PASSWORD"
}

export enum CreateExecutionStatus {
    QUEUE = "QUEUE",
    PROCESSING = "PROCESSING",
    FAILED = "FAILED",
    SUCCESS = "SUCCESS"
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

export interface CreateCryptoPortfolioInput {
    name: string;
    exchanges: CEXExchanges;
    apiKey: string;
    secretKey: string;
}

export interface CreateOKXCryptoPortfolioInput {
    name: string;
    exchanges: CEXExchanges;
    apiKey: string;
    secretKey: string;
    passphrase: string;
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
    categoryId?: Nullable<number>;
    reminderMinutes?: Nullable<number>;
    recurrence?: Nullable<CreateRecurrenceInput>;
}

export interface CreateEventCategoryInput {
    name: string;
    color: string;
}

export interface UpdateEventCategoryInput {
    name?: Nullable<string>;
    color?: Nullable<string>;
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
    assetInfo: AssetInfoOutput;
    cryptoPortfolio: CryptoPortfolio;
}

export interface Trade {
    cryptoPortfolioId: string;
    assetInfoId: string;
    price: number;
    qty: number;
    quoteQty: number;
    commission: number;
    commissionAsset: string;
    time: DateTime;
    isBuyer: boolean;
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
    cryptoPortfolio: CryptoPortfolio;
}

export interface OKXCryptoPortfolio {
    id: string;
    cryptoPortfolioId: string;
    passphrase: string;
    cryptoPortfolio: CryptoPortfolio;
}

export interface CryptoPortfolio {
    userId: number;
    name: string;
    status: PortfolioStatus;
    exchanges: CEXExchanges;
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
    okxPortfolio?: Nullable<OKXCryptoPortfolio>;
    parentPortfolio?: Nullable<CryptoPortfolio>;
    childPortfolios?: Nullable<CryptoPortfolio[]>;
    latestHistoricalBalances?: HistoricalCryptoBalance;
    latestAssetProfits: HistoricalAssetProfit[];
}

export interface Recurrence {
    id: number;
    type: RecurrenceType;
    interval: number;
    daysOfWeek?: Nullable<string>;
    dayOfMonth?: Nullable<number>;
    weekOfMonth?: Nullable<number>;
    dayOfWeek?: Nullable<number>;
    endDate?: Nullable<DateTime>;
    endCount?: Nullable<number>;
    eventId: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    event: Event;
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
    userId: number;
    categoryId: number;
    reminderMinutes?: Nullable<number>;
    createdAt: DateTime;
    updatedAt: DateTime;
    recurrence?: Nullable<Recurrence>;
    user: User;
    category: EventCategory;
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
    expenses?: Nullable<Expense[]>;
    expenseCategories?: Nullable<ExpenseCategory[]>;
    events?: Nullable<Event[]>;
    eventCategories?: Nullable<EventCategory[]>;
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

export interface CreatePortfolioExecution {
    id: number;
    time?: Nullable<DateTime>;
    userId: number;
    status: CreateExecutionStatus;
}

export interface CreateCryptoRes {
    userId: number;
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

export interface TotalSpentAmountOutput {
    amount: number;
    month: number;
    year: number;
}

export interface IQuery {
    getMe(): User | Promise<User>;
    getCryptoPortfolios(): CryptoPortfolio[] | Promise<CryptoPortfolio[]>;
    getCreatePortfolioExecutions(userId: number): CreatePortfolioExecution[] | Promise<CreatePortfolioExecution[]>;
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
}

export interface IMutation {
    createCryptoPortfolio(data: CreateCryptoPortfolioInput): CreateCryptoRes | Promise<CreateCryptoRes>;
    createOKXCryptoPortfolio(data: CreateOKXCryptoPortfolioInput): CreateCryptoRes | Promise<CreateCryptoRes>;
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
}

export interface ISubscription {
    portfolioCreated(): CryptoPortfolio | Promise<CryptoPortfolio>;
    newAssetPrice1m(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
    newAssetPrice5m(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
    newHistoricalCryptoBalance1m(data: GetHistoricalBalancesInput): HistoricalCryptoBalance | Promise<HistoricalCryptoBalance>;
    newHistoricalCryptoBalance1h(data: GetHistoricalBalancesInput): HistoricalCryptoBalance | Promise<HistoricalCryptoBalance>;
    newHistoricalAssetProfit1m(data: GetHistoricalAssetProfitInput): HistoricalAssetProfit | Promise<HistoricalAssetProfit>;
    newHistoricalAssetProfit1h(data: GetHistoricalAssetProfitInput): HistoricalAssetProfit | Promise<HistoricalAssetProfit>;
}

export type DateTime = any;
type Nullable<T> = T | null;
