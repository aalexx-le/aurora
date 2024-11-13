import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "../backend/graphql/schema.gql",
    documents: "./src/api/documents/*.gql",
    ignoreNoDocuments: true, // for better experience with the watcher
    emitLegacyCommonJSImports: false, // for better experience with the watchers
    generates: {
        "./src/gql/": {
            plugins: ["typescript"],
            preset: "client",
        },
    },
};

export default config;
