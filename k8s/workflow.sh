#!/bin/bash

# Xela Kubernetes Environment Variable Workflow
# This script documents the end-to-end process for managing environment variables in Kubernetes
# Usage: ./workflow.sh [dev|test|prod]

# Default to dev environment if none specified
ENVIRONMENT=${1:-dev}
VALID_ENVIRONMENTS=("dev" "test" "prod")

# Show the workflow steps
echo "=== Xela Kubernetes Environment Variable Workflow ==="
echo "Environment: $ENVIRONMENT"
echo ""
echo "Step 1: Generate environment-specific .env files"
echo "  ./generate-env-files.sh"
echo ""
echo "Step 2: Copy environment files to overlay directories"
echo "  ./apply-env-files.sh $ENVIRONMENT"
echo ""
echo "Step 3: Deploy to Kubernetes"
echo "  ./deploy.sh $ENVIRONMENT"
echo ""
echo "Step 4: Verify environment configuration"
echo "  ./verify-env-config.sh $ENVIRONMENT"
echo ""
echo "Notes:"
echo "- The environment files (.env.$ENVIRONMENT) contain sensitive information and should not be committed to version control"
echo "- The ConfigMap and Secret resources are created/updated during deployment with kustomize"
echo "- Environment-specific variables override base variables"
echo ""
echo "For more information, see:"
echo "- README-ENV.md - Overview of environment variable management"
echo "- ENV_MANAGEMENT.md - Detailed documentation on environment variable management"
echo ""

# Check if user wants to run the workflow
read -p "Do you want to run this workflow now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running workflow for environment: $ENVIRONMENT"
    
    echo ""
    echo "Step 1: Generating environment-specific .env files..."
    ./generate-env-files.sh
    
    echo ""
    echo "Step 2: Copying environment files to overlay directories..."
    ./apply-env-files.sh $ENVIRONMENT
    
    echo ""
    echo "Step 3: Deploying to Kubernetes..."
    ./deploy.sh $ENVIRONMENT
    
    echo ""
    echo "Step 4: Verifying environment configuration..."
    ./verify-env-config.sh $ENVIRONMENT
    
    echo ""
    echo "Workflow completed!"
else
    echo "Workflow not executed. Run the commands manually as needed."
fi 