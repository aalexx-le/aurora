# Backend - NestJS API

## Overview

The backend provides a GraphQL API with integrated crypto portfolio management services. It handles real-time portfolio creation, exchange integration, and progress tracking through Kafka event streams.

## Architecture

### Crypto Portfolio Services

The crypto module includes integrated portfolio services for automated exchange connection and balance tracking:

- **PortfolioCreationService**: Main orchestration service for the 8-step portfolio creation workflow
- **PortfolioProgressService**: Database operations and progress tracking with milestone-based status updates
- **PortfolioExchangeService**: Exchange integration using CCXT with encryption for API credentials

### Event-Driven Architecture

- **Kafka Integration**: Real-time event streaming for portfolio creation status updates
- **GraphQL Subscriptions**: Live updates for frontend clients
- **Microservice Communication**: Hybrid HTTP/Kafka service architecture

## How to run

```bash
yarn install
```

```bash
npx prisma generate
```

```bash
yarn run start:dev
```

## Crypto Portfolio Integration

### Supported Features

- **190+ Exchange Support**: Automatic CCXT integration for major cryptocurrency exchanges
- **Secure Credential Storage**: AES-256-GCM encryption with PBKDF2 key derivation
- **Real-time Progress Tracking**: 8-step workflow with intelligent error recovery
- **Event Streaming**: Kafka-based status updates and error handling

### Event Handlers

The portfolio controller handles Kafka events:

- `create-crypto-portfolio`: Initiates portfolio creation workflow
- `create-crypto-portfolio-status`: Status updates and progress tracking
- `health-check`: Service health monitoring

### Database Schema

Key tables for crypto portfolio management:
- `CryptoPortfolio`: Portfolio configurations and metadata
- `AssetBalance`: Current and historical balance tracking
- `CreatePortfolioExecution`: Workflow execution tracking
- `Trade`: Transaction history and trade records

## To add new table

```bash
npx prisma migrate dev --name <migration_name>
```

## Configuration

### Environment Variables

Required for crypto portfolio functionality:
```bash
# Database
DATABASE_URL="your_postgresql_url"

# Kafka
MESSAGE_BROKER_URL="localhost:9092"

# Server
SERVER_PORT=4000
SERVER_HOST="localhost"

# Optional: Exchange API rate limiting
EXCHANGE_RATE_LIMIT_MS=1000
```

## Development Notes

### Service Dependencies

The crypto services follow a dependency injection pattern:
- PortfolioCreationService → Uses PortfolioProgressService & PortfolioExchangeService
- PortfolioController → Uses PortfolioCreationService
- CryptoModule → Provides all services with proper DI setup

### Testing

- **Compilation**: `npm run build` - Verifies TypeScript compilation
- **Unit Tests**: `npm run test` - Service-level testing
- **E2E Tests**: `npm run test:e2e` - Integration testing