# TECHNICAL CONTEXT - XELA Finance Management System

## 🛠️ TECHNOLOGY STACK OVERVIEW

### Frontend Technologies
```
Next.js 14+ (React Framework)
├── TypeScript (Type Safety)
├── Apollo Client (GraphQL State Management)
├── Tailwind CSS (Utility-First Styling)
├── Shadcn/UI (Component Library)
├── React Hook Form (Form Handling)
├── Recharts (Data Visualization)
├── Framer Motion (Animations)
└── Jest + Testing Library (Testing)
```

### Backend Technologies
```
NestJS (Node.js Framework)
├── TypeScript (Type Safety)
├── GraphQL (API Layer)
├── Prisma ORM (Database Access)
├── PostgreSQL (Primary Database)
├── Redis (Caching & Sessions)
├── JWT (Authentication)
├── Passport (Auth Strategies)
├── Winston (Logging)
├── Jest (Unit Testing)
└── Supertest (Integration Testing)
```

### Data Pipeline & Processing
```
Apache Airflow (Orchestration)
├── Python (ETL Scripts)
├── Pandas (Data Processing)
├── NumPy (Numerical Computing)
├── SQLAlchemy (Database ORM)
├── Celery (Task Queue)
├── Redis (Message Broker)
├── TimescaleDB (Time Series Data)
└── Apache Kafka (Event Streaming)
```

### Infrastructure & DevOps
```
Docker (Containerization)
├── GitLab CI/CD (Continuous Integration)
├── Nginx (Reverse Proxy)
├── Prometheus (Monitoring)
├── Grafana (Visualization)
├── ELK Stack (Logging)
└── Let's Encrypt (SSL Certificates)
```

## 🏗️ INFRASTRUCTURE ARCHITECTURE

### Production Environment
```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │     (Nginx)     │
                    └─────────┬───────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼─────────┐ ┌───▼────┐ ┌───────▼───────┐
    │   Frontend Pod    │ │   API  │ │   Auth Pod    │
    │   (Next.js)       │ │ Gateway│ │   (NestJS)    │
    └───────────────────┘ │(GraphQL)│ └───────────────┘
                          └────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
  ┌─────▼─────┐     ┌────────▼────────┐     ┌──────▼──────┐
  │Portfolio  │     │   Exchange      │     │  Banking    │
  │Service    │     │   Integration   │     │  Service    │
  │(NestJS)   │     │   (Python)      │     │  (NestJS)   │
  └───────────┘     └─────────────────┘     └─────────────┘
        │                     │                     │
  ┌─────▼─────┐     ┌────────▼────────┐     ┌──────▼──────┐
  │PostgreSQL │     │    TimescaleDB  │     │    Redis    │
  │(Primary)  │     │  (Time Series)  │     │   (Cache)   │
  └───────────┘     └─────────────────┘     └─────────────┘
```

### Development Environment
```
Docker Compose Setup:
├── frontend (Next.js on port 3000)
├── backend (NestJS on port 3001)
├── postgres (PostgreSQL on port 5432)
├── redis (Redis on port 6379)
├── elasticsearch (Elasticsearch on port 9200)
├── kibana (Kibana on port 5601)
├── airflow-webserver (Airflow on port 8080)
├── airflow-scheduler
└── airflow-worker
```

## 📊 DATABASE DESIGN

### PostgreSQL Schema
```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange Connections
CREATE TABLE exchange_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exchange_name VARCHAR(50) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    api_secret_encrypted TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_value DECIMAL(20, 8) DEFAULT 0,
    base_currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    quantity DECIMAL(20, 8) NOT NULL DEFAULT 0,
    average_price DECIMAL(20, 8) DEFAULT 0,
    current_price DECIMAL(20, 8) DEFAULT 0,
    total_value DECIMAL(20, 8) DEFAULT 0,
    exchange VARCHAR(50),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- BUY, SELL, TRANSFER, DEPOSIT, WITHDRAWAL
    quantity DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    fee DECIMAL(20, 8) DEFAULT 0,
    total_amount DECIMAL(20, 8) NOT NULL,
    exchange VARCHAR(50),
    external_id VARCHAR(255), -- Exchange transaction ID
    executed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### TimescaleDB for Time Series
```sql
-- Price History (TimescaleDB)
CREATE TABLE price_history (
    time TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    volume DECIMAL(20, 8),
    market_cap DECIMAL(20, 8),
    exchange VARCHAR(50)
);

