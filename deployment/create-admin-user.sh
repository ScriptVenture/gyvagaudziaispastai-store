#!/bin/bash

# ============================================
# Admin User Creation Script
# ============================================
# Creates administrative user for Medusa backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo -e "${BOLD}${BLUE}  👤 MEDUSA ADMIN USER CREATION${NC}"
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

# Default admin credentials
ADMIN_EMAIL="admin@gyvagaudziaispastai.com"
ADMIN_PASSWORD=""
ADMIN_FIRST_NAME="Demo"
ADMIN_LAST_NAME="Admin"

# Generate secure admin password
generate_admin_password() {
    # Generate a secure 16-character password
    ADMIN_PASSWORD=$(openssl rand -base64 16 | tr -d /=+ | head -c 16)
}

# Create admin user via Medusa CLI
create_admin_user() {
    local backend_path="${1:-/opt/gyvagaudziaispastai/backend}"
    
    print_info "Creating admin user in Medusa backend..."
    
    # Change to backend directory
    cd "$backend_path" || {
        print_error "Backend directory not found: $backend_path"
        return 1
    }
    
    # Load environment variables
    if [ -f "../.env.production" ]; then
        export $(grep -v '^#' ../.env.production | xargs)
        print_success "Loaded production environment"
    else
        print_error ".env.production not found"
        return 1
    fi
    
    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    local retries=30
    while [ $retries -gt 0 ]; do
        if npx medusa db:create 2>/dev/null; then
            print_success "Database is ready"
            break
        fi
        retries=$((retries - 1))
        if [ $retries -eq 0 ]; then
            print_error "Database connection timeout"
            return 1
        fi
        sleep 2
    done
    
    # Run database migrations
    print_info "Running database migrations..."
    if npx medusa db:migrate; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        return 1
    fi
    
    # Create admin user
    print_info "Creating admin user..."
    if echo -e "$ADMIN_EMAIL\n$ADMIN_PASSWORD\n$ADMIN_FIRST_NAME\n$ADMIN_LAST_NAME" | npx medusa user -c; then
        print_success "Admin user created successfully"
    else
        print_error "Failed to create admin user"
        return 1
    fi
}

# Create admin credentials file
create_credentials_file() {
    local creds_file="admin-credentials.txt"
    
    cat > "$creds_file" << EOF
# ================================================
# MEDUSA ADMIN PANEL CREDENTIALS
# ================================================
# Generated on: $(date)
# For demo/showcase purposes

Admin Panel URL: http://YOUR_AWS_DOMAIN/app
Email: $ADMIN_EMAIL
Password: $ADMIN_PASSWORD

# ================================================
# SECURITY NOTES
# ================================================
- Change password after first login for production use
- This file contains sensitive information
- Delete this file after noting credentials
- Use strong passwords for production deployments

# ================================================
# ADMIN PANEL FEATURES TO SHOWCASE
# ================================================
- Product management and catalog
- Order management and fulfillment
- Customer management
- Analytics and reports
- Payment and shipping configuration
- Content management
- User and role management

EOF
    
    chmod 600 "$creds_file"
    print_success "Admin credentials saved to: $creds_file"
}

# Docker-based admin user creation (for containerized setup)
create_admin_user_docker() {
    print_info "Creating admin user in Docker container..."
    
    # Wait for backend container to be healthy
    local retries=60
    print_info "Waiting for backend container to be ready..."
    while [ $retries -gt 0 ]; do
        if docker-compose -f docker-compose.production.yml ps | grep -q "gyvagaudziaispastai-backend.*Up"; then
            print_success "Backend container is running"
            break
        fi
        retries=$((retries - 1))
        if [ $retries -eq 0 ]; then
            print_error "Backend container not ready"
            return 1
        fi
        sleep 2
    done
    
    # Wait a bit more for services to initialize
    sleep 10
    
    # Run migrations first
    print_info "Running database migrations in container..."
    if docker-compose -f docker-compose.production.yml exec -T backend sh -c "npm run build && npx medusa db:migrate"; then
        print_success "Database migrations completed"
    else
        print_warning "Database migrations may have failed, continuing..."
    fi
    
    # Create admin user in container
    print_info "Creating admin user in container..."
    if docker-compose -f docker-compose.production.yml exec -T backend sh -c "echo -e '$ADMIN_EMAIL\n$ADMIN_PASSWORD\n$ADMIN_FIRST_NAME\n$ADMIN_LAST_NAME' | npx medusa user -c"; then
        print_success "Admin user created successfully"
    else
        print_error "Failed to create admin user"
        return 1
    fi
}

