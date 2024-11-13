/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends " $fragmentName" | "__typename"
              ? T[P]
              : never;
      };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
    DateTime: { input: any; output: any };
};

export type AssetBalance = {
    __typename?: "AssetBalance";
    assetInfo: AssetInfoOutput;
    assetInfoId: Scalars["String"]["output"];
    balance: Scalars["Float"]["output"];
    cryptoPortfolio: CryptoPortfolio;
    cryptoPortfolioId: Scalars["String"]["output"];
    id: Scalars["String"]["output"];
    locked: Scalars["Float"]["output"];
};

export type AssetBalanceAvgAggregate = {
    __typename?: "AssetBalanceAvgAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceCountAggregate = {
    __typename?: "AssetBalanceCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    balance: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    locked: Scalars["Int"]["output"];
};

export type AssetBalanceCreateManyCryptoPortfolioInput = {
    assetInfoId: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    id?: InputMaybe<Scalars["String"]["input"]>;
    locked: Scalars["Float"]["input"];
};

export type AssetBalanceCreateManyCryptoPortfolioInputEnvelope = {
    data: Array<AssetBalanceCreateManyCryptoPortfolioInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type AssetBalanceCreateNestedManyWithoutCryptoPortfolioInput = {
    connect?: InputMaybe<Array<AssetBalanceWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<AssetBalanceCreateOrConnectWithoutCryptoPortfolioInput>
    >;
    create?: InputMaybe<Array<AssetBalanceCreateWithoutCryptoPortfolioInput>>;
    createMany?: InputMaybe<AssetBalanceCreateManyCryptoPortfolioInputEnvelope>;
};

export type AssetBalanceCreateOrConnectWithoutCryptoPortfolioInput = {
    create: AssetBalanceCreateWithoutCryptoPortfolioInput;
    where: AssetBalanceWhereUniqueInput;
};

export type AssetBalanceCreateWithoutCryptoPortfolioInput = {
    assetInfo: AssetInfoCreateNestedOneWithoutAssetBalancesInput;
    balance: Scalars["Float"]["input"];
    id?: InputMaybe<Scalars["String"]["input"]>;
    locked: Scalars["Float"]["input"];
};

export type AssetBalanceListRelationFilter = {
    every?: InputMaybe<AssetBalanceWhereInput>;
    none?: InputMaybe<AssetBalanceWhereInput>;
    some?: InputMaybe<AssetBalanceWhereInput>;
};

export type AssetBalanceMaxAggregate = {
    __typename?: "AssetBalanceMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceMinAggregate = {
    __typename?: "AssetBalanceMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceSumAggregate = {
    __typename?: "AssetBalanceSumAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceWhereInput = {
    AND?: InputMaybe<Array<AssetBalanceWhereInput>>;
    NOT?: InputMaybe<Array<AssetBalanceWhereInput>>;
    OR?: InputMaybe<Array<AssetBalanceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    id?: InputMaybe<StringFilter>;
    locked?: InputMaybe<FloatFilter>;
};

export type AssetBalanceWhereUniqueInput = {
    AND?: InputMaybe<Array<AssetBalanceWhereInput>>;
    NOT?: InputMaybe<Array<AssetBalanceWhereInput>>;
    OR?: InputMaybe<Array<AssetBalanceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    locked?: InputMaybe<FloatFilter>;
};

export type AssetInfo = {
    __typename?: "AssetInfo";
    assetBalances?: Maybe<Array<AssetBalance>>;
    assetPrices?: Maybe<Array<AssetPrice>>;
    category: Scalars["String"]["output"];
    desc: Scalars["String"]["output"];
    id: Scalars["String"]["output"];
    logo: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    symbol: Scalars["String"]["output"];
};

export type AssetInfoCountAggregate = {
    __typename?: "AssetInfoCountAggregate";
    _all: Scalars["Int"]["output"];
    category: Scalars["Int"]["output"];
    desc: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    logo: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    symbol: Scalars["Int"]["output"];
};

export type AssetInfoCreateNestedOneWithoutAssetBalancesInput = {
    connect?: InputMaybe<AssetInfoWhereUniqueInput>;
    connectOrCreate?: InputMaybe<AssetInfoCreateOrConnectWithoutAssetBalancesInput>;
    create?: InputMaybe<AssetInfoCreateWithoutAssetBalancesInput>;
};

export type AssetInfoCreateOrConnectWithoutAssetBalancesInput = {
    create: AssetInfoCreateWithoutAssetBalancesInput;
    where: AssetInfoWhereUniqueInput;
};

export type AssetInfoCreateWithoutAssetBalancesInput = {
    assetPrices?: InputMaybe<AssetPriceCreateNestedManyWithoutAssetInfoInput>;
    category: Scalars["String"]["input"];
    desc: Scalars["String"]["input"];
    id?: InputMaybe<Scalars["String"]["input"]>;
    logo: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    symbol: Scalars["String"]["input"];
};

export type AssetInfoMaxAggregate = {
    __typename?: "AssetInfoMaxAggregate";
    category?: Maybe<Scalars["String"]["output"]>;
    desc?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    logo?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    symbol?: Maybe<Scalars["String"]["output"]>;
};

export type AssetInfoMinAggregate = {
    __typename?: "AssetInfoMinAggregate";
    category?: Maybe<Scalars["String"]["output"]>;
    desc?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    logo?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    symbol?: Maybe<Scalars["String"]["output"]>;
};

export type AssetInfoOutput = {
    __typename?: "AssetInfoOutput";
    assetBalances?: Maybe<Array<AssetBalance>>;
    assetPrices?: Maybe<Array<AssetPrice>>;
    category?: Maybe<Scalars["String"]["output"]>;
    desc?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    lastPrice: Scalars["Float"]["output"];
    logo?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    symbol?: Maybe<Scalars["String"]["output"]>;
};

export type AssetInfoRelationFilter = {
    is?: InputMaybe<AssetInfoWhereInput>;
    isNot?: InputMaybe<AssetInfoWhereInput>;
};

export type AssetInfoWhereInput = {
    AND?: InputMaybe<Array<AssetInfoWhereInput>>;
    NOT?: InputMaybe<Array<AssetInfoWhereInput>>;
    OR?: InputMaybe<Array<AssetInfoWhereInput>>;
    assetBalances?: InputMaybe<AssetBalanceListRelationFilter>;
    assetPrices?: InputMaybe<AssetPriceListRelationFilter>;
    category?: InputMaybe<StringFilter>;
    desc?: InputMaybe<StringFilter>;
    id?: InputMaybe<StringFilter>;
    logo?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    symbol?: InputMaybe<StringFilter>;
};

export type AssetInfoWhereUniqueInput = {
    AND?: InputMaybe<Array<AssetInfoWhereInput>>;
    NOT?: InputMaybe<Array<AssetInfoWhereInput>>;
    OR?: InputMaybe<Array<AssetInfoWhereInput>>;
    assetBalances?: InputMaybe<AssetBalanceListRelationFilter>;
    assetPrices?: InputMaybe<AssetPriceListRelationFilter>;
    category?: InputMaybe<StringFilter>;
    desc?: InputMaybe<StringFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    logo?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    symbol?: InputMaybe<StringFilter>;
};

export type AssetPrice = {
    __typename?: "AssetPrice";
    assetInfo: AssetInfo;
    assetInfoId: Scalars["String"]["output"];
    closePrice: Scalars["Float"]["output"];
    close_time: Scalars["DateTime"]["output"];
    highPrice: Scalars["Float"]["output"];
    interval: Scalars["String"]["output"];
    lowPrice: Scalars["Float"]["output"];
    openPrice: Scalars["Float"]["output"];
    open_time: Scalars["DateTime"]["output"];
    volume: Scalars["Float"]["output"];
};

export type AssetPriceAssetInfoIdOpen_TimeCompoundUniqueInput = {
    assetInfoId: Scalars["String"]["input"];
    open_time: Scalars["DateTime"]["input"];
};

export type AssetPriceAvgAggregate = {
    __typename?: "AssetPriceAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceCountAggregate = {
    __typename?: "AssetPriceCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    close_time: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    interval: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type AssetPriceCreateManyAssetInfoInput = {
    closePrice: Scalars["Float"]["input"];
    close_time: Scalars["DateTime"]["input"];
    highPrice: Scalars["Float"]["input"];
    interval: Scalars["String"]["input"];
    lowPrice: Scalars["Float"]["input"];
    openPrice: Scalars["Float"]["input"];
    open_time: Scalars["DateTime"]["input"];
    volume: Scalars["Float"]["input"];
};

export type AssetPriceCreateManyAssetInfoInputEnvelope = {
    data: Array<AssetPriceCreateManyAssetInfoInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type AssetPriceCreateNestedManyWithoutAssetInfoInput = {
    connect?: InputMaybe<Array<AssetPriceWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<AssetPriceCreateOrConnectWithoutAssetInfoInput>
    >;
    create?: InputMaybe<Array<AssetPriceCreateWithoutAssetInfoInput>>;
    createMany?: InputMaybe<AssetPriceCreateManyAssetInfoInputEnvelope>;
};

export type AssetPriceCreateOrConnectWithoutAssetInfoInput = {
    create: AssetPriceCreateWithoutAssetInfoInput;
    where: AssetPriceWhereUniqueInput;
};

export type AssetPriceCreateWithoutAssetInfoInput = {
    closePrice: Scalars["Float"]["input"];
    close_time: Scalars["DateTime"]["input"];
    highPrice: Scalars["Float"]["input"];
    interval: Scalars["String"]["input"];
    lowPrice: Scalars["Float"]["input"];
    openPrice: Scalars["Float"]["input"];
    open_time: Scalars["DateTime"]["input"];
    volume: Scalars["Float"]["input"];
};

export type AssetPriceListRelationFilter = {
    every?: InputMaybe<AssetPriceWhereInput>;
    none?: InputMaybe<AssetPriceWhereInput>;
    some?: InputMaybe<AssetPriceWhereInput>;
};

export type AssetPriceMaxAggregate = {
    __typename?: "AssetPriceMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    close_time?: Maybe<Scalars["DateTime"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    interval?: Maybe<Scalars["String"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceMinAggregate = {
    __typename?: "AssetPriceMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    close_time?: Maybe<Scalars["DateTime"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    interval?: Maybe<Scalars["String"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceSumAggregate = {
    __typename?: "AssetPriceSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceWhereInput = {
    AND?: InputMaybe<Array<AssetPriceWhereInput>>;
    NOT?: InputMaybe<Array<AssetPriceWhereInput>>;
    OR?: InputMaybe<Array<AssetPriceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    closePrice?: InputMaybe<FloatFilter>;
    close_time?: InputMaybe<DateTimeFilter>;
    highPrice?: InputMaybe<FloatFilter>;
    interval?: InputMaybe<StringFilter>;
    lowPrice?: InputMaybe<FloatFilter>;
    openPrice?: InputMaybe<FloatFilter>;
    open_time?: InputMaybe<DateTimeFilter>;
    volume?: InputMaybe<FloatFilter>;
};

export type AssetPriceWhereUniqueInput = {
    AND?: InputMaybe<Array<AssetPriceWhereInput>>;
    NOT?: InputMaybe<Array<AssetPriceWhereInput>>;
    OR?: InputMaybe<Array<AssetPriceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    assetInfoId_open_time?: InputMaybe<AssetPriceAssetInfoIdOpen_TimeCompoundUniqueInput>;
    closePrice?: InputMaybe<FloatFilter>;
    close_time?: InputMaybe<DateTimeFilter>;
    highPrice?: InputMaybe<FloatFilter>;
    interval?: InputMaybe<StringFilter>;
    lowPrice?: InputMaybe<FloatFilter>;
    openPrice?: InputMaybe<FloatFilter>;
    open_time?: InputMaybe<DateTimeFilter>;
    volume?: InputMaybe<FloatFilter>;
};

export type Asset_Price_1MAvgAggregate = {
    __typename?: "Asset_price_1MAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1MCountAggregate = {
    __typename?: "Asset_price_1MCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_1MMaxAggregate = {
    __typename?: "Asset_price_1MMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1MMinAggregate = {
    __typename?: "Asset_price_1MMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1MSumAggregate = {
    __typename?: "Asset_price_1MSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dAvgAggregate = {
    __typename?: "Asset_price_1dAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dCountAggregate = {
    __typename?: "Asset_price_1dCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_1dMaxAggregate = {
    __typename?: "Asset_price_1dMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dMinAggregate = {
    __typename?: "Asset_price_1dMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dSumAggregate = {
    __typename?: "Asset_price_1dSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hAvgAggregate = {
    __typename?: "Asset_price_1hAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hCountAggregate = {
    __typename?: "Asset_price_1hCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_1hMaxAggregate = {
    __typename?: "Asset_price_1hMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hMinAggregate = {
    __typename?: "Asset_price_1hMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hSumAggregate = {
    __typename?: "Asset_price_1hSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mAvgAggregate = {
    __typename?: "Asset_price_5mAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mCountAggregate = {
    __typename?: "Asset_price_5mCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_5mMaxAggregate = {
    __typename?: "Asset_price_5mMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mMinAggregate = {
    __typename?: "Asset_price_5mMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mSumAggregate = {
    __typename?: "Asset_price_5mSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type BankAccount = {
    __typename?: "BankAccount";
    accountName: Scalars["String"]["output"];
    accountNumber: Scalars["String"]["output"];
    balance: Scalars["Float"]["output"];
    bankManager: BankManager;
    bankManagerId: Scalars["String"]["output"];
    createdAt: Scalars["DateTime"]["output"];
    fullName: Scalars["String"]["output"];
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    transactions: Array<BankTransaction>;
    updatedAt: Scalars["DateTime"]["output"];
};

export type BankAccountAvgAggregate = {
    __typename?: "BankAccountAvgAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
};

export type BankAccountCountAggregate = {
    __typename?: "BankAccountCountAggregate";
    _all: Scalars["Int"]["output"];
    accountName: Scalars["Int"]["output"];
    accountNumber: Scalars["Int"]["output"];
    balance: Scalars["Int"]["output"];
    bankManagerId: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    fullName: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    updatedAt: Scalars["Int"]["output"];
};

export type BankAccountCreateManyBankManagerInput = {
    accountName: Scalars["String"]["input"];
    accountNumber: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    fullName: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankAccountCreateManyBankManagerInputEnvelope = {
    data: Array<BankAccountCreateManyBankManagerInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BankAccountCreateNestedManyWithoutBankManagerInput = {
    connect?: InputMaybe<Array<BankAccountWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<BankAccountCreateOrConnectWithoutBankManagerInput>
    >;
    create?: InputMaybe<Array<BankAccountCreateWithoutBankManagerInput>>;
    createMany?: InputMaybe<BankAccountCreateManyBankManagerInputEnvelope>;
};

export type BankAccountCreateNestedOneWithoutTransactionsInput = {
    connect?: InputMaybe<BankAccountWhereUniqueInput>;
    connectOrCreate?: InputMaybe<BankAccountCreateOrConnectWithoutTransactionsInput>;
    create?: InputMaybe<BankAccountCreateWithoutTransactionsInput>;
};

export type BankAccountCreateOrConnectWithoutBankManagerInput = {
    create: BankAccountCreateWithoutBankManagerInput;
    where: BankAccountWhereUniqueInput;
};

export type BankAccountCreateOrConnectWithoutTransactionsInput = {
    create: BankAccountCreateWithoutTransactionsInput;
    where: BankAccountWhereUniqueInput;
};

export type BankAccountCreateWithoutBankManagerInput = {
    accountName: Scalars["String"]["input"];
    accountNumber: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    fullName: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    transactions?: InputMaybe<BankTransactionCreateNestedManyWithoutBankInput>;
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankAccountCreateWithoutTransactionsInput = {
    accountName: Scalars["String"]["input"];
    accountNumber: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    bankManager: BankManagerCreateNestedOneWithoutBanksInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    fullName: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankAccountListRelationFilter = {
    every?: InputMaybe<BankAccountWhereInput>;
    none?: InputMaybe<BankAccountWhereInput>;
    some?: InputMaybe<BankAccountWhereInput>;
};

export type BankAccountMaxAggregate = {
    __typename?: "BankAccountMaxAggregate";
    accountName?: Maybe<Scalars["String"]["output"]>;
    accountNumber?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    bankManagerId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    fullName?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type BankAccountMinAggregate = {
    __typename?: "BankAccountMinAggregate";
    accountName?: Maybe<Scalars["String"]["output"]>;
    accountNumber?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    bankManagerId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    fullName?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type BankAccountRelationFilter = {
    is?: InputMaybe<BankAccountWhereInput>;
    isNot?: InputMaybe<BankAccountWhereInput>;
};

export type BankAccountSumAggregate = {
    __typename?: "BankAccountSumAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
};

export type BankAccountWhereInput = {
    AND?: InputMaybe<Array<BankAccountWhereInput>>;
    NOT?: InputMaybe<Array<BankAccountWhereInput>>;
    OR?: InputMaybe<Array<BankAccountWhereInput>>;
    accountName?: InputMaybe<StringFilter>;
    accountNumber?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    bankManager?: InputMaybe<BankManagerRelationFilter>;
    bankManagerId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    fullName?: InputMaybe<StringFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    transactions?: InputMaybe<BankTransactionListRelationFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BankAccountWhereUniqueInput = {
    AND?: InputMaybe<Array<BankAccountWhereInput>>;
    NOT?: InputMaybe<Array<BankAccountWhereInput>>;
    OR?: InputMaybe<Array<BankAccountWhereInput>>;
    accountName?: InputMaybe<StringFilter>;
    accountNumber?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    bankManager?: InputMaybe<BankManagerRelationFilter>;
    bankManagerId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    fullName?: InputMaybe<StringFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    transactions?: InputMaybe<BankTransactionListRelationFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BankManager = {
    __typename?: "BankManager";
    apiKey: Scalars["String"]["output"];
    banks: Array<BankAccount>;
    createdAt: Scalars["DateTime"]["output"];
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    updatedAt: Scalars["DateTime"]["output"];
    user: User;
    userId: Scalars["Int"]["output"];
};

export type BankManagerAvgAggregate = {
    __typename?: "BankManagerAvgAggregate";
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type BankManagerCountAggregate = {
    __typename?: "BankManagerCountAggregate";
    _all: Scalars["Int"]["output"];
    apiKey: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    updatedAt: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type BankManagerCreateManyUserInput = {
    apiKey: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankManagerCreateManyUserInputEnvelope = {
    data: Array<BankManagerCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BankManagerCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<BankManagerWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<BankManagerCreateOrConnectWithoutUserInput>
    >;
    create?: InputMaybe<Array<BankManagerCreateWithoutUserInput>>;
    createMany?: InputMaybe<BankManagerCreateManyUserInputEnvelope>;
};

export type BankManagerCreateNestedOneWithoutBanksInput = {
    connect?: InputMaybe<BankManagerWhereUniqueInput>;
    connectOrCreate?: InputMaybe<BankManagerCreateOrConnectWithoutBanksInput>;
    create?: InputMaybe<BankManagerCreateWithoutBanksInput>;
};

export type BankManagerCreateOrConnectWithoutBanksInput = {
    create: BankManagerCreateWithoutBanksInput;
    where: BankManagerWhereUniqueInput;
};

export type BankManagerCreateOrConnectWithoutUserInput = {
    create: BankManagerCreateWithoutUserInput;
    where: BankManagerWhereUniqueInput;
};

export type BankManagerCreateWithoutBanksInput = {
    apiKey: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    user: UserCreateNestedOneWithoutBankManagerInput;
};

export type BankManagerCreateWithoutUserInput = {
    apiKey: Scalars["String"]["input"];
    banks?: InputMaybe<BankAccountCreateNestedManyWithoutBankManagerInput>;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankManagerListRelationFilter = {
    every?: InputMaybe<BankManagerWhereInput>;
    none?: InputMaybe<BankManagerWhereInput>;
    some?: InputMaybe<BankManagerWhereInput>;
};

export type BankManagerMaxAggregate = {
    __typename?: "BankManagerMaxAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type BankManagerMinAggregate = {
    __typename?: "BankManagerMinAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type BankManagerRelationFilter = {
    is?: InputMaybe<BankManagerWhereInput>;
    isNot?: InputMaybe<BankManagerWhereInput>;
};

export type BankManagerSumAggregate = {
    __typename?: "BankManagerSumAggregate";
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type BankManagerWhereInput = {
    AND?: InputMaybe<Array<BankManagerWhereInput>>;
    NOT?: InputMaybe<Array<BankManagerWhereInput>>;
    OR?: InputMaybe<Array<BankManagerWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    banks?: InputMaybe<BankAccountListRelationFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type BankManagerWhereUniqueInput = {
    AND?: InputMaybe<Array<BankManagerWhereInput>>;
    NOT?: InputMaybe<Array<BankManagerWhereInput>>;
    OR?: InputMaybe<Array<BankManagerWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    banks?: InputMaybe<BankAccountListRelationFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type BankTransaction = {
    __typename?: "BankTransaction";
    amount: Scalars["Float"]["output"];
    bank: BankAccount;
    bankId: Scalars["String"]["output"];
    createdAt: Scalars["DateTime"]["output"];
    description: Scalars["String"]["output"];
    expense?: Maybe<Array<Expense>>;
    id: Scalars["String"]["output"];
    spentAmount: Scalars["Float"]["output"];
};

export type BankTransactionAvgAggregate = {
    __typename?: "BankTransactionAvgAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionCountAggregate = {
    __typename?: "BankTransactionCountAggregate";
    _all: Scalars["Int"]["output"];
    amount: Scalars["Int"]["output"];
    bankId: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    description: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    spentAmount: Scalars["Int"]["output"];
};

export type BankTransactionCreateManyBankInput = {
    amount: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    spentAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type BankTransactionCreateManyBankInputEnvelope = {
    data: Array<BankTransactionCreateManyBankInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BankTransactionCreateNestedManyWithoutBankInput = {
    connect?: InputMaybe<Array<BankTransactionWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<BankTransactionCreateOrConnectWithoutBankInput>
    >;
    create?: InputMaybe<Array<BankTransactionCreateWithoutBankInput>>;
    createMany?: InputMaybe<BankTransactionCreateManyBankInputEnvelope>;
};

export type BankTransactionCreateNestedOneWithoutExpenseInput = {
    connect?: InputMaybe<BankTransactionWhereUniqueInput>;
    connectOrCreate?: InputMaybe<BankTransactionCreateOrConnectWithoutExpenseInput>;
    create?: InputMaybe<BankTransactionCreateWithoutExpenseInput>;
};

export type BankTransactionCreateOrConnectWithoutBankInput = {
    create: BankTransactionCreateWithoutBankInput;
    where: BankTransactionWhereUniqueInput;
};

export type BankTransactionCreateOrConnectWithoutExpenseInput = {
    create: BankTransactionCreateWithoutExpenseInput;
    where: BankTransactionWhereUniqueInput;
};

export type BankTransactionCreateWithoutBankInput = {
    amount: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description: Scalars["String"]["input"];
    expense?: InputMaybe<ExpenseCreateNestedManyWithoutBankTransactionInput>;
    id: Scalars["String"]["input"];
    spentAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type BankTransactionCreateWithoutExpenseInput = {
    amount: Scalars["Float"]["input"];
    bank: BankAccountCreateNestedOneWithoutTransactionsInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    spentAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type BankTransactionListRelationFilter = {
    every?: InputMaybe<BankTransactionWhereInput>;
    none?: InputMaybe<BankTransactionWhereInput>;
    some?: InputMaybe<BankTransactionWhereInput>;
};

export type BankTransactionMaxAggregate = {
    __typename?: "BankTransactionMaxAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionMinAggregate = {
    __typename?: "BankTransactionMinAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionRelationFilter = {
    is?: InputMaybe<BankTransactionWhereInput>;
    isNot?: InputMaybe<BankTransactionWhereInput>;
};

export type BankTransactionSumAggregate = {
    __typename?: "BankTransactionSumAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionWhereInput = {
    AND?: InputMaybe<Array<BankTransactionWhereInput>>;
    NOT?: InputMaybe<Array<BankTransactionWhereInput>>;
    OR?: InputMaybe<Array<BankTransactionWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bank?: InputMaybe<BankAccountRelationFilter>;
    bankId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringFilter>;
    expense?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<StringFilter>;
    spentAmount?: InputMaybe<FloatFilter>;
};

export type BankTransactionWhereUniqueInput = {
    AND?: InputMaybe<Array<BankTransactionWhereInput>>;
    NOT?: InputMaybe<Array<BankTransactionWhereInput>>;
    OR?: InputMaybe<Array<BankTransactionWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bank?: InputMaybe<BankAccountRelationFilter>;
    bankId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringFilter>;
    expense?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    spentAmount?: InputMaybe<FloatFilter>;
};

export type CreateBankManagerInput = {
    apiKey: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CreateCryptoPortfolioInput = {
    apiKey: Scalars["String"]["input"];
    secretKey: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CreateCryptoRes = {
    __typename?: "CreateCryptoRes";
    userId: Scalars["Float"]["output"];
};

export type CreateExpenseCategoryInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CreateExpenseInput = {
    amount: Scalars["Float"]["input"];
    bankTransactionId: Scalars["String"]["input"];
    categoryId: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CryptoPortfolio = {
    __typename?: "CryptoPortfolio";
    apiKey: Scalars["String"]["output"];
    balances: Array<AssetBalance>;
    exchanges: Scalars["String"]["output"];
    historicalBalances: Array<HistoricalCryptoBalance>;
    id: Scalars["String"]["output"];
    secretKey: Scalars["String"]["output"];
    tradingType: TradingType;
    updateTime?: Maybe<Scalars["DateTime"]["output"]>;
    user: User;
    userId: Scalars["Int"]["output"];
};

export type CryptoPortfolioAvgAggregate = {
    __typename?: "CryptoPortfolioAvgAggregate";
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type CryptoPortfolioCountAggregate = {
    __typename?: "CryptoPortfolioCountAggregate";
    _all: Scalars["Int"]["output"];
    apiKey: Scalars["Int"]["output"];
    exchanges: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    secretKey: Scalars["Int"]["output"];
    tradingType: Scalars["Int"]["output"];
    updateTime: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type CryptoPortfolioCreateManyUserInput = {
    apiKey: Scalars["String"]["input"];
    exchanges?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    secretKey: Scalars["String"]["input"];
    tradingType: TradingType;
    updateTime?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type CryptoPortfolioCreateManyUserInputEnvelope = {
    data: Array<CryptoPortfolioCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type CryptoPortfolioCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<CryptoPortfolioWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<CryptoPortfolioCreateOrConnectWithoutUserInput>
    >;
    create?: InputMaybe<Array<CryptoPortfolioCreateWithoutUserInput>>;
    createMany?: InputMaybe<CryptoPortfolioCreateManyUserInputEnvelope>;
};

export type CryptoPortfolioCreateOrConnectWithoutUserInput = {
    create: CryptoPortfolioCreateWithoutUserInput;
    where: CryptoPortfolioWhereUniqueInput;
};

export type CryptoPortfolioCreateWithoutUserInput = {
    apiKey: Scalars["String"]["input"];
    balances?: InputMaybe<AssetBalanceCreateNestedManyWithoutCryptoPortfolioInput>;
    exchanges?: InputMaybe<Scalars["String"]["input"]>;
    historicalBalances?: InputMaybe<HistoricalCryptoBalanceCreateNestedManyWithoutCryptoPortfolioInput>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    secretKey: Scalars["String"]["input"];
    tradingType: TradingType;
    updateTime?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type CryptoPortfolioListRelationFilter = {
    every?: InputMaybe<CryptoPortfolioWhereInput>;
    none?: InputMaybe<CryptoPortfolioWhereInput>;
    some?: InputMaybe<CryptoPortfolioWhereInput>;
};

export type CryptoPortfolioMaxAggregate = {
    __typename?: "CryptoPortfolioMaxAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    exchanges?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    secretKey?: Maybe<Scalars["String"]["output"]>;
    tradingType?: Maybe<TradingType>;
    updateTime?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type CryptoPortfolioMinAggregate = {
    __typename?: "CryptoPortfolioMinAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    exchanges?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    secretKey?: Maybe<Scalars["String"]["output"]>;
    tradingType?: Maybe<TradingType>;
    updateTime?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type CryptoPortfolioRelationFilter = {
    is?: InputMaybe<CryptoPortfolioWhereInput>;
    isNot?: InputMaybe<CryptoPortfolioWhereInput>;
};

export type CryptoPortfolioSumAggregate = {
    __typename?: "CryptoPortfolioSumAggregate";
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type CryptoPortfolioWhereInput = {
    AND?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    NOT?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    OR?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    balances?: InputMaybe<AssetBalanceListRelationFilter>;
    exchanges?: InputMaybe<StringFilter>;
    historicalBalances?: InputMaybe<HistoricalCryptoBalanceListRelationFilter>;
    id?: InputMaybe<StringFilter>;
    secretKey?: InputMaybe<StringFilter>;
    tradingType?: InputMaybe<EnumTradingTypeFilter>;
    updateTime?: InputMaybe<DateTimeNullableFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type CryptoPortfolioWhereUniqueInput = {
    AND?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    NOT?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    OR?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    balances?: InputMaybe<AssetBalanceListRelationFilter>;
    exchanges?: InputMaybe<StringFilter>;
    historicalBalances?: InputMaybe<HistoricalCryptoBalanceListRelationFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    secretKey?: InputMaybe<StringFilter>;
    tradingType?: InputMaybe<EnumTradingTypeFilter>;
    updateTime?: InputMaybe<DateTimeNullableFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type DateTimeFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type DateTimeNullableFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type EnumOtpPurposeNullableFilter = {
    equals?: InputMaybe<OtpPurpose>;
    in?: InputMaybe<Array<OtpPurpose>>;
    not?: InputMaybe<NestedEnumOtpPurposeNullableFilter>;
    notIn?: InputMaybe<Array<OtpPurpose>>;
};

export type EnumTradingTypeFilter = {
    equals?: InputMaybe<TradingType>;
    in?: InputMaybe<Array<TradingType>>;
    not?: InputMaybe<NestedEnumTradingTypeFilter>;
    notIn?: InputMaybe<Array<TradingType>>;
};

export type Expense = {
    __typename?: "Expense";
    amount: Scalars["Float"]["output"];
    bankTransaction: BankTransaction;
    bankTransactionId: Scalars["String"]["output"];
    category: ExpenseCategory;
    categoryId: Scalars["String"]["output"];
    createdAt: Scalars["DateTime"]["output"];
    description?: Maybe<Scalars["String"]["output"]>;
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    transaction: BankTransaction;
    user: User;
    userId: Scalars["Int"]["output"];
};

export type ExpenseAvgAggregate = {
    __typename?: "ExpenseAvgAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type ExpenseCategory = {
    __typename?: "ExpenseCategory";
    color: Scalars["String"]["output"];
    countExpenses: Scalars["Int"]["output"];
    description?: Maybe<Scalars["String"]["output"]>;
    expenses?: Maybe<Array<Expense>>;
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    totalAmount: Scalars["Int"]["output"];
    user: User;
    userId: Scalars["Int"]["output"];
};

export type ExpenseCategoryTotalAmountArgs = {
    endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type ExpenseCategoryAvgAggregate = {
    __typename?: "ExpenseCategoryAvgAggregate";
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type ExpenseCategoryCountAggregate = {
    __typename?: "ExpenseCategoryCountAggregate";
    _all: Scalars["Int"]["output"];
    color: Scalars["Int"]["output"];
    description: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type ExpenseCategoryCreateManyUserInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseCategoryCreateManyUserInputEnvelope = {
    data: Array<ExpenseCategoryCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCategoryCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<ExpenseCategoryWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<ExpenseCategoryCreateOrConnectWithoutUserInput>
    >;
    create?: InputMaybe<Array<ExpenseCategoryCreateWithoutUserInput>>;
    createMany?: InputMaybe<ExpenseCategoryCreateManyUserInputEnvelope>;
};

export type ExpenseCategoryCreateNestedOneWithoutExpensesInput = {
    connect?: InputMaybe<ExpenseCategoryWhereUniqueInput>;
    connectOrCreate?: InputMaybe<ExpenseCategoryCreateOrConnectWithoutExpensesInput>;
    create?: InputMaybe<ExpenseCategoryCreateWithoutExpensesInput>;
};

export type ExpenseCategoryCreateOrConnectWithoutExpensesInput = {
    create: ExpenseCategoryCreateWithoutExpensesInput;
    where: ExpenseCategoryWhereUniqueInput;
};

export type ExpenseCategoryCreateOrConnectWithoutUserInput = {
    create: ExpenseCategoryCreateWithoutUserInput;
    where: ExpenseCategoryWhereUniqueInput;
};

export type ExpenseCategoryCreateWithoutExpensesInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    user: UserCreateNestedOneWithoutExpenseCategoriesInput;
};

export type ExpenseCategoryCreateWithoutUserInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutCategoryInput>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseCategoryListRelationFilter = {
    every?: InputMaybe<ExpenseCategoryWhereInput>;
    none?: InputMaybe<ExpenseCategoryWhereInput>;
    some?: InputMaybe<ExpenseCategoryWhereInput>;
};

export type ExpenseCategoryMaxAggregate = {
    __typename?: "ExpenseCategoryMaxAggregate";
    color?: Maybe<Scalars["String"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseCategoryMinAggregate = {
    __typename?: "ExpenseCategoryMinAggregate";
    color?: Maybe<Scalars["String"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseCategoryRelationFilter = {
    is?: InputMaybe<ExpenseCategoryWhereInput>;
    isNot?: InputMaybe<ExpenseCategoryWhereInput>;
};

export type ExpenseCategorySumAggregate = {
    __typename?: "ExpenseCategorySumAggregate";
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseCategoryWhereInput = {
    AND?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    OR?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    color?: InputMaybe<StringFilter>;
    description?: InputMaybe<StringNullableFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type ExpenseCategoryWhereUniqueInput = {
    AND?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    OR?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    color?: InputMaybe<StringFilter>;
    description?: InputMaybe<StringNullableFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type ExpenseCountAggregate = {
    __typename?: "ExpenseCountAggregate";
    _all: Scalars["Int"]["output"];
    amount: Scalars["Int"]["output"];
    bankTransactionId: Scalars["Int"]["output"];
    categoryId: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    description: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type ExpenseCreateManyBankTransactionInput = {
    amount: Scalars["Float"]["input"];
    categoryId: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type ExpenseCreateManyBankTransactionInputEnvelope = {
    data: Array<ExpenseCreateManyBankTransactionInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCreateManyCategoryInput = {
    amount: Scalars["Float"]["input"];
    bankTransactionId: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type ExpenseCreateManyCategoryInputEnvelope = {
    data: Array<ExpenseCreateManyCategoryInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCreateManyUserInput = {
    amount: Scalars["Float"]["input"];
    bankTransactionId: Scalars["String"]["input"];
    categoryId: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseCreateManyUserInputEnvelope = {
    data: Array<ExpenseCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCreateNestedManyWithoutBankTransactionInput = {
    connect?: InputMaybe<Array<ExpenseWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<ExpenseCreateOrConnectWithoutBankTransactionInput>
    >;
    create?: InputMaybe<Array<ExpenseCreateWithoutBankTransactionInput>>;
    createMany?: InputMaybe<ExpenseCreateManyBankTransactionInputEnvelope>;
};

export type ExpenseCreateNestedManyWithoutCategoryInput = {
    connect?: InputMaybe<Array<ExpenseWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<ExpenseCreateOrConnectWithoutCategoryInput>
    >;
    create?: InputMaybe<Array<ExpenseCreateWithoutCategoryInput>>;
    createMany?: InputMaybe<ExpenseCreateManyCategoryInputEnvelope>;
};

export type ExpenseCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<ExpenseWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<Array<ExpenseCreateOrConnectWithoutUserInput>>;
    create?: InputMaybe<Array<ExpenseCreateWithoutUserInput>>;
    createMany?: InputMaybe<ExpenseCreateManyUserInputEnvelope>;
};

export type ExpenseCreateOrConnectWithoutBankTransactionInput = {
    create: ExpenseCreateWithoutBankTransactionInput;
    where: ExpenseWhereUniqueInput;
};

export type ExpenseCreateOrConnectWithoutCategoryInput = {
    create: ExpenseCreateWithoutCategoryInput;
    where: ExpenseWhereUniqueInput;
};

export type ExpenseCreateOrConnectWithoutUserInput = {
    create: ExpenseCreateWithoutUserInput;
    where: ExpenseWhereUniqueInput;
};

export type ExpenseCreateWithoutBankTransactionInput = {
    amount: Scalars["Float"]["input"];
    category: ExpenseCategoryCreateNestedOneWithoutExpensesInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    user: UserCreateNestedOneWithoutExpensesInput;
};

export type ExpenseCreateWithoutCategoryInput = {
    amount: Scalars["Float"]["input"];
    bankTransaction: BankTransactionCreateNestedOneWithoutExpenseInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    user: UserCreateNestedOneWithoutExpensesInput;
};

export type ExpenseCreateWithoutUserInput = {
    amount: Scalars["Float"]["input"];
    bankTransaction: BankTransactionCreateNestedOneWithoutExpenseInput;
    category: ExpenseCategoryCreateNestedOneWithoutExpensesInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseListRelationFilter = {
    every?: InputMaybe<ExpenseWhereInput>;
    none?: InputMaybe<ExpenseWhereInput>;
    some?: InputMaybe<ExpenseWhereInput>;
};

export type ExpenseMaxAggregate = {
    __typename?: "ExpenseMaxAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankTransactionId?: Maybe<Scalars["String"]["output"]>;
    categoryId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseMinAggregate = {
    __typename?: "ExpenseMinAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankTransactionId?: Maybe<Scalars["String"]["output"]>;
    categoryId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseSumAggregate = {
    __typename?: "ExpenseSumAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseWhereInput = {
    AND?: InputMaybe<Array<ExpenseWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseWhereInput>>;
    OR?: InputMaybe<Array<ExpenseWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bankTransaction?: InputMaybe<BankTransactionRelationFilter>;
    bankTransactionId?: InputMaybe<StringFilter>;
    category?: InputMaybe<ExpenseCategoryRelationFilter>;
    categoryId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringNullableFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type ExpenseWhereUniqueInput = {
    AND?: InputMaybe<Array<ExpenseWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseWhereInput>>;
    OR?: InputMaybe<Array<ExpenseWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bankTransaction?: InputMaybe<BankTransactionRelationFilter>;
    bankTransactionId?: InputMaybe<StringFilter>;
    category?: InputMaybe<ExpenseCategoryRelationFilter>;
    categoryId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringNullableFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type FloatFilter = {
    equals?: InputMaybe<Scalars["Float"]["input"]>;
    gt?: InputMaybe<Scalars["Float"]["input"]>;
    gte?: InputMaybe<Scalars["Float"]["input"]>;
    in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
    lt?: InputMaybe<Scalars["Float"]["input"]>;
    lte?: InputMaybe<Scalars["Float"]["input"]>;
    not?: InputMaybe<NestedFloatFilter>;
    notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
};

export type GetAssetInfoInput = {
    id: Scalars["String"]["input"];
};

export type GetAssetPriceInput = {
    assetInfoId: Scalars["String"]["input"];
    timeFrame: Scalars["String"]["input"];
};

export type GetCryptoPortfolioInput = {
    userId: Scalars["Int"]["input"];
};

export type HistoricalCryptoBalance = {
    __typename?: "HistoricalCryptoBalance";
    changeBalance: Scalars["Float"]["output"];
    changePercent: Scalars["Float"]["output"];
    cryptoPortfolio: CryptoPortfolio;
    cryptoPortfolioId: Scalars["String"]["output"];
    estimatedBalance: Scalars["Float"]["output"];
    time: Scalars["DateTime"]["output"];
};

export type HistoricalCryptoBalanceAvgAggregate = {
    __typename?: "HistoricalCryptoBalanceAvgAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type HistoricalCryptoBalanceCountAggregate = {
    __typename?: "HistoricalCryptoBalanceCountAggregate";
    _all: Scalars["Int"]["output"];
    changeBalance: Scalars["Int"]["output"];
    changePercent: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    estimatedBalance: Scalars["Int"]["output"];
    time: Scalars["Int"]["output"];
};

export type HistoricalCryptoBalanceCreateManyCryptoPortfolioInput = {
    changeBalance: Scalars["Float"]["input"];
    changePercent: Scalars["Float"]["input"];
    estimatedBalance: Scalars["Float"]["input"];
    time: Scalars["DateTime"]["input"];
};

export type HistoricalCryptoBalanceCreateManyCryptoPortfolioInputEnvelope = {
    data: Array<HistoricalCryptoBalanceCreateManyCryptoPortfolioInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type HistoricalCryptoBalanceCreateNestedManyWithoutCryptoPortfolioInput =
    {
        connect?: InputMaybe<Array<HistoricalCryptoBalanceWhereUniqueInput>>;
        connectOrCreate?: InputMaybe<
            Array<HistoricalCryptoBalanceCreateOrConnectWithoutCryptoPortfolioInput>
        >;
        create?: InputMaybe<
            Array<HistoricalCryptoBalanceCreateWithoutCryptoPortfolioInput>
        >;
        createMany?: InputMaybe<HistoricalCryptoBalanceCreateManyCryptoPortfolioInputEnvelope>;
    };

export type HistoricalCryptoBalanceCreateOrConnectWithoutCryptoPortfolioInput =
    {
        create: HistoricalCryptoBalanceCreateWithoutCryptoPortfolioInput;
        where: HistoricalCryptoBalanceWhereUniqueInput;
    };

export type HistoricalCryptoBalanceCreateWithoutCryptoPortfolioInput = {
    changeBalance: Scalars["Float"]["input"];
    changePercent: Scalars["Float"]["input"];
    estimatedBalance: Scalars["Float"]["input"];
    time: Scalars["DateTime"]["input"];
};

export type HistoricalCryptoBalanceCryptoPortfolioIdTimeCompoundUniqueInput = {
    cryptoPortfolioId: Scalars["String"]["input"];
    time: Scalars["DateTime"]["input"];
};

export type HistoricalCryptoBalanceListRelationFilter = {
    every?: InputMaybe<HistoricalCryptoBalanceWhereInput>;
    none?: InputMaybe<HistoricalCryptoBalanceWhereInput>;
    some?: InputMaybe<HistoricalCryptoBalanceWhereInput>;
};

export type HistoricalCryptoBalanceMaxAggregate = {
    __typename?: "HistoricalCryptoBalanceMaxAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type HistoricalCryptoBalanceMinAggregate = {
    __typename?: "HistoricalCryptoBalanceMinAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type HistoricalCryptoBalanceSumAggregate = {
    __typename?: "HistoricalCryptoBalanceSumAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type HistoricalCryptoBalanceWhereInput = {
    AND?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    NOT?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    OR?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    changeBalance?: InputMaybe<FloatFilter>;
    changePercent?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    estimatedBalance?: InputMaybe<FloatFilter>;
    time?: InputMaybe<DateTimeFilter>;
};

export type HistoricalCryptoBalanceWhereUniqueInput = {
    AND?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    NOT?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    OR?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    changeBalance?: InputMaybe<FloatFilter>;
    changePercent?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    cryptoPortfolioId_time?: InputMaybe<HistoricalCryptoBalanceCryptoPortfolioIdTimeCompoundUniqueInput>;
    estimatedBalance?: InputMaybe<FloatFilter>;
    time?: InputMaybe<DateTimeFilter>;
};

export type Historical_Crypto_Balance_1dAvgAggregate = {
    __typename?: "Historical_crypto_balance_1dAvgAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type Historical_Crypto_Balance_1dCountAggregate = {
    __typename?: "Historical_crypto_balance_1dCountAggregate";
    _all: Scalars["Int"]["output"];
    changeBalance: Scalars["Int"]["output"];
    changePercent: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    estimatedBalance: Scalars["Int"]["output"];
    time: Scalars["Int"]["output"];
};

export type Historical_Crypto_Balance_1dMaxAggregate = {
    __typename?: "Historical_crypto_balance_1dMaxAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1dMinAggregate = {
    __typename?: "Historical_crypto_balance_1dMinAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1dSumAggregate = {
    __typename?: "Historical_crypto_balance_1dSumAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type Historical_Crypto_Balance_1hAvgAggregate = {
    __typename?: "Historical_crypto_balance_1hAvgAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type Historical_Crypto_Balance_1hCountAggregate = {
    __typename?: "Historical_crypto_balance_1hCountAggregate";
    _all: Scalars["Int"]["output"];
    changeBalance: Scalars["Int"]["output"];
    changePercent: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    estimatedBalance: Scalars["Int"]["output"];
    time: Scalars["Int"]["output"];
};

export type Historical_Crypto_Balance_1hMaxAggregate = {
    __typename?: "Historical_crypto_balance_1hMaxAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1hMinAggregate = {
    __typename?: "Historical_crypto_balance_1hMinAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1hSumAggregate = {
    __typename?: "Historical_crypto_balance_1hSumAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type IntFilter = {
    equals?: InputMaybe<Scalars["Int"]["input"]>;
    gt?: InputMaybe<Scalars["Int"]["input"]>;
    gte?: InputMaybe<Scalars["Int"]["input"]>;
    in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
    lt?: InputMaybe<Scalars["Int"]["input"]>;
    lte?: InputMaybe<Scalars["Int"]["input"]>;
    not?: InputMaybe<NestedIntFilter>;
    notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type LoginReqDto = {
    email: Scalars["String"]["input"];
    password: Scalars["String"]["input"];
};

export type LoginResDto = {
    __typename?: "LoginResDto";
    accessToken: Scalars["String"]["output"];
    refreshToken: Scalars["String"]["output"];
};

export type Mutation = {
    __typename?: "Mutation";
    createBank: BankManager;
    createCryptoPortfolio: CreateCryptoRes;
    createExpense: Expense;
    createExpenseCategory: ExpenseCategory;
    login: LoginResDto;
    removeExpense: Expense;
    removeExpenseCategory: ExpenseCategory;
    removeExpenses: Scalars["Int"]["output"];
    signup: SignupResDto;
    updateExpense: Expense;
    updateExpenseCategory: ExpenseCategory;
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

export type MutationLoginArgs = {
    data: LoginReqDto;
};

export type MutationRemoveExpenseArgs = {
    id: Scalars["String"]["input"];
};

export type MutationRemoveExpenseCategoryArgs = {
    id: Scalars["String"]["input"];
};

export type MutationRemoveExpensesArgs = {
    ids: Array<Scalars["String"]["input"]>;
};

export type MutationSignupArgs = {
    data: UserCreateInput;
};

export type MutationUpdateExpenseArgs = {
    data: UpdateExpenseInput;
    id: Scalars["String"]["input"];
};

export type MutationUpdateExpenseCategoryArgs = {
    data: UpdateExpenseCategoryInput;
    id: Scalars["String"]["input"];
};

export type MutationVerifyAccountArgs = {
    data: VerifyDto;
};

export type NestedDateTimeFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type NestedDateTimeNullableFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type NestedEnumOtpPurposeNullableFilter = {
    equals?: InputMaybe<OtpPurpose>;
    in?: InputMaybe<Array<OtpPurpose>>;
    not?: InputMaybe<NestedEnumOtpPurposeNullableFilter>;
    notIn?: InputMaybe<Array<OtpPurpose>>;
};

export type NestedEnumTradingTypeFilter = {
    equals?: InputMaybe<TradingType>;
    in?: InputMaybe<Array<TradingType>>;
    not?: InputMaybe<NestedEnumTradingTypeFilter>;
    notIn?: InputMaybe<Array<TradingType>>;
};

export type NestedFloatFilter = {
    equals?: InputMaybe<Scalars["Float"]["input"]>;
    gt?: InputMaybe<Scalars["Float"]["input"]>;
    gte?: InputMaybe<Scalars["Float"]["input"]>;
    in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
    lt?: InputMaybe<Scalars["Float"]["input"]>;
    lte?: InputMaybe<Scalars["Float"]["input"]>;
    not?: InputMaybe<NestedFloatFilter>;
    notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
};

export type NestedIntFilter = {
    equals?: InputMaybe<Scalars["Int"]["input"]>;
    gt?: InputMaybe<Scalars["Int"]["input"]>;
    gte?: InputMaybe<Scalars["Int"]["input"]>;
    in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
    lt?: InputMaybe<Scalars["Int"]["input"]>;
    lte?: InputMaybe<Scalars["Int"]["input"]>;
    not?: InputMaybe<NestedIntFilter>;
    notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type NestedStringFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    not?: InputMaybe<NestedStringFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type NestedStringNullableFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    not?: InputMaybe<NestedStringNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export enum OtpPurpose {
    ResetPassword = "RESET_PASSWORD",
    VerifyAccount = "VERIFY_ACCOUNT",
}

export type PaginationInput = {
    after?: InputMaybe<Scalars["String"]["input"]>;
    before?: InputMaybe<Scalars["String"]["input"]>;
    take: Scalars["Int"]["input"];
};

export type Query = {
    __typename?: "Query";
    getAssetInfo: AssetInfo;
    getAssetPrices: Array<AssetPrice>;
    getBankManagers: Array<BankManager>;
    getBankTransactions: Array<BankTransaction>;
    getCryptoPortfolios: Array<CryptoPortfolio>;
    getExpenseCategories: Array<ExpenseCategory>;
    getExpenses: Array<Expense>;
    getMe: User;
};

export type QueryGetAssetInfoArgs = {
    data: GetAssetInfoInput;
};

export type QueryGetAssetPricesArgs = {
    data: GetAssetPriceInput;
    pagination: PaginationInput;
};

export type QueryGetBankManagersArgs = {
    userId: Scalars["Int"]["input"];
};

export type QueryGetBankTransactionsArgs = {
    userId: Scalars["Float"]["input"];
};

export type QueryGetCryptoPortfoliosArgs = {
    data: GetCryptoPortfolioInput;
};

export type QueryGetExpenseCategoriesArgs = {
    userId: Scalars["Int"]["input"];
};

export type QueryGetExpensesArgs = {
    endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    userId: Scalars["Int"]["input"];
};

export enum QueryMode {
    Default = "default",
    Insensitive = "insensitive",
}

export type SignupResDto = {
    __typename?: "SignupResDto";
    accessToken: Scalars["String"]["output"];
    refreshToken: Scalars["String"]["output"];
};

export type StringFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    mode?: InputMaybe<QueryMode>;
    not?: InputMaybe<NestedStringFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type StringNullableFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    mode?: InputMaybe<QueryMode>;
    not?: InputMaybe<NestedStringNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type Subscription = {
    __typename?: "Subscription";
    newAssetPrice1m: AssetPrice;
    newAssetPrice5m: AssetPrice;
    portfolioCreated: CryptoPortfolio;
};

export type SubscriptionNewAssetPrice1mArgs = {
    data: GetAssetPriceInput;
};

export type SubscriptionNewAssetPrice5mArgs = {
    data: GetAssetPriceInput;
};

export type SubscriptionPortfolioCreatedArgs = {
    data: GetCryptoPortfolioInput;
};

export enum TradingType {
    Futures = "FUTURES",
    Spot = "SPOT",
}

export type UpdateExpenseCategoryInput = {
    color?: InputMaybe<Scalars["String"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateExpenseInput = {
    amount?: InputMaybe<Scalars["Float"]["input"]>;
    bankTransactionId?: InputMaybe<Scalars["String"]["input"]>;
    categoryId?: InputMaybe<Scalars["String"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
    __typename?: "User";
    bankManager?: Maybe<Array<BankManager>>;
    cryptoPortfolios?: Maybe<Array<CryptoPortfolio>>;
    cryptoProfiles: CryptoPortfolio;
    email: Scalars["String"]["output"];
    expenseCategories?: Maybe<Array<ExpenseCategory>>;
    expenses?: Maybe<Array<Expense>>;
    id: Scalars["Int"]["output"];
    name?: Maybe<Scalars["String"]["output"]>;
    otp?: Maybe<Scalars["String"]["output"]>;
    otpPurpose?: Maybe<OtpPurpose>;
    password: Scalars["String"]["output"];
};

export type UserAvgAggregate = {
    __typename?: "UserAvgAggregate";
    id?: Maybe<Scalars["Float"]["output"]>;
};

export type UserCountAggregate = {
    __typename?: "UserCountAggregate";
    _all: Scalars["Int"]["output"];
    email: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    otp: Scalars["Int"]["output"];
    otpPurpose: Scalars["Int"]["output"];
    password: Scalars["Int"]["output"];
};

export type UserCreateInput = {
    bankManager?: InputMaybe<BankManagerCreateNestedManyWithoutUserInput>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenseCategories?: InputMaybe<ExpenseCategoryCreateNestedManyWithoutUserInput>;
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserCreateNestedOneWithoutBankManagerInput = {
    connect?: InputMaybe<UserWhereUniqueInput>;
    connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutBankManagerInput>;
    create?: InputMaybe<UserCreateWithoutBankManagerInput>;
};

export type UserCreateNestedOneWithoutExpenseCategoriesInput = {
    connect?: InputMaybe<UserWhereUniqueInput>;
    connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutExpenseCategoriesInput>;
    create?: InputMaybe<UserCreateWithoutExpenseCategoriesInput>;
};

export type UserCreateNestedOneWithoutExpensesInput = {
    connect?: InputMaybe<UserWhereUniqueInput>;
    connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutExpensesInput>;
    create?: InputMaybe<UserCreateWithoutExpensesInput>;
};

export type UserCreateOrConnectWithoutBankManagerInput = {
    create: UserCreateWithoutBankManagerInput;
    where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutExpenseCategoriesInput = {
    create: UserCreateWithoutExpenseCategoriesInput;
    where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutExpensesInput = {
    create: UserCreateWithoutExpensesInput;
    where: UserWhereUniqueInput;
};

export type UserCreateWithoutBankManagerInput = {
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenseCategories?: InputMaybe<ExpenseCategoryCreateNestedManyWithoutUserInput>;
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserCreateWithoutExpenseCategoriesInput = {
    bankManager?: InputMaybe<BankManagerCreateNestedManyWithoutUserInput>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserCreateWithoutExpensesInput = {
    bankManager?: InputMaybe<BankManagerCreateNestedManyWithoutUserInput>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenseCategories?: InputMaybe<ExpenseCategoryCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserMaxAggregate = {
    __typename?: "UserMaxAggregate";
    email?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["Int"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    otp?: Maybe<Scalars["String"]["output"]>;
    otpPurpose?: Maybe<OtpPurpose>;
    password?: Maybe<Scalars["String"]["output"]>;
};

export type UserMinAggregate = {
    __typename?: "UserMinAggregate";
    email?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["Int"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    otp?: Maybe<Scalars["String"]["output"]>;
    otpPurpose?: Maybe<OtpPurpose>;
    password?: Maybe<Scalars["String"]["output"]>;
};

export type UserRelationFilter = {
    is?: InputMaybe<UserWhereInput>;
    isNot?: InputMaybe<UserWhereInput>;
};

export type UserSumAggregate = {
    __typename?: "UserSumAggregate";
    id?: Maybe<Scalars["Int"]["output"]>;
};

export type UserWhereInput = {
    AND?: InputMaybe<Array<UserWhereInput>>;
    NOT?: InputMaybe<Array<UserWhereInput>>;
    OR?: InputMaybe<Array<UserWhereInput>>;
    bankManager?: InputMaybe<BankManagerListRelationFilter>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioListRelationFilter>;
    email?: InputMaybe<StringFilter>;
    expenseCategories?: InputMaybe<ExpenseCategoryListRelationFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<IntFilter>;
    name?: InputMaybe<StringNullableFilter>;
    otp?: InputMaybe<StringNullableFilter>;
    otpPurpose?: InputMaybe<EnumOtpPurposeNullableFilter>;
    password?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
    AND?: InputMaybe<Array<UserWhereInput>>;
    NOT?: InputMaybe<Array<UserWhereInput>>;
    OR?: InputMaybe<Array<UserWhereInput>>;
    bankManager?: InputMaybe<BankManagerListRelationFilter>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioListRelationFilter>;
    email?: InputMaybe<Scalars["String"]["input"]>;
    expenseCategories?: InputMaybe<ExpenseCategoryListRelationFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<Scalars["Int"]["input"]>;
    name?: InputMaybe<StringNullableFilter>;
    otp?: InputMaybe<StringNullableFilter>;
    otpPurpose?: InputMaybe<EnumOtpPurposeNullableFilter>;
    password?: InputMaybe<StringFilter>;
};

export type VerifyDto = {
    otp: Scalars["String"]["input"];
    otpPurpose: OtpPurpose;
};

export type SignupMutationVariables = Exact<{
    data: UserCreateInput;
}>;

export type SignupMutation = {
    __typename?: "Mutation";
    signup: {
        __typename?: "SignupResDto";
        accessToken: string;
        refreshToken: string;
    };
};

export type LoginMutationVariables = Exact<{
    data: LoginReqDto;
}>;

export type LoginMutation = {
    __typename?: "Mutation";
    login: { __typename?: "LoginResDto"; accessToken: string };
};

export type VerifyAccountMutationVariables = Exact<{
    data: VerifyDto;
}>;

export type VerifyAccountMutation = {
    __typename?: "Mutation";
    verifyAccount: { __typename?: "LoginResDto"; accessToken: string };
};

export type GetBankQueryVariables = Exact<{
    userId: Scalars["Int"]["input"];
}>;

export type GetBankQuery = {
    __typename?: "Query";
    getBankManagers: Array<{
        __typename?: "BankManager";
        name: string;
        createdAt: any;
        updatedAt: any;
        banks: Array<{
            __typename?: "BankAccount";
            name: string;
            accountName: string;
            accountNumber: string;
            balance: number;
            createdAt: any;
            updatedAt: any;
            transactions: Array<{
                __typename?: "BankTransaction";
                id: string;
                amount: number;
                spentAmount: number;
                description: string;
                createdAt: any;
                bank: { __typename?: "BankAccount"; name: string };
            }>;
        }>;
    }>;
};

export type GetBankTransactionsQueryVariables = Exact<{
    userId: Scalars["Float"]["input"];
}>;

export type GetBankTransactionsQuery = {
    __typename?: "Query";
    getBankTransactions: Array<{
        __typename?: "BankTransaction";
        id: string;
        amount: number;
        spentAmount: number;
        createdAt: any;
        description: string;
        bank: { __typename?: "BankAccount"; name: string };
    }>;
};

export type CreateCryptoPortfolioMutationVariables = Exact<{
    data: CreateCryptoPortfolioInput;
}>;

export type CreateCryptoPortfolioMutation = {
    __typename?: "Mutation";
    createCryptoPortfolio: { __typename?: "CreateCryptoRes"; userId: number };
};

export type GetCryptoPortfolioQueryVariables = Exact<{
    data: GetCryptoPortfolioInput;
}>;

export type GetCryptoPortfolioQuery = {
    __typename?: "Query";
    getCryptoPortfolios: Array<{
        __typename?: "CryptoPortfolio";
        id: string;
        exchanges: string;
        tradingType: TradingType;
        historicalBalances: Array<{
            __typename?: "HistoricalCryptoBalance";
            time: any;
            estimatedBalance: number;
            changePercent: number;
            changeBalance: number;
        }>;
        balances: Array<{
            __typename?: "AssetBalance";
            balance: number;
            assetInfo: {
                __typename?: "AssetInfoOutput";
                id?: string | null;
                logo?: string | null;
                lastPrice: number;
                symbol?: string | null;
            };
        }>;
    }>;
};

export type GetAssetQueryVariables = Exact<{
    pagination: PaginationInput;
    getAssetPriceData: GetAssetPriceInput;
    getAssetInfoData: GetAssetInfoInput;
}>;

export type GetAssetQuery = {
    __typename?: "Query";
    getAssetPrices: Array<{
        __typename?: "AssetPrice";
        open_time: any;
        openPrice: number;
        closePrice: number;
        highPrice: number;
        lowPrice: number;
    }>;
    getAssetInfo: {
        __typename?: "AssetInfo";
        logo: string;
        desc: string;
        category: string;
        symbol: string;
        name: string;
    };
};

export type NewAssetPrice1mSubscriptionVariables = Exact<{
    data: GetAssetPriceInput;
}>;

export type NewAssetPrice1mSubscription = {
    __typename?: "Subscription";
    newAssetPrice1m: {
        __typename?: "AssetPrice";
        assetInfoId: string;
        open_time: any;
        openPrice: number;
        closePrice: number;
        highPrice: number;
        lowPrice: number;
    };
};

export type NewAssetPrice5mSubscriptionVariables = Exact<{
    data: GetAssetPriceInput;
}>;

export type NewAssetPrice5mSubscription = {
    __typename?: "Subscription";
    newAssetPrice5m: {
        __typename?: "AssetPrice";
        assetInfoId: string;
        open_time: any;
        openPrice: number;
        closePrice: number;
        highPrice: number;
        lowPrice: number;
    };
};

export type GetExpenseCategoriesQueryVariables = Exact<{
    userId: Scalars["Int"]["input"];
    startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
}>;

export type GetExpenseCategoriesQuery = {
    __typename?: "Query";
    getExpenseCategories: Array<{
        __typename?: "ExpenseCategory";
        color: string;
        description?: string | null;
        name: string;
        id: string;
        countExpenses: number;
        totalAmount: number;
    }>;
};

export type CreateExpenseCategoryMutationVariables = Exact<{
    data: CreateExpenseCategoryInput;
}>;

export type CreateExpenseCategoryMutation = {
    __typename?: "Mutation";
    createExpenseCategory: {
        __typename?: "ExpenseCategory";
        color: string;
        description?: string | null;
        name: string;
        id: string;
    };
};

export type UpdateExpenseCategoryMutationVariables = Exact<{
    id: Scalars["String"]["input"];
    data: UpdateExpenseCategoryInput;
}>;

export type UpdateExpenseCategoryMutation = {
    __typename?: "Mutation";
    updateExpenseCategory: {
        __typename?: "ExpenseCategory";
        color: string;
        description?: string | null;
        name: string;
        id: string;
    };
};

export type RemoveExpenseCategoryMutationVariables = Exact<{
    id: Scalars["String"]["input"];
}>;

export type RemoveExpenseCategoryMutation = {
    __typename?: "Mutation";
    removeExpenseCategory: { __typename?: "ExpenseCategory"; id: string };
};

export type GetExpensesQueryVariables = Exact<{
    userId: Scalars["Int"]["input"];
    startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
}>;

export type GetExpensesQuery = {
    __typename?: "Query";
    getExpenses: Array<{
        __typename?: "Expense";
        id: string;
        createdAt: any;
        description?: string | null;
        amount: number;
        name: string;
        category: {
            __typename?: "ExpenseCategory";
            id: string;
            color: string;
            name: string;
        };
        transaction: {
            __typename?: "BankTransaction";
            id: string;
            amount: number;
            spentAmount: number;
            description: string;
        };
    }>;
};

export type CreateExpenseMutationVariables = Exact<{
    data: CreateExpenseInput;
}>;

export type CreateExpenseMutation = {
    __typename?: "Mutation";
    createExpense: {
        __typename?: "Expense";
        id: string;
        description?: string | null;
        amount: number;
        name: string;
    };
};

export type UpdateExpenseMutationVariables = Exact<{
    id: Scalars["String"]["input"];
    data: UpdateExpenseInput;
}>;

export type UpdateExpenseMutation = {
    __typename?: "Mutation";
    updateExpense: {
        __typename?: "Expense";
        id: string;
        description?: string | null;
        amount: number;
        name: string;
    };
};

export type RemoveExpenseMutationVariables = Exact<{
    id: Scalars["String"]["input"];
}>;

export type RemoveExpenseMutation = {
    __typename?: "Mutation";
    removeExpense: {
        __typename?: "Expense";
        id: string;
        description?: string | null;
        amount: number;
        name: string;
    };
};

export type RemoveExpensesMutationVariables = Exact<{
    ids: Array<Scalars["String"]["input"]> | Scalars["String"]["input"];
}>;

export type RemoveExpensesMutation = {
    __typename?: "Mutation";
    removeExpenses: number;
};

export type GetMeQueryVariables = Exact<{ [key: string]: never }>;

export type GetMeQuery = {
    __typename?: "Query";
    getMe: {
        __typename?: "User";
        email: string;
        id: number;
        name?: string | null;
        otp?: string | null;
        otpPurpose?: OtpPurpose | null;
    };
};

export const SignupDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "Signup" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "UserCreateInput" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "signup" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "accessToken",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "refreshToken",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SignupMutation, SignupMutationVariables>;
export const LoginDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "Login" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "LoginReqDto" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "login" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "accessToken",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const VerifyAccountDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "VerifyAccount" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "VerifyDto" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "verifyAccount" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "accessToken",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    VerifyAccountMutation,
    VerifyAccountMutationVariables
>;
export const GetBankDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetBank" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "userId" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Int" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getBankManagers" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "userId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "userId" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "updatedAt" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "banks" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "accountName",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "accountNumber",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "balance",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "createdAt",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "updatedAt",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "transactions",
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "id",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "bank",
                                                            },
                                                            selectionSet: {
                                                                kind: "SelectionSet",
                                                                selections: [
                                                                    {
                                                                        kind: "Field",
                                                                        name: {
                                                                            kind: "Name",
                                                                            value: "name",
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "amount",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "spentAmount",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "description",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "createdAt",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetBankQuery, GetBankQueryVariables>;
export const GetBankTransactionsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetBankTransactions" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "userId" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Float" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getBankTransactions" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "userId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "userId" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "amount" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "spentAmount",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "bank" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetBankTransactionsQuery,
    GetBankTransactionsQueryVariables
>;
export const CreateCryptoPortfolioDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateCryptoPortfolio" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: {
                                kind: "Name",
                                value: "CreateCryptoPortfolioInput",
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createCryptoPortfolio" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "userId" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateCryptoPortfolioMutation,
    CreateCryptoPortfolioMutationVariables
>;
export const GetCryptoPortfolioDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetCryptoPortfolio" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: {
                                kind: "Name",
                                value: "GetCryptoPortfolioInput",
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getCryptoPortfolios" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "exchanges" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "tradingType",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "historicalBalances",
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "time",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "estimatedBalance",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "changePercent",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "changeBalance",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "balances" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "balance",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "assetInfo",
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "id",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "logo",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "lastPrice",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "symbol",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetCryptoPortfolioQuery,
    GetCryptoPortfolioQueryVariables
>;
export const GetAssetDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetAsset" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "pagination" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "PaginationInput" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "getAssetPriceData" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "GetAssetPriceInput" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "getAssetInfoData" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "GetAssetInfoInput" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getAssetPrices" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: {
                                        kind: "Name",
                                        value: "getAssetPriceData",
                                    },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "pagination" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "pagination" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "open_time" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "openPrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "closePrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "highPrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "lowPrice" },
                                },
                            ],
                        },
                    },
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getAssetInfo" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: {
                                        kind: "Name",
                                        value: "getAssetInfoData",
                                    },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "logo" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "desc" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "category" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "symbol" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetAssetQuery, GetAssetQueryVariables>;
export const NewAssetPrice1mDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "subscription",
            name: { kind: "Name", value: "NewAssetPrice1m" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "GetAssetPriceInput" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "newAssetPrice1m" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "assetInfoId",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "open_time" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "openPrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "closePrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "highPrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "lowPrice" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    NewAssetPrice1mSubscription,
    NewAssetPrice1mSubscriptionVariables
>;
export const NewAssetPrice5mDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "subscription",
            name: { kind: "Name", value: "NewAssetPrice5m" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "GetAssetPriceInput" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "newAssetPrice5m" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "assetInfoId",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "open_time" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "openPrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "closePrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "highPrice" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "lowPrice" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    NewAssetPrice5mSubscription,
    NewAssetPrice5mSubscriptionVariables
>;
export const GetExpenseCategoriesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetExpenseCategories" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "userId" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Int" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "startDate" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "DateTime" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "endDate" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "DateTime" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getExpenseCategories" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "userId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "userId" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "color" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "countExpenses",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "totalAmount",
                                    },
                                    arguments: [
                                        {
                                            kind: "Argument",
                                            name: {
                                                kind: "Name",
                                                value: "startDate",
                                            },
                                            value: {
                                                kind: "Variable",
                                                name: {
                                                    kind: "Name",
                                                    value: "startDate",
                                                },
                                            },
                                        },
                                        {
                                            kind: "Argument",
                                            name: {
                                                kind: "Name",
                                                value: "endDate",
                                            },
                                            value: {
                                                kind: "Variable",
                                                name: {
                                                    kind: "Name",
                                                    value: "endDate",
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetExpenseCategoriesQuery,
    GetExpenseCategoriesQueryVariables
>;
export const CreateExpenseCategoryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateExpenseCategory" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: {
                                kind: "Name",
                                value: "CreateExpenseCategoryInput",
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createExpenseCategory" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "color" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateExpenseCategoryMutation,
    CreateExpenseCategoryMutationVariables
>;
export const UpdateExpenseCategoryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "UpdateExpenseCategory" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: {
                                kind: "Name",
                                value: "UpdateExpenseCategoryInput",
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateExpenseCategory" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "id" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "color" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    UpdateExpenseCategoryMutation,
    UpdateExpenseCategoryMutationVariables
>;
export const RemoveExpenseCategoryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "RemoveExpenseCategory" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "removeExpenseCategory" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "id" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    RemoveExpenseCategoryMutation,
    RemoveExpenseCategoryMutationVariables
>;
export const GetExpensesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetExpenses" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "userId" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Int" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "startDate" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "DateTime" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "endDate" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "DateTime" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getExpenses" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "userId" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "userId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "startDate" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "startDate" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "endDate" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "endDate" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "category" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "color",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "transaction",
                                    },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "amount",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "spentAmount",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "description",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdAt" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "amount" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const CreateExpenseDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateExpense" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "CreateExpenseInput" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createExpense" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "amount" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateExpenseMutation,
    CreateExpenseMutationVariables
>;
export const UpdateExpenseDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "UpdateExpense" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "data" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "UpdateExpenseInput" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "updateExpense" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "id" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "data" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "data" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "amount" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    UpdateExpenseMutation,
    UpdateExpenseMutationVariables
>;
export const RemoveExpenseDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "RemoveExpense" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "removeExpense" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "id" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "description",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "amount" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    RemoveExpenseMutation,
    RemoveExpenseMutationVariables
>;
export const RemoveExpensesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "RemoveExpenses" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "ids" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "ListType",
                            type: {
                                kind: "NonNullType",
                                type: {
                                    kind: "NamedType",
                                    name: { kind: "Name", value: "String" },
                                },
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "removeExpenses" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "ids" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "ids" },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    RemoveExpensesMutation,
    RemoveExpensesMutationVariables
>;
export const GetMeDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetMe" },
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "getMe" },
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "email" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "otp" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "otpPurpose" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
    DateTime: { input: any; output: any };
};

export type AssetBalance = {
    __typename?: "AssetBalance";
    assetInfo: AssetInfoOutput;
    assetInfoId: Scalars["String"]["output"];
    balance: Scalars["Float"]["output"];
    cryptoPortfolio: CryptoPortfolio;
    cryptoPortfolioId: Scalars["String"]["output"];
    id: Scalars["String"]["output"];
    locked: Scalars["Float"]["output"];
};

export type AssetBalanceAvgAggregate = {
    __typename?: "AssetBalanceAvgAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceCountAggregate = {
    __typename?: "AssetBalanceCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    balance: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    locked: Scalars["Int"]["output"];
};

export type AssetBalanceCreateManyCryptoPortfolioInput = {
    assetInfoId: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    id?: InputMaybe<Scalars["String"]["input"]>;
    locked: Scalars["Float"]["input"];
};

export type AssetBalanceCreateManyCryptoPortfolioInputEnvelope = {
    data: Array<AssetBalanceCreateManyCryptoPortfolioInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type AssetBalanceCreateNestedManyWithoutCryptoPortfolioInput = {
    connect?: InputMaybe<Array<AssetBalanceWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<AssetBalanceCreateOrConnectWithoutCryptoPortfolioInput>
    >;
    create?: InputMaybe<Array<AssetBalanceCreateWithoutCryptoPortfolioInput>>;
    createMany?: InputMaybe<AssetBalanceCreateManyCryptoPortfolioInputEnvelope>;
};

export type AssetBalanceCreateOrConnectWithoutCryptoPortfolioInput = {
    create: AssetBalanceCreateWithoutCryptoPortfolioInput;
    where: AssetBalanceWhereUniqueInput;
};

export type AssetBalanceCreateWithoutCryptoPortfolioInput = {
    assetInfo: AssetInfoCreateNestedOneWithoutAssetBalancesInput;
    balance: Scalars["Float"]["input"];
    id?: InputMaybe<Scalars["String"]["input"]>;
    locked: Scalars["Float"]["input"];
};

export type AssetBalanceListRelationFilter = {
    every?: InputMaybe<AssetBalanceWhereInput>;
    none?: InputMaybe<AssetBalanceWhereInput>;
    some?: InputMaybe<AssetBalanceWhereInput>;
};

export type AssetBalanceMaxAggregate = {
    __typename?: "AssetBalanceMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceMinAggregate = {
    __typename?: "AssetBalanceMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceSumAggregate = {
    __typename?: "AssetBalanceSumAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
    locked?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetBalanceWhereInput = {
    AND?: InputMaybe<Array<AssetBalanceWhereInput>>;
    NOT?: InputMaybe<Array<AssetBalanceWhereInput>>;
    OR?: InputMaybe<Array<AssetBalanceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    id?: InputMaybe<StringFilter>;
    locked?: InputMaybe<FloatFilter>;
};

export type AssetBalanceWhereUniqueInput = {
    AND?: InputMaybe<Array<AssetBalanceWhereInput>>;
    NOT?: InputMaybe<Array<AssetBalanceWhereInput>>;
    OR?: InputMaybe<Array<AssetBalanceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    locked?: InputMaybe<FloatFilter>;
};

export type AssetInfo = {
    __typename?: "AssetInfo";
    assetBalances?: Maybe<Array<AssetBalance>>;
    assetPrices?: Maybe<Array<AssetPrice>>;
    category: Scalars["String"]["output"];
    desc: Scalars["String"]["output"];
    id: Scalars["String"]["output"];
    logo: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    symbol: Scalars["String"]["output"];
};

export type AssetInfoCountAggregate = {
    __typename?: "AssetInfoCountAggregate";
    _all: Scalars["Int"]["output"];
    category: Scalars["Int"]["output"];
    desc: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    logo: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    symbol: Scalars["Int"]["output"];
};

export type AssetInfoCreateNestedOneWithoutAssetBalancesInput = {
    connect?: InputMaybe<AssetInfoWhereUniqueInput>;
    connectOrCreate?: InputMaybe<AssetInfoCreateOrConnectWithoutAssetBalancesInput>;
    create?: InputMaybe<AssetInfoCreateWithoutAssetBalancesInput>;
};

export type AssetInfoCreateOrConnectWithoutAssetBalancesInput = {
    create: AssetInfoCreateWithoutAssetBalancesInput;
    where: AssetInfoWhereUniqueInput;
};

export type AssetInfoCreateWithoutAssetBalancesInput = {
    assetPrices?: InputMaybe<AssetPriceCreateNestedManyWithoutAssetInfoInput>;
    category: Scalars["String"]["input"];
    desc: Scalars["String"]["input"];
    id?: InputMaybe<Scalars["String"]["input"]>;
    logo: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    symbol: Scalars["String"]["input"];
};

export type AssetInfoMaxAggregate = {
    __typename?: "AssetInfoMaxAggregate";
    category?: Maybe<Scalars["String"]["output"]>;
    desc?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    logo?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    symbol?: Maybe<Scalars["String"]["output"]>;
};

export type AssetInfoMinAggregate = {
    __typename?: "AssetInfoMinAggregate";
    category?: Maybe<Scalars["String"]["output"]>;
    desc?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    logo?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    symbol?: Maybe<Scalars["String"]["output"]>;
};

export type AssetInfoOutput = {
    __typename?: "AssetInfoOutput";
    assetBalances?: Maybe<Array<AssetBalance>>;
    assetPrices?: Maybe<Array<AssetPrice>>;
    category?: Maybe<Scalars["String"]["output"]>;
    desc?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    lastPrice: Scalars["Float"]["output"];
    logo?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    symbol?: Maybe<Scalars["String"]["output"]>;
};

export type AssetInfoRelationFilter = {
    is?: InputMaybe<AssetInfoWhereInput>;
    isNot?: InputMaybe<AssetInfoWhereInput>;
};

export type AssetInfoWhereInput = {
    AND?: InputMaybe<Array<AssetInfoWhereInput>>;
    NOT?: InputMaybe<Array<AssetInfoWhereInput>>;
    OR?: InputMaybe<Array<AssetInfoWhereInput>>;
    assetBalances?: InputMaybe<AssetBalanceListRelationFilter>;
    assetPrices?: InputMaybe<AssetPriceListRelationFilter>;
    category?: InputMaybe<StringFilter>;
    desc?: InputMaybe<StringFilter>;
    id?: InputMaybe<StringFilter>;
    logo?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    symbol?: InputMaybe<StringFilter>;
};

export type AssetInfoWhereUniqueInput = {
    AND?: InputMaybe<Array<AssetInfoWhereInput>>;
    NOT?: InputMaybe<Array<AssetInfoWhereInput>>;
    OR?: InputMaybe<Array<AssetInfoWhereInput>>;
    assetBalances?: InputMaybe<AssetBalanceListRelationFilter>;
    assetPrices?: InputMaybe<AssetPriceListRelationFilter>;
    category?: InputMaybe<StringFilter>;
    desc?: InputMaybe<StringFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    logo?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    symbol?: InputMaybe<StringFilter>;
};

export type AssetPrice = {
    __typename?: "AssetPrice";
    assetInfo: AssetInfo;
    assetInfoId: Scalars["String"]["output"];
    closePrice: Scalars["Float"]["output"];
    close_time: Scalars["DateTime"]["output"];
    highPrice: Scalars["Float"]["output"];
    interval: Scalars["String"]["output"];
    lowPrice: Scalars["Float"]["output"];
    openPrice: Scalars["Float"]["output"];
    open_time: Scalars["DateTime"]["output"];
    volume: Scalars["Float"]["output"];
};

export type AssetPriceAssetInfoIdOpen_TimeCompoundUniqueInput = {
    assetInfoId: Scalars["String"]["input"];
    open_time: Scalars["DateTime"]["input"];
};

export type AssetPriceAvgAggregate = {
    __typename?: "AssetPriceAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceCountAggregate = {
    __typename?: "AssetPriceCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    close_time: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    interval: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type AssetPriceCreateManyAssetInfoInput = {
    closePrice: Scalars["Float"]["input"];
    close_time: Scalars["DateTime"]["input"];
    highPrice: Scalars["Float"]["input"];
    interval: Scalars["String"]["input"];
    lowPrice: Scalars["Float"]["input"];
    openPrice: Scalars["Float"]["input"];
    open_time: Scalars["DateTime"]["input"];
    volume: Scalars["Float"]["input"];
};

export type AssetPriceCreateManyAssetInfoInputEnvelope = {
    data: Array<AssetPriceCreateManyAssetInfoInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type AssetPriceCreateNestedManyWithoutAssetInfoInput = {
    connect?: InputMaybe<Array<AssetPriceWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<AssetPriceCreateOrConnectWithoutAssetInfoInput>
    >;
    create?: InputMaybe<Array<AssetPriceCreateWithoutAssetInfoInput>>;
    createMany?: InputMaybe<AssetPriceCreateManyAssetInfoInputEnvelope>;
};

export type AssetPriceCreateOrConnectWithoutAssetInfoInput = {
    create: AssetPriceCreateWithoutAssetInfoInput;
    where: AssetPriceWhereUniqueInput;
};

export type AssetPriceCreateWithoutAssetInfoInput = {
    closePrice: Scalars["Float"]["input"];
    close_time: Scalars["DateTime"]["input"];
    highPrice: Scalars["Float"]["input"];
    interval: Scalars["String"]["input"];
    lowPrice: Scalars["Float"]["input"];
    openPrice: Scalars["Float"]["input"];
    open_time: Scalars["DateTime"]["input"];
    volume: Scalars["Float"]["input"];
};

export type AssetPriceListRelationFilter = {
    every?: InputMaybe<AssetPriceWhereInput>;
    none?: InputMaybe<AssetPriceWhereInput>;
    some?: InputMaybe<AssetPriceWhereInput>;
};

export type AssetPriceMaxAggregate = {
    __typename?: "AssetPriceMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    close_time?: Maybe<Scalars["DateTime"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    interval?: Maybe<Scalars["String"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceMinAggregate = {
    __typename?: "AssetPriceMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    close_time?: Maybe<Scalars["DateTime"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    interval?: Maybe<Scalars["String"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceSumAggregate = {
    __typename?: "AssetPriceSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type AssetPriceWhereInput = {
    AND?: InputMaybe<Array<AssetPriceWhereInput>>;
    NOT?: InputMaybe<Array<AssetPriceWhereInput>>;
    OR?: InputMaybe<Array<AssetPriceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    closePrice?: InputMaybe<FloatFilter>;
    close_time?: InputMaybe<DateTimeFilter>;
    highPrice?: InputMaybe<FloatFilter>;
    interval?: InputMaybe<StringFilter>;
    lowPrice?: InputMaybe<FloatFilter>;
    openPrice?: InputMaybe<FloatFilter>;
    open_time?: InputMaybe<DateTimeFilter>;
    volume?: InputMaybe<FloatFilter>;
};

export type AssetPriceWhereUniqueInput = {
    AND?: InputMaybe<Array<AssetPriceWhereInput>>;
    NOT?: InputMaybe<Array<AssetPriceWhereInput>>;
    OR?: InputMaybe<Array<AssetPriceWhereInput>>;
    assetInfo?: InputMaybe<AssetInfoRelationFilter>;
    assetInfoId?: InputMaybe<StringFilter>;
    assetInfoId_open_time?: InputMaybe<AssetPriceAssetInfoIdOpen_TimeCompoundUniqueInput>;
    closePrice?: InputMaybe<FloatFilter>;
    close_time?: InputMaybe<DateTimeFilter>;
    highPrice?: InputMaybe<FloatFilter>;
    interval?: InputMaybe<StringFilter>;
    lowPrice?: InputMaybe<FloatFilter>;
    openPrice?: InputMaybe<FloatFilter>;
    open_time?: InputMaybe<DateTimeFilter>;
    volume?: InputMaybe<FloatFilter>;
};

export type Asset_Price_1MAvgAggregate = {
    __typename?: "Asset_price_1MAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1MCountAggregate = {
    __typename?: "Asset_price_1MCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_1MMaxAggregate = {
    __typename?: "Asset_price_1MMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1MMinAggregate = {
    __typename?: "Asset_price_1MMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1MSumAggregate = {
    __typename?: "Asset_price_1MSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dAvgAggregate = {
    __typename?: "Asset_price_1dAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dCountAggregate = {
    __typename?: "Asset_price_1dCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_1dMaxAggregate = {
    __typename?: "Asset_price_1dMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dMinAggregate = {
    __typename?: "Asset_price_1dMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1dSumAggregate = {
    __typename?: "Asset_price_1dSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hAvgAggregate = {
    __typename?: "Asset_price_1hAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hCountAggregate = {
    __typename?: "Asset_price_1hCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_1hMaxAggregate = {
    __typename?: "Asset_price_1hMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hMinAggregate = {
    __typename?: "Asset_price_1hMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_1hSumAggregate = {
    __typename?: "Asset_price_1hSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mAvgAggregate = {
    __typename?: "Asset_price_5mAvgAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mCountAggregate = {
    __typename?: "Asset_price_5mCountAggregate";
    _all: Scalars["Int"]["output"];
    assetInfoId: Scalars["Int"]["output"];
    closePrice: Scalars["Int"]["output"];
    highPrice: Scalars["Int"]["output"];
    lowPrice: Scalars["Int"]["output"];
    openPrice: Scalars["Int"]["output"];
    open_time: Scalars["Int"]["output"];
    volume: Scalars["Int"]["output"];
};

export type Asset_Price_5mMaxAggregate = {
    __typename?: "Asset_price_5mMaxAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mMinAggregate = {
    __typename?: "Asset_price_5mMinAggregate";
    assetInfoId?: Maybe<Scalars["String"]["output"]>;
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    open_time?: Maybe<Scalars["DateTime"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type Asset_Price_5mSumAggregate = {
    __typename?: "Asset_price_5mSumAggregate";
    closePrice?: Maybe<Scalars["Float"]["output"]>;
    highPrice?: Maybe<Scalars["Float"]["output"]>;
    lowPrice?: Maybe<Scalars["Float"]["output"]>;
    openPrice?: Maybe<Scalars["Float"]["output"]>;
    volume?: Maybe<Scalars["Float"]["output"]>;
};

export type BankAccount = {
    __typename?: "BankAccount";
    accountName: Scalars["String"]["output"];
    accountNumber: Scalars["String"]["output"];
    balance: Scalars["Float"]["output"];
    bankManager: BankManager;
    bankManagerId: Scalars["String"]["output"];
    createdAt: Scalars["DateTime"]["output"];
    fullName: Scalars["String"]["output"];
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    transactions: Array<BankTransaction>;
    updatedAt: Scalars["DateTime"]["output"];
};

export type BankAccountAvgAggregate = {
    __typename?: "BankAccountAvgAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
};

export type BankAccountCountAggregate = {
    __typename?: "BankAccountCountAggregate";
    _all: Scalars["Int"]["output"];
    accountName: Scalars["Int"]["output"];
    accountNumber: Scalars["Int"]["output"];
    balance: Scalars["Int"]["output"];
    bankManagerId: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    fullName: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    updatedAt: Scalars["Int"]["output"];
};

export type BankAccountCreateManyBankManagerInput = {
    accountName: Scalars["String"]["input"];
    accountNumber: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    fullName: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankAccountCreateManyBankManagerInputEnvelope = {
    data: Array<BankAccountCreateManyBankManagerInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BankAccountCreateNestedManyWithoutBankManagerInput = {
    connect?: InputMaybe<Array<BankAccountWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<BankAccountCreateOrConnectWithoutBankManagerInput>
    >;
    create?: InputMaybe<Array<BankAccountCreateWithoutBankManagerInput>>;
    createMany?: InputMaybe<BankAccountCreateManyBankManagerInputEnvelope>;
};

export type BankAccountCreateNestedOneWithoutTransactionsInput = {
    connect?: InputMaybe<BankAccountWhereUniqueInput>;
    connectOrCreate?: InputMaybe<BankAccountCreateOrConnectWithoutTransactionsInput>;
    create?: InputMaybe<BankAccountCreateWithoutTransactionsInput>;
};

export type BankAccountCreateOrConnectWithoutBankManagerInput = {
    create: BankAccountCreateWithoutBankManagerInput;
    where: BankAccountWhereUniqueInput;
};

export type BankAccountCreateOrConnectWithoutTransactionsInput = {
    create: BankAccountCreateWithoutTransactionsInput;
    where: BankAccountWhereUniqueInput;
};

export type BankAccountCreateWithoutBankManagerInput = {
    accountName: Scalars["String"]["input"];
    accountNumber: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    fullName: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    transactions?: InputMaybe<BankTransactionCreateNestedManyWithoutBankInput>;
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankAccountCreateWithoutTransactionsInput = {
    accountName: Scalars["String"]["input"];
    accountNumber: Scalars["String"]["input"];
    balance: Scalars["Float"]["input"];
    bankManager: BankManagerCreateNestedOneWithoutBanksInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    fullName: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankAccountListRelationFilter = {
    every?: InputMaybe<BankAccountWhereInput>;
    none?: InputMaybe<BankAccountWhereInput>;
    some?: InputMaybe<BankAccountWhereInput>;
};

export type BankAccountMaxAggregate = {
    __typename?: "BankAccountMaxAggregate";
    accountName?: Maybe<Scalars["String"]["output"]>;
    accountNumber?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    bankManagerId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    fullName?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type BankAccountMinAggregate = {
    __typename?: "BankAccountMinAggregate";
    accountName?: Maybe<Scalars["String"]["output"]>;
    accountNumber?: Maybe<Scalars["String"]["output"]>;
    balance?: Maybe<Scalars["Float"]["output"]>;
    bankManagerId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    fullName?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type BankAccountRelationFilter = {
    is?: InputMaybe<BankAccountWhereInput>;
    isNot?: InputMaybe<BankAccountWhereInput>;
};

export type BankAccountSumAggregate = {
    __typename?: "BankAccountSumAggregate";
    balance?: Maybe<Scalars["Float"]["output"]>;
};

export type BankAccountWhereInput = {
    AND?: InputMaybe<Array<BankAccountWhereInput>>;
    NOT?: InputMaybe<Array<BankAccountWhereInput>>;
    OR?: InputMaybe<Array<BankAccountWhereInput>>;
    accountName?: InputMaybe<StringFilter>;
    accountNumber?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    bankManager?: InputMaybe<BankManagerRelationFilter>;
    bankManagerId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    fullName?: InputMaybe<StringFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    transactions?: InputMaybe<BankTransactionListRelationFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BankAccountWhereUniqueInput = {
    AND?: InputMaybe<Array<BankAccountWhereInput>>;
    NOT?: InputMaybe<Array<BankAccountWhereInput>>;
    OR?: InputMaybe<Array<BankAccountWhereInput>>;
    accountName?: InputMaybe<StringFilter>;
    accountNumber?: InputMaybe<StringFilter>;
    balance?: InputMaybe<FloatFilter>;
    bankManager?: InputMaybe<BankManagerRelationFilter>;
    bankManagerId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    fullName?: InputMaybe<StringFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    transactions?: InputMaybe<BankTransactionListRelationFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
};

export type BankManager = {
    __typename?: "BankManager";
    apiKey: Scalars["String"]["output"];
    banks: Array<BankAccount>;
    createdAt: Scalars["DateTime"]["output"];
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    updatedAt: Scalars["DateTime"]["output"];
    user: User;
    userId: Scalars["Int"]["output"];
};

export type BankManagerAvgAggregate = {
    __typename?: "BankManagerAvgAggregate";
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type BankManagerCountAggregate = {
    __typename?: "BankManagerCountAggregate";
    _all: Scalars["Int"]["output"];
    apiKey: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    updatedAt: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type BankManagerCreateManyUserInput = {
    apiKey: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankManagerCreateManyUserInputEnvelope = {
    data: Array<BankManagerCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BankManagerCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<BankManagerWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<BankManagerCreateOrConnectWithoutUserInput>
    >;
    create?: InputMaybe<Array<BankManagerCreateWithoutUserInput>>;
    createMany?: InputMaybe<BankManagerCreateManyUserInputEnvelope>;
};

export type BankManagerCreateNestedOneWithoutBanksInput = {
    connect?: InputMaybe<BankManagerWhereUniqueInput>;
    connectOrCreate?: InputMaybe<BankManagerCreateOrConnectWithoutBanksInput>;
    create?: InputMaybe<BankManagerCreateWithoutBanksInput>;
};

export type BankManagerCreateOrConnectWithoutBanksInput = {
    create: BankManagerCreateWithoutBanksInput;
    where: BankManagerWhereUniqueInput;
};

export type BankManagerCreateOrConnectWithoutUserInput = {
    create: BankManagerCreateWithoutUserInput;
    where: BankManagerWhereUniqueInput;
};

export type BankManagerCreateWithoutBanksInput = {
    apiKey: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    user: UserCreateNestedOneWithoutBankManagerInput;
};

export type BankManagerCreateWithoutUserInput = {
    apiKey: Scalars["String"]["input"];
    banks?: InputMaybe<BankAccountCreateNestedManyWithoutBankManagerInput>;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    id: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    updatedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type BankManagerListRelationFilter = {
    every?: InputMaybe<BankManagerWhereInput>;
    none?: InputMaybe<BankManagerWhereInput>;
    some?: InputMaybe<BankManagerWhereInput>;
};

export type BankManagerMaxAggregate = {
    __typename?: "BankManagerMaxAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type BankManagerMinAggregate = {
    __typename?: "BankManagerMinAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type BankManagerRelationFilter = {
    is?: InputMaybe<BankManagerWhereInput>;
    isNot?: InputMaybe<BankManagerWhereInput>;
};

export type BankManagerSumAggregate = {
    __typename?: "BankManagerSumAggregate";
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type BankManagerWhereInput = {
    AND?: InputMaybe<Array<BankManagerWhereInput>>;
    NOT?: InputMaybe<Array<BankManagerWhereInput>>;
    OR?: InputMaybe<Array<BankManagerWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    banks?: InputMaybe<BankAccountListRelationFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type BankManagerWhereUniqueInput = {
    AND?: InputMaybe<Array<BankManagerWhereInput>>;
    NOT?: InputMaybe<Array<BankManagerWhereInput>>;
    OR?: InputMaybe<Array<BankManagerWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    banks?: InputMaybe<BankAccountListRelationFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    updatedAt?: InputMaybe<DateTimeFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type BankTransaction = {
    __typename?: "BankTransaction";
    amount: Scalars["Float"]["output"];
    bank: BankAccount;
    bankId: Scalars["String"]["output"];
    createdAt: Scalars["DateTime"]["output"];
    description: Scalars["String"]["output"];
    expense?: Maybe<Array<Expense>>;
    id: Scalars["String"]["output"];
    spentAmount: Scalars["Float"]["output"];
};

export type BankTransactionAvgAggregate = {
    __typename?: "BankTransactionAvgAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionCountAggregate = {
    __typename?: "BankTransactionCountAggregate";
    _all: Scalars["Int"]["output"];
    amount: Scalars["Int"]["output"];
    bankId: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    description: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    spentAmount: Scalars["Int"]["output"];
};

export type BankTransactionCreateManyBankInput = {
    amount: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    spentAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type BankTransactionCreateManyBankInputEnvelope = {
    data: Array<BankTransactionCreateManyBankInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type BankTransactionCreateNestedManyWithoutBankInput = {
    connect?: InputMaybe<Array<BankTransactionWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<BankTransactionCreateOrConnectWithoutBankInput>
    >;
    create?: InputMaybe<Array<BankTransactionCreateWithoutBankInput>>;
    createMany?: InputMaybe<BankTransactionCreateManyBankInputEnvelope>;
};

export type BankTransactionCreateNestedOneWithoutExpenseInput = {
    connect?: InputMaybe<BankTransactionWhereUniqueInput>;
    connectOrCreate?: InputMaybe<BankTransactionCreateOrConnectWithoutExpenseInput>;
    create?: InputMaybe<BankTransactionCreateWithoutExpenseInput>;
};

export type BankTransactionCreateOrConnectWithoutBankInput = {
    create: BankTransactionCreateWithoutBankInput;
    where: BankTransactionWhereUniqueInput;
};

export type BankTransactionCreateOrConnectWithoutExpenseInput = {
    create: BankTransactionCreateWithoutExpenseInput;
    where: BankTransactionWhereUniqueInput;
};

export type BankTransactionCreateWithoutBankInput = {
    amount: Scalars["Float"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description: Scalars["String"]["input"];
    expense?: InputMaybe<ExpenseCreateNestedManyWithoutBankTransactionInput>;
    id: Scalars["String"]["input"];
    spentAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type BankTransactionCreateWithoutExpenseInput = {
    amount: Scalars["Float"]["input"];
    bank: BankAccountCreateNestedOneWithoutTransactionsInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description: Scalars["String"]["input"];
    id: Scalars["String"]["input"];
    spentAmount?: InputMaybe<Scalars["Float"]["input"]>;
};

export type BankTransactionListRelationFilter = {
    every?: InputMaybe<BankTransactionWhereInput>;
    none?: InputMaybe<BankTransactionWhereInput>;
    some?: InputMaybe<BankTransactionWhereInput>;
};

export type BankTransactionMaxAggregate = {
    __typename?: "BankTransactionMaxAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionMinAggregate = {
    __typename?: "BankTransactionMinAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionRelationFilter = {
    is?: InputMaybe<BankTransactionWhereInput>;
    isNot?: InputMaybe<BankTransactionWhereInput>;
};

export type BankTransactionSumAggregate = {
    __typename?: "BankTransactionSumAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    spentAmount?: Maybe<Scalars["Float"]["output"]>;
};

export type BankTransactionWhereInput = {
    AND?: InputMaybe<Array<BankTransactionWhereInput>>;
    NOT?: InputMaybe<Array<BankTransactionWhereInput>>;
    OR?: InputMaybe<Array<BankTransactionWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bank?: InputMaybe<BankAccountRelationFilter>;
    bankId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringFilter>;
    expense?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<StringFilter>;
    spentAmount?: InputMaybe<FloatFilter>;
};

export type BankTransactionWhereUniqueInput = {
    AND?: InputMaybe<Array<BankTransactionWhereInput>>;
    NOT?: InputMaybe<Array<BankTransactionWhereInput>>;
    OR?: InputMaybe<Array<BankTransactionWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bank?: InputMaybe<BankAccountRelationFilter>;
    bankId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringFilter>;
    expense?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    spentAmount?: InputMaybe<FloatFilter>;
};

export type CreateBankManagerInput = {
    apiKey: Scalars["String"]["input"];
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CreateCryptoPortfolioInput = {
    apiKey: Scalars["String"]["input"];
    secretKey: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CreateCryptoRes = {
    __typename?: "CreateCryptoRes";
    userId: Scalars["Float"]["output"];
};

export type CreateExpenseCategoryInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CreateExpenseInput = {
    amount: Scalars["Float"]["input"];
    bankTransactionId: Scalars["String"]["input"];
    categoryId: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type CryptoPortfolio = {
    __typename?: "CryptoPortfolio";
    apiKey: Scalars["String"]["output"];
    balances: Array<AssetBalance>;
    exchanges: Scalars["String"]["output"];
    historicalBalances: Array<HistoricalCryptoBalance>;
    id: Scalars["String"]["output"];
    secretKey: Scalars["String"]["output"];
    tradingType: TradingType;
    updateTime?: Maybe<Scalars["DateTime"]["output"]>;
    user: User;
    userId: Scalars["Int"]["output"];
};

export type CryptoPortfolioAvgAggregate = {
    __typename?: "CryptoPortfolioAvgAggregate";
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type CryptoPortfolioCountAggregate = {
    __typename?: "CryptoPortfolioCountAggregate";
    _all: Scalars["Int"]["output"];
    apiKey: Scalars["Int"]["output"];
    exchanges: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    secretKey: Scalars["Int"]["output"];
    tradingType: Scalars["Int"]["output"];
    updateTime: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type CryptoPortfolioCreateManyUserInput = {
    apiKey: Scalars["String"]["input"];
    exchanges?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    secretKey: Scalars["String"]["input"];
    tradingType: TradingType;
    updateTime?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type CryptoPortfolioCreateManyUserInputEnvelope = {
    data: Array<CryptoPortfolioCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type CryptoPortfolioCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<CryptoPortfolioWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<CryptoPortfolioCreateOrConnectWithoutUserInput>
    >;
    create?: InputMaybe<Array<CryptoPortfolioCreateWithoutUserInput>>;
    createMany?: InputMaybe<CryptoPortfolioCreateManyUserInputEnvelope>;
};

export type CryptoPortfolioCreateOrConnectWithoutUserInput = {
    create: CryptoPortfolioCreateWithoutUserInput;
    where: CryptoPortfolioWhereUniqueInput;
};

export type CryptoPortfolioCreateWithoutUserInput = {
    apiKey: Scalars["String"]["input"];
    balances?: InputMaybe<AssetBalanceCreateNestedManyWithoutCryptoPortfolioInput>;
    exchanges?: InputMaybe<Scalars["String"]["input"]>;
    historicalBalances?: InputMaybe<HistoricalCryptoBalanceCreateNestedManyWithoutCryptoPortfolioInput>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    secretKey: Scalars["String"]["input"];
    tradingType: TradingType;
    updateTime?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type CryptoPortfolioListRelationFilter = {
    every?: InputMaybe<CryptoPortfolioWhereInput>;
    none?: InputMaybe<CryptoPortfolioWhereInput>;
    some?: InputMaybe<CryptoPortfolioWhereInput>;
};

export type CryptoPortfolioMaxAggregate = {
    __typename?: "CryptoPortfolioMaxAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    exchanges?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    secretKey?: Maybe<Scalars["String"]["output"]>;
    tradingType?: Maybe<TradingType>;
    updateTime?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type CryptoPortfolioMinAggregate = {
    __typename?: "CryptoPortfolioMinAggregate";
    apiKey?: Maybe<Scalars["String"]["output"]>;
    exchanges?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    secretKey?: Maybe<Scalars["String"]["output"]>;
    tradingType?: Maybe<TradingType>;
    updateTime?: Maybe<Scalars["DateTime"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type CryptoPortfolioRelationFilter = {
    is?: InputMaybe<CryptoPortfolioWhereInput>;
    isNot?: InputMaybe<CryptoPortfolioWhereInput>;
};

export type CryptoPortfolioSumAggregate = {
    __typename?: "CryptoPortfolioSumAggregate";
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type CryptoPortfolioWhereInput = {
    AND?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    NOT?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    OR?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    balances?: InputMaybe<AssetBalanceListRelationFilter>;
    exchanges?: InputMaybe<StringFilter>;
    historicalBalances?: InputMaybe<HistoricalCryptoBalanceListRelationFilter>;
    id?: InputMaybe<StringFilter>;
    secretKey?: InputMaybe<StringFilter>;
    tradingType?: InputMaybe<EnumTradingTypeFilter>;
    updateTime?: InputMaybe<DateTimeNullableFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type CryptoPortfolioWhereUniqueInput = {
    AND?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    NOT?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    OR?: InputMaybe<Array<CryptoPortfolioWhereInput>>;
    apiKey?: InputMaybe<StringFilter>;
    balances?: InputMaybe<AssetBalanceListRelationFilter>;
    exchanges?: InputMaybe<StringFilter>;
    historicalBalances?: InputMaybe<HistoricalCryptoBalanceListRelationFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    secretKey?: InputMaybe<StringFilter>;
    tradingType?: InputMaybe<EnumTradingTypeFilter>;
    updateTime?: InputMaybe<DateTimeNullableFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type DateTimeFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type DateTimeNullableFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type EnumOtpPurposeNullableFilter = {
    equals?: InputMaybe<OtpPurpose>;
    in?: InputMaybe<Array<OtpPurpose>>;
    not?: InputMaybe<NestedEnumOtpPurposeNullableFilter>;
    notIn?: InputMaybe<Array<OtpPurpose>>;
};

export type EnumTradingTypeFilter = {
    equals?: InputMaybe<TradingType>;
    in?: InputMaybe<Array<TradingType>>;
    not?: InputMaybe<NestedEnumTradingTypeFilter>;
    notIn?: InputMaybe<Array<TradingType>>;
};

export type Expense = {
    __typename?: "Expense";
    amount: Scalars["Float"]["output"];
    bankTransaction: BankTransaction;
    bankTransactionId: Scalars["String"]["output"];
    category: ExpenseCategory;
    categoryId: Scalars["String"]["output"];
    createdAt: Scalars["DateTime"]["output"];
    description?: Maybe<Scalars["String"]["output"]>;
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    transaction: BankTransaction;
    user: User;
    userId: Scalars["Int"]["output"];
};

export type ExpenseAvgAggregate = {
    __typename?: "ExpenseAvgAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type ExpenseCategory = {
    __typename?: "ExpenseCategory";
    color: Scalars["String"]["output"];
    countExpenses: Scalars["Int"]["output"];
    description?: Maybe<Scalars["String"]["output"]>;
    expenses?: Maybe<Array<Expense>>;
    id: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    totalAmount: Scalars["Int"]["output"];
    user: User;
    userId: Scalars["Int"]["output"];
};

export type ExpenseCategoryTotalAmountArgs = {
    endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type ExpenseCategoryAvgAggregate = {
    __typename?: "ExpenseCategoryAvgAggregate";
    userId?: Maybe<Scalars["Float"]["output"]>;
};

export type ExpenseCategoryCountAggregate = {
    __typename?: "ExpenseCategoryCountAggregate";
    _all: Scalars["Int"]["output"];
    color: Scalars["Int"]["output"];
    description: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type ExpenseCategoryCreateManyUserInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseCategoryCreateManyUserInputEnvelope = {
    data: Array<ExpenseCategoryCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCategoryCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<ExpenseCategoryWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<ExpenseCategoryCreateOrConnectWithoutUserInput>
    >;
    create?: InputMaybe<Array<ExpenseCategoryCreateWithoutUserInput>>;
    createMany?: InputMaybe<ExpenseCategoryCreateManyUserInputEnvelope>;
};

export type ExpenseCategoryCreateNestedOneWithoutExpensesInput = {
    connect?: InputMaybe<ExpenseCategoryWhereUniqueInput>;
    connectOrCreate?: InputMaybe<ExpenseCategoryCreateOrConnectWithoutExpensesInput>;
    create?: InputMaybe<ExpenseCategoryCreateWithoutExpensesInput>;
};

export type ExpenseCategoryCreateOrConnectWithoutExpensesInput = {
    create: ExpenseCategoryCreateWithoutExpensesInput;
    where: ExpenseCategoryWhereUniqueInput;
};

export type ExpenseCategoryCreateOrConnectWithoutUserInput = {
    create: ExpenseCategoryCreateWithoutUserInput;
    where: ExpenseCategoryWhereUniqueInput;
};

export type ExpenseCategoryCreateWithoutExpensesInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    user: UserCreateNestedOneWithoutExpenseCategoriesInput;
};

export type ExpenseCategoryCreateWithoutUserInput = {
    color: Scalars["String"]["input"];
    description?: InputMaybe<Scalars["String"]["input"]>;
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutCategoryInput>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseCategoryListRelationFilter = {
    every?: InputMaybe<ExpenseCategoryWhereInput>;
    none?: InputMaybe<ExpenseCategoryWhereInput>;
    some?: InputMaybe<ExpenseCategoryWhereInput>;
};

export type ExpenseCategoryMaxAggregate = {
    __typename?: "ExpenseCategoryMaxAggregate";
    color?: Maybe<Scalars["String"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseCategoryMinAggregate = {
    __typename?: "ExpenseCategoryMinAggregate";
    color?: Maybe<Scalars["String"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseCategoryRelationFilter = {
    is?: InputMaybe<ExpenseCategoryWhereInput>;
    isNot?: InputMaybe<ExpenseCategoryWhereInput>;
};

export type ExpenseCategorySumAggregate = {
    __typename?: "ExpenseCategorySumAggregate";
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseCategoryWhereInput = {
    AND?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    OR?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    color?: InputMaybe<StringFilter>;
    description?: InputMaybe<StringNullableFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type ExpenseCategoryWhereUniqueInput = {
    AND?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    OR?: InputMaybe<Array<ExpenseCategoryWhereInput>>;
    color?: InputMaybe<StringFilter>;
    description?: InputMaybe<StringNullableFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type ExpenseCountAggregate = {
    __typename?: "ExpenseCountAggregate";
    _all: Scalars["Int"]["output"];
    amount: Scalars["Int"]["output"];
    bankTransactionId: Scalars["Int"]["output"];
    categoryId: Scalars["Int"]["output"];
    createdAt: Scalars["Int"]["output"];
    description: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    userId: Scalars["Int"]["output"];
};

export type ExpenseCreateManyBankTransactionInput = {
    amount: Scalars["Float"]["input"];
    categoryId: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type ExpenseCreateManyBankTransactionInputEnvelope = {
    data: Array<ExpenseCreateManyBankTransactionInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCreateManyCategoryInput = {
    amount: Scalars["Float"]["input"];
    bankTransactionId: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    userId: Scalars["Int"]["input"];
};

export type ExpenseCreateManyCategoryInputEnvelope = {
    data: Array<ExpenseCreateManyCategoryInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCreateManyUserInput = {
    amount: Scalars["Float"]["input"];
    bankTransactionId: Scalars["String"]["input"];
    categoryId: Scalars["String"]["input"];
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseCreateManyUserInputEnvelope = {
    data: Array<ExpenseCreateManyUserInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExpenseCreateNestedManyWithoutBankTransactionInput = {
    connect?: InputMaybe<Array<ExpenseWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<ExpenseCreateOrConnectWithoutBankTransactionInput>
    >;
    create?: InputMaybe<Array<ExpenseCreateWithoutBankTransactionInput>>;
    createMany?: InputMaybe<ExpenseCreateManyBankTransactionInputEnvelope>;
};

export type ExpenseCreateNestedManyWithoutCategoryInput = {
    connect?: InputMaybe<Array<ExpenseWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<
        Array<ExpenseCreateOrConnectWithoutCategoryInput>
    >;
    create?: InputMaybe<Array<ExpenseCreateWithoutCategoryInput>>;
    createMany?: InputMaybe<ExpenseCreateManyCategoryInputEnvelope>;
};

export type ExpenseCreateNestedManyWithoutUserInput = {
    connect?: InputMaybe<Array<ExpenseWhereUniqueInput>>;
    connectOrCreate?: InputMaybe<Array<ExpenseCreateOrConnectWithoutUserInput>>;
    create?: InputMaybe<Array<ExpenseCreateWithoutUserInput>>;
    createMany?: InputMaybe<ExpenseCreateManyUserInputEnvelope>;
};

export type ExpenseCreateOrConnectWithoutBankTransactionInput = {
    create: ExpenseCreateWithoutBankTransactionInput;
    where: ExpenseWhereUniqueInput;
};

export type ExpenseCreateOrConnectWithoutCategoryInput = {
    create: ExpenseCreateWithoutCategoryInput;
    where: ExpenseWhereUniqueInput;
};

export type ExpenseCreateOrConnectWithoutUserInput = {
    create: ExpenseCreateWithoutUserInput;
    where: ExpenseWhereUniqueInput;
};

export type ExpenseCreateWithoutBankTransactionInput = {
    amount: Scalars["Float"]["input"];
    category: ExpenseCategoryCreateNestedOneWithoutExpensesInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    user: UserCreateNestedOneWithoutExpensesInput;
};

export type ExpenseCreateWithoutCategoryInput = {
    amount: Scalars["Float"]["input"];
    bankTransaction: BankTransactionCreateNestedOneWithoutExpenseInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
    user: UserCreateNestedOneWithoutExpensesInput;
};

export type ExpenseCreateWithoutUserInput = {
    amount: Scalars["Float"]["input"];
    bankTransaction: BankTransactionCreateNestedOneWithoutExpenseInput;
    category: ExpenseCategoryCreateNestedOneWithoutExpensesInput;
    createdAt?: InputMaybe<Scalars["DateTime"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name: Scalars["String"]["input"];
};

export type ExpenseListRelationFilter = {
    every?: InputMaybe<ExpenseWhereInput>;
    none?: InputMaybe<ExpenseWhereInput>;
    some?: InputMaybe<ExpenseWhereInput>;
};

export type ExpenseMaxAggregate = {
    __typename?: "ExpenseMaxAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankTransactionId?: Maybe<Scalars["String"]["output"]>;
    categoryId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseMinAggregate = {
    __typename?: "ExpenseMinAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    bankTransactionId?: Maybe<Scalars["String"]["output"]>;
    categoryId?: Maybe<Scalars["String"]["output"]>;
    createdAt?: Maybe<Scalars["DateTime"]["output"]>;
    description?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["String"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseSumAggregate = {
    __typename?: "ExpenseSumAggregate";
    amount?: Maybe<Scalars["Float"]["output"]>;
    userId?: Maybe<Scalars["Int"]["output"]>;
};

export type ExpenseWhereInput = {
    AND?: InputMaybe<Array<ExpenseWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseWhereInput>>;
    OR?: InputMaybe<Array<ExpenseWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bankTransaction?: InputMaybe<BankTransactionRelationFilter>;
    bankTransactionId?: InputMaybe<StringFilter>;
    category?: InputMaybe<ExpenseCategoryRelationFilter>;
    categoryId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringNullableFilter>;
    id?: InputMaybe<StringFilter>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type ExpenseWhereUniqueInput = {
    AND?: InputMaybe<Array<ExpenseWhereInput>>;
    NOT?: InputMaybe<Array<ExpenseWhereInput>>;
    OR?: InputMaybe<Array<ExpenseWhereInput>>;
    amount?: InputMaybe<FloatFilter>;
    bankTransaction?: InputMaybe<BankTransactionRelationFilter>;
    bankTransactionId?: InputMaybe<StringFilter>;
    category?: InputMaybe<ExpenseCategoryRelationFilter>;
    categoryId?: InputMaybe<StringFilter>;
    createdAt?: InputMaybe<DateTimeFilter>;
    description?: InputMaybe<StringNullableFilter>;
    id?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<StringFilter>;
    user?: InputMaybe<UserRelationFilter>;
    userId?: InputMaybe<IntFilter>;
};

export type FloatFilter = {
    equals?: InputMaybe<Scalars["Float"]["input"]>;
    gt?: InputMaybe<Scalars["Float"]["input"]>;
    gte?: InputMaybe<Scalars["Float"]["input"]>;
    in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
    lt?: InputMaybe<Scalars["Float"]["input"]>;
    lte?: InputMaybe<Scalars["Float"]["input"]>;
    not?: InputMaybe<NestedFloatFilter>;
    notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
};

export type GetAssetInfoInput = {
    id: Scalars["String"]["input"];
};

export type GetAssetPriceInput = {
    assetInfoId: Scalars["String"]["input"];
    timeFrame: Scalars["String"]["input"];
};

export type GetCryptoPortfolioInput = {
    userId: Scalars["Int"]["input"];
};

export type HistoricalCryptoBalance = {
    __typename?: "HistoricalCryptoBalance";
    changeBalance: Scalars["Float"]["output"];
    changePercent: Scalars["Float"]["output"];
    cryptoPortfolio: CryptoPortfolio;
    cryptoPortfolioId: Scalars["String"]["output"];
    estimatedBalance: Scalars["Float"]["output"];
    time: Scalars["DateTime"]["output"];
};

export type HistoricalCryptoBalanceAvgAggregate = {
    __typename?: "HistoricalCryptoBalanceAvgAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type HistoricalCryptoBalanceCountAggregate = {
    __typename?: "HistoricalCryptoBalanceCountAggregate";
    _all: Scalars["Int"]["output"];
    changeBalance: Scalars["Int"]["output"];
    changePercent: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    estimatedBalance: Scalars["Int"]["output"];
    time: Scalars["Int"]["output"];
};

export type HistoricalCryptoBalanceCreateManyCryptoPortfolioInput = {
    changeBalance: Scalars["Float"]["input"];
    changePercent: Scalars["Float"]["input"];
    estimatedBalance: Scalars["Float"]["input"];
    time: Scalars["DateTime"]["input"];
};

export type HistoricalCryptoBalanceCreateManyCryptoPortfolioInputEnvelope = {
    data: Array<HistoricalCryptoBalanceCreateManyCryptoPortfolioInput>;
    skipDuplicates?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type HistoricalCryptoBalanceCreateNestedManyWithoutCryptoPortfolioInput =
    {
        connect?: InputMaybe<Array<HistoricalCryptoBalanceWhereUniqueInput>>;
        connectOrCreate?: InputMaybe<
            Array<HistoricalCryptoBalanceCreateOrConnectWithoutCryptoPortfolioInput>
        >;
        create?: InputMaybe<
            Array<HistoricalCryptoBalanceCreateWithoutCryptoPortfolioInput>
        >;
        createMany?: InputMaybe<HistoricalCryptoBalanceCreateManyCryptoPortfolioInputEnvelope>;
    };

export type HistoricalCryptoBalanceCreateOrConnectWithoutCryptoPortfolioInput =
    {
        create: HistoricalCryptoBalanceCreateWithoutCryptoPortfolioInput;
        where: HistoricalCryptoBalanceWhereUniqueInput;
    };

export type HistoricalCryptoBalanceCreateWithoutCryptoPortfolioInput = {
    changeBalance: Scalars["Float"]["input"];
    changePercent: Scalars["Float"]["input"];
    estimatedBalance: Scalars["Float"]["input"];
    time: Scalars["DateTime"]["input"];
};

export type HistoricalCryptoBalanceCryptoPortfolioIdTimeCompoundUniqueInput = {
    cryptoPortfolioId: Scalars["String"]["input"];
    time: Scalars["DateTime"]["input"];
};

export type HistoricalCryptoBalanceListRelationFilter = {
    every?: InputMaybe<HistoricalCryptoBalanceWhereInput>;
    none?: InputMaybe<HistoricalCryptoBalanceWhereInput>;
    some?: InputMaybe<HistoricalCryptoBalanceWhereInput>;
};

export type HistoricalCryptoBalanceMaxAggregate = {
    __typename?: "HistoricalCryptoBalanceMaxAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type HistoricalCryptoBalanceMinAggregate = {
    __typename?: "HistoricalCryptoBalanceMinAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type HistoricalCryptoBalanceSumAggregate = {
    __typename?: "HistoricalCryptoBalanceSumAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type HistoricalCryptoBalanceWhereInput = {
    AND?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    NOT?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    OR?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    changeBalance?: InputMaybe<FloatFilter>;
    changePercent?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    estimatedBalance?: InputMaybe<FloatFilter>;
    time?: InputMaybe<DateTimeFilter>;
};

export type HistoricalCryptoBalanceWhereUniqueInput = {
    AND?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    NOT?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    OR?: InputMaybe<Array<HistoricalCryptoBalanceWhereInput>>;
    changeBalance?: InputMaybe<FloatFilter>;
    changePercent?: InputMaybe<FloatFilter>;
    cryptoPortfolio?: InputMaybe<CryptoPortfolioRelationFilter>;
    cryptoPortfolioId?: InputMaybe<StringFilter>;
    cryptoPortfolioId_time?: InputMaybe<HistoricalCryptoBalanceCryptoPortfolioIdTimeCompoundUniqueInput>;
    estimatedBalance?: InputMaybe<FloatFilter>;
    time?: InputMaybe<DateTimeFilter>;
};

export type Historical_Crypto_Balance_1dAvgAggregate = {
    __typename?: "Historical_crypto_balance_1dAvgAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type Historical_Crypto_Balance_1dCountAggregate = {
    __typename?: "Historical_crypto_balance_1dCountAggregate";
    _all: Scalars["Int"]["output"];
    changeBalance: Scalars["Int"]["output"];
    changePercent: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    estimatedBalance: Scalars["Int"]["output"];
    time: Scalars["Int"]["output"];
};

export type Historical_Crypto_Balance_1dMaxAggregate = {
    __typename?: "Historical_crypto_balance_1dMaxAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1dMinAggregate = {
    __typename?: "Historical_crypto_balance_1dMinAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1dSumAggregate = {
    __typename?: "Historical_crypto_balance_1dSumAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type Historical_Crypto_Balance_1hAvgAggregate = {
    __typename?: "Historical_crypto_balance_1hAvgAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type Historical_Crypto_Balance_1hCountAggregate = {
    __typename?: "Historical_crypto_balance_1hCountAggregate";
    _all: Scalars["Int"]["output"];
    changeBalance: Scalars["Int"]["output"];
    changePercent: Scalars["Int"]["output"];
    cryptoPortfolioId: Scalars["Int"]["output"];
    estimatedBalance: Scalars["Int"]["output"];
    time: Scalars["Int"]["output"];
};

export type Historical_Crypto_Balance_1hMaxAggregate = {
    __typename?: "Historical_crypto_balance_1hMaxAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1hMinAggregate = {
    __typename?: "Historical_crypto_balance_1hMinAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    cryptoPortfolioId?: Maybe<Scalars["String"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
    time?: Maybe<Scalars["DateTime"]["output"]>;
};

export type Historical_Crypto_Balance_1hSumAggregate = {
    __typename?: "Historical_crypto_balance_1hSumAggregate";
    changeBalance?: Maybe<Scalars["Float"]["output"]>;
    changePercent?: Maybe<Scalars["Float"]["output"]>;
    estimatedBalance?: Maybe<Scalars["Float"]["output"]>;
};

export type IntFilter = {
    equals?: InputMaybe<Scalars["Int"]["input"]>;
    gt?: InputMaybe<Scalars["Int"]["input"]>;
    gte?: InputMaybe<Scalars["Int"]["input"]>;
    in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
    lt?: InputMaybe<Scalars["Int"]["input"]>;
    lte?: InputMaybe<Scalars["Int"]["input"]>;
    not?: InputMaybe<NestedIntFilter>;
    notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type LoginReqDto = {
    email: Scalars["String"]["input"];
    password: Scalars["String"]["input"];
};

export type LoginResDto = {
    __typename?: "LoginResDto";
    accessToken: Scalars["String"]["output"];
    refreshToken: Scalars["String"]["output"];
};

export type Mutation = {
    __typename?: "Mutation";
    createBank: BankManager;
    createCryptoPortfolio: CreateCryptoRes;
    createExpense: Expense;
    createExpenseCategory: ExpenseCategory;
    login: LoginResDto;
    removeExpense: Expense;
    removeExpenseCategory: ExpenseCategory;
    removeExpenses: Scalars["Int"]["output"];
    signup: SignupResDto;
    updateExpense: Expense;
    updateExpenseCategory: ExpenseCategory;
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

export type MutationLoginArgs = {
    data: LoginReqDto;
};

export type MutationRemoveExpenseArgs = {
    id: Scalars["String"]["input"];
};

export type MutationRemoveExpenseCategoryArgs = {
    id: Scalars["String"]["input"];
};

export type MutationRemoveExpensesArgs = {
    ids: Array<Scalars["String"]["input"]>;
};

export type MutationSignupArgs = {
    data: UserCreateInput;
};

export type MutationUpdateExpenseArgs = {
    data: UpdateExpenseInput;
    id: Scalars["String"]["input"];
};

export type MutationUpdateExpenseCategoryArgs = {
    data: UpdateExpenseCategoryInput;
    id: Scalars["String"]["input"];
};

export type MutationVerifyAccountArgs = {
    data: VerifyDto;
};

export type NestedDateTimeFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type NestedDateTimeNullableFilter = {
    equals?: InputMaybe<Scalars["DateTime"]["input"]>;
    gt?: InputMaybe<Scalars["DateTime"]["input"]>;
    gte?: InputMaybe<Scalars["DateTime"]["input"]>;
    in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
    lt?: InputMaybe<Scalars["DateTime"]["input"]>;
    lte?: InputMaybe<Scalars["DateTime"]["input"]>;
    not?: InputMaybe<NestedDateTimeNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
};

export type NestedEnumOtpPurposeNullableFilter = {
    equals?: InputMaybe<OtpPurpose>;
    in?: InputMaybe<Array<OtpPurpose>>;
    not?: InputMaybe<NestedEnumOtpPurposeNullableFilter>;
    notIn?: InputMaybe<Array<OtpPurpose>>;
};

export type NestedEnumTradingTypeFilter = {
    equals?: InputMaybe<TradingType>;
    in?: InputMaybe<Array<TradingType>>;
    not?: InputMaybe<NestedEnumTradingTypeFilter>;
    notIn?: InputMaybe<Array<TradingType>>;
};

export type NestedFloatFilter = {
    equals?: InputMaybe<Scalars["Float"]["input"]>;
    gt?: InputMaybe<Scalars["Float"]["input"]>;
    gte?: InputMaybe<Scalars["Float"]["input"]>;
    in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
    lt?: InputMaybe<Scalars["Float"]["input"]>;
    lte?: InputMaybe<Scalars["Float"]["input"]>;
    not?: InputMaybe<NestedFloatFilter>;
    notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
};

export type NestedIntFilter = {
    equals?: InputMaybe<Scalars["Int"]["input"]>;
    gt?: InputMaybe<Scalars["Int"]["input"]>;
    gte?: InputMaybe<Scalars["Int"]["input"]>;
    in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
    lt?: InputMaybe<Scalars["Int"]["input"]>;
    lte?: InputMaybe<Scalars["Int"]["input"]>;
    not?: InputMaybe<NestedIntFilter>;
    notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type NestedStringFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    not?: InputMaybe<NestedStringFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type NestedStringNullableFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    not?: InputMaybe<NestedStringNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export enum OtpPurpose {
    ResetPassword = "RESET_PASSWORD",
    VerifyAccount = "VERIFY_ACCOUNT",
}

export type PaginationInput = {
    after?: InputMaybe<Scalars["String"]["input"]>;
    before?: InputMaybe<Scalars["String"]["input"]>;
    take: Scalars["Int"]["input"];
};

export type Query = {
    __typename?: "Query";
    getAssetInfo: AssetInfo;
    getAssetPrices: Array<AssetPrice>;
    getBankManagers: Array<BankManager>;
    getBankTransactions: Array<BankTransaction>;
    getCryptoPortfolios: Array<CryptoPortfolio>;
    getExpenseCategories: Array<ExpenseCategory>;
    getExpenses: Array<Expense>;
    getMe: User;
};

export type QueryGetAssetInfoArgs = {
    data: GetAssetInfoInput;
};

export type QueryGetAssetPricesArgs = {
    data: GetAssetPriceInput;
    pagination: PaginationInput;
};

export type QueryGetBankManagersArgs = {
    userId: Scalars["Int"]["input"];
};

export type QueryGetBankTransactionsArgs = {
    userId: Scalars["Float"]["input"];
};

export type QueryGetCryptoPortfoliosArgs = {
    data: GetCryptoPortfolioInput;
};

export type QueryGetExpenseCategoriesArgs = {
    userId: Scalars["Int"]["input"];
};

export type QueryGetExpensesArgs = {
    endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
    userId: Scalars["Int"]["input"];
};

export enum QueryMode {
    Default = "default",
    Insensitive = "insensitive",
}

export type SignupResDto = {
    __typename?: "SignupResDto";
    accessToken: Scalars["String"]["output"];
    refreshToken: Scalars["String"]["output"];
};

export type StringFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    mode?: InputMaybe<QueryMode>;
    not?: InputMaybe<NestedStringFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type StringNullableFilter = {
    contains?: InputMaybe<Scalars["String"]["input"]>;
    endsWith?: InputMaybe<Scalars["String"]["input"]>;
    equals?: InputMaybe<Scalars["String"]["input"]>;
    gt?: InputMaybe<Scalars["String"]["input"]>;
    gte?: InputMaybe<Scalars["String"]["input"]>;
    in?: InputMaybe<Array<Scalars["String"]["input"]>>;
    lt?: InputMaybe<Scalars["String"]["input"]>;
    lte?: InputMaybe<Scalars["String"]["input"]>;
    mode?: InputMaybe<QueryMode>;
    not?: InputMaybe<NestedStringNullableFilter>;
    notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
    startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type Subscription = {
    __typename?: "Subscription";
    newAssetPrice1m: AssetPrice;
    newAssetPrice5m: AssetPrice;
    portfolioCreated: CryptoPortfolio;
};

export type SubscriptionNewAssetPrice1mArgs = {
    data: GetAssetPriceInput;
};

export type SubscriptionNewAssetPrice5mArgs = {
    data: GetAssetPriceInput;
};

export type SubscriptionPortfolioCreatedArgs = {
    data: GetCryptoPortfolioInput;
};

export enum TradingType {
    Futures = "FUTURES",
    Spot = "SPOT",
}

export type UpdateExpenseCategoryInput = {
    color?: InputMaybe<Scalars["String"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateExpenseInput = {
    amount?: InputMaybe<Scalars["Float"]["input"]>;
    bankTransactionId?: InputMaybe<Scalars["String"]["input"]>;
    categoryId?: InputMaybe<Scalars["String"]["input"]>;
    description?: InputMaybe<Scalars["String"]["input"]>;
    name?: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
    __typename?: "User";
    bankManager?: Maybe<Array<BankManager>>;
    cryptoPortfolios?: Maybe<Array<CryptoPortfolio>>;
    cryptoProfiles: CryptoPortfolio;
    email: Scalars["String"]["output"];
    expenseCategories?: Maybe<Array<ExpenseCategory>>;
    expenses?: Maybe<Array<Expense>>;
    id: Scalars["Int"]["output"];
    name?: Maybe<Scalars["String"]["output"]>;
    otp?: Maybe<Scalars["String"]["output"]>;
    otpPurpose?: Maybe<OtpPurpose>;
    password: Scalars["String"]["output"];
};

export type UserAvgAggregate = {
    __typename?: "UserAvgAggregate";
    id?: Maybe<Scalars["Float"]["output"]>;
};

export type UserCountAggregate = {
    __typename?: "UserCountAggregate";
    _all: Scalars["Int"]["output"];
    email: Scalars["Int"]["output"];
    id: Scalars["Int"]["output"];
    name: Scalars["Int"]["output"];
    otp: Scalars["Int"]["output"];
    otpPurpose: Scalars["Int"]["output"];
    password: Scalars["Int"]["output"];
};

export type UserCreateInput = {
    bankManager?: InputMaybe<BankManagerCreateNestedManyWithoutUserInput>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenseCategories?: InputMaybe<ExpenseCategoryCreateNestedManyWithoutUserInput>;
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserCreateNestedOneWithoutBankManagerInput = {
    connect?: InputMaybe<UserWhereUniqueInput>;
    connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutBankManagerInput>;
    create?: InputMaybe<UserCreateWithoutBankManagerInput>;
};

export type UserCreateNestedOneWithoutExpenseCategoriesInput = {
    connect?: InputMaybe<UserWhereUniqueInput>;
    connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutExpenseCategoriesInput>;
    create?: InputMaybe<UserCreateWithoutExpenseCategoriesInput>;
};

export type UserCreateNestedOneWithoutExpensesInput = {
    connect?: InputMaybe<UserWhereUniqueInput>;
    connectOrCreate?: InputMaybe<UserCreateOrConnectWithoutExpensesInput>;
    create?: InputMaybe<UserCreateWithoutExpensesInput>;
};

export type UserCreateOrConnectWithoutBankManagerInput = {
    create: UserCreateWithoutBankManagerInput;
    where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutExpenseCategoriesInput = {
    create: UserCreateWithoutExpenseCategoriesInput;
    where: UserWhereUniqueInput;
};

export type UserCreateOrConnectWithoutExpensesInput = {
    create: UserCreateWithoutExpensesInput;
    where: UserWhereUniqueInput;
};

export type UserCreateWithoutBankManagerInput = {
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenseCategories?: InputMaybe<ExpenseCategoryCreateNestedManyWithoutUserInput>;
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserCreateWithoutExpenseCategoriesInput = {
    bankManager?: InputMaybe<BankManagerCreateNestedManyWithoutUserInput>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenses?: InputMaybe<ExpenseCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserCreateWithoutExpensesInput = {
    bankManager?: InputMaybe<BankManagerCreateNestedManyWithoutUserInput>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioCreateNestedManyWithoutUserInput>;
    email: Scalars["String"]["input"];
    expenseCategories?: InputMaybe<ExpenseCategoryCreateNestedManyWithoutUserInput>;
    name?: InputMaybe<Scalars["String"]["input"]>;
    otp?: InputMaybe<Scalars["String"]["input"]>;
    otpPurpose?: InputMaybe<OtpPurpose>;
    password: Scalars["String"]["input"];
};

export type UserMaxAggregate = {
    __typename?: "UserMaxAggregate";
    email?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["Int"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    otp?: Maybe<Scalars["String"]["output"]>;
    otpPurpose?: Maybe<OtpPurpose>;
    password?: Maybe<Scalars["String"]["output"]>;
};

export type UserMinAggregate = {
    __typename?: "UserMinAggregate";
    email?: Maybe<Scalars["String"]["output"]>;
    id?: Maybe<Scalars["Int"]["output"]>;
    name?: Maybe<Scalars["String"]["output"]>;
    otp?: Maybe<Scalars["String"]["output"]>;
    otpPurpose?: Maybe<OtpPurpose>;
    password?: Maybe<Scalars["String"]["output"]>;
};

export type UserRelationFilter = {
    is?: InputMaybe<UserWhereInput>;
    isNot?: InputMaybe<UserWhereInput>;
};

export type UserSumAggregate = {
    __typename?: "UserSumAggregate";
    id?: Maybe<Scalars["Int"]["output"]>;
};

export type UserWhereInput = {
    AND?: InputMaybe<Array<UserWhereInput>>;
    NOT?: InputMaybe<Array<UserWhereInput>>;
    OR?: InputMaybe<Array<UserWhereInput>>;
    bankManager?: InputMaybe<BankManagerListRelationFilter>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioListRelationFilter>;
    email?: InputMaybe<StringFilter>;
    expenseCategories?: InputMaybe<ExpenseCategoryListRelationFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<IntFilter>;
    name?: InputMaybe<StringNullableFilter>;
    otp?: InputMaybe<StringNullableFilter>;
    otpPurpose?: InputMaybe<EnumOtpPurposeNullableFilter>;
    password?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
    AND?: InputMaybe<Array<UserWhereInput>>;
    NOT?: InputMaybe<Array<UserWhereInput>>;
    OR?: InputMaybe<Array<UserWhereInput>>;
    bankManager?: InputMaybe<BankManagerListRelationFilter>;
    cryptoPortfolios?: InputMaybe<CryptoPortfolioListRelationFilter>;
    email?: InputMaybe<Scalars["String"]["input"]>;
    expenseCategories?: InputMaybe<ExpenseCategoryListRelationFilter>;
    expenses?: InputMaybe<ExpenseListRelationFilter>;
    id?: InputMaybe<Scalars["Int"]["input"]>;
    name?: InputMaybe<StringNullableFilter>;
    otp?: InputMaybe<StringNullableFilter>;
    otpPurpose?: InputMaybe<EnumOtpPurposeNullableFilter>;
    password?: InputMaybe<StringFilter>;
};

export type VerifyDto = {
    otp: Scalars["String"]["input"];
    otpPurpose: OtpPurpose;
};