SELECT create_hypertable('price_history', 'time');

-- Portfolio Value History
CREATE TABLE portfolio_value_history (
    time TIMESTAMPTZ NOT NULL,
    portfolio_id UUID NOT NULL,
    total_value DECIMAL(20, 8) NOT NULL,
    base_currency VARCHAR(10) DEFAULT 'USD'
);

SELECT create_hypertable('portfolio_value_history', 'time');
```

## 🔧 DEVELOPMENT TOOLS & SETUP

### Required Development Tools
```bash
# Core Development Environment
Node.js 18+ (LTS version)
npm 8+ or yarn 1.22+
Docker Desktop 4.0+
Docker Compose 2.0+
Git 2.30+
PostgreSQL 14+ (for local development)
Redis 6+ (for local development)

# Optional but Recommended
Visual Studio Code
    ├── TypeScript Extension
    ├── Prettier Extension
    ├── ESLint Extension
    ├── Docker Extension
    ├── GraphQL Extension
    └── Prisma Extension

# Python Environment (for Airflow)
Python 3.9+
pip 21+
virtualenv or conda
```

### Local Development Setup
```bash
# 1. Clone the repository
git clone https://gitlab.com/nnaaaa/xela.git
cd xela

# 2. Install dependencies
npm install

# 3. Frontend setup
cd frontend
npm install
cp .env.example .env.local
npm run dev

# 4. Backend setup
cd ../backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run start:dev

# 5. Start infrastructure services
docker-compose -f docker-compose.dev.yml up -d
```

### Environment Configuration
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/graphql
NEXT_PUBLIC_WS_URL=ws://localhost:3001/graphql
NEXT_PUBLIC_APP_ENV=development

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/xela_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-char-encryption-key

# Exchange API Keys (encrypted in database)
BINANCE_API_KEY=your-binance-api-key
BINANCE_SECRET=your-binance-secret
OKX_API_KEY=your-okx-api-key
OKX_SECRET=your-okx-secret
MEXC_API_KEY=your-mexc-api-key
MEXC_SECRET=your-mexc-secret

# Airflow Configuration
AIRFLOW_HOME=/opt/airflow
AIRFLOW__CORE__EXECUTOR=CeleryExecutor
AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@postgres:5432/airflow
AIRFLOW__CELERY__RESULT_BACKEND=redis://redis:6379/1
AIRFLOW__CELERY__BROKER_URL=redis://redis:6379/1
```

## 📦 PACKAGE MANAGEMENT

