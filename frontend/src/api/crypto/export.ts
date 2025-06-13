import { graphql } from "@/gql";

export const EXPORT_PORTFOLIO_MUTATION = graphql(`
    mutation ExportPortfolio($input: ExportPortfolioInput!) {
        exportPortfolio(input: $input) {
            downloadUrl
            fileName
            mimeType
            fileSize
            expiresAt
        }
    }
`);
