# Gyvagaudziaispastai Store

Modern e-commerce platform built with Medusa.js and Next.js, inspired by professional wildlife control solutions.

## Architecture

- **Backend**: Medusa.js (Node.js/Express)
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Containerization**: Docker & Docker Compose
- **Deployment**: AWS Ready

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

### Initial Setup

1. **Clone and setup the project**:
   ```bash
   cd gyvagaudziaispastai-store
   ./dev.sh setup
   ```

2. **Start the development environment**:
   ```bash
   ./dev.sh up
   ```

3. **Access the applications**:
   - Storefront: http://localhost:3000
   - Medusa Backend: http://localhost:9000
   - Medusa Admin: http://localhost:9000/app

### Development Commands

```bash
# Start all services
./dev.sh up

# Stop all services  
./dev.sh down

# Restart all services
./dev.sh restart

# View logs
./dev.sh logs
./dev.sh logs backend    # specific service logs

# Open shell in container
./dev.sh shell backend
./dev.sh shell storefront
```

## Project Structure

```
gyvagaudziaispastai-store/
├── backend/              # Medusa.js backend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── storefront/           # Next.js frontend
│   ├── src/
│   ├── Dockerfile  
│   └── package.json
├── docker-compose.yml    # Docker services orchestration
└── dev.sh               # Development helper script
```

## Services

- **Backend** (port 9000): Medusa.js API and admin
- **Storefront** (port 3000): Next.js customer-facing store
- **PostgreSQL** (port 5432): Primary database
- **Redis** (port 6379): Cache and session storage

## Development Workflow

1. Make changes to code in `backend/` or `storefront/`
2. Changes are automatically reflected via Docker volumes
3. Hot reload is enabled for both services
4. Database and Redis data persists between container restarts


// AWS

Implemetation