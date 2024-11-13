
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
    bankTransactionId: string;
    name: string;
    description?: Nullable<string>;
    amount: number;
}

export interface UpdateExpenseInput {
    categoryId?: Nullable<string>;
    bankTransactionId?: Nullable<string>;
    name?: Nullable<string>;
    description?: Nullable<string>;
    amount?: Nullable<number>;
}

export interface CreateExpenseCategoryInput {
    userId: number;
    name: string;
    color: string;
    description?: Nullable<string>;
}

export interface UpdateExpenseCategoryInput {
    name?: Nullable<string>;
    color?: Nullable<string>;
    description?: Nullable<string>;
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
    id: string;
    userId: number;
    exchanges: string;
    tradingType: TradingType;
    apiKey: string;
    secretKey: string;
    updateTime?: Nullable<DateTime>;
    balances: AssetBalance[];
    user: User;
    historicalBalances: HistoricalCryptoBalance[];
}

export interface ExpenseCategory {
    id: string;
    userId: number;
    name: string;
    color: string;
    description?: Nullable<string>;
    expenses?: Nullable<Expense[]>;
    user: User;
    countExpenses: number;
    totalAmount?: number;
}

export interface Expense {
    id: string;
    userId: number;
    categoryId: string;
    bankTransactionId: string;
    name: string;
    description?: Nullable<string>;
    amount: number;
    createdAt: DateTime;
    category: ExpenseCategory;
    user: User;
    bankTransaction: BankTransaction;
    transaction: BankTransaction;
}

export interface BankTransaction {
    id: string;
    bankId: string;
    amount: number;
    description: string;
    spentAmount: number;
    createdAt: DateTime;
    expense?: Nullable<Expense[]>;
    bank: BankAccount;
}

export interface BankAccount {
    id: string;
    name: string;
    fullName: string;
    bankManagerId: string;
    accountName: string;
    accountNumber: string;
    balance: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    bankManager: BankManager;
    transactions: BankTransaction[];
}

export interface BankManager {
    id: string;
    userId: number;
    name: string;
    apiKey: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    user: User;
    banks: BankAccount[];
}

export interface User {
    id: number;
    email: string;
    name?: Nullable<string>;
    password: string;
    otp?: Nullable<string>;
    otpPurpose?: Nullable<OtpPurpose>;
    cryptoPortfolios?: Nullable<CryptoPortfolio[]>;
    bankManager?: Nullable<BankManager[]>;
    expenseCategories?: Nullable<ExpenseCategory[]>;
    expenses?: Nullable<Expense[]>;
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
    id?: Nullable<string>;
    name?: Nullable<string>;
    symbol?: Nullable<string>;
    category?: Nullable<string>;
    desc?: Nullable<string>;
    logo?: Nullable<string>;
    assetBalances?: Nullable<AssetBalance[]>;
    assetPrices?: Nullable<AssetPrice[]>;
    lastPrice: number;
}

export interface IQuery {
    getMe(): User | Promise<User>;
    getCryptoPortfolios(data: GetCryptoPortfolioInput): CryptoPortfolio[] | Promise<CryptoPortfolio[]>;
    getAssetInfo(data: GetAssetInfoInput): AssetInfo | Promise<AssetInfo>;
    getAssetPrices(data: GetAssetPriceInput, pagination: PaginationInput): AssetPrice[] | Promise<AssetPrice[]>;
    getBankManagers(userId: number): BankManager[] | Promise<BankManager[]>;
    getBankTransactions(userId: number): BankTransaction[] | Promise<BankTransaction[]>;
    getExpenses(userId: number, startDate?: Nullable<DateTime>, endDate?: Nullable<DateTime>): Expense[] | Promise<Expense[]>;
    getExpenseCategories(userId: number): ExpenseCategory[] | Promise<ExpenseCategory[]>;
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
}

export interface ISubscription {
    portfolioCreated(data: GetCryptoPortfolioInput): CryptoPortfolio | Promise<CryptoPortfolio>;
    newAssetPrice1m(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
    newAssetPrice5m(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
}

export type DateTime = any;
type Nullable<T> = T | null;
