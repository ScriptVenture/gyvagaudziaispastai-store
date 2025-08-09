#!/bin/bash

echo "🚀 Starting Medusa backend in production..."

# Run database migrations
echo "🔄 Running database migrations..."
npx medusa db:migrate

# Start the production server
echo "🎯 Starting production server..."
npm run start