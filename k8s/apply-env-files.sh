#!/bin/bash

# Script to copy environment files to overlay directories for Kubernetes deployment
# Usage: ./apply-env-files.sh [dev|test|prod]

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

# Default to all environments if none specified
ENVIRONMENTS=${1:-"dev test prod"}

for ENV in $ENVIRONMENTS; do
    # Source file
    SOURCE_FILE=".env.$ENV"
    
    # Target directory
    TARGET_DIR="$SCRIPT_DIR/overlays/$ENV"
    TARGET_FILE="$TARGET_DIR/.env.$ENV"
    
    if [ -f "$SOURCE_FILE" ]; then
        echo "Copying $SOURCE_FILE to $TARGET_DIR"
        cp "$SOURCE_FILE" "$TARGET_FILE"
    else
        echo "Warning: $SOURCE_FILE does not exist. Skipping."
    fi
done

echo "Environment files have been copied to overlay directories." 