# Backend Project Structure

## Overview
This document outlines the structure of the NestJS backend project, detailing the organization of directories and their purposes.

## Root Directory Structure
```
backend/
├── dist/                 # Compiled output
├── src/                  # Source code
├── prisma/              # Database schema and migrations
├── test/                # Test files
├── graphql/             # GraphQL schema definitions
└── node_modules/        # Dependencies
```

## Source Code Structure (src/)
```
src/
├── app.module.ts        # Main application module
├── main.ts             # Application entry point
├── app.controller.ts   # Main application controller
├── instrument.ts       # Instrumentation configuration
├── modules/           # Feature modules
│   ├── auth/         # Authentication module
│   ├── user/         # User management module
│   ├── event/        # Event handling module
│   ├── expense/      # Expense management module
│   ├── bank/         # Banking features module
│   ├── crypto/       # Cryptocurrency features module
│   └── health/       # Health check module
├── shared/           # Shared resources
│   ├── redis/        # Redis configuration and services
│   ├── constants/    # Shared constants
│   ├── decorators/   # Custom decorators
│   ├── pagination/   # Pagination utilities
│   ├── utils/        # Utility functions
│   ├── encryption.service.ts  # Encryption service
│   └── base.service.ts        # Base service class
└── entities/         # Database entity definitions
```

## Database Structure (prisma/)
```
prisma/
├── migrations/       # Database migration files
├── schema/          # Prisma schema definitions
└── views/           # Database view definitions
```

## Configuration Files
```
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
├── tsconfig.build.json  # TypeScript build configuration
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── nest-cli.json       # NestJS CLI configuration
└── package.json        # Project dependencies and scripts
```

## Module Structure
Each feature module typically follows this structure:
```
module/
├── dtos/              # Data Transfer Objects
├── resolvers/         # GraphQL resolvers
├── services/         # Business logic services
└── module.ts         # Module definition
```

## Testing Structure
```
test/
├── e2e/              # End-to-end tests
└── unit/             # Unit tests
```

## Best Practices
1. Each module should be self-contained with its own services, resolvers, and DTOs
2. Shared code should be placed in the shared/ directory
3. Database schema changes should be managed through Prisma migrations
4. Environment-specific configuration should be managed through .env files
5. Follow the NestJS module pattern for new features
6. Maintain separation of concerns between layers (resolvers, services, repositories) 