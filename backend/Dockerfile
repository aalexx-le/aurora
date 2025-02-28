FROM node:20.18-alpine3.20 AS base
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json  ./

COPY prisma/ ./prisma/

# Install dependencies with the preferred package manager
RUN yarn --frozen-lockfile && yarn run prisma-client;



FROM node:20.18-alpine3.20 AS build
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules

# Copy the rest of the files
COPY . .

# Run build with the preferred package manager
RUN yarn build;

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Re-run install only for production dependencies
RUN yarn --frozen-lockfile --production && yarn cache clean;


FROM node:20-slim AS production
WORKDIR /app

# Ensure proper permissions for app directory
RUN chown -R node:node /app

# Copy the bundled code from the builder stage
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/graphql/schema.gql ./dist/graphql/schema.gql
COPY --from=build --chown=node:node /app/node_modules ./node_modules

# Use the node user from the image
USER node

EXPOSE 5001

# Start the server
CMD ["node", "dist/src/main.js"]
