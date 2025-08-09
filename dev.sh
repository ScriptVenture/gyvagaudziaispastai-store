#!/bin/bash

# Development script for gyvagaudziaispastai-store
set -e

ENV=${2:-development}

case "$1" in
  up)
    case "$ENV" in
      development|dev)
        echo "🚀 Starting gyvagaudziaispastai-store DEVELOPMENT environment..."
        if [ ! -f .env ]; then
          echo "❌ .env file not found! Please create your .env file."
          exit 1
        fi
        docker compose up --build
        ;;
      staging)
        echo "🚀 Starting gyvagaudziaispastai-store STAGING environment..."
        if [ ! -f .env ]; then
          echo "❌ .env file not found! Please create your .env file."
          exit 1
        fi
        docker compose -f docker-compose.yml -f docker-compose.staging.yml up --build
        ;;
      production|prod)
        echo "🚀 Starting gyvagaudziaispastai-store PRODUCTION environment..."
        if [ ! -f .env ]; then
          echo "❌ .env file not found! Please create your .env file."
          exit 1
        fi
        docker compose -f docker-compose.production.yml up --build
        ;;
      *)
        echo "❌ Invalid environment: $ENV. Use: development, staging, or production"
        exit 1
        ;;
    esac
    ;;
  down)
    echo "🛑 Stopping gyvagaudziaispastai-store environment..."
    docker compose down
    ;;
  restart)
    echo "🔄 Restarting gyvagaudziaispastai-store environment..."
    $0 down
    $0 up $ENV
    ;;
  logs)
    echo "📋 Showing logs for $2..."
    if [ -z "$2" ]; then
      docker compose logs -f
    else
      docker compose logs -f "$2"
    fi
    ;;
  shell)
    echo "🐚 Opening shell for $2..."
    docker compose exec "$2" sh
    ;;
  setup)
    echo "⚙️ Setting up the project..."
    
    # Copy environment template
    if [ ! -f .env ]; then
      cp .env.development .env
      echo "📄 Created .env from .env.development template"
    fi
    
    # Create backend using Medusa CLI
    echo "📦 Setting up Medusa backend..."
    if [ ! -f backend/package.json ]; then
      # Remove existing backend directory if it's empty or only contains Docker files
      if [ "$(ls -A backend 2>/dev/null | grep -v -E '^(Dockerfile|\.dockerignore)$' | wc -l)" -eq 0 ]; then
        echo "🗑️ Removing empty backend directory..."
        rm -rf backend
      fi
      
      # Create Medusa app in a temporary directory and move it
      echo "📦 Creating Medusa application..."
      npx create-medusa-app@latest temp-medusa-backend --skip-db
      
      # Move the contents to backend directory
      mkdir -p backend
      mv temp-medusa-backend/* backend/ 2>/dev/null || true
      mv temp-medusa-backend/.[^.]* backend/ 2>/dev/null || true
      rmdir temp-medusa-backend
      
      # Copy our Docker files back
      cp backend/Dockerfile backend/Dockerfile.dev 2>/dev/null || true
    else
      echo "✅ Backend already exists, skipping creation"
    fi
    
    # Create storefront using Next.js starter  
    echo "🎨 Setting up Next.js storefront..."
    if [ ! -f storefront/package.json ]; then
      # Remove existing storefront directory if it's empty or only contains Docker files
      if [ "$(ls -A storefront 2>/dev/null | grep -v -E '^(Dockerfile|\.dockerignore)$' | wc -l)" -eq 0 ]; then
        echo "🗑️ Removing empty storefront directory..."
        rm -rf storefront
      fi
      
      # Create Next.js app in a temporary directory and move it
      echo "🎨 Creating Next.js application..."
      npx create-next-app@latest temp-nextjs-storefront --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
      
      # Move the contents to storefront directory
      mkdir -p storefront
      mv temp-nextjs-storefront/* storefront/ 2>/dev/null || true
      mv temp-nextjs-storefront/.[^.]* storefront/ 2>/dev/null || true
      rmdir temp-nextjs-storefront
      
      # Copy our Docker files back
      cp storefront/Dockerfile storefront/Dockerfile.dev 2>/dev/null || true
    else
      echo "✅ Storefront already exists, skipping creation"
    fi
    
    # Create backend start script for development
    if [ ! -f backend/start.sh ]; then
      echo "📝 Creating backend start script..."
      cat > backend/start.sh << 'EOF'
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
EOF
      chmod +x backend/start.sh
    fi
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Review and update .env file with your settings"
    echo "2. Run './dev.sh up' to start the development environment"
    echo "3. Create staging/production env files when needed:"
    echo "   - cp .env.staging.example .env.staging"
    echo "   - cp .env.production.example .env.production"
    ;;
  env)
    echo "🌍 Environment management:"
    echo ""
    echo "Available environments:"
    echo "  development (default) - Local development with hot reload"
    echo "  staging              - Testing environment"
    echo "  production           - Production environment"
    echo ""
    echo "Usage:"
    echo "  ./dev.sh up development  # or just ./dev.sh up"
    echo "  ./dev.sh up staging"
    echo "  ./dev.sh up production"
    echo ""
    echo "Environment files:"
    echo "  .env                  - Environment settings (configure per server)"
    echo "  .env.development      - Development template (committed)"
    echo "  .env.staging.example  - Staging template (committed)"
    echo "  .env.production       - Production template (committed)"
    ;;
  *)
    echo "📖 Usage: $0 {up|down|restart|logs|shell|setup|env} [environment]"
    echo ""
    echo "Commands:"
    echo "  up [env]  - Start environment (dev/staging/prod)"
    echo "  down      - Stop all services"
    echo "  restart   - Restart services"
    echo "  logs [svc] - Show logs (optionally for specific service)"
    echo "  shell [svc] - Open shell in container"
    echo "  setup     - Initial project setup"
    echo "  env       - Show environment information"
    echo ""
    echo "Environments: development (default), staging, production"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh up              # Start development"
    echo "  ./dev.sh up staging      # Start staging"
    echo "  ./dev.sh up production   # Start production"
    exit 1
    ;;
esac