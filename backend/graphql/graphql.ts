
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

export enum Interval {
    day = "day",
    week = "week",
    month = "month",
    year = "year"
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
    PADDLE = "PADDLE"
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

export interface GetPaymentMethodDto {
    id?: Nullable<number>;
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

export interface CreateFeatureDto {
    type: FeatureType;
}

export interface UpdateFeatureDto {
    type?: Nullable<FeatureType>;
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
}

export interface PaddlePaymentMethod {
    id: number;
    paymentMethodId: number;
    customerId: string;
    addressId?: Nullable<string>;
    businessId?: Nullable<string>;
    paymentMethod: PaymentMethod;
}

export interface PaymentMethod {
    id: number;
    userId: number;
    provider: PaymentProvider;
    user: User;
    paddlePaymentMethod?: Nullable<PaddlePaymentMethod>;
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

export interface CreatePortfolioExecution {
    id: number;
    time?: Nullable<DateTime>;
    userId: number;
    status: CreateExecutionStatus;
}

export interface CreateCryptoRes {
    userId: number;
}

export interface TotalSpentAmountOutput {
    amount: number;
    month: number;
    year: number;
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
    getRecurrenceTemplates(): EventRecurrence[] | Promise<EventRecurrence[]>;
    getRecurrenceTemplate(id: number): EventRecurrence | Promise<EventRecurrence>;
    getMembershipPlans(): MembershipPlan[] | Promise<MembershipPlan[]>;
    getMembershipPlan(id: string): MembershipPlan | Promise<MembershipPlan>;
    getMembershipPrices(): MembershipPrice[] | Promise<MembershipPrice[]>;
    getMembershipPrice(id: string): MembershipPrice | Promise<MembershipPrice>;
    getMembershipPricesByPlan(planId: string): MembershipPrice[] | Promise<MembershipPrice[]>;
    myMembershipFeatures(): MembershipFeature[] | Promise<MembershipFeature[]>;
    getFeatures(): Feature[] | Promise<Feature[]>;
    getFeature(id: number): Feature | Promise<Feature>;
    myActiveMembershipSubscriptions(): MembershipSubscription[] | Promise<MembershipSubscription[]>;
    myMembershipSubscriptions(): MembershipSubscription[] | Promise<MembershipSubscription[]>;
    getPaymentMethod(data: GetPaymentMethodDto): Nullable<PaymentMethod> | Promise<Nullable<PaymentMethod>>;
    getPaymentMethods(): PaymentMethod[] | Promise<PaymentMethod[]>;
}

export interface IMutation {
    createCryptoPortfolio(data: CreateCryptoPortfolioInput): CreateCryptoRes | Promise<CreateCryptoRes>;
    createOKXCryptoPortfolio(data: CreateOKXCryptoPortfolioInput): CreateCryptoRes | Promise<CreateCryptoRes>;
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
    cancelPaddleSubscription(id: string): MembershipSubscription | Promise<MembershipSubscription>;
    reactivatePaddleSubscription(id: string, handlePastDueTransactions?: Nullable<string>): MembershipSubscription | Promise<MembershipSubscription>;
    createCustomerPortalSession(subscriptionIds?: Nullable<string[]>): CustomerPortalSessionResponse | Promise<CustomerPortalSessionResponse>;
    createMembershipPlan(data: CreatePlanDto): MembershipPlan | Promise<MembershipPlan>;
    updateMembershipPlan(id: string, data: UpdatePlanDto): MembershipPlan | Promise<MembershipPlan>;
    deleteMembershipPlan(id: string): boolean | Promise<boolean>;
    createMembershipPrice(data: CreatePriceDto): MembershipPrice | Promise<MembershipPrice>;
    updateMembershipPrice(id: string, data: UpdatePriceDto): MembershipPrice | Promise<MembershipPrice>;
    deleteMembershipPrice(id: string): boolean | Promise<boolean>;
    createFeature(data: CreateFeatureDto): Feature | Promise<Feature>;
    updateFeature(id: number, data: UpdateFeatureDto): Feature | Promise<Feature>;
    deleteFeature(id: number): Feature | Promise<Feature>;
    createMembershipSubscription(data: CreateSubscriptionDto): MembershipSubscription | Promise<MembershipSubscription>;
    updateMembershipSubscription(id: string, data: UpdateSubscriptionDto): MembershipSubscription | Promise<MembershipSubscription>;
}

export interface ISubscription {
    onCreatePortfolioExecution(): CreatePortfolioExecution | Promise<CreatePortfolioExecution>;
    newAssetPrice(data: GetAssetPriceInput): AssetPrice | Promise<AssetPrice>;
    newHistoricalCryptoBalance(data: GetHistoricalBalancesInput): HistoricalCryptoBalance | Promise<HistoricalCryptoBalance>;
    newHistoricalAssetProfit(data: GetHistoricalAssetProfitInput): HistoricalAssetProfit | Promise<HistoricalAssetProfit>;
    onMembershipSubscriptionUpdated(): MembershipSubscription | Promise<MembershipSubscription>;
}

export type DateTime = any;
export type Decimal = any;
type Nullable<T> = T | null;
