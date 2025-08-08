#!/bin/bash

# ============================================
# Security Validation Script
# ============================================
# Validates environment and code security before deployment

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
    echo -e "${BOLD}${BLUE}  🔐 SECURITY VALIDATION REPORT${NC}"
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo ""
}

print_section() {
    echo -e "${BOLD}${YELLOW}🔍 ${1}${NC}"
    echo "----------------------------------------"
}

print_success() {
    echo -e "${GREEN}✓${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

print_error() {
    echo -e "${RED}✗${NC} ${1}"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} ${1}"
}

# Global variables
SECURITY_SCORE=0
MAX_SCORE=0
ERRORS=()
WARNINGS=()

add_test() {
    MAX_SCORE=$((MAX_SCORE + 1))
}

pass_test() {
    SECURITY_SCORE=$((SECURITY_SCORE + 1))
    print_success "$1"
}

fail_test() {
    ERRORS+=("$1")
    print_error "$1"
}

warn_test() {
    WARNINGS+=("$1")
    print_warning "$1"
}

# Test functions
test_hardcoded_secrets() {
    print_section "Checking for hardcoded secrets"
    
    add_test
    local secrets_found=false
    
    # Check for common secret patterns
    if grep -r -E "(password|secret|key|token).*=.*['\"][^'\"]{8,}['\"]" \
        --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" \
        --exclude-dir=deployment . 2>/dev/null; then
        fail_test "Potential hardcoded secrets found in code"
        secrets_found=true
    fi
    
    # Check for specific dangerous patterns
    local patterns=(
        "supersecret"
        "password123"
        "admin123"
        "AKIA[A-Z0-9]{16}"  # AWS Access Key
        "sk_live_"          # Stripe live key
        "pk_live_"          # Stripe live publishable key
    )
    
    for pattern in "${patterns[@]}"; do
        if grep -r -E "$pattern" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null; then
            fail_test "Dangerous secret pattern found: $pattern"
            secrets_found=true
        fi
    done
    
    if [ "$secrets_found" = false ]; then
        pass_test "No hardcoded secrets detected"
    fi
    
    echo ""
}

test_environment_variables() {
    print_section "Validating environment variables"
    
    # Critical environment variables
    local critical_vars=(
        "JWT_SECRET"
        "COOKIE_SECRET"
        "POSTGRES_PASSWORD"
        "PAYSERA_PROJECT_ID"
        "PAYSERA_SIGN_PASSWORD"
    )
    
    local env_file=".env.production"
    
    if [ ! -f "$env_file" ]; then
        add_test
        fail_test "Production environment file ($env_file) not found"
        print_info "Create $env_file with production environment variables"
        echo ""
        return
    fi
    
    # Load environment variables
    source "$env_file" 2>/dev/null || true
    
    for var in "${critical_vars[@]}"; do
        add_test
        local value=$(eval echo \$$var)
        
        if [ -z "$value" ]; then
            fail_test "Missing critical environment variable: $var"
        elif [ ${#value} -lt 16 ]; then
            fail_test "Environment variable $var is too short (minimum 16 characters)"
        elif [[ "$value" == *"change"* ]] || [[ "$value" == *"example"* ]] || [[ "$value" == *"your"* ]]; then
            fail_test "Environment variable $var contains placeholder text"
        else
            pass_test "Environment variable $var is properly configured"
        fi
    done
    
    # Test JWT_SECRET length (should be exactly 64 characters for hex)
    add_test
    if [ -n "$JWT_SECRET" ] && [ ${#JWT_SECRET} -eq 64 ]; then
        pass_test "JWT_SECRET has correct length (64 characters)"
    elif [ -n "$JWT_SECRET" ]; then
        warn_test "JWT_SECRET should be 64 characters long (current: ${#JWT_SECRET})"
    fi
    
    # Test COOKIE_SECRET length
    add_test
    if [ -n "$COOKIE_SECRET" ] && [ ${#COOKIE_SECRET} -eq 64 ]; then
        pass_test "COOKIE_SECRET has correct length (64 characters)"
    elif [ -n "$COOKIE_SECRET" ]; then
        warn_test "COOKIE_SECRET should be 64 characters long (current: ${#COOKIE_SECRET})"
    fi
    
    echo ""
}

test_cors_configuration() {
    print_section "Validating CORS configuration"
    
    add_test
    if [ -f ".env.production" ]; then
        source ".env.production" 2>/dev/null || true
        
        if [[ "$STORE_CORS" == *"localhost"* ]] || [[ "$ADMIN_CORS" == *"localhost"* ]]; then
            fail_test "CORS still configured for localhost in production"
        elif [[ "$STORE_CORS" == *"**"* ]] || [[ "$ADMIN_CORS" == *"**"* ]]; then
            fail_test "CORS is too permissive (allows all domains)"
        elif [ -n "$STORE_CORS" ] && [ -n "$ADMIN_CORS" ]; then
            pass_test "CORS is properly configured for production"
        else
            warn_test "CORS configuration not found or incomplete"
        fi
    else
        fail_test "Cannot validate CORS - .env.production not found"
    fi
    
    echo ""
}

test_docker_security() {
    print_section "Validating Docker security"
    
    # Check for privileged containers
    add_test
    if grep -r "privileged.*true" docker-compose*.yml 2>/dev/null; then
        fail_test "Privileged containers found - security risk"
    else
        pass_test "No privileged containers detected"
    fi
    
    # Check for host network mode
    add_test
    if grep -r "network_mode.*host" docker-compose*.yml 2>/dev/null; then
        fail_test "Host network mode detected - security risk"
    else
        pass_test "No host network mode detected"
    fi
    
    # Check for unnecessary volume mounts
    add_test
    if grep -r "/:/\|/var/run/docker.sock:/var/run/docker.sock" docker-compose*.yml 2>/dev/null | grep -v "# monitoring"; then
        warn_test "Potentially risky volume mounts detected"
    else
        pass_test "No risky volume mounts detected"
    fi
    
    echo ""
}

test_ssl_configuration() {
    print_section "Validating SSL configuration"
    
    # Check Next.js security headers
    add_test
    if grep -q "Strict-Transport-Security" storefront/next.config.ts 2>/dev/null; then
        pass_test "HSTS header configured in Next.js"
    else
        warn_test "HSTS header not found in Next.js config"
    fi
    
    # Check for HTTPS enforcement
    add_test
    if grep -q "https://" .env.production 2>/dev/null; then
        pass_test "HTTPS URLs configured in production environment"
    else
        warn_test "HTTPS URLs not found in production configuration"
    fi
    
    echo ""
}

test_database_security() {
    print_section "Validating database security"
    
    # Check for strong database password
    add_test
    if [ -f ".env.production" ]; then
        source ".env.production" 2>/dev/null || true
        
        if [ -n "$POSTGRES_PASSWORD" ]; then
            # Check password strength
            local pwd_length=${#POSTGRES_PASSWORD}
            local has_upper=$(echo "$POSTGRES_PASSWORD" | grep -E '[A-Z]' > /dev/null && echo "yes" || echo "no")
            local has_lower=$(echo "$POSTGRES_PASSWORD" | grep -E '[a-z]' > /dev/null && echo "yes" || echo "no")
            local has_digit=$(echo "$POSTGRES_PASSWORD" | grep -E '[0-9]' > /dev/null && echo "yes" || echo "no")
            local has_special=$(echo "$POSTGRES_PASSWORD" | grep -E '[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]' > /dev/null && echo "yes" || echo "no")
            
            if [ $pwd_length -ge 12 ] && [ "$has_upper" = "yes" ] && [ "$has_lower" = "yes" ] && [ "$has_digit" = "yes" ]; then
                pass_test "Database password is strong"
            else
                fail_test "Database password is weak (needs 12+ chars, uppercase, lowercase, numbers)"
            fi
        else
            fail_test "Database password not configured"
        fi
    else
        fail_test "Cannot validate database password - .env.production not found"
    fi
    
    # Check for SSL enforcement in production
    add_test
    if grep -q "DATABASE_SSL=true" .env.production 2>/dev/null; then
        pass_test "Database SSL is enabled for production"
    else
        warn_test "Database SSL should be enabled for production"
    fi
    
    echo ""
}

test_payment_security() {
    print_section "Validating payment security"
    
    # Check Paysera configuration
    add_test
    if [ -f ".env.production" ]; then
        source ".env.production" 2>/dev/null || true
        
        if [ "$PAYSERA_TEST_MODE" = "false" ]; then
            pass_test "Paysera is configured for production mode"
        elif [ "$PAYSERA_TEST_MODE" = "true" ]; then
            warn_test "Paysera is still in test mode"
        else
            warn_test "Paysera test mode not explicitly set"
        fi
    fi
    
    # Check for production payment keys
    add_test
    if [ -n "$PAYSERA_PROJECT_ID" ] && [ -n "$PAYSERA_SIGN_PASSWORD" ]; then
        if [[ "$PAYSERA_PROJECT_ID" != "252103" ]]; then  # Development project ID
            pass_test "Production Paysera credentials configured"
        else
            warn_test "Still using development Paysera project ID"
        fi
    else
        fail_test "Paysera credentials not configured"
    fi
    
    echo ""
}

test_file_permissions() {
    print_section "Validating file permissions"
    
    # Check for world-readable sensitive files
    add_test
    local sensitive_files=(".env.production" ".env" "*.key" "*.pem")
    local permission_issues=false
    
    for pattern in "${sensitive_files[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ]; then
                local perms=$(stat -c "%a" "$file" 2>/dev/null || echo "000")
                if [ "${perms: -1}" != "0" ]; then
                    fail_test "File $file is world-readable (permissions: $perms)"
                    permission_issues=true
                fi
            fi
        done
    done
    
    if [ "$permission_issues" = false ]; then
        pass_test "No world-readable sensitive files detected"
    fi
    
    echo ""
}

test_monitoring_security() {
    print_section "Validating monitoring security"
    
    # Check Grafana admin password
    add_test
    if [ -f ".env.production" ]; then
        source ".env.production" 2>/dev/null || true
        
        if [ -n "$GRAFANA_ADMIN_PASSWORD" ]; then
            if [ "$GRAFANA_ADMIN_PASSWORD" = "admin123" ] || [ "$GRAFANA_ADMIN_PASSWORD" = "admin" ]; then
                fail_test "Grafana admin password is using default/weak password"
            else
                pass_test "Grafana admin password is configured"
            fi
        else
            warn_test "Grafana admin password not configured"
        fi
    fi
    
    echo ""
}

generate_security_report() {
    print_section "Security Report Summary"
    
    local percentage=$((SECURITY_SCORE * 100 / MAX_SCORE))
    
    echo -e "${BOLD}Security Score: ${SECURITY_SCORE}/${MAX_SCORE} (${percentage}%)${NC}"
    echo ""
    
    if [ $percentage -ge 90 ]; then
        print_success "EXCELLENT SECURITY - Ready for production deployment"
    elif [ $percentage -ge 75 ]; then
        print_warning "GOOD SECURITY - Address warnings before deployment"
    elif [ $percentage -ge 60 ]; then
        print_warning "MODERATE SECURITY - Fix critical issues before deployment"
    else
        print_error "POOR SECURITY - DO NOT deploy until critical issues are resolved"
    fi
    
    echo ""
    
    if [ ${#ERRORS[@]} -gt 0 ]; then
        echo -e "${BOLD}${RED}CRITICAL ISSUES (must fix before deployment):${NC}"
        for error in "${ERRORS[@]}"; do
            echo -e "${RED}• $error${NC}"
        done
        echo ""
    fi
    
    if [ ${#WARNINGS[@]} -gt 0 ]; then
        echo -e "${BOLD}${YELLOW}WARNINGS (should fix for better security):${NC}"
        for warning in "${WARNINGS[@]}"; do
            echo -e "${YELLOW}• $warning${NC}"
        done
        echo ""
    fi
    
    echo -e "${BOLD}RECOMMENDATIONS:${NC}"
    
    if [ ${#ERRORS[@]} -gt 0 ]; then
        echo "1. Fix all critical issues listed above"
        echo "2. Re-run this validation script"
        echo "3. Only deploy when security score is 90%+"
    elif [ $percentage -lt 90 ]; then
        echo "1. Address remaining warnings"
        echo "2. Consider implementing additional security measures"
        echo "3. Re-run validation after changes"
    else
        echo "1. Your deployment is ready from a security perspective"
        echo "2. Follow the deployment guide step by step"
        echo "3. Run post-deployment security tests"
    fi
    
    echo ""
}

# Main execution
main() {
    print_header
    
    # Change to project root directory
    cd "$(dirname "$0")/.."
    
    # Run all security tests
    test_hardcoded_secrets
    test_environment_variables
    test_cors_configuration
    test_docker_security
    test_ssl_configuration
    test_database_security
    test_payment_security
    test_file_permissions
    test_monitoring_security
    
    # Generate final report
    generate_security_report
    
    # Exit with error code if critical issues found
    if [ ${#ERRORS[@]} -gt 0 ]; then
        echo -e "${BOLD}${RED}❌ SECURITY VALIDATION FAILED${NC}"
        echo -e "${RED}Fix critical issues before deployment${NC}"
        exit 1
    else
        echo -e "${BOLD}${GREEN}✅ SECURITY VALIDATION PASSED${NC}"
        echo -e "${GREEN}Ready for secure deployment${NC}"
        exit 0
    fi
}

# Run main function
main "$@"