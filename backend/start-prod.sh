#!/bin/sh

echo "🚀 Starting Medusa backend in production..."

# Build the application first
echo "🔧 Building application..."
npm run build

# Run database migrations (this will also test connection)
echo "🔄 Running database migrations..."
npx medusa db:migrate

# Start the production server
echo "🎯 Starting production server..."
npm run start