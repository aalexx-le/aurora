import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "../backend/graphql/schema.gql",
    documents: "./src/api/**/*.ts",
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        "./src/gql/": {
            plugins: ["typescript"],
            preset: "client",
        },
    },
};

export default config;