# Update startup script to include admin user creation
update_startup_script() {
    local startup_script="/opt/gyvagaudziaispastai/start-secure.sh"
    
    if [ -f "$startup_script" ]; then
        print_info "Adding admin user creation to startup script..."
        
        # Add admin user creation to startup script
        cat >> "$startup_script" << 'EOF'

# Create admin user if it doesn't exist
echo "🔐 Checking admin user..."
if docker-compose -f docker-compose.production.yml exec -T backend sh -c "npx medusa user -l" 2>/dev/null | grep -q "admin@gyvagaudziaispastai.com"; then
    echo "✅ Admin user already exists"
else
    echo "👤 Creating admin user..."
    /opt/gyvagaudziaispastai/deployment/create-admin-user.sh --docker
fi
EOF
        
        print_success "Updated startup script with admin user creation"
    else
        print_warning "Startup script not found, skipping update"
    fi
}

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Create administrative user for Medusa backend"
    echo ""
    echo "Options:"
    echo "  --email EMAIL        Admin email (default: admin@gyvagaudziaispastai.com)"
    echo "  --password PASS      Admin password (default: auto-generated)"
    echo "  --first-name NAME    Admin first name (default: Demo)"
    echo "  --last-name NAME     Admin last name (default: Admin)"
    echo "  --docker             Use Docker container for user creation"
    echo "  --backend-path PATH  Backend directory path"
    echo "  --help, -h           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Create with defaults"
    echo "  $0 --docker                          # Create in Docker container"
    echo "  $0 --email admin@mystore.com         # Custom email"
    echo ""
}

# Main execution
main() {
    local use_docker=false
    local backend_path="/opt/gyvagaudziaispastai/backend"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --email)
                ADMIN_EMAIL="$2"
                shift 2
                ;;
            --password)
                ADMIN_PASSWORD="$2"
                shift 2
                ;;
            --first-name)
                ADMIN_FIRST_NAME="$2"
                shift 2
                ;;
            --last-name)
                ADMIN_LAST_NAME="$2"
                shift 2
                ;;
            --docker)
                use_docker=true
                shift
                ;;
            --backend-path)
                backend_path="$2"
                shift 2
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_header
    
    # Generate password if not provided
    if [ -z "$ADMIN_PASSWORD" ]; then
        generate_admin_password
        print_success "Generated secure admin password"
    fi
    
    print_info "Admin Details:"
    print_info "  Email: $ADMIN_EMAIL"
    print_info "  Password: [GENERATED - will be saved to file]"
    print_info "  Name: $ADMIN_FIRST_NAME $ADMIN_LAST_NAME"
    echo ""
    
    # Create admin user
    if [ "$use_docker" = true ]; then
        create_admin_user_docker
    else
        create_admin_user "$backend_path"
    fi
    
    if [ $? -eq 0 ]; then
        # Create credentials file
        create_credentials_file
        
        echo ""
        print_success "Admin user creation completed!"
        echo ""
        echo -e "${BOLD}Login Details:${NC}"
        echo -e "📧 Email: ${YELLOW}$ADMIN_EMAIL${NC}"
        echo -e "🔐 Password: ${YELLOW}$ADMIN_PASSWORD${NC}"
        echo -e "🌐 Admin Panel: ${GREEN}http://YOUR_AWS_DOMAIN/app${NC}"
        echo ""
        print_warning "Save these credentials securely!"
        print_info "Credentials also saved to: admin-credentials.txt"
    else
        print_error "Admin user creation failed"
        exit 1
    fi
}

# Run main function
main "$@"