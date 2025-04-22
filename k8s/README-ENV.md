# Environment Variable Management in Kubernetes

This document explains how environment variables from `.env` files are managed in the Kubernetes deployment.

## Setup Overview

We have implemented a comprehensive system to manage environment variables for Kubernetes deployments:

1. Base environment variables are stored in the project root `.env` file
2. Environment-specific variables are stored in `.env.dev`, `.env.test`, and `.env.prod` files
3. These variables are loaded into Kubernetes as ConfigMaps and Secrets

## Tools and Scripts

### 1. Environment File Generation

The `generate-env-files.sh` script creates environment-specific `.env` files by:
- Starting with the base `.env` file
- Adding environment-specific overrides
- Cleaning up the files to remove duplicates and fix formatting issues

```bash
./k8s/generate-env-files.sh
```

### 2. Environment File Deployment

The `apply-env-files.sh` script copies the environment files to the appropriate Kubernetes overlay directories:

```bash
./k8s/apply-env-files.sh [env]
```

### 3. Deployment

The `deploy.sh` script deploys the application to Kubernetes:

```bash
./k8s/deploy.sh [dev|test|prod]
```

### 4. Verification

The `verify-env-config.sh` script verifies the environment configuration:

```bash
./k8s/verify-env-config.sh [dev|test|prod]
```

## Workflow

1. Update base variables in `.env`
2. Run `./k8s/generate-env-files.sh` to create environment-specific files
3. Customize environment-specific variables in `.env.dev`, `.env.test`, or `.env.prod`
4. Run `./k8s/apply-env-files.sh` to copy files to overlay directories
5. Deploy with `./k8s/deploy.sh [env]`
6. Verify with `./k8s/verify-env-config.sh [env]`

## Environment Variable Categories

### Non-sensitive variables (ConfigMap)

```yaml
# Examples
NODE_ENV: "development"
API_SERVER: "http://localhost:5001/graphql"
SUBSCRIPTION_SERVER: "ws://localhost:5001/graphql"
SUBSCRIPTION_PATH: "/graphql"
CASSANDRA_CLUSTER_NAME: "xela_cluster"
CASSANDRA_DATACENTER: "datacenter1"
MESSAGE_BROKER_PORT: "9092"
```

### Sensitive variables (Secret)

```yaml
# Examples
DATABASE_USER: "postgre"
DATABASE_PASSWORD: "abcd1234"
JWT_SECRET: "xelaqdtjlz"
CRYPTO_PORTFOLIO_MASTER_KEY: "pRlbqjx9R1-uqcEQN_1gdH5O2Gq7zjkfV0kS8uW2FfQ="
```

## Security Considerations

- Never commit `.env.*` files to version control
- Use Kubernetes Secrets for sensitive information
- Consider using a secrets management solution like HashiCorp Vault for production
- Encrypt Secret manifests before storing in version control

## Troubleshooting

- If environment variables are not being applied, check that the `.env.*` files exist in both the project root and the overlay directories
- Verify that the ConfigMap and Secret have been created in the cluster
- Check that the deployments and statefulsets have the envFrom sections referencing the ConfigMap and Secret

## Additional Resources

For more detailed information, see:
- [Kubernetes ConfigMaps and Secrets Documentation](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [ENV_MANAGEMENT.md](ENV_MANAGEMENT.md) - Detailed documentation on environment variable management 