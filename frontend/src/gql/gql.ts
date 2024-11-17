/* eslint-disable */
import * as types from "./graphql.js";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "mutation Signup($data: CreateUserInput!) {\n  signup(data: $data) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Login($data: LoginReqDto!) {\n  login(data: $data) {\n    accessToken\n  }\n}\n\nmutation VerifyAccount($data: VerifyDto!) {\n  verifyAccount(data: $data) {\n    accessToken\n  }\n}":
        types.SignupDocument,
    "query GetBank($userId: Int!) {\n  getBankManagers(userId: $userId) {\n    name\n    createdAt\n    updatedAt\n    banks {\n      name\n      accountName\n      accountNumber\n      balance\n      createdAt\n      updatedAt\n      transactions {\n        id\n        bank {\n          name\n        }\n        amount\n        spentAmount\n        description\n        createdAt\n      }\n    }\n  }\n}\n\nquery GetBankTransactions($userId: Float!) {\n  getBankTransactions(userId: $userId) {\n    id\n    amount\n    spentAmount\n    createdAt\n    description\n    bank {\n      name\n    }\n  }\n}":
        types.GetBankDocument,
    "mutation CreateCryptoPortfolio($data: CreateCryptoPortfolioInput!) {\n  createCryptoPortfolio(data: $data) {\n    userId\n  }\n}\n\nquery GetCryptoPortfolios($data: GetCryptoPortfolioInput!, $timeFrame: String!) {\n  getCryptoPortfolios(data: $data) {\n    id\n    exchanges\n    tradingType\n    investmentCategoryName\n    latestHistoricalBalances(timeFrame: $timeFrame) {\n      changeBalance\n      changePercent\n      estimatedBalance\n    }\n    balances {\n      id\n      balance\n      assetInfo {\n        id\n        logo\n        lastPrice\n        symbol\n      }\n    }\n  }\n}\n\nquery GetHistoricalBalances($data: GetHistoricalBalanceInput!, $pagination: PaginationInput!) {\n  getHistoricalBalances(data: $data, pagination: $pagination) {\n    time\n    estimatedBalance\n    changePercent\n    changeBalance\n  }\n}\n\nquery GetAsset($pagination: PaginationInput!, $getAssetPriceData: GetAssetPriceInput!, $getAssetInfoData: GetAssetInfoInput!) {\n  getAssetPrices(data: $getAssetPriceData, pagination: $pagination) {\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n  getAssetInfo(data: $getAssetInfoData) {\n    logo\n    desc\n    category\n    symbol\n    name\n  }\n}\n\nsubscription NewAssetPrice1m($data: GetAssetPriceInput!) {\n  newAssetPrice1m(data: $data) {\n    assetInfoId\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n}\n\nsubscription NewAssetPrice5m($data: GetAssetPriceInput!) {\n  newAssetPrice5m(data: $data) {\n    assetInfoId\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n}":
        types.CreateCryptoPortfolioDocument,
    "query GetExpenseCategories($userId: Int!, $name: String, $startDate: DateTime, $endDate: DateTime, $month: Int, $year: Int) {\n  getExpenseCategories(userId: $userId, name: $name) {\n    color\n    description\n    name\n    id\n    countExpenses\n    totalAmount(startDate: $startDate, endDate: $endDate)\n    monthlyTargets(month: $month, year: $year) {\n      month\n      year\n      target\n    }\n  }\n}\n\nmutation CreateExpenseCategory($data: CreateExpenseCategoryInput!) {\n  createExpenseCategory(data: $data) {\n    color\n    description\n    name\n    id\n  }\n}\n\nmutation UpdateExpenseCategory($id: String!, $data: UpdateExpenseCategoryInput!) {\n  updateExpenseCategory(id: $id, data: $data) {\n    color\n    description\n    name\n    id\n  }\n}\n\nmutation RemoveExpenseCategory($id: String!) {\n  removeExpenseCategory(id: $id) {\n    id\n  }\n}\n\nquery GetMonthlyTargets($categoryId: String!, $month: Int, $year: Int) {\n  getMonthlyTargets(categoryId: $categoryId, month: $month, year: $year) {\n    target\n    month\n    year\n  }\n}\n\nmutation CreateMonthlyTarget($data: CreateMonthlyTargetInput!) {\n  createMonthlyTarget(data: $data) {\n    categoryId\n  }\n}\n\nmutation UpdateMonthlyTarget($updateMonthlyTargetId: String!, $data: UpdateMonthlyTargetInput!) {\n  updateMonthlyTarget(id: $updateMonthlyTargetId, data: $data) {\n    categoryId\n  }\n}":
        types.GetExpenseCategoriesDocument,
    "query GetExpenses($userId: Int!, $startDate: DateTime, $endDate: DateTime) {\n  getExpenses(userId: $userId, startDate: $startDate, endDate: $endDate) {\n    id\n    category {\n      id\n      color\n      name\n    }\n    transaction {\n      id\n      amount\n      spentAmount\n      description\n    }\n    createdAt\n    description\n    amount\n    name\n  }\n}\n\nmutation CreateExpense($data: CreateExpenseInput!) {\n  createExpense(data: $data) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation UpdateExpense($id: String!, $data: UpdateExpenseInput!) {\n  updateExpense(id: $id, data: $data) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation RemoveExpense($id: String!) {\n  removeExpense(id: $id) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation RemoveExpenses($ids: [String!]!) {\n  removeExpenses(ids: $ids)\n}":
        types.GetExpensesDocument,
    "query GetMe {\n  getMe {\n    email\n    id\n    name\n    otp\n    otpPurpose\n  }\n}":
        types.GetMeDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "mutation Signup($data: CreateUserInput!) {\n  signup(data: $data) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Login($data: LoginReqDto!) {\n  login(data: $data) {\n    accessToken\n  }\n}\n\nmutation VerifyAccount($data: VerifyDto!) {\n  verifyAccount(data: $data) {\n    accessToken\n  }\n}",
): (typeof documents)["mutation Signup($data: CreateUserInput!) {\n  signup(data: $data) {\n    accessToken\n    refreshToken\n  }\n}\n\nmutation Login($data: LoginReqDto!) {\n  login(data: $data) {\n    accessToken\n  }\n}\n\nmutation VerifyAccount($data: VerifyDto!) {\n  verifyAccount(data: $data) {\n    accessToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "query GetBank($userId: Int!) {\n  getBankManagers(userId: $userId) {\n    name\n    createdAt\n    updatedAt\n    banks {\n      name\n      accountName\n      accountNumber\n      balance\n      createdAt\n      updatedAt\n      transactions {\n        id\n        bank {\n          name\n        }\n        amount\n        spentAmount\n        description\n        createdAt\n      }\n    }\n  }\n}\n\nquery GetBankTransactions($userId: Float!) {\n  getBankTransactions(userId: $userId) {\n    id\n    amount\n    spentAmount\n    createdAt\n    description\n    bank {\n      name\n    }\n  }\n}",
): (typeof documents)["query GetBank($userId: Int!) {\n  getBankManagers(userId: $userId) {\n    name\n    createdAt\n    updatedAt\n    banks {\n      name\n      accountName\n      accountNumber\n      balance\n      createdAt\n      updatedAt\n      transactions {\n        id\n        bank {\n          name\n        }\n        amount\n        spentAmount\n        description\n        createdAt\n      }\n    }\n  }\n}\n\nquery GetBankTransactions($userId: Float!) {\n  getBankTransactions(userId: $userId) {\n    id\n    amount\n    spentAmount\n    createdAt\n    description\n    bank {\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "mutation CreateCryptoPortfolio($data: CreateCryptoPortfolioInput!) {\n  createCryptoPortfolio(data: $data) {\n    userId\n  }\n}\n\nquery GetCryptoPortfolios($data: GetCryptoPortfolioInput!, $timeFrame: String!) {\n  getCryptoPortfolios(data: $data) {\n    id\n    exchanges\n    tradingType\n    investmentCategoryName\n    latestHistoricalBalances(timeFrame: $timeFrame) {\n      changeBalance\n      changePercent\n      estimatedBalance\n    }\n    balances {\n      id\n      balance\n      assetInfo {\n        id\n        logo\n        lastPrice\n        symbol\n      }\n    }\n  }\n}\n\nquery GetHistoricalBalances($data: GetHistoricalBalanceInput!, $pagination: PaginationInput!) {\n  getHistoricalBalances(data: $data, pagination: $pagination) {\n    time\n    estimatedBalance\n    changePercent\n    changeBalance\n  }\n}\n\nquery GetAsset($pagination: PaginationInput!, $getAssetPriceData: GetAssetPriceInput!, $getAssetInfoData: GetAssetInfoInput!) {\n  getAssetPrices(data: $getAssetPriceData, pagination: $pagination) {\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n  getAssetInfo(data: $getAssetInfoData) {\n    logo\n    desc\n    category\n    symbol\n    name\n  }\n}\n\nsubscription NewAssetPrice1m($data: GetAssetPriceInput!) {\n  newAssetPrice1m(data: $data) {\n    assetInfoId\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n}\n\nsubscription NewAssetPrice5m($data: GetAssetPriceInput!) {\n  newAssetPrice5m(data: $data) {\n    assetInfoId\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n}",
): (typeof documents)["mutation CreateCryptoPortfolio($data: CreateCryptoPortfolioInput!) {\n  createCryptoPortfolio(data: $data) {\n    userId\n  }\n}\n\nquery GetCryptoPortfolios($data: GetCryptoPortfolioInput!, $timeFrame: String!) {\n  getCryptoPortfolios(data: $data) {\n    id\n    exchanges\n    tradingType\n    investmentCategoryName\n    latestHistoricalBalances(timeFrame: $timeFrame) {\n      changeBalance\n      changePercent\n      estimatedBalance\n    }\n    balances {\n      id\n      balance\n      assetInfo {\n        id\n        logo\n        lastPrice\n        symbol\n      }\n    }\n  }\n}\n\nquery GetHistoricalBalances($data: GetHistoricalBalanceInput!, $pagination: PaginationInput!) {\n  getHistoricalBalances(data: $data, pagination: $pagination) {\n    time\n    estimatedBalance\n    changePercent\n    changeBalance\n  }\n}\n\nquery GetAsset($pagination: PaginationInput!, $getAssetPriceData: GetAssetPriceInput!, $getAssetInfoData: GetAssetInfoInput!) {\n  getAssetPrices(data: $getAssetPriceData, pagination: $pagination) {\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n  getAssetInfo(data: $getAssetInfoData) {\n    logo\n    desc\n    category\n    symbol\n    name\n  }\n}\n\nsubscription NewAssetPrice1m($data: GetAssetPriceInput!) {\n  newAssetPrice1m(data: $data) {\n    assetInfoId\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n}\n\nsubscription NewAssetPrice5m($data: GetAssetPriceInput!) {\n  newAssetPrice5m(data: $data) {\n    assetInfoId\n    open_time\n    openPrice\n    closePrice\n    highPrice\n    lowPrice\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "query GetExpenseCategories($userId: Int!, $name: String, $startDate: DateTime, $endDate: DateTime, $month: Int, $year: Int) {\n  getExpenseCategories(userId: $userId, name: $name) {\n    color\n    description\n    name\n    id\n    countExpenses\n    totalAmount(startDate: $startDate, endDate: $endDate)\n    monthlyTargets(month: $month, year: $year) {\n      month\n      year\n      target\n    }\n  }\n}\n\nmutation CreateExpenseCategory($data: CreateExpenseCategoryInput!) {\n  createExpenseCategory(data: $data) {\n    color\n    description\n    name\n    id\n  }\n}\n\nmutation UpdateExpenseCategory($id: String!, $data: UpdateExpenseCategoryInput!) {\n  updateExpenseCategory(id: $id, data: $data) {\n    color\n    description\n    name\n    id\n  }\n}\n\nmutation RemoveExpenseCategory($id: String!) {\n  removeExpenseCategory(id: $id) {\n    id\n  }\n}\n\nquery GetMonthlyTargets($categoryId: String!, $month: Int, $year: Int) {\n  getMonthlyTargets(categoryId: $categoryId, month: $month, year: $year) {\n    target\n    month\n    year\n  }\n}\n\nmutation CreateMonthlyTarget($data: CreateMonthlyTargetInput!) {\n  createMonthlyTarget(data: $data) {\n    categoryId\n  }\n}\n\nmutation UpdateMonthlyTarget($updateMonthlyTargetId: String!, $data: UpdateMonthlyTargetInput!) {\n  updateMonthlyTarget(id: $updateMonthlyTargetId, data: $data) {\n    categoryId\n  }\n}",
): (typeof documents)["query GetExpenseCategories($userId: Int!, $name: String, $startDate: DateTime, $endDate: DateTime, $month: Int, $year: Int) {\n  getExpenseCategories(userId: $userId, name: $name) {\n    color\n    description\n    name\n    id\n    countExpenses\n    totalAmount(startDate: $startDate, endDate: $endDate)\n    monthlyTargets(month: $month, year: $year) {\n      month\n      year\n      target\n    }\n  }\n}\n\nmutation CreateExpenseCategory($data: CreateExpenseCategoryInput!) {\n  createExpenseCategory(data: $data) {\n    color\n    description\n    name\n    id\n  }\n}\n\nmutation UpdateExpenseCategory($id: String!, $data: UpdateExpenseCategoryInput!) {\n  updateExpenseCategory(id: $id, data: $data) {\n    color\n    description\n    name\n    id\n  }\n}\n\nmutation RemoveExpenseCategory($id: String!) {\n  removeExpenseCategory(id: $id) {\n    id\n  }\n}\n\nquery GetMonthlyTargets($categoryId: String!, $month: Int, $year: Int) {\n  getMonthlyTargets(categoryId: $categoryId, month: $month, year: $year) {\n    target\n    month\n    year\n  }\n}\n\nmutation CreateMonthlyTarget($data: CreateMonthlyTargetInput!) {\n  createMonthlyTarget(data: $data) {\n    categoryId\n  }\n}\n\nmutation UpdateMonthlyTarget($updateMonthlyTargetId: String!, $data: UpdateMonthlyTargetInput!) {\n  updateMonthlyTarget(id: $updateMonthlyTargetId, data: $data) {\n    categoryId\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "query GetExpenses($userId: Int!, $startDate: DateTime, $endDate: DateTime) {\n  getExpenses(userId: $userId, startDate: $startDate, endDate: $endDate) {\n    id\n    category {\n      id\n      color\n      name\n    }\n    transaction {\n      id\n      amount\n      spentAmount\n      description\n    }\n    createdAt\n    description\n    amount\n    name\n  }\n}\n\nmutation CreateExpense($data: CreateExpenseInput!) {\n  createExpense(data: $data) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation UpdateExpense($id: String!, $data: UpdateExpenseInput!) {\n  updateExpense(id: $id, data: $data) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation RemoveExpense($id: String!) {\n  removeExpense(id: $id) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation RemoveExpenses($ids: [String!]!) {\n  removeExpenses(ids: $ids)\n}",
): (typeof documents)["query GetExpenses($userId: Int!, $startDate: DateTime, $endDate: DateTime) {\n  getExpenses(userId: $userId, startDate: $startDate, endDate: $endDate) {\n    id\n    category {\n      id\n      color\n      name\n    }\n    transaction {\n      id\n      amount\n      spentAmount\n      description\n    }\n    createdAt\n    description\n    amount\n    name\n  }\n}\n\nmutation CreateExpense($data: CreateExpenseInput!) {\n  createExpense(data: $data) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation UpdateExpense($id: String!, $data: UpdateExpenseInput!) {\n  updateExpense(id: $id, data: $data) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation RemoveExpense($id: String!) {\n  removeExpense(id: $id) {\n    id\n    description\n    amount\n    name\n  }\n}\n\nmutation RemoveExpenses($ids: [String!]!) {\n  removeExpenses(ids: $ids)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
    source: "query GetMe {\n  getMe {\n    email\n    id\n    name\n    otp\n    otpPurpose\n  }\n}",
): (typeof documents)["query GetMe {\n  getMe {\n    email\n    id\n    name\n    otp\n    otpPurpose\n  }\n}"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
