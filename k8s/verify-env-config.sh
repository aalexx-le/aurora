#!/bin/bash

# Script to verify the environment configuration in Kubernetes
# Usage: ./verify-env-config.sh [dev|test|prod]

set -e

# Default to dev environment if none specified
ENVIRONMENT=${1:-dev}
VALID_ENVIRONMENTS=("dev" "test" "prod")

# Validate environment
if [[ ! " ${VALID_ENVIRONMENTS[@]} " =~ " ${ENVIRONMENT} " ]]; then
    echo "Error: Invalid environment. Please use one of: ${VALID_ENVIRONMENTS[*]}"
    exit 1
fi

NAMESPACE="xela-$ENVIRONMENT"

echo "Verifying configuration for environment: $ENVIRONMENT in namespace: $NAMESPACE"

# Check if namespace exists
if ! kubectl get namespace $NAMESPACE &>/dev/null; then
    echo "Error: Namespace $NAMESPACE does not exist"
    exit 1
fi

# Verify ConfigMap
echo -e "\n--- ConfigMap: xela-config ---"
if ! kubectl get configmap xela-config -n $NAMESPACE &>/dev/null; then
    echo "Warning: ConfigMap 'xela-config' does not exist in namespace $NAMESPACE"
else
    echo "ConfigMap exists. Keys:"
    kubectl get configmap xela-config -n $NAMESPACE -o json | jq -r '.data | keys[]' | sort
fi

# Verify Secret
echo -e "\n--- Secret: xela-secrets ---"
if ! kubectl get secret xela-secrets -n $NAMESPACE &>/dev/null; then
    echo "Warning: Secret 'xela-secrets' does not exist in namespace $NAMESPACE"
else
    echo "Secret exists. Keys:"
    kubectl get secret xela-secrets -n $NAMESPACE -o json | jq -r '.data | keys[]' | sort
fi

# Verify environment-specific .env file
echo -e "\n--- Environment File: .env.$ENVIRONMENT ---"
if [ -f "../.env.$ENVIRONMENT" ]; then
    echo "File exists. Variables:"
    grep -v '^#' "../.env.$ENVIRONMENT" | grep -v '^$' | cut -d= -f1 | sort
else
    echo "Warning: Environment file ../.env.$ENVIRONMENT does not exist"
fi

# Check for missing variables in deployments
echo -e "\n--- Checking for environment variable references in deployments ---"
DEPLOYMENTS=$(kubectl get deployments -n $NAMESPACE -o name 2>/dev/null || echo "")
if [ -z "$DEPLOYMENTS" ]; then
    echo "No deployments found in namespace $NAMESPACE"
else
    for DEPLOYMENT in $DEPLOYMENTS; do
        echo "Checking $DEPLOYMENT..."
        ENV_VARS=$(kubectl get $DEPLOYMENT -n $NAMESPACE -o json | jq -r '.spec.template.spec.containers[].env[]?.name' 2>/dev/null || echo "")
        ENV_FROM=$(kubectl get $DEPLOYMENT -n $NAMESPACE -o json | jq -r '.spec.template.spec.containers[].envFrom[]?.configMapRef.name, .spec.template.spec.containers[].envFrom[]?.secretRef.name' 2>/dev/null || echo "")
        
        if [ -n "$ENV_VARS" ]; then
            echo "Individual environment variables:"
            echo "$ENV_VARS" | sort
        fi
        
        if [ -n "$ENV_FROM" ]; then
            echo "Referenced ConfigMaps/Secrets:"
            echo "$ENV_FROM" | sort
        fi
        
        if [ -z "$ENV_VARS" ] && [ -z "$ENV_FROM" ]; then
            echo "No environment variables found"
        fi
        echo ""
    done
fi

echo "Verification complete for environment: $ENVIRONMENT" 