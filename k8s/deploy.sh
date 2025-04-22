#!/bin/bash

# Deploy to Kubernetes using Kustomize
# Usage: ./deploy.sh [dev|test|prod]

set -e

# Default to dev environment if none specified
ENVIRONMENT=${1:-dev}
VALID_ENVIRONMENTS=("dev" "test" "prod")

# Validate environment
if [[ ! " ${VALID_ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
    echo "Error: Invalid environment. Please use one of: ${VALID_ENVIRONMENTS[*]}"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load environment variables
ENV_FILE="../.env.$ENVIRONMENT"
if [ -f "$ENV_FILE" ]; then
    # Process the file to remove comments and empty lines
    # and properly handle quotes in values
    while IFS= read -r line; do
        # Skip comments and empty lines
        [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
        
        # Extract variable name and value
        if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
            key="${BASH_REMATCH[1]}"
            value="${BASH_REMATCH[2]}"
            
            # Remove leading/trailing whitespaces
            key="${key#"${key%%[![:space:]]*}"}"
            key="${key%"${key##*[![:space:]]}"}"
            
            # Remove quotes if present
            value="${value#\"}"
            value="${value%\"}"
            
            # Export the variable
            export "$key=$value"
        fi
    done < "$ENV_FILE"
    echo "Loaded variables from $ENV_FILE"
else
    echo "Warning: $ENV_FILE file not found"
fi

# Export default values if not set in the environment file
export APP_HOST="${APP_HOST:-xela.local}"
export REGISTRY_URL="${REGISTRY_URL:-localhost:5000}"

echo "Using APP_HOST=$APP_HOST"
echo "Using REGISTRY_URL=$REGISTRY_URL"

# Check kubectl connection
echo "Checking kubectl connection..."
kubectl version --short || { echo "Error: kubectl not connected to a cluster"; exit 1; }

# Apply namespace first to ensure it exists
echo "Creating/updating namespace..."
kubectl apply -f "$SCRIPT_DIR/overlays/$ENVIRONMENT/namespace.yaml"

# Apply Kustomize configuration
echo "Deploying to $ENVIRONMENT environment..."
kubectl apply -k "$SCRIPT_DIR/overlays/$ENVIRONMENT"

echo "Deployment to $ENVIRONMENT completed successfully" 