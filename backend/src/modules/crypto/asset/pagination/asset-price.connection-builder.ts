// import { ConnectionBuilder, Cursor, PageInfo, validateParamsUsingSchema } from 'nestjs-graphql-connection';
// import {AssetPriceConnection} from "./asset-price.connection";
// import {AssetPriceConnectionArgs} from "./asset-price.args";
// import {AssetPriceEdge} from "./asset-price.edge";
// import {AssetPrice} from "src/entities/asset-price";
//
// export type AssetPriceCursorParams = { assetInfoId: string };
// export type AssetPriceCursor = Cursor<AssetPriceCursorParams>;
//
// export class AssetPriceConnectionBuilder extends ConnectionBuilder<
//     AssetPriceConnection,
//     AssetPriceConnectionArgs,
//     AssetPriceEdge,
//     AssetPrice,
//     AssetPriceCursor
// > {
//     public createConnection(fields: { edges: AssetPriceEdge[]; pageInfo: PageInfo }): AssetPriceConnection {
//         return new AssetPriceConnection(fields);
//     }
//
//     public createEdge(fields: { node: AssetPrice; cursor: string }): AssetPriceEdge {
//         return new AssetPriceEdge(fields);
//     }
//
//     public createCursor(node: AssetPrice): AssetPriceCursor {
//         return new Cursor({ assetInfoId: node.assetInfoId });
//     }
//
//     public decodeCursor(encodedString: string): AssetPriceCursor {
//
//         return Cursor.fromString(encodedString);
//     }
// }
