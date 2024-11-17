
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum TradingType {
    FUTURES = "FUTURES",
    SPOT = "SPOT"
}

export enum OtpPurpose {
    VERIFY_ACCOUNT = "VERIFY_ACCOUNT",
    RESET_PASSWORD = "RESET_PASSWORD"
}

export interface GetCryptoPortfolioInput {
    userId: number;
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

export interface CreateCryptoPortfolioInput {
    userId: number;
    apiKey: string;
    secretKey: string;
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

export interface CreateBankManagerInput {
    name: string;
    userId: number;
    apiKey: string;
}

export interface CreateExpenseInput {
    userId: number;
    categoryId: string;
    name: string;
    description?: Nullable<string>;
    amount: number;
    bankTransactionId: string;
}

export interface UpdateExpenseInput {
    categoryId?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    amount?: Nullable<number>;
    bankTransactionId?: Nullable<string>;
}

export interface CreateExpenseCategoryInput {
    userId: number;
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
    totalAmount?: number;
}

export interface Expense {
    id: string;
    userId: number;
    categoryId: string;
    name: string;
    description?: Nullable<string>;
    amount: number;
    bankTransactionId: string;
    createdAt: DateTime;
    bankTransaction: BankTransaction;
    category: ExpenseCategory;
    user: User;
    transaction: BankTransaction;
}

export interface BankTransaction {
    id: string;
    bankId: string;
    amount: number;
    description: string;
    createdAt: DateTime;
    spentAmount: number;
    bank: BankAccount;
    expense?: Nullable<Expense[]>;
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
}

export interface BankManager {
    id: string;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    apiKey: string;
    userId: number;
    banks: BankAccount[];
    user: User;
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

export interface AssetInfo {
    id: string;
    name: string;
    symbol: string;
    category: string;
    desc: string;
    logo: string;
    assetBalances?: Nullable<AssetBalance[]>;
    assetPrices?: Nullable<AssetPrice[]>;
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

export interface CryptoPortfolio {
    userId: number;
    exchanges: string;
    tradingType: TradingType;
    apiKey: string;
    secretKey: string;
    updateTime?: Nullable<DateTime>;
    id: string;
    investmentCategoryName?: Nullable<string>;
    balances: AssetBalance[];
    user: User;
    historicalBalances?: Nullable<HistoricalCryptoBalance[]>;
    latestHistoricalBalances?: HistoricalCryptoBalance;
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
    cryptoProfiles: CryptoPortfolio;
}

export interface LoginResDto {
    accessToken: string;
    refreshToken: string;
}

export interface SignupResDto {
    accessToken: string;
    refreshToken: string;
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
    lastPrice: number;
}

export interface IQuery {
    getMe(): User | Promise<User>;
    getCryptoPortfolios(data: GetCryptoPortfolioInput): CryptoPortfolio[] | Promise<CryptoPortfolio[]>;
    getAssetInfo(data: GetAssetInfoInput): AssetInfo | Promise<AssetInfo>;
    getAssetPrices(data: GetAssetPriceInput, pagination: PaginationInput): AssetPrice[] | Promise<AssetPrice[]>;
    getHistoricalBalances(data: GetHistoricalBalanceInput, pagination: PaginationInput): HistoricalCryptoBalance[] | Promise<HistoricalCryptoBalance[]>;
    getBankManagers(userId: number): BankManager[] | Promise<BankManager[]>;
    getBankTransactions(userId: number): BankTransaction[] | Promise<BankTransaction[]>;
    getExpenses(userId: number, startDate?: Nullable<DateTime>, endDate?: Nullable<DateTime>): Expense[] | Promise<Expense[]>;
    getExpenseCategories(userId?: Nullable<number>, name?: Nullable<string>): ExpenseCategory[] | Promise<ExpenseCategory[]>;
    getMonthlyTargets(categoryId: string, month?: Nullable<number>, year?: Nullable<number>): MonthlyTarget[] | Promise<MonthlyTarget[]>;
}

export interface IMutation {
    createCryptoPortfolio(data: CreateCryptoPortfolioInput): CreateCryptoRes | Promise<CreateCryptoRes>;
    login(data: LoginReqDto): LoginResDto | Promise<LoginResDto>;
    signup(data: CreateUserInput): SignupResDto | Promise<SignupResDto>;
    verifyAccount(data: VerifyDto): LoginResDto | Promise<LoginResDto>;
    createBank(data: CreateBankManagerInput): BankManager | Promise<BankManager>;
    createExpense(data: CreateExpenseInput): Expense | Promise<Expense>;
    updateExpense(id: string, data: UpdateExpenseInput): Expense | Promise<Expense>;
    removeExpense(id: string): Expense | Promise<Expense>;
    removeExpenses(ids: string[]): number | Promise<number>;
    createExpenseCategory(data: CreateExpenseCategoryInput): ExpenseCategory | Promise<ExpenseCategory>;
    updateExpenseCategory(id: string, data: UpdateExpenseCategoryInput): ExpenseCategory | Promise<ExpenseCategory>;
    removeExpenseCategory(id: string): ExpenseCategory | Promise<ExpenseCategory>;
    createMonthlyTarget(data: CreateMonthlyTargetInput): MonthlyTarget | Promise<MonthlyTarget>;
    updateMonthlyTarget(id: string, data: UpdateMonthlyTargetInput): MonthlyTarget | Promise<MonthlyTarget>;
}

export interface ISubscription {
    portfolioCreated(data: GetCryptoPortfolioInput): CryptoPortfolio | Promise<CryptoPortfolio>;
    newAssetPrice1m(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
    newAssetPrice5m(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
}

export type DateTime = any;
type Nullable<T> = T | null;
