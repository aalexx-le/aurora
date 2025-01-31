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
  apiKey: Scalars['String']['output'];
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
  id: Scalars['String']['output'];
  spentAmount: Scalars['Float']['output'];
};

export enum CexExchanges {
  All = 'ALL',
  Binance = 'BINANCE',
  Mexc = 'MEXC',
  Okx = 'OKX'
}

export type CreateBankManagerInput = {
  apiKey: Scalars['String']['input'];
  name: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateCryptoPortfolioInput = {
  apiKey: Scalars['String']['input'];
  exchanges?: CexExchanges;
  name?: Scalars['String']['input'];
  secretKey: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateCryptoRes = {
  __typename?: 'CreateCryptoRes';
  userId: Scalars['Float']['output'];
};

export enum CreateExecutionStatus {
  Failed = 'FAILED',
  Processing = 'PROCESSING',
  Queue = 'QUEUE',
  Success = 'SUCCESS'
}

export type CreateExpenseCategoryInput = {
  color: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  bankTransactionId: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateMonthlyTargetInput = {
  categoryId: Scalars['String']['input'];
  month: Scalars['Int']['input'];
  target: Scalars['Float']['input'];
  year: Scalars['Int']['input'];
};

export type CreateOkxCryptoPortfolioInput = {
  apiKey: Scalars['String']['input'];
  exchanges?: CexExchanges;
  name?: Scalars['String']['input'];
  passphrase: Scalars['String']['input'];
  secretKey: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreatePortfolioExecution = {
  __typename?: 'CreatePortfolioExecution';
  id: Scalars['Int']['output'];
  status: CreateExecutionStatus;
  time?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['Int']['output'];
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
  exchanges: CexExchanges;
  historicalAssetProfits?: Maybe<Array<HistoricalAssetProfit>>;
  historicalBalances?: Maybe<Array<HistoricalCryptoBalance>>;
  id: Scalars['String']['output'];
  investmentCategoryName?: Maybe<Scalars['String']['output']>;
  latestAssetProfits: Array<HistoricalAssetProfit>;
  latestHistoricalBalances: HistoricalCryptoBalance;
  name: Scalars['String']['output'];
  parentPortfolio?: Maybe<CryptoPortfolio>;
  parentPortfolioId?: Maybe<Scalars['String']['output']>;
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

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float']['output'];
  bankTransaction: BankTransaction;
  bankTransactionId: Scalars['String']['output'];
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

export type GetAssetInfoInput = {
  id: Scalars['String']['input'];
};

export type GetAssetPriceInput = {
  assetInfoId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetCryptoPortfolioInput = {
  userId: Scalars['Int']['input'];
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

export type GetTradeInput = {
  assetInfoId?: InputMaybe<Scalars['String']['input']>;
  cryptoPortfolioId?: InputMaybe<Scalars['String']['input']>;
};

export type HistoricalAssetProfit = {
  __typename?: 'HistoricalAssetProfit';
  assetInfo: AssetInfoOutput;
  assetInfoId: Scalars['String']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  estimatedProfit: Scalars['Float']['output'];
  remainingQty: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
  totalCostInQuoteQty: Scalars['Float']['output'];
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
  changeBalance: Scalars['Float']['output'];
  changePercent: Scalars['Float']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  estimatedBalance: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
};

export type LoginReqDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResDto = {
  __typename?: 'LoginResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
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
  createBank: BankManager;
  createCryptoPortfolio: CreateCryptoRes;
  createExpense: Expense;
  createExpenseCategory: ExpenseCategory;
  createMonthlyTarget: MonthlyTarget;
  createOKXCryptoPortfolio: CreateCryptoRes;
  login: LoginResDto;
  removeExpense: Expense;
  removeExpenseCategory: ExpenseCategory;
  removeExpenses: Scalars['Int']['output'];
  signup: SignupResDto;
  updateExpense: Expense;
  updateExpenseCategory: ExpenseCategory;
  updateMonthlyTarget: MonthlyTarget;
  verifyAccount: LoginResDto;
};


export type MutationCreateBankArgs = {
  data: CreateBankManagerInput;
};


export type MutationCreateCryptoPortfolioArgs = {
  data: CreateCryptoPortfolioInput;
};


export type MutationCreateExpenseArgs = {
  data: CreateExpenseInput;
};


export type MutationCreateExpenseCategoryArgs = {
  data: CreateExpenseCategoryInput;
};


export type MutationCreateMonthlyTargetArgs = {
  data: CreateMonthlyTargetInput;
};


export type MutationCreateOkxCryptoPortfolioArgs = {
  data: CreateOkxCryptoPortfolioInput;
};


export type MutationLoginArgs = {
  data: LoginReqDto;
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


export type MutationSignupArgs = {
  data: CreateUserInput;
};


export type MutationUpdateExpenseArgs = {
  data: UpdateExpenseInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateExpenseCategoryArgs = {
  data: UpdateExpenseCategoryInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateMonthlyTargetArgs = {
  data: UpdateMonthlyTargetInput;
  id: Scalars['String']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerifyDto;
};

export enum OtpPurpose {
  ResetPassword = 'RESET_PASSWORD',
  VerifyAccount = 'VERIFY_ACCOUNT'
}

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export enum PortfolioStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type Query = {
  __typename?: 'Query';
  getAssetInfo: AssetInfo;
  getAssetPrices: Array<AssetPrice>;
  getBankManagers: Array<BankManager>;
  getBankTransactions: Array<BankTransaction>;
  getCreatePortfolioExecutions: Array<CreatePortfolioExecution>;
  getCryptoPortfolios: Array<CryptoPortfolio>;
  getExpenseCategories: Array<ExpenseCategory>;
  getExpenses: Array<Expense>;
  getHistoricalAssetProfits: Array<HistoricalAssetProfit>;
  getHistoricalBalances: Array<HistoricalCryptoBalance>;
  getMe: User;
  getMonthlyTargets: Array<MonthlyTarget>;
  getSuggestedExpenses: Array<Expense>;
  getTrades: Array<Trade>;
};


export type QueryGetAssetInfoArgs = {
  data: GetAssetInfoInput;
};


export type QueryGetAssetPricesArgs = {
  data: GetAssetPriceInput;
  pagination: PaginationInput;
};


export type QueryGetBankManagersArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryGetBankTransactionsArgs = {
  userId: Scalars['Float']['input'];
};


export type QueryGetCreatePortfolioExecutionsArgs = {
  userId: Scalars['Float']['input'];
};


export type QueryGetCryptoPortfoliosArgs = {
  data: GetCryptoPortfolioInput;
};


export type QueryGetExpenseCategoriesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetExpensesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetHistoricalAssetProfitsArgs = {
  data: GetHistoricalAssetProfitInput;
  pagination: PaginationInput;
};


export type QueryGetHistoricalBalancesArgs = {
  data: GetHistoricalBalanceInput;
  pagination: PaginationInput;
};


export type QueryGetMonthlyTargetsArgs = {
  categoryId: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetSuggestedExpensesArgs = {
  bankTransactionId: Scalars['String']['input'];
};


export type QueryGetTradesArgs = {
  data: GetTradeInput;
};

export type SignupResDto = {
  __typename?: 'SignupResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newAssetPrice1m: AssetPrice;
  newAssetPrice5m: AssetPrice;
  newHistoricalAssetProfit1h: HistoricalAssetProfit;
  newHistoricalAssetProfit1m: HistoricalAssetProfit;
  newHistoricalCryptoBalance1h: HistoricalCryptoBalance;
  newHistoricalCryptoBalance1m: HistoricalCryptoBalance;
  portfolioCreated: CryptoPortfolio;
};


export type SubscriptionNewAssetPrice1mArgs = {
  data: GetAssetPriceInput;
};


export type SubscriptionNewAssetPrice5mArgs = {
  data: GetAssetPriceInput;
};


export type SubscriptionNewHistoricalAssetProfit1hArgs = {
  data: GetHistoricalAssetProfitInput;
};


export type SubscriptionNewHistoricalAssetProfit1mArgs = {
  data: GetHistoricalAssetProfitInput;
};


export type SubscriptionNewHistoricalCryptoBalance1hArgs = {
  data: GetHistoricalBalancesInput;
};


export type SubscriptionNewHistoricalCryptoBalance1mArgs = {
  data: GetHistoricalBalancesInput;
};


export type SubscriptionPortfolioCreatedArgs = {
  data: GetCryptoPortfolioInput;
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
  isBuyer: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
  qty: Scalars['Float']['output'];
  quoteQty: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
};

export enum TradingType {
  Futures = 'FUTURES',
  Spot = 'SPOT'
}

export type UpdateExpenseCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  bankTransactionId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMonthlyTargetInput = {
  month?: InputMaybe<Scalars['Int']['input']>;
  target?: InputMaybe<Scalars['Float']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  bankManager?: Maybe<Array<BankManager>>;
  cryptoPortfolios?: Maybe<Array<CryptoPortfolio>>;
  cryptoProfiles: CryptoPortfolio;
  email: Scalars['String']['output'];
  expenseCategories?: Maybe<Array<ExpenseCategory>>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  otpPurpose?: Maybe<OtpPurpose>;
  password: Scalars['String']['output'];
};

export type VerifyDto = {
  otp: Scalars['String']['input'];
  otpPurpose: OtpPurpose;
};

export type SignupMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'SignupResDto', accessToken: string, refreshToken: string } };

export type LoginMutationVariables = Exact<{
  data: LoginReqDto;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResDto', accessToken: string } };

export type VerifyAccountMutationVariables = Exact<{
  data: VerifyDto;
}>;


export type VerifyAccountMutation = { __typename?: 'Mutation', verifyAccount: { __typename?: 'LoginResDto', accessToken: string } };

export type NewHistoricalAssetProfit1mSubscriptionVariables = Exact<{
  data: GetHistoricalAssetProfitInput;
}>;


export type NewHistoricalAssetProfit1mSubscription = { __typename?: 'Subscription', newHistoricalAssetProfit1m: { __typename?: 'HistoricalAssetProfit', time: any, totalCostInQuoteQty: number, remainingQty: number, estimatedProfit: number, assetInfo: { __typename?: 'AssetInfoOutput', id: string, logo: string, lastPrice: number, symbol: string, tag: string } } };

export type NewHistoricalAssetProfit1hSubscriptionVariables = Exact<{
  data: GetHistoricalAssetProfitInput;
}>;


export type NewHistoricalAssetProfit1hSubscription = { __typename?: 'Subscription', newHistoricalAssetProfit1h: { __typename?: 'HistoricalAssetProfit', time: any, totalCostInQuoteQty: number, remainingQty: number, estimatedProfit: number, assetInfo: { __typename?: 'AssetInfoOutput', id: string, logo: string, lastPrice: number, symbol: string, tag: string } } };

export type CreateCryptoPortfolioMutationVariables = Exact<{
  data: CreateCryptoPortfolioInput;
}>;


export type CreateCryptoPortfolioMutation = { __typename?: 'Mutation', createCryptoPortfolio: { __typename?: 'CreateCryptoRes', userId: number } };

export type CreateOkxCryptoPortfolioMutationVariables = Exact<{
  data: CreateOkxCryptoPortfolioInput;
}>;


export type CreateOkxCryptoPortfolioMutation = { __typename?: 'Mutation', createOKXCryptoPortfolio: { __typename?: 'CreateCryptoRes', userId: number } };

export type GetCryptoPortfoliosQueryVariables = Exact<{
  data: GetCryptoPortfolioInput;
  timeFrame: Scalars['String']['input'];
}>;


export type GetCryptoPortfoliosQuery = { __typename?: 'Query', getCryptoPortfolios: Array<{ __typename?: 'CryptoPortfolio', id: string, name: string, exchanges: CexExchanges, tradingType: TradingType, investmentCategoryName?: string | null, latestHistoricalBalances: { __typename?: 'HistoricalCryptoBalance', changeBalance: number, changePercent: number, estimatedBalance: number }, latestAssetProfits: Array<{ __typename?: 'HistoricalAssetProfit', estimatedProfit: number, remainingQty: number, totalCostInQuoteQty: number, cryptoPortfolio: { __typename?: 'CryptoPortfolio', id: string, exchanges: CexExchanges, name: string }, assetInfo: { __typename?: 'AssetInfoOutput', id: string, logo: string, lastPrice: number, symbol: string, tag: string } }>, balances: Array<{ __typename?: 'AssetBalance', id: string, balance: number, cryptoPortfolio: { __typename?: 'CryptoPortfolio', id: string, exchanges: CexExchanges, name: string }, assetInfo: { __typename?: 'AssetInfoOutput', id: string, logo: string, lastPrice: number, symbol: string, tag: string } }> }> };

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

export type NewAssetPrice1mSubscriptionVariables = Exact<{
  data: GetAssetPriceInput;
}>;


export type NewAssetPrice1mSubscription = { __typename?: 'Subscription', newAssetPrice1m: { __typename?: 'AssetPrice', assetInfoId: string, open_time: any, openPrice: number, closePrice: number, highPrice: number, lowPrice: number } };

export type NewAssetPrice5mSubscriptionVariables = Exact<{
  data: GetAssetPriceInput;
}>;


export type NewAssetPrice5mSubscription = { __typename?: 'Subscription', newAssetPrice5m: { __typename?: 'AssetPrice', assetInfoId: string, open_time: any, openPrice: number, closePrice: number, highPrice: number, lowPrice: number } };

export type NewHistoricalCryptoBalance1mSubscriptionVariables = Exact<{
  data: GetHistoricalBalancesInput;
}>;


export type NewHistoricalCryptoBalance1mSubscription = { __typename?: 'Subscription', newHistoricalCryptoBalance1m: { __typename?: 'HistoricalCryptoBalance', cryptoPortfolioId: string, time: any, estimatedBalance: number, changeBalance: number, changePercent: number } };

export type NewHistoricalCryptoBalance1hSubscriptionVariables = Exact<{
  data: GetHistoricalBalancesInput;
}>;


export type NewHistoricalCryptoBalance1hSubscription = { __typename?: 'Subscription', newHistoricalCryptoBalance1h: { __typename?: 'HistoricalCryptoBalance', cryptoPortfolioId: string, time: any, estimatedBalance: number, changeBalance: number, changePercent: number } };

export type GetCreatePortfolioExecutionsQueryVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type GetCreatePortfolioExecutionsQuery = { __typename?: 'Query', getCreatePortfolioExecutions: Array<{ __typename?: 'CreatePortfolioExecution', id: number, status: CreateExecutionStatus, time?: any | null }> };

export type GetTradesQueryVariables = Exact<{
  data: GetTradeInput;
}>;


export type GetTradesQuery = { __typename?: 'Query', getTrades: Array<{ __typename?: 'Trade', time: any, price: number, qty: number, quoteQty: number, commission: number, commissionAsset: string, isBuyer: boolean, cryptoPortfolio: { __typename?: 'CryptoPortfolio', id: string, name: string, exchanges: CexExchanges } }> };

export type GetExpenseCategoriesQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
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
  updateMonthlyTargetId: Scalars['String']['input'];
  data: UpdateMonthlyTargetInput;
}>;


export type UpdateMonthlyTargetMutation = { __typename?: 'Mutation', updateMonthlyTarget: { __typename?: 'MonthlyTarget', categoryId: string } };

export type GetExpensesQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
}>;


export type GetExpensesQuery = { __typename?: 'Query', getExpenses: Array<{ __typename?: 'Expense', id: string, createdAt: any, description?: string | null, amount: number, name: string, category: { __typename?: 'ExpenseCategory', id: string, color: string, name: string }, transaction: { __typename?: 'BankTransaction', id: string, amount: number, spentAmount: number, description: string } }> };

export type GetSuggestedExpensesQueryVariables = Exact<{
  bankTransactionId: Scalars['String']['input'];
}>;


export type GetSuggestedExpensesQuery = { __typename?: 'Query', getSuggestedExpenses: Array<{ __typename?: 'Expense', amount: number, name: string, bankTransactionId: string, categoryId: string, description?: string | null }> };

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

export type GetBankQueryVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type GetBankQuery = { __typename?: 'Query', getBankManagers: Array<{ __typename?: 'BankManager', name: string, createdAt: any, updatedAt: any, banks: Array<{ __typename?: 'BankAccount', name: string, accountName: string, accountNumber: string, balance: number, createdAt: any, updatedAt: any, historicalBalances?: Array<{ __typename?: 'HistoricalBankBalance', balance: number, time: any }> | null, transactions: Array<{ __typename?: 'BankTransaction', id: string, amount: number, spentAmount: number, description: string, createdAt: any, bank: { __typename?: 'BankAccount', name: string } }> }> }> };

export type GetBankTransactionsQueryVariables = Exact<{
  userId: Scalars['Float']['input'];
}>;


export type GetBankTransactionsQuery = { __typename?: 'Query', getBankTransactions: Array<{ __typename?: 'BankTransaction', id: string, amount: number, spentAmount: number, createdAt: any, description: string, bank: { __typename?: 'BankAccount', name: string } }> };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getMe: { __typename?: 'User', email: string, id: number, name?: string | null, otp?: string | null, otpPurpose?: OtpPurpose | null } };


export const SignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Signup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginReqDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const VerifyAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}}]}}]}}]} as unknown as DocumentNode<VerifyAccountMutation, VerifyAccountMutationVariables>;
export const NewHistoricalAssetProfit1mDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewHistoricalAssetProfit1m"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newHistoricalAssetProfit1m"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"assetInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}}]}}]}}]} as unknown as DocumentNode<NewHistoricalAssetProfit1mSubscription, NewHistoricalAssetProfit1mSubscriptionVariables>;
export const NewHistoricalAssetProfit1hDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewHistoricalAssetProfit1h"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newHistoricalAssetProfit1h"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"assetInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}}]}}]}}]} as unknown as DocumentNode<NewHistoricalAssetProfit1hSubscription, NewHistoricalAssetProfit1hSubscriptionVariables>;
export const CreateCryptoPortfolioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCryptoPortfolio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCryptoPortfolioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCryptoPortfolio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CreateCryptoPortfolioMutation, CreateCryptoPortfolioMutationVariables>;
export const CreateOkxCryptoPortfolioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOKXCryptoPortfolio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOKXCryptoPortfolioInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOKXCryptoPortfolio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<CreateOkxCryptoPortfolioMutation, CreateOkxCryptoPortfolioMutationVariables>;
export const GetCryptoPortfoliosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCryptoPortfolios"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetCryptoPortfolioInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeFrame"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCryptoPortfolios"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}},{"kind":"Field","name":{"kind":"Name","value":"tradingType"}},{"kind":"Field","name":{"kind":"Name","value":"investmentCategoryName"}},{"kind":"Field","name":{"kind":"Name","value":"latestHistoricalBalances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"timeFrame"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeFrame"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestAssetProfits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assetInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"lastPrice"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCryptoPortfoliosQuery, GetCryptoPortfoliosQueryVariables>;
export const GetHistoricalAssetProfitsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHistoricalAssetProfits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHistoricalAssetProfits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}}]}}]}}]} as unknown as DocumentNode<GetHistoricalAssetProfitsQuery, GetHistoricalAssetProfitsQueryVariables>;
export const GetHistoricalBalancesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetHistoricalBalances"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalBalanceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHistoricalBalances"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}},{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}}]}}]}}]} as unknown as DocumentNode<GetHistoricalBalancesQuery, GetHistoricalBalancesQueryVariables>;
export const GetAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAssetPriceData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetPriceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAssetProfitData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalAssetProfitInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"getAssetInfoData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getHistoricalAssetProfits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAssetProfitData"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedProfit"}},{"kind":"Field","name":{"kind":"Name","value":"remainingQty"}},{"kind":"Field","name":{"kind":"Name","value":"totalCostInQuoteQty"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAssetPrices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAssetPriceData"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"open_time"}},{"kind":"Field","name":{"kind":"Name","value":"openPrice"}},{"kind":"Field","name":{"kind":"Name","value":"closePrice"}},{"kind":"Field","name":{"kind":"Name","value":"highPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lowPrice"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getAssetInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"getAssetInfoData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logo"}},{"kind":"Field","name":{"kind":"Name","value":"desc"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"symbol"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetAssetQuery, GetAssetQueryVariables>;
export const NewAssetPrice1mDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewAssetPrice1m"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetPriceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newAssetPrice1m"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetInfoId"}},{"kind":"Field","name":{"kind":"Name","value":"open_time"}},{"kind":"Field","name":{"kind":"Name","value":"openPrice"}},{"kind":"Field","name":{"kind":"Name","value":"closePrice"}},{"kind":"Field","name":{"kind":"Name","value":"highPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lowPrice"}}]}}]}}]} as unknown as DocumentNode<NewAssetPrice1mSubscription, NewAssetPrice1mSubscriptionVariables>;
export const NewAssetPrice5mDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewAssetPrice5m"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetAssetPriceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newAssetPrice5m"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assetInfoId"}},{"kind":"Field","name":{"kind":"Name","value":"open_time"}},{"kind":"Field","name":{"kind":"Name","value":"openPrice"}},{"kind":"Field","name":{"kind":"Name","value":"closePrice"}},{"kind":"Field","name":{"kind":"Name","value":"highPrice"}},{"kind":"Field","name":{"kind":"Name","value":"lowPrice"}}]}}]}}]} as unknown as DocumentNode<NewAssetPrice5mSubscription, NewAssetPrice5mSubscriptionVariables>;
export const NewHistoricalCryptoBalance1mDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewHistoricalCryptoBalance1m"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalBalancesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newHistoricalCryptoBalance1m"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}}]}}]}}]} as unknown as DocumentNode<NewHistoricalCryptoBalance1mSubscription, NewHistoricalCryptoBalance1mSubscriptionVariables>;
export const NewHistoricalCryptoBalance1hDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewHistoricalCryptoBalance1h"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetHistoricalBalancesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"newHistoricalCryptoBalance1h"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolioId"}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changeBalance"}},{"kind":"Field","name":{"kind":"Name","value":"changePercent"}}]}}]}}]} as unknown as DocumentNode<NewHistoricalCryptoBalance1hSubscription, NewHistoricalCryptoBalance1hSubscriptionVariables>;
export const GetCreatePortfolioExecutionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreatePortfolioExecutions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCreatePortfolioExecutions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]} as unknown as DocumentNode<GetCreatePortfolioExecutionsQuery, GetCreatePortfolioExecutionsQueryVariables>;
export const GetTradesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTrades"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetTradeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getTrades"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cryptoPortfolio"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"exchanges"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"qty"}},{"kind":"Field","name":{"kind":"Name","value":"quoteQty"}},{"kind":"Field","name":{"kind":"Name","value":"commission"}},{"kind":"Field","name":{"kind":"Name","value":"commissionAsset"}},{"kind":"Field","name":{"kind":"Name","value":"isBuyer"}}]}}]}}]} as unknown as DocumentNode<GetTradesQuery, GetTradesQueryVariables>;
export const GetExpenseCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpenseCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getExpenseCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"countExpenses"}},{"kind":"Field","name":{"kind":"Name","value":"totalSpentAmounts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"monthlyTargets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"target"}}]}}]}}]}}]} as unknown as DocumentNode<GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables>;
export const CreateExpenseCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpenseCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpenseCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateExpenseCategoryMutation, CreateExpenseCategoryMutationVariables>;
export const UpdateExpenseCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpenseCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpenseCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseCategoryMutation, UpdateExpenseCategoryMutationVariables>;
export const RemoveExpenseCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpenseCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpenseCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveExpenseCategoryMutation, RemoveExpenseCategoryMutationVariables>;
export const GetMonthlyTargetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMonthlyTargets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMonthlyTargets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]} as unknown as DocumentNode<GetMonthlyTargetsQuery, GetMonthlyTargetsQueryVariables>;
export const CreateMonthlyTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMonthlyTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMonthlyTargetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMonthlyTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}}]}}]}}]} as unknown as DocumentNode<CreateMonthlyTargetMutation, CreateMonthlyTargetMutationVariables>;
export const UpdateMonthlyTargetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMonthlyTarget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updateMonthlyTargetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMonthlyTargetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMonthlyTarget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updateMonthlyTargetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryId"}}]}}]}}]} as unknown as DocumentNode<UpdateMonthlyTargetMutation, UpdateMonthlyTargetMutationVariables>;
export const GetExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"startDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"endDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"spentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const GetSuggestedExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSuggestedExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bankTransactionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSuggestedExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bankTransactionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bankTransactionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bankTransactionId"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetSuggestedExpensesQuery, GetSuggestedExpensesQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const RemoveExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<RemoveExpenseMutation, RemoveExpenseMutationVariables>;
export const RemoveExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<RemoveExpensesMutation, RemoveExpensesMutationVariables>;
export const GetBankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBankManagers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"banks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"accountName"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"historicalBalances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"spentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBankQuery, GetBankQueryVariables>;
export const GetBankTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBankTransactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getBankTransactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"spentAmount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"bank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetBankTransactionsQuery, GetBankTransactionsQueryVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"otp"}},{"kind":"Field","name":{"kind":"Name","value":"otpPurpose"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
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
  apiKey: Scalars['String']['output'];
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
  id: Scalars['String']['output'];
  spentAmount: Scalars['Float']['output'];
};

export enum CexExchanges {
  All = 'ALL',
  Binance = 'BINANCE',
  Mexc = 'MEXC',
  Okx = 'OKX'
}

export type CreateBankManagerInput = {
  apiKey: Scalars['String']['input'];
  name: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateCryptoPortfolioInput = {
  apiKey: Scalars['String']['input'];
  exchanges?: CexExchanges;
  name?: Scalars['String']['input'];
  secretKey: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateCryptoRes = {
  __typename?: 'CreateCryptoRes';
  userId: Scalars['Float']['output'];
};

export enum CreateExecutionStatus {
  Failed = 'FAILED',
  Processing = 'PROCESSING',
  Queue = 'QUEUE',
  Success = 'SUCCESS'
}

export type CreateExpenseCategoryInput = {
  color: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateExpenseInput = {
  amount: Scalars['Float']['input'];
  bankTransactionId: Scalars['String']['input'];
  categoryId: Scalars['String']['input'];
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateMonthlyTargetInput = {
  categoryId: Scalars['String']['input'];
  month: Scalars['Int']['input'];
  target: Scalars['Float']['input'];
  year: Scalars['Int']['input'];
};

export type CreateOkxCryptoPortfolioInput = {
  apiKey: Scalars['String']['input'];
  exchanges?: CexExchanges;
  name?: Scalars['String']['input'];
  passphrase: Scalars['String']['input'];
  secretKey: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

export type CreatePortfolioExecution = {
  __typename?: 'CreatePortfolioExecution';
  id: Scalars['Int']['output'];
  status: CreateExecutionStatus;
  time?: Maybe<Scalars['DateTime']['output']>;
  userId: Scalars['Int']['output'];
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
  exchanges: CexExchanges;
  historicalAssetProfits?: Maybe<Array<HistoricalAssetProfit>>;
  historicalBalances?: Maybe<Array<HistoricalCryptoBalance>>;
  id: Scalars['String']['output'];
  investmentCategoryName?: Maybe<Scalars['String']['output']>;
  latestAssetProfits: Array<HistoricalAssetProfit>;
  latestHistoricalBalances: HistoricalCryptoBalance;
  name: Scalars['String']['output'];
  parentPortfolio?: Maybe<CryptoPortfolio>;
  parentPortfolioId?: Maybe<Scalars['String']['output']>;
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

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float']['output'];
  bankTransaction: BankTransaction;
  bankTransactionId: Scalars['String']['output'];
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

export type GetAssetInfoInput = {
  id: Scalars['String']['input'];
};

export type GetAssetPriceInput = {
  assetInfoId: Scalars['String']['input'];
  timeFrame: Scalars['String']['input'];
};

export type GetCryptoPortfolioInput = {
  userId: Scalars['Int']['input'];
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

export type GetTradeInput = {
  assetInfoId?: InputMaybe<Scalars['String']['input']>;
  cryptoPortfolioId?: InputMaybe<Scalars['String']['input']>;
};

export type HistoricalAssetProfit = {
  __typename?: 'HistoricalAssetProfit';
  assetInfo: AssetInfoOutput;
  assetInfoId: Scalars['String']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  estimatedProfit: Scalars['Float']['output'];
  remainingQty: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
  totalCostInQuoteQty: Scalars['Float']['output'];
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
  changeBalance: Scalars['Float']['output'];
  changePercent: Scalars['Float']['output'];
  cryptoPortfolio: CryptoPortfolio;
  cryptoPortfolioId: Scalars['String']['output'];
  estimatedBalance: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
};

export type LoginReqDto = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginResDto = {
  __typename?: 'LoginResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
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
  createBank: BankManager;
  createCryptoPortfolio: CreateCryptoRes;
  createExpense: Expense;
  createExpenseCategory: ExpenseCategory;
  createMonthlyTarget: MonthlyTarget;
  createOKXCryptoPortfolio: CreateCryptoRes;
  login: LoginResDto;
  removeExpense: Expense;
  removeExpenseCategory: ExpenseCategory;
  removeExpenses: Scalars['Int']['output'];
  signup: SignupResDto;
  updateExpense: Expense;
  updateExpenseCategory: ExpenseCategory;
  updateMonthlyTarget: MonthlyTarget;
  verifyAccount: LoginResDto;
};


export type MutationCreateBankArgs = {
  data: CreateBankManagerInput;
};


export type MutationCreateCryptoPortfolioArgs = {
  data: CreateCryptoPortfolioInput;
};


export type MutationCreateExpenseArgs = {
  data: CreateExpenseInput;
};


export type MutationCreateExpenseCategoryArgs = {
  data: CreateExpenseCategoryInput;
};


export type MutationCreateMonthlyTargetArgs = {
  data: CreateMonthlyTargetInput;
};


export type MutationCreateOkxCryptoPortfolioArgs = {
  data: CreateOkxCryptoPortfolioInput;
};


export type MutationLoginArgs = {
  data: LoginReqDto;
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


export type MutationSignupArgs = {
  data: CreateUserInput;
};


export type MutationUpdateExpenseArgs = {
  data: UpdateExpenseInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateExpenseCategoryArgs = {
  data: UpdateExpenseCategoryInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateMonthlyTargetArgs = {
  data: UpdateMonthlyTargetInput;
  id: Scalars['String']['input'];
};


export type MutationVerifyAccountArgs = {
  data: VerifyDto;
};

export enum OtpPurpose {
  ResetPassword = 'RESET_PASSWORD',
  VerifyAccount = 'VERIFY_ACCOUNT'
}

export type PaginationInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export enum PortfolioStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export type Query = {
  __typename?: 'Query';
  getAssetInfo: AssetInfo;
  getAssetPrices: Array<AssetPrice>;
  getBankManagers: Array<BankManager>;
  getBankTransactions: Array<BankTransaction>;
  getCreatePortfolioExecutions: Array<CreatePortfolioExecution>;
  getCryptoPortfolios: Array<CryptoPortfolio>;
  getExpenseCategories: Array<ExpenseCategory>;
  getExpenses: Array<Expense>;
  getHistoricalAssetProfits: Array<HistoricalAssetProfit>;
  getHistoricalBalances: Array<HistoricalCryptoBalance>;
  getMe: User;
  getMonthlyTargets: Array<MonthlyTarget>;
  getSuggestedExpenses: Array<Expense>;
  getTrades: Array<Trade>;
};


export type QueryGetAssetInfoArgs = {
  data: GetAssetInfoInput;
};


export type QueryGetAssetPricesArgs = {
  data: GetAssetPriceInput;
  pagination: PaginationInput;
};


export type QueryGetBankManagersArgs = {
  userId: Scalars['Int']['input'];
};


export type QueryGetBankTransactionsArgs = {
  userId: Scalars['Float']['input'];
};


export type QueryGetCreatePortfolioExecutionsArgs = {
  userId: Scalars['Float']['input'];
};


export type QueryGetCryptoPortfoliosArgs = {
  data: GetCryptoPortfolioInput;
};


export type QueryGetExpenseCategoriesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetExpensesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};


export type QueryGetHistoricalAssetProfitsArgs = {
  data: GetHistoricalAssetProfitInput;
  pagination: PaginationInput;
};


export type QueryGetHistoricalBalancesArgs = {
  data: GetHistoricalBalanceInput;
  pagination: PaginationInput;
};


export type QueryGetMonthlyTargetsArgs = {
  categoryId: Scalars['String']['input'];
  month?: InputMaybe<Scalars['Int']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetSuggestedExpensesArgs = {
  bankTransactionId: Scalars['String']['input'];
};


export type QueryGetTradesArgs = {
  data: GetTradeInput;
};

export type SignupResDto = {
  __typename?: 'SignupResDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newAssetPrice1m: AssetPrice;
  newAssetPrice5m: AssetPrice;
  newHistoricalAssetProfit1h: HistoricalAssetProfit;
  newHistoricalAssetProfit1m: HistoricalAssetProfit;
  newHistoricalCryptoBalance1h: HistoricalCryptoBalance;
  newHistoricalCryptoBalance1m: HistoricalCryptoBalance;
  portfolioCreated: CryptoPortfolio;
};


export type SubscriptionNewAssetPrice1mArgs = {
  data: GetAssetPriceInput;
};


export type SubscriptionNewAssetPrice5mArgs = {
  data: GetAssetPriceInput;
};


export type SubscriptionNewHistoricalAssetProfit1hArgs = {
  data: GetHistoricalAssetProfitInput;
};


export type SubscriptionNewHistoricalAssetProfit1mArgs = {
  data: GetHistoricalAssetProfitInput;
};


export type SubscriptionNewHistoricalCryptoBalance1hArgs = {
  data: GetHistoricalBalancesInput;
};


export type SubscriptionNewHistoricalCryptoBalance1mArgs = {
  data: GetHistoricalBalancesInput;
};


export type SubscriptionPortfolioCreatedArgs = {
  data: GetCryptoPortfolioInput;
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
  isBuyer: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
  qty: Scalars['Float']['output'];
  quoteQty: Scalars['Float']['output'];
  time: Scalars['DateTime']['output'];
};

export enum TradingType {
  Futures = 'FUTURES',
  Spot = 'SPOT'
}

export type UpdateExpenseCategoryInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateExpenseInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  bankTransactionId?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMonthlyTargetInput = {
  month?: InputMaybe<Scalars['Int']['input']>;
  target?: InputMaybe<Scalars['Float']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  bankManager?: Maybe<Array<BankManager>>;
  cryptoPortfolios?: Maybe<Array<CryptoPortfolio>>;
  cryptoProfiles: CryptoPortfolio;
  email: Scalars['String']['output'];
  expenseCategories?: Maybe<Array<ExpenseCategory>>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  otp?: Maybe<Scalars['String']['output']>;
  otpPurpose?: Maybe<OtpPurpose>;
  password: Scalars['String']['output'];
};

export type VerifyDto = {
  otp: Scalars['String']['input'];
  otpPurpose: OtpPurpose;
};
