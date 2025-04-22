# Xela Kubernetes Setup

This directory contains the Kubernetes configurations for deploying the Xela application stack across development, testing, and production environments.

## Directory Structure

```
k8s/
├── base/                 # Base resources shared across all environments
│   ├── configmaps/       # ConfigMaps for application configuration
│   ├── deployments/      # Deployment definitions
│   ├── ingress/          # Ingress configurations
│   ├── secrets/          # Secret definitions (templates, not actual secrets)
│   ├── services/         # Service definitions
│   ├── statefulsets/     # StatefulSet definitions
│   ├── volumes/          # Volume definitions
│   ├── config.yaml       # Base ConfigMap with common configuration
│   ├── secrets.yaml      # Base Secret with common sensitive data
│   ├── kustomization.yaml # Kustomize configuration for base resources
│   └── namespace.yaml    # Default namespace definition
├── overlays/             # Environment-specific configurations
│   ├── dev/              # Development environment
│   │   ├── patches/      # Patches for development customizations
│   │   ├── kustomization.yaml # Development kustomize configuration
│   │   └── namespace.yaml     # Development namespace
│   ├── test/             # Testing environment
│   │   ├── patches/      # Patches for testing customizations
│   │   ├── kustomization.yaml # Testing kustomize configuration
│   │   └── namespace.yaml     # Testing namespace
│   └── prod/             # Production environment
│       ├── networkpolicies/   # Production-specific network policies
│       ├── patches/      # Patches for production customizations
│       ├── kustomization.yaml # Production kustomize configuration
│       └── namespace.yaml     # Production namespace
├── generate-env-files.sh # Script to generate environment-specific .env files
├── ENV_MANAGEMENT.md     # Documentation for environment variable management
└── deploy.sh            # Deployment script
```

## Prerequisites

- Kubernetes cluster (Azure AKS, AWS EKS, GCP GKE, or any compatible Kubernetes cluster)
- `kubectl` CLI configured to connect to your cluster
- `kustomize` installed (included in recent versions of kubectl)
- Appropriate credentials for your container registry

## Environment Variables

The deployment relies on the following environment variables, which can be set in the `.env.{environment}` files:

- `APP_HOST`: The hostname for the application (e.g., xela.app)
- `REGISTRY_URL`: The container registry URL where images are stored
- Various application-specific configurations loaded from the environment files

### Environment Variable Management

Environment variables are managed through a combination of ConfigMaps and Secrets:

- **ConfigMaps**: Store non-sensitive configuration data
- **Secrets**: Store sensitive data like passwords and tokens

For detailed information on how to manage environment variables, see [ENV_MANAGEMENT.md](ENV_MANAGEMENT.md).

To generate environment-specific `.env` files for deployment:

```bash
# Generate .env.dev, .env.test, and .env.prod from the base .env
./generate-env-files.sh
```

## Deployment

To deploy to a specific environment, use the deployment script:

```bash
# Deploy to development
./deploy.sh dev

# Deploy to testing
./deploy.sh test

# Deploy to production
./deploy.sh prod
```

The `deploy.sh` script automatically loads the appropriate environment variables from `.env.{environment}` files.

## Security Notes

- Secrets should be properly managed and not committed to version control
- Production environments use network policies for enhanced security
- Resource limits are carefully tuned for each environment
- High availability configurations are applied in production
- Consider using a secrets management solution like HashiCorp Vault for production environments
- Encrypt Secret manifests before storing in version control (consider using [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or similar)

## Scaling

- Development: Minimal resources, single replicas
- Testing: Moderate resources, some redundancy
- Production: Full high-availability setup with proper resource allocation

## CI/CD Integration

This Kubernetes setup integrates with GitLab CI/CD pipelines. See `gitlab-ci-k8s.yml` for the configuration.

## Adding New Services

When adding a new service:

1. Create the deployment in `base/deployments/`
2. Create the service in `base/services/`
3. Add appropriate resource configurations in each environment's patches
4. Update the kustomization files to include the new resources 
5. If the service requires environment variables, add them to the ConfigMap or Secret as appropriate

## Adding New Environment Variables

When adding new environment variables:

1. Determine if the variable is sensitive (should be in Secret) or non-sensitive (should be in ConfigMap)
2. Add the variable to the appropriate file in `base/` directory
3. For environment-specific values, add overrides in the respective environment's kustomization.yaml
4. Update the `.env` file with the new variable
5. Run `./generate-env-files.sh` to update the environment-specific files
6. See [ENV_MANAGEMENT.md](ENV_MANAGEMENT.md) for more details 