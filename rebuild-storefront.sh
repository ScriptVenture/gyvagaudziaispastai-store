#!/bin/bash

# Script to rebuild storefront container without stopping the entire environment
echo "🔧 Rebuilding storefront container with fresh environment variables..."

# Build only the storefront with no cache
docker-compose -f docker-compose.production.yml build --no-cache storefront

# Stop only the storefront container
docker-compose -f docker-compose.production.yml stop storefront

# Start only the storefront container
docker-compose -f docker-compose.production.yml up -d storefront

echo "✅ Storefront container rebuilt and restarted!"
