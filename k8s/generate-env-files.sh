#!/bin/bash

# Script to generate environment-specific .env files for Kubernetes deployment
# Usage: ./generate-env-files.sh

set -e

# Base directory
BASE_DIR=$(dirname "$0")
cd $BASE_DIR/..

# Function to clean up the .env file
cleanup_env_file() {
  FILE=$1
  
  # Create a temporary file
  TMP_FILE=$(mktemp)
  
  # Process the file to fix common issues
  cat $FILE | grep -v '^#' | grep -v '^$' | \
    # Remove spaces around equal signs
    sed 's/ *= */=/g' | \
    # Remove spaces at beginning of lines
    sed 's/^ *//g' | \
    # Remove duplicate entries (keeping the last occurrence)
    awk -F= '!seen[$1]++' > $TMP_FILE
  
  # Replace the original file with the cleaned version
  mv $TMP_FILE $FILE
  
  echo "Cleaned up $FILE"
}

# Function to generate environment file
generate_env_file() {
  ENV=$1
  OUTPUT_FILE=".env.$ENV"
  
  echo "Generating $OUTPUT_FILE..."
  
  # Start with base variables from .env
  if [ -f ".env" ]; then
    cp .env $OUTPUT_FILE
    
    # Clean up the file first
    cleanup_env_file $OUTPUT_FILE
  else
    touch $OUTPUT_FILE
  fi
  
  # Add environment-specific overrides
  case $ENV in
    dev)
      cat >> $OUTPUT_FILE << EOF
# Development-specific overrides
NODE_ENV=development
LOG_LEVEL=debug
API_SERVER=http://api-dev.xela.local/graphql
SUBSCRIPTION_SERVER=ws://api-dev.xela.local/graphql
APP_HOST=xela-dev.local
REGISTRY_URL=localhost:5000
EOF
      ;;
    test)
      cat >> $OUTPUT_FILE << EOF
# Test-specific overrides
NODE_ENV=test
LOG_LEVEL=info
API_SERVER=http://api-test.xela.local/graphql
SUBSCRIPTION_SERVER=ws://api-test.xela.local/graphql
APP_HOST=xela-test.local
REGISTRY_URL=localhost:5000
EOF
      ;;
    prod)
      cat >> $OUTPUT_FILE << EOF
# Production-specific overrides
NODE_ENV=production
LOG_LEVEL=warn
API_SERVER=https://api.xela.com/graphql
SUBSCRIPTION_SERVER=wss://api.xela.com/graphql
APP_HOST=xela.com
REGISTRY_URL=registry.xela.com
EOF
      ;;
    *)
      echo "Unknown environment: $ENV"
      exit 1
      ;;
  esac
  
  # Final cleanup to remove any duplicates created by appending
  cleanup_env_file $OUTPUT_FILE
  
  echo "Generated $OUTPUT_FILE"
}

# Generate files for all environments
for ENV in dev test prod; do
  generate_env_file $ENV
done

echo "All environment files generated successfully."
echo "Note: These files contain sensitive information and should not be committed to version control."
echo "You should review and modify these files before using them for deployment." 