### Frontend Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "@radix-ui/react-button": "^2.0.0",
    "recharts": "^2.8.0",
    "framer-motion": "^10.16.0",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.2.0",
    "eslint": "^8.51.0",
    "prettier": "^3.0.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/graphql": "^12.0.0",
    "@nestjs/apollo": "^12.0.0",
    "@nestjs/prisma": "^5.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "apollo-server-express": "^3.12.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "redis": "^4.6.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "typescript": "^5.2.0",
    "@nestjs/testing": "^10.0.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.0"
  }
}
```

### Python Dependencies (Airflow)
```requirements.txt
apache-airflow==2.7.0
apache-airflow-providers-postgres==5.6.0
apache-airflow-providers-redis==3.4.0
pandas==2.1.0
numpy==1.25.0
requests==2.31.0
sqlalchemy==1.4.49
psycopg2-binary==2.9.7
redis==4.6.0
celery==5.3.0
ccxt==4.1.0  # Cryptocurrency exchange library
```

## 🔐 SECURITY CONFIGURATION

### SSL/TLS Configuration
```nginx
# Nginx SSL Configuration
server {
    listen 443 ssl http2;
    server_name xela.finance;

    ssl_certificate /etc/letsencrypt/live/xela.finance/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xela.finance/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy no-referrer-when-downgrade;

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Database Security
```sql
-- Database security settings
ALTER DATABASE xela SET log_statement = 'all';
ALTER DATABASE xela SET log_duration = on;

-- Create read-only user for reporting
CREATE USER xela_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE xela TO xela_readonly;
GRANT USAGE ON SCHEMA public TO xela_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO xela_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO xela_readonly;

-- Row Level Security for multi-tenancy
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
CREATE POLICY portfolio_user_policy ON portfolios
    FOR ALL
    TO application_role
    USING (user_id = current_setting('app.current_user_id')::uuid);
```

## 📊 MONITORING & LOGGING

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'xela-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'xela-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/api/metrics'
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
```

### ELK Stack Configuration
```yaml
# logstash.conf
input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "xela-backend" {
    json {
      source => "message"
    }
    
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    mutate {
      add_field => { "service" => "xela-backend" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "xela-logs-%{+YYYY.MM.dd}"
  }
}
```

### Winston Logging Configuration
```typescript
// logger.config.ts
import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'xela-backend' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
});
```

## 🚀 DEPLOYMENT CONFIGURATION

### Kubernetes Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xela-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: xela-backend
  template:
    metadata:
      labels:
        app: xela-backend
    spec:
      containers:
      - name: backend
        image: xela/backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: xela-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: xela-secrets
              key: redis-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: xela-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

### CI/CD Pipeline
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_HOST: tcp://docker:2376
  DOCKER_TLS_CERTDIR: "/certs"

test:backend:
  stage: test
  image: node:18-alpine
  services:
    - postgres:14
    - redis:6-alpine
  variables:
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/test_db"
    REDIS_URL: "redis://redis:6379"
  before_script:
    - cd backend
    - npm ci
    - npx prisma generate
    - npx prisma db push
  script:
    - npm run test
    - npm run test:e2e
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:backend:
  stage: build
  image: docker:20.10.16
  services:
    - docker:20.10.16-dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - cd backend
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA

deploy:production:
  stage: deploy
  image: alpine/helm:latest
  script:
    - helm upgrade --install xela-backend ./k8s/backend \
        --set image.tag=$CI_COMMIT_SHA \
        --set environment=production
  only:
    - main
```

## 🔧 PERFORMANCE OPTIMIZATION

### Database Optimization
```sql
-- Indexes for performance
CREATE INDEX CONCURRENTLY idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX CONCURRENTLY idx_assets_portfolio_id ON assets(portfolio_id);
CREATE INDEX CONCURRENTLY idx_transactions_portfolio_id ON transactions(portfolio_id);
CREATE INDEX CONCURRENTLY idx_transactions_executed_at ON transactions(executed_at);
CREATE INDEX CONCURRENTLY idx_price_history_symbol_time ON price_history(symbol, time DESC);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_portfolios_active ON portfolios(user_id) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_exchange_connections_active ON exchange_connections(user_id) WHERE is_active = true;

-- Database connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
```

### Redis Caching Strategy
```typescript
// Cache configuration
export const cacheConfig = {
  price_data: {
    ttl: 30, // 30 seconds for price data
    pattern: 'price:*',
  },
  portfolio_data: {
    ttl: 300, // 5 minutes for portfolio data
    pattern: 'portfolio:*',
  },
  user_sessions: {
    ttl: 86400, // 24 hours for user sessions
    pattern: 'session:*',
  },
  exchange_data: {
    ttl: 60, // 1 minute for exchange data
    pattern: 'exchange:*',
  },
};

// Cache warming strategy
@Cron('0 */5 * * * *') // Every 5 minutes
async warmCache() {
  const popularSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL'];
  
  for (const symbol of popularSymbols) {
    await this.priceService.getCurrentPrice(symbol);
  }
}
```

---

*This technical context provides the comprehensive technical foundation and infrastructure guidelines for all development and deployment within the Xela Finance Management System.* 