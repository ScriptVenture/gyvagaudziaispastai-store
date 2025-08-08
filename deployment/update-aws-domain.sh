#!/bin/bash

# ============================================
# AWS Domain Update Script
# ============================================
# Updates environment variables with AWS auto-assigned domain

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
    echo -e "${BOLD}${BLUE}  🌐 AWS DOMAIN UPDATE UTILITY${NC}"
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

# Get AWS public DNS from deployment config or EC2 instance
get_aws_public_dns() {
    local instance_id=""
    local region=""
    
    # Try to get from deployment config first
    if [ -f ".deployment-config" ]; then
        source .deployment-config
        instance_id="$INSTANCE_ID"
        region="$AWS_REGION"
    fi
    
    # If not found, ask user
    if [ -z "$instance_id" ]; then
        echo -e "${YELLOW}Enter your EC2 Instance ID:${NC}"
        read -r instance_id
    fi
    
    if [ -z "$region" ]; then
        echo -e "${YELLOW}Enter your AWS Region (default: eu-central-1):${NC}"
        read -r region
        region=${region:-"eu-central-1"}
    fi
    
    # Get public DNS name
    local public_dns=$(aws ec2 describe-instances \
        --instance-ids "$instance_id" \
        --region "$region" \
        --query 'Reservations[0].Instances[0].PublicDnsName' \
        --output text 2>/dev/null)
    
    if [ "$public_dns" = "None" ] || [ -z "$public_dns" ]; then
        print_error "Could not retrieve public DNS name for instance $instance_id"
        return 1
    fi
    
    echo "$public_dns"
}

# Update environment file with AWS domain
update_env_file() {
    local aws_domain="$1"
    local env_file="${2:-.env.production}"
    
    if [ ! -f "$env_file" ]; then
        print_error "Environment file $env_file not found"
        return 1
    fi
    
    print_info "Updating $env_file with AWS domain: $aws_domain"
    
    # Create backup
    cp "$env_file" "$env_file.backup.$(date +%Y%m%d-%H%M%S)"
    print_success "Created backup of $env_file"
    
    # Update all AUTO_ASSIGNED_FROM_AWS entries
    sed -i "s/AUTO_ASSIGNED_FROM_AWS/$aws_domain/g" "$env_file"
    
    # Verify updates
    local updated_count=$(grep -c "$aws_domain" "$env_file")
    print_success "Updated $updated_count entries with AWS domain"
}

# Upload updated environment to server
upload_to_server() {
    local aws_domain="$1"
    local env_file="${2:-.env.production}"
    local ssh_key=""
    local server_ip=""
    
    # Try to get server details from deployment config
    if [ -f ".deployment-config" ]; then
        source .deployment-config
        ssh_key="${KEY_NAME}.pem"
        server_ip="$ELASTIC_IP"
    fi
    
    # Ask for details if not found
    if [ -z "$ssh_key" ] || [ ! -f "$ssh_key" ]; then
        echo -e "${YELLOW}Enter path to your SSH key file:${NC}"
        read -r ssh_key
    fi
    
    if [ -z "$server_ip" ]; then
        echo -e "${YELLOW}Enter your server IP address:${NC}"
        read -r server_ip
    fi
    
    # Upload updated environment file
    print_info "Uploading updated environment file to server..."
    
    if scp -i "$ssh_key" "$env_file" "ubuntu@$server_ip:/opt/gyvagaudziaispastai/" 2>/dev/null; then
        print_success "Environment file uploaded successfully"
    else
        print_error "Failed to upload environment file"
        print_info "Manual upload command:"
        echo "scp -i $ssh_key $env_file ubuntu@$server_ip:/opt/gyvagaudziaispastai/"
        return 1
    fi
    
    # Set secure permissions
    if ssh -i "$ssh_key" "ubuntu@$server_ip" "chmod 600 /opt/gyvagaudziaispastai/$env_file" 2>/dev/null; then
        print_success "Secure permissions set on server"
    else
        print_error "Failed to set permissions on server"
    fi
}

# Restart services with updated environment
restart_services() {
    local ssh_key="$1"
    local server_ip="$2"
    
    print_info "Restarting services with updated environment..."
    
    # Connect and restart services
    ssh -i "$ssh_key" "ubuntu@$server_ip" << 'EOF'
cd /opt/gyvagaudziaispastai

# Load updated environment
if [ -f .env.production ]; then
    export $(grep -v '^#' .env.production | xargs)
fi

# Restart services
if [ -f docker-compose.production.yml ]; then
    docker-compose -f docker-compose.production.yml down
    docker-compose -f docker-compose.production.yml up -d
    
    echo "Services restarted with updated domain configuration"
else
    echo "Warning: docker-compose.production.yml not found"
fi
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Services restarted successfully"
    else
        print_error "Failed to restart services"
    fi
}

# Main execution
main() {
    print_header
    
    # Get AWS public DNS
    print_info "Retrieving AWS public DNS name..."
    local aws_domain=$(get_aws_public_dns)
    
    if [ $? -ne 0 ] || [ -z "$aws_domain" ]; then
        print_error "Failed to retrieve AWS domain"
        exit 1
    fi
    
    print_success "AWS Public DNS: $aws_domain"
    
    # Update local environment file
    update_env_file "$aws_domain"
    
    # Ask if user wants to upload to server
    echo ""
    echo -e "${YELLOW}Upload updated environment to server? (y/N)${NC}"
    read -r upload_choice
    
    if [[ $upload_choice =~ ^[Yy]$ ]]; then
        upload_to_server "$aws_domain"
        
        # Ask if user wants to restart services
        echo ""
        echo -e "${YELLOW}Restart services with updated configuration? (y/N)${NC}"
        read -r restart_choice
        
        if [[ $restart_choice =~ ^[Yy]$ ]]; then
            # Get connection details
            source .deployment-config 2>/dev/null || true
            restart_services "${KEY_NAME}.pem" "$ELASTIC_IP"
        fi
    fi
    
    echo ""
    print_success "Domain update completed!"
    echo ""
    echo -e "${BOLD}Your demo platform is now accessible at:${NC}"
    echo -e "🌐 Main Store: ${GREEN}https://$aws_domain${NC}"
    echo -e "⚙️  Admin Panel: ${GREEN}https://$aws_domain/app${NC}"
    echo -e "📊 Monitoring: ${GREEN}http://$([ -f .deployment-config ] && source .deployment-config && echo $ELASTIC_IP || echo 'SERVER_IP'):3001${NC}"
    echo ""
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Update environment variables with AWS auto-assigned domain"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo ""
    echo "This script:"
    echo "1. Retrieves the AWS public DNS name from your EC2 instance"
    echo "2. Updates .env.production with the correct domain"
    echo "3. Optionally uploads the updated file to your server"
    echo "4. Optionally restarts services with the new configuration"
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
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main "$@"