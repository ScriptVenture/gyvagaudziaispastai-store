#!/bin/bash

# ============================================
# Secure Secrets Generator
# ============================================
# Generates cryptographically secure secrets for production

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
    echo -e "${BOLD}${BLUE}  🔐 PRODUCTION SECRETS GENERATOR${NC}"
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  CRITICAL: Keep these secrets secure!${NC}"
    echo -e "${YELLOW}   Never commit them to Git or share publicly${NC}"
    echo ""
}

print_section() {
    echo -e "${BOLD}${YELLOW}🔑 ${1}${NC}"
    echo "----------------------------------------"
}

print_secret() {
    echo -e "${GREEN}$1${NC}=${BOLD}$2${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

# Check if required tools are available
check_dependencies() {
    if ! command -v openssl &> /dev/null; then
        echo -e "${RED}Error: openssl is required but not installed${NC}"
        echo "Install with: sudo apt install openssl"
        exit 1
    fi
}

# Generate secure random string
generate_secure_random() {
    local length=$1
    openssl rand -base64 $((length * 3 / 4)) | tr -d "=+/" | cut -c1-$length
}

# Generate hex string
generate_hex() {
    local length=$1
    openssl rand -hex $((length / 2))
}

# Generate secure password
generate_secure_password() {
    local length=${1:-20}
    # Generate password with mixed case, numbers, and safe special characters
    openssl rand -base64 $((length * 3 / 4)) | tr -d "=+/" | head -c $length
}

# Generate JWT secret (should be exactly 64 characters for optimal security)
generate_jwt_secret() {
    generate_hex 64
}

# Generate cookie secret (should be exactly 64 characters)
generate_cookie_secret() {
    generate_hex 64
}

# Generate strong database password
generate_db_password() {
    # Use 20 characters with mixed complexity
    local base_password=$(generate_secure_password 16)
    local special_chars="!@#$%^&*"
    local random_special=${special_chars:$((RANDOM % ${#special_chars})):1}
    local random_number=$((RANDOM % 100))
    
    # Combine for strong password
    echo "${base_password}${random_special}${random_number}"
}

# Generate monitoring password
generate_monitoring_password() {
    generate_secure_password 16
}

# Generate backup encryption key
generate_backup_key() {
    generate_hex 32
}

# Create .env.production template with generated secrets
create_env_template() {
    local use_aws_domain=${1:-true}
    local custom_domain=${2:-""}
    local env_file=".env.production"
    
    print_info "Creating secure .env.production file..."
    
    cat > "$env_file" << EOF
# ===========================================
# PRODUCTION ENVIRONMENT VARIABLES
# ===========================================
# 🚨 KEEP THIS FILE SECURE - NEVER COMMIT TO GIT
# Generated on: $(date)
# Purpose: Customer demonstration platform using AWS auto-assigned domain

# ==================
# CRITICAL SECURITY SECRETS
# ==================
JWT_SECRET=$JWT_SECRET
COOKIE_SECRET=$COOKIE_SECRET

# Strong database password
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# ==================
# DATABASE CONFIGURATION
# ==================
DATABASE_URL=postgresql://medusa:\${POSTGRES_PASSWORD}@postgres:5432/gyvagaudziaispastai
DATABASE_SSL=true
POSTGRES_DB=gyvagaudziaispastai
POSTGRES_USER=medusa

# ==================
# REDIS CONFIGURATION
# ==================
REDIS_URL=redis://redis:6379

# ==================
# DOMAIN & CORS (AWS Auto-assigned for demo)
# ==================
# Note: Domain will be auto-populated after AWS deployment
DOMAIN=AUTO_ASSIGNED_FROM_AWS
STORE_CORS=http://AUTO_ASSIGNED_FROM_AWS
ADMIN_CORS=http://AUTO_ASSIGNED_FROM_AWS
AUTH_CORS=http://AUTO_ASSIGNED_FROM_AWS
MEDUSA_BACKEND_URL=http://AUTO_ASSIGNED_FROM_AWS
FRONTEND_URL=http://AUTO_ASSIGNED_FROM_AWS

# ==================
# PAYMENT CONFIGURATION (Update with production keys)
# ==================
PAYSERA_PROJECT_ID=YOUR_PRODUCTION_PAYSERA_PROJECT_ID
PAYSERA_SIGN_PASSWORD=YOUR_PRODUCTION_PAYSERA_SIGN_PASSWORD  
PAYSERA_TEST_MODE=false

# ==================
# SHIPPING CONFIGURATION (Update with production keys)
# ==================
VENIPAK_API_KEY=YOUR_PRODUCTION_VENIPAK_API_KEY
VENIPAK_USERNAME=YOUR_PRODUCTION_VENIPAK_USERNAME
VENIPAK_PASSWORD=YOUR_PRODUCTION_VENIPAK_PASSWORD

# ==================
# NEXT.JS CONFIGURATION
# ==================
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://AUTO_ASSIGNED_FROM_AWS
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=YOUR_DEMO_PUBLISHABLE_KEY
NEXT_PUBLIC_CDN_DOMAIN=AUTO_ASSIGNED_FROM_AWS
NEXT_PUBLIC_API_DOMAIN=AUTO_ASSIGNED_FROM_AWS

# ==================
# APPLICATION SETTINGS
# ==================
NODE_ENV=production
DISABLE_MEDUSA_ADMIN=false
LOG_LEVEL=info
DEMO_MODE=true
SHOW_DEMO_BANNER=true

# ==================
# MONITORING & ALERTS (Demo Configuration)
# ==================
GRAFANA_ADMIN_PASSWORD=$GRAFANA_PASSWORD
SMTP_HOST=smtp.gmail.com:587
SMTP_USER=demo@example.com
SMTP_PASSWORD=YOUR_EMAIL_APP_PASSWORD_FOR_DEMO
SMTP_FROM=monitoring@demo-platform.com

# ==================
# BACKUP CONFIGURATION (Demo)
# ==================
BACKUP_S3_BUCKET=gyvagaudziaispastai-demo-backups-$(date +%s)
BACKUP_ENCRYPTION_KEY=$BACKUP_KEY
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
EOF

    # Set secure permissions
    chmod 600 "$env_file"
    
    print_info "Created $env_file with secure permissions (600)"
    print_warning "Remember to update the placeholder values with your actual credentials!"
}

# Main execution
main() {
    local domain=$1
    
    print_header
    
    # Check dependencies
    check_dependencies
    
    print_section "Generating Cryptographically Secure Secrets"
    
    # Generate all secrets
    JWT_SECRET=$(generate_jwt_secret)
    COOKIE_SECRET=$(generate_cookie_secret)
    POSTGRES_PASSWORD=$(generate_db_password)
    GRAFANA_PASSWORD=$(generate_monitoring_password)
    BACKUP_KEY=$(generate_backup_key)
    
    # Display generated secrets
    print_secret "JWT_SECRET" "$JWT_SECRET"
    print_secret "COOKIE_SECRET" "$COOKIE_SECRET"
    print_secret "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD"
    print_secret "GRAFANA_ADMIN_PASSWORD" "$GRAFANA_PASSWORD"
    print_secret "BACKUP_ENCRYPTION_KEY" "$BACKUP_KEY"
    
    echo ""
    print_section "Secret Quality Validation"
    
    # Validate secret quality
    if [ ${#JWT_SECRET} -eq 64 ]; then
        echo -e "${GREEN}✓${NC} JWT_SECRET length: ${#JWT_SECRET} characters (optimal)"
    else
        echo -e "${YELLOW}⚠${NC} JWT_SECRET length: ${#JWT_SECRET} characters (should be 64)"
    fi
    
    if [ ${#COOKIE_SECRET} -eq 64 ]; then
        echo -e "${GREEN}✓${NC} COOKIE_SECRET length: ${#COOKIE_SECRET} characters (optimal)"
    else
        echo -e "${YELLOW}⚠${NC} COOKIE_SECRET length: ${#COOKIE_SECRET} characters (should be 64)"
    fi
    
    if [ ${#POSTGRES_PASSWORD} -ge 18 ]; then
        echo -e "${GREEN}✓${NC} POSTGRES_PASSWORD length: ${#POSTGRES_PASSWORD} characters (strong)"
    else
        echo -e "${YELLOW}⚠${NC} POSTGRES_PASSWORD length: ${#POSTGRES_PASSWORD} characters (weak)"
    fi
    
    echo ""
    
    # Ask about creating .env.production file
    echo -e "${YELLOW}Create .env.production file with these secrets? (y/N)${NC}"
    read -r create_env
    
    if [[ $create_env =~ ^[Yy]$ ]]; then
        create_env_template
        echo ""
    fi
    
    print_section "Security Instructions"
    
    echo -e "${BOLD}IMPORTANT SECURITY REMINDERS:${NC}"
    echo ""
    echo "1. 🚨 NEVER commit .env.production to Git"
    echo "2. 🔒 Store secrets securely (password manager recommended)"
    echo "3. 🔄 Rotate secrets regularly (every 90 days)"
    echo "4. 👥 Limit access to production secrets"
    echo "5. 📝 Keep backup of secrets in secure location"
    echo "6. 🔍 Monitor for secret exposure in logs"
    echo ""
    
    echo -e "${BOLD}NEXT STEPS FOR DEMO DEPLOYMENT:${NC}"
    echo ""
    echo "1. Update .env.production with your actual service credentials:"
    echo "   - Paysera demo/test keys (set TEST_MODE=true for demo)"
    echo "   - Venipak test credentials"
    echo "   - Medusa demo publishable key"
    echo "   - AWS access keys for deployment"
    echo "   - Email SMTP credentials (optional for demo)"
    echo ""
    echo "2. Run security validation:"
    echo "   ./deployment/validate-security.sh"
    echo ""
    echo "3. Deploy demo platform (uses AWS auto-assigned domain):"
    echo "   ./deployment/deploy-secure.sh"
    echo ""
    echo "4. After deployment, domains will be auto-updated in environment"
    echo ""
    
    echo -e "${GREEN}✅ Secure secrets generated successfully!${NC}"
}

# Help function
show_help() {
    echo "Usage: $0 [domain]"
    echo ""
    echo "Generate cryptographically secure secrets for production deployment"
    echo ""
    echo "Arguments:"
    echo "  domain    Your production domain (optional)"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 gyvagaudziaispastai.com"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            main "$1"
            exit $?
            ;;
    esac
done

# If no arguments, run with prompts
main