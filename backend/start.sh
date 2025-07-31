#!/bin/bash

echo "🚀 Starting Medusa backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
timeout=30
while ! pg_isready -h postgres -p 5432 -U postgres 2>/dev/null; do
  echo "Database is unavailable - waiting..."
  sleep 2
  timeout=$((timeout-2))
  if [ $timeout -le 0 ]; then
    echo "❌ Database connection timeout"
    exit 1
  fi
done

echo "✅ Database is ready!"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Run database migrations
echo "🔄 Running database migrations..."
npm run build
npx medusa db:migrate

# Start the development server
echo "🎯 Starting development server..."
npm run dev
