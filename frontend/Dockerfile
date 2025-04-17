FROM node:23-alpine AS base

WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile \
    && yarn cache clean


FROM node:23-alpine AS build

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN yarn build \
    && rm -rf node_modules \
    && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# Build production
FROM node:23-alpine AS production

WORKDIR /app

COPY --from=build /app/next.config.mjs ./

# Set mode "standalone" in file "next.config.js"
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]