#!/bin/bash

# ============================================
# Production Deployment Script
# ============================================
# Secure production deployment for Gyvagaudziaispastai Store

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.production.yml"
PROJECT_NAME="gyvagaudziaispastai"
ENV_FILE=".env"

print_header() {
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo -e "${BOLD}${BLUE}  🚀 PRODUCTION DEPLOYMENT${NC}"
    echo -e "${BOLD}${BLUE}  Gyvagaudziaispastai E-commerce Platform${NC}"
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓${NC} ${1}"
}

print_error() {
    echo -e "${RED}✗${NC} ${1}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        echo "Install with: curl -fsSL https://get.docker.com | sh"
        exit 1
    fi
    
    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        echo "Install with: sudo apt install docker-compose-plugin"
        exit 1
    fi
    
    # Check environment file
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file not found: $ENV_FILE"
        echo "Create it with: ./deployment/generate-secrets.sh"
        exit 1
    fi
    
    # Validate NODE_ENV is production
    if grep -q "NODE_ENV=production" "$ENV_FILE"; then
        print_success "Production environment confirmed"
    else
        print_warning "NODE_ENV is not set to production in $ENV_FILE"
        echo "Add: NODE_ENV=production to your .env file"
    fi
    
    print_success "All prerequisites met"
}

# Security validation
run_security_check() {
    print_info "Running security validation..."
    
    # Check for exposed secrets
    if grep -q "supersecret" "$ENV_FILE" 2>/dev/null; then
        print_error "Weak secrets detected in environment file!"
        echo "Generate secure secrets with: ./deployment/generate-secrets.sh"
        exit 1
    fi
    
    # Check file permissions
    if [ "$(stat -c %a "$ENV_FILE")" != "600" ]; then
        print_warning "Setting secure permissions on $ENV_FILE"
        chmod 600 "$ENV_FILE"
    fi
    
    print_success "Security validation passed"
}

# Start production services
start_production() {
    print_info "Starting production services..."
    
    # Pull latest images (if using registry)
    # docker compose -f "$COMPOSE_FILE" pull
    
    # Build and start services
    docker compose -f "$COMPOSE_FILE" up -d --build
    
    print_success "Production services started"
}

# Stop production services
stop_production() {
    print_info "Stopping production services..."
    
    docker compose -f "$COMPOSE_FILE" down
    
    print_success "Production services stopped"
}

# Restart production services
restart_production() {
    print_info "Restarting production services..."
    
    stop_production
    start_production
    
    print_success "Production services restarted"
}

# View logs
view_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        docker compose -f "$COMPOSE_FILE" logs -f --tail=100
    else
        docker compose -f "$COMPOSE_FILE" logs -f --tail=100 "$service"
    fi
}

# Health check
health_check() {
    print_info "Checking service health..."
    
    # Check backend
    if curl -f http://localhost:9000/health &> /dev/null; then
        print_success "Backend is healthy"
    else
        print_error "Backend health check failed"
    fi
    
    # Check storefront
    if curl -f http://localhost:3000 &> /dev/null; then
        print_success "Storefront is healthy"
    else
        print_error "Storefront health check failed"
    fi
    
    # Check database
    if docker compose -f "$COMPOSE_FILE" exec -T postgres pg_isready &> /dev/null; then
        print_success "Database is healthy"
    else
        print_error "Database health check failed"
    fi
    
    # Check Redis
    if docker compose -f "$COMPOSE_FILE" exec -T redis redis-cli ping &> /dev/null; then
        print_success "Redis is healthy"
    else
        print_error "Redis health check failed"
    fi
}

# Backup database
backup_database() {
    local backup_dir="backups"
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${backup_dir}/db_backup_${timestamp}.sql"
    
    print_info "Creating database backup..."
    
    mkdir -p "$backup_dir"
    
    docker compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U medusa gyvagaudziaispastai > "$backup_file"
    
    if [ -f "$backup_file" ]; then
        gzip "$backup_file"
        print_success "Database backed up to: ${backup_file}.gz"
    else
        print_error "Database backup failed"
    fi
}

# Restore database
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_error "Please provide a backup file"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will overwrite the current database. Continue? (y/N)"
    read -r confirm
    
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_info "Restore cancelled"
        exit 0
    fi
    
    print_info "Restoring database from: $backup_file"
    
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U medusa gyvagaudziaispastai
    else
        docker compose -f "$COMPOSE_FILE" exec -T postgres psql -U medusa gyvagaudziaispastai < "$backup_file"
    fi
    
    print_success "Database restored"
}

# Update deployment
update_deployment() {
    print_info "Updating deployment..."
    
    # Pull latest code
    if [ -d .git ]; then
        print_info "Pulling latest code..."
        git pull origin main
    fi
    
    # Rebuild and restart
    docker compose -f "$COMPOSE_FILE" up -d --build
    
    print_success "Deployment updated"
}

# Create admin user
create_admin() {
    print_info "Creating admin user..."
    
    if [ -f "deployment/create-admin-user.sh" ]; then
        ./deployment/create-admin-user.sh --docker
    else
        print_error "Admin creation script not found"
    fi
}

# Show status
show_status() {
    print_header
    
    print_info "Service Status:"
    docker compose -f "$COMPOSE_FILE" ps
    
    echo ""
    health_check
    
    echo ""
    print_info "Resource Usage:"
    docker stats --no-stream
}

# Show help
show_help() {
    echo "Usage: $0 {start|stop|restart|status|logs|health|backup|restore|update|admin|help}"
    echo ""
    echo "Production deployment management for Gyvagaudziaispastai Store"
    echo ""
    echo "Commands:"
    echo "  start       Start production services"
    echo "  stop        Stop production services"
    echo "  restart     Restart production services"
    echo "  status      Show service status and health"
    echo "  logs [svc]  View logs (optionally for specific service)"
    echo "  health      Run health checks"
    echo "  backup      Backup database"
    echo "  restore     Restore database from backup"
    echo "  update      Update deployment (pull & rebuild)"
    echo "  admin       Create admin user"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Start production"
    echo "  $0 logs backend       # View backend logs"
    echo "  $0 backup             # Create database backup"
    echo "  $0 restore backup.sql # Restore from backup"
    echo ""
}

# Main execution
case "$1" in
    start)
        print_header
        check_prerequisites
        run_security_check
        start_production
        echo ""
        health_check
        echo ""
        print_success "Production deployment started successfully!"
        echo ""
        echo "🌐 Production URL: https://gyva.appiolabs.com"
        echo "🔧 Backend API: https://gyva.appiolabs.com/api"
        echo "👤 Admin Panel: https://gyva.appiolabs.com/app"
        echo ""
        echo "📝 Local Access (for debugging):"
        echo "   Storefront: http://localhost:3000"
        echo "   Backend: http://localhost:9000"
        ;;
    stop)
        print_header
        stop_production
        ;;
    restart)
        print_header
        restart_production
        ;;
    status)
        show_status
        ;;
    logs)
        view_logs "$2"
        ;;
    health)
        print_header
        health_check
        ;;
    backup)
        print_header
        backup_database
        ;;
    restore)
        print_header
        restore_database "$2"
        ;;
    update)
        print_header
        check_prerequisites
        update_deployment
        ;;
    admin)
        print_header
        create_admin
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Invalid command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
