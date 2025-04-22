# Environment Variable Management for Kubernetes

This document explains how environment variables are managed in the Kubernetes deployment of the Xela application.

## Overview

The Xela application uses environment variables for configuration. These variables are managed in Kubernetes using:

1. **ConfigMaps** - For non-sensitive configuration data
2. **Secrets** - For sensitive data like passwords and tokens

## Environment Files

Environment variables are sourced from `.env` files, which are processed based on the deployment environment:

- `.env.dev` - Development environment
- `.env.test` - Testing environment  
- `.env.prod` - Production environment

## How to Update Environment Variables

### Method 1: Using Base Files

1. Update the base ConfigMap and Secret files in `k8s/base/`:
   - `k8s/base/config.yaml` - For non-sensitive configuration
   - `k8s/base/secrets.yaml` - For sensitive data

2. For environment-specific overrides, update the kustomization.yaml files in the respective overlay directories:
   - `k8s/overlays/dev/kustomization.yaml`
   - `k8s/overlays/test/kustomization.yaml`
   - `k8s/overlays/prod/kustomization.yaml`

### Method 2: Using .env Files (Recommended)

1. Create or update the `.env` file in the project root with common variables.

2. Run the generate-env-files.sh script to create environment-specific files:
   ```bash
   ./k8s/generate-env-files.sh
   ```

3. Review and modify the generated files:
   - `.env.dev`
   - `.env.test`
   - `.env.prod`

4. Deploy with the updated environment variables:
   ```bash
   ./k8s/deploy.sh [dev|test|prod]
   ```

## Variables Managed

### ConfigMap Variables (Non-sensitive)
- `NODE_ENV` - Application environment
- `LOG_LEVEL` - Logging level
- `API_SERVER` - GraphQL API server URL
- `SUBSCRIPTION_SERVER` - WebSocket subscription server URL
- `SUBSCRIPTION_PATH` - GraphQL subscription path
- `CASSANDRA_CLUSTER_NAME` - Cassandra cluster name
- `CASSANDRA_DATACENTER` - Cassandra datacenter
- `MESSAGE_BROKER_PORT` - Message broker port

### Secret Variables (Sensitive)
- `DATABASE_USER` - Database username
- `DATABASE_PASSWORD` - Database password
- `DATABASE_URL` - Full database connection string
- `CASSANDRA_USERNAME` - Cassandra username
- `CASSANDRA_PASSWORD` - Cassandra password
- `OTP_KEY` - OTP secret key
- `JWT_SECRET` - JWT signing secret
- `JWT_AT_EXP_TIME` - JWT access token expiration time
- `JWT_RT_EXP_TIME` - JWT refresh token expiration time
- `BANK_API_URL` - Bank API URL
- `BACKEND_SENTRY_AUTH_TOKEN` - Sentry authentication token
- `CRYPTO_PORTFOLIO_MASTER_KEY` - Crypto portfolio master key
- `REDIS_PASSWORD` - Redis password

## Security Considerations

- Never commit `.env.*` files to version control
- Use Kubernetes Secrets for sensitive information
- Consider using a secrets management solution like HashiCorp Vault for production environments
- Encrypt Secret manifests before storing in version control (consider using [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or similar)

## Additional Notes

- Environment-specific variables override base variables
- The deploy.sh script automatically loads the appropriate environment file
- The ConfigMap and Secret resources are created/updated during deployment with kustomize 