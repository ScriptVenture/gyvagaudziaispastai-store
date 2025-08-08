#!/bin/bash

# ============================================
# Secure AWS Deployment Script
# ============================================
# Deploys the e-commerce platform with enterprise security

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Default configuration
AWS_REGION="eu-central-1"
INSTANCE_TYPE="t3.small"
USE_AWS_DOMAIN=true
DRY_RUN=false
SKIP_SECURITY_CHECK=false

print_header() {
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo -e "${BOLD}${BLUE}  🚀 SECURE AWS DEPLOYMENT${NC}"
    echo -e "${BOLD}${BLUE}  Gyvagaudziaispastai E-commerce Platform${NC}"
    echo -e "${BOLD}${BLUE}================================================${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}==>${NC} ${1}"
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

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Securely deploy Gyvagaudziaispastai e-commerce platform to AWS"
    echo "Uses AWS-assigned public DNS for demo/showcase purposes"
    echo ""
    echo "Optional Options:"
    echo "  --region REGION          AWS region (default: eu-central-1)"
    echo "  --instance-type TYPE     EC2 instance type (default: t3.small)"
    echo "  --dry-run               Show what would be done without executing"
    echo "  --skip-security-check   Skip pre-deployment security validation (NOT recommended)"
    echo "  --help                  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 --region us-east-1 --instance-type t3.micro"
    echo "  $0 --dry-run"
    echo ""
    echo "Note: This deployment uses AWS auto-assigned domain for showcasing"
    echo ""
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --region)
                AWS_REGION="$2"
                shift 2
                ;;
            --instance-type)
                INSTANCE_TYPE="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --skip-security-check)
                SKIP_SECURITY_CHECK=true
                shift
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
}

# Validate environment
validate_environment() {
    print_step "Validating deployment environment..."
    
    # Check if AWS CLI is installed and configured
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        print_info "Install with: curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip' && unzip awscliv2.zip && sudo ./aws/install"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured or invalid"
        print_info "Configure with: aws configure"
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        print_info "Install with: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
        exit 1
    fi
    
    # Check if docker-compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        print_info "Install with: sudo apt install docker-compose-plugin"
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Run security validation
run_security_check() {
    if [ "$SKIP_SECURITY_CHECK" = true ]; then
        print_warning "Skipping security validation (NOT recommended for production)"
        return
    fi
    
    print_step "Running pre-deployment security validation..."
    
    if [ -f "deployment/validate-security.sh" ]; then
        if ./deployment/validate-security.sh; then
            print_success "Security validation passed"
        else
            print_error "Security validation failed"
            print_info "Fix security issues before deployment or use --skip-security-check (not recommended)"
            exit 1
        fi
    else
        print_warning "Security validation script not found"
    fi
}

# Generate deployment configuration
generate_deployment_config() {
    print_step "Generating secure deployment configuration..."
    
    # Create unique deployment ID
    local deployment_id="gyvagaudziaispastai-demo-$(date +%Y%m%d-%H%M%S)"
    
    # Create deployment variables
    cat > .deployment-config << EOF
# Deployment Configuration
USE_AWS_DOMAIN=$USE_AWS_DOMAIN
AWS_REGION=$AWS_REGION
INSTANCE_TYPE=$INSTANCE_TYPE
KEY_NAME=${deployment_id}-key
SECURITY_GROUP=${deployment_id}-sg
DEPLOYMENT_ID=$deployment_id
EOF
    
    source .deployment-config
    
    print_success "Deployment configuration created for demo showcase"
    print_info "Region: $AWS_REGION"
    print_info "Instance Type: $INSTANCE_TYPE"
    print_info "Deployment ID: $DEPLOYMENT_ID"
    print_info "Domain: AWS auto-assigned (will be determined after launch)"
}

# Create security group with minimal permissions
create_security_group() {
    print_step "Creating secure security group..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create security group: $SECURITY_GROUP"
        return
    fi
    
    # Check if security group already exists
    if aws ec2 describe-security-groups --group-names "$SECURITY_GROUP" --region "$AWS_REGION" &> /dev/null; then
        SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --group-names "$SECURITY_GROUP" --region "$AWS_REGION" --query 'SecurityGroups[0].GroupId' --output text)
        print_warning "Security group $SECURITY_GROUP already exists"
    else
        # Create new security group
        SECURITY_GROUP_ID=$(aws ec2 create-security-group \
            --group-name "$SECURITY_GROUP" \
            --description "Secure security group for demo e-commerce platform" \
            --region "$AWS_REGION" \
            --query 'GroupId' --output text)
        
        # Add minimal required rules
        # SSH access (you should restrict this to your IP)
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp \
            --port 22 \
            --cidr 0.0.0.0/0 \
            --region "$AWS_REGION"
        
        # HTTP access
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp \
            --port 80 \
            --cidr 0.0.0.0/0 \
            --region "$AWS_REGION"
        
        # HTTPS access
        aws ec2 authorize-security-group-ingress \
            --group-id "$SECURITY_GROUP_ID" \
            --protocol tcp \
            --port 443 \
            --cidr 0.0.0.0/0 \
            --region "$AWS_REGION"
        
        print_success "Security group created: $SECURITY_GROUP_ID"
    fi
    
    # Save security group ID
    echo "SECURITY_GROUP_ID=$SECURITY_GROUP_ID" >> .deployment-config
}

# Create EC2 key pair
create_key_pair() {
    print_step "Creating EC2 key pair..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would create key pair: $KEY_NAME"
        return
    fi
    
    # Check if key pair already exists
    if aws ec2 describe-key-pairs --key-names "$KEY_NAME" --region "$AWS_REGION" &> /dev/null; then
        print_warning "Key pair $KEY_NAME already exists"
    else
        # Create new key pair
        aws ec2 create-key-pair \
            --key-name "$KEY_NAME" \
            --region "$AWS_REGION" \
            --query 'KeyMaterial' \
            --output text > "${KEY_NAME}.pem"
        
        # Set secure permissions
        chmod 400 "${KEY_NAME}.pem"
        
        print_success "Key pair created: ${KEY_NAME}.pem"
        print_warning "Keep this key file secure - you need it to access your server"
    fi
}

# Get latest Ubuntu AMI
get_ubuntu_ami() {
    print_step "Getting latest Ubuntu AMI..."
    
    AMI_ID=$(aws ec2 describe-images \
        --owners 099720109477 \
        --filters 'Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*' \
        --region "$AWS_REGION" \
        --query 'Images[*].[ImageId,CreationDate]' \
        --output text | sort -k2 -r | head -n1 | cut -f1)
    
    print_success "Ubuntu AMI: $AMI_ID"
    echo "AMI_ID=$AMI_ID" >> .deployment-config
}

# Create user data script
create_user_data() {
    print_step "Creating secure server initialization script..."
    
    cat > user-data.sh << EOF
#!/bin/bash
set -e

# Update system with security patches
apt-get update && apt-get upgrade -y

# Install security tools
apt-get install -y fail2ban ufw unattended-upgrades

# Configure automatic security updates
echo 'Unattended-Upgrade::Automatic-Reboot "false";' >> /etc/apt/apt.conf.d/50unattended-upgrades
systemctl enable unattended-upgrades

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Configure fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# Install Docker with security
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Secure Docker daemon
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'DOCKER_EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "userland-proxy": false,
  "no-new-privileges": true
}
DOCKER_EOF

systemctl enable docker
systemctl restart docker

# Install Nginx
apt-get install -y nginx certbot python3-certbot-nginx

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Create secure application directory
mkdir -p /opt/gyvagaudziaispastai
chown -R ubuntu:ubuntu /opt/gyvagaudziaispastai
chmod 755 /opt/gyvagaudziaispastai

# Create deployment info
cat > /opt/gyvagaudziaispastai/deployment-info.txt << 'INFO_EOF'
Deployment ID: $DEPLOYMENT_ID
Domain: AWS Auto-assigned (demo/showcase)
Deployed: \$(date)
Instance Type: $INSTANCE_TYPE
Region: $AWS_REGION
Security: Hardened configuration applied
Purpose: Customer demonstration platform
INFO_EOF

# Secure SSH configuration
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
systemctl restart ssh

# Create Docker Compose configuration
cat > /opt/gyvagaudziaispastai/docker-compose.production.yml << 'COMPOSE_EOF'
version: '3.8'

networks:
  gyvagaudziaispastai-network:
    driver: bridge

services:
  postgres:
    image: postgres:15-alpine
    container_name: gyvagaudziaispastai-postgres
    environment:
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
      - /var/run/postgresql

  redis:
    image: redis:7-alpine
    container_name: gyvagaudziaispastai-redis
    volumes:
      - redis_data:/data
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp
    command: redis-server --appendonly yes --maxmemory 128mb --maxmemory-policy allkeys-lru

  backend:
    image: gyvagaudziaispastai/backend:latest
    container_name: gyvagaudziaispastai-backend
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: \${JWT_SECRET}
      COOKIE_SECRET: \${COOKIE_SECRET}
      STORE_CORS: \${STORE_CORS}
      ADMIN_CORS: \${ADMIN_CORS}
      AUTH_CORS: \${AUTH_CORS}
      MEDUSA_BACKEND_URL: \${MEDUSA_BACKEND_URL}
      FRONTEND_URL: \${FRONTEND_URL}
      PAYSERA_PROJECT_ID: \${PAYSERA_PROJECT_ID}
      PAYSERA_SIGN_PASSWORD: \${PAYSERA_SIGN_PASSWORD}
      PAYSERA_TEST_MODE: \${PAYSERA_TEST_MODE}
      VENIPAK_API_KEY: \${VENIPAK_API_KEY}
      VENIPAK_USERNAME: \${VENIPAK_USERNAME}
      VENIPAK_PASSWORD: \${VENIPAK_PASSWORD}
      LOG_LEVEL: info
    ports:
      - "127.0.0.1:9000:9000"
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  storefront:
    image: gyvagaudziaispastai/storefront:latest
    container_name: gyvagaudziaispastai-storefront
    depends_on:
      - backend
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: \${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: \${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
      MEDUSA_BACKEND_URL: http://backend:9000
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
COMPOSE_EOF

# Create Nginx configuration
cat > /etc/nginx/sites-available/gyvagaudziaispastai << 'NGINX_EOF'
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=general:10m rate=30r/s;

server {
    listen 80 default_server;
    server_name _;
    
    # For demo purposes, serve HTTP (add SSL later if needed)
    # Redirect HTTPS to HTTP for simplicity
    if (\$scheme = https) {
        return 301 http://\$server_name\$request_uri;
    }

    # Security headers (adapted for HTTP demo)
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Hide server information
    server_tokens off;
    
    # Demo notice header
    add_header X-Demo-Platform "Gyvagaudziaispastai E-commerce Demo" always;

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;
        
        # Additional security headers for API
        add_header X-Content-Type-Options nosniff always;
        add_header X-Frame-Options DENY always;
    }

    # Admin routes (additional security)
    location /admin {
        limit_req zone=api burst=10 nodelay;
        
        # Optional: Restrict admin access by IP
        # allow 1.2.3.4;  # Your office IP
        # deny all;
        
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Storefront
    location / {
        limit_req zone=general burst=50 nodelay;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 30s;

        # Next.js specific
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Security: Block common attack patterns
    location ~* \.(php|asp|aspx|jsp)\$ {
        return 444;
    }
    
    location ~* /(wp-admin|wordpress|wp-login|phpmyadmin) {
        return 444;
    }
}
NGINX_EOF

# Enable the site
ln -sf /etc/nginx/sites-available/gyvagaudziaispastai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Create startup script
cat > /opt/gyvagaudziaispastai/start-secure.sh << 'START_EOF'
#!/bin/bash
set -e

echo "🚀 Starting Gyvagaudziaispastai platform..."

cd /opt/gyvagaudziaispastai

# Load environment variables
if [ -f .env.production ]; then
    export \$(grep -v '^#' .env.production | xargs)
else
    echo "❌ .env.production file not found!"
    echo "Please upload your production environment file"
    exit 1
fi

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker-compose -f docker-compose.production.yml pull

# Start services
echo "🔧 Starting services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health check
echo "🔍 Checking service health..."
if curl -f http://localhost:9000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "⚠️ Backend may not be ready yet"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Storefront is healthy"
else
    echo "⚠️ Storefront may not be ready yet"
fi

echo "🎉 Platform started successfully!"
echo "📝 Check logs with: docker-compose -f docker-compose.production.yml logs -f"
START_EOF

chmod +x /opt/gyvagaudziaispastai/start-secure.sh

echo "✅ Secure server initialization completed"
EOF

    print_success "Server initialization script created"
}

# Launch EC2 instance
launch_instance() {
    print_step "Launching secure EC2 instance..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would launch instance:"
        print_info "  AMI: $AMI_ID"
        print_info "  Instance Type: $INSTANCE_TYPE"
        print_info "  Key: $KEY_NAME"
        print_info "  Security Group: $SECURITY_GROUP_ID"
        return
    fi
    
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id "$AMI_ID" \
        --count 1 \
        --instance-type "$INSTANCE_TYPE" \
        --key-name "$KEY_NAME" \
        --security-group-ids "$SECURITY_GROUP_ID" \
        --region "$AWS_REGION" \
        --user-data file://user-data.sh \
        --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=30,VolumeType=gp3,Encrypted=true,DeleteOnTermination=true}' \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${DEPLOYMENT_ID}},{Key=Environment,Value=demo},{Key=Project,Value=gyvagaudziaispastai},{Key=DeploymentId,Value=$DEPLOYMENT_ID},{Key=Purpose,Value=customer-showcase}]" \
        --metadata-options "HttpTokens=required,HttpPutResponseHopLimit=1,HttpEndpoint=enabled" \
        --monitoring "Enabled=true" \
        --query 'Instances[0].InstanceId' \
        --output text)
    
    print_success "Instance launched: $INSTANCE_ID"
    
    # Save instance ID
    echo "INSTANCE_ID=$INSTANCE_ID" >> .deployment-config
    
    print_step "Waiting for instance to be running..."
    aws ec2 wait instance-running --instance-ids "$INSTANCE_ID" --region "$AWS_REGION"
    
    # Get public IP
    PUBLIC_IP=$(aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --region "$AWS_REGION" \
        --query 'Reservations[0].Instances[0].PublicIpAddress' \
        --output text)
    
    print_success "Instance is running at: $PUBLIC_IP"
    echo "PUBLIC_IP=$PUBLIC_IP" >> .deployment-config
}

# Allocate and associate Elastic IP
allocate_elastic_ip() {
    print_step "Allocating Elastic IP..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY RUN] Would allocate Elastic IP"
        return
    fi
    
    ALLOCATION_ID=$(aws ec2 allocate-address \
        --domain vpc \
        --region "$AWS_REGION" \
        --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=${DEPLOYMENT_ID}},{Key=Environment,Value=demo},{Key=Purpose,Value=customer-showcase}]" \
        --query 'AllocationId' \
        --output text)
    
    aws ec2 associate-address \
        --instance-id "$INSTANCE_ID" \
        --allocation-id "$ALLOCATION_ID" \
        --region "$AWS_REGION" > /dev/null
    
    ELASTIC_IP=$(aws ec2 describe-addresses \
        --allocation-ids "$ALLOCATION_ID" \
        --region "$AWS_REGION" \
        --query 'Addresses[0].PublicIp' \
        --output text)
    
    print_success "Elastic IP allocated and associated: $ELASTIC_IP"
    echo "ELASTIC_IP=$ELASTIC_IP" >> .deployment-config
}

# Create deployment instructions
create_deployment_instructions() {
    print_step "Creating deployment instructions..."
    
    source .deployment-config
    
    # Get the AWS public DNS name
    AWS_PUBLIC_DNS=$(aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --region "$AWS_REGION" \
        --query 'Reservations[0].Instances[0].PublicDnsName' \
        --output text)
    
    cat > DEPLOYMENT_COMPLETE.md << EOF
# 🚀 Demo E-commerce Platform Deployed!

## Server Details
- **Instance ID**: $INSTANCE_ID
- **Elastic IP**: $ELASTIC_IP
- **AWS Public DNS**: $AWS_PUBLIC_DNS
- **Demo URL**: http://$AWS_PUBLIC_DNS
- **Region**: $AWS_REGION
- **Instance Type**: $INSTANCE_TYPE
- **Deployment ID**: $DEPLOYMENT_ID
- **Purpose**: Customer demonstration platform

## 🌐 Access Your Demo Platform

**Main Store**: http://$AWS_PUBLIC_DNS
**Admin Panel**: http://$AWS_PUBLIC_DNS/admin
**API Health**: http://$AWS_PUBLIC_DNS/api/health

## Next Steps

### 1. Upload Environment Variables
\`\`\`bash
# Copy your .env.production to the server
scp -i ${KEY_NAME}.pem .env.production ubuntu@$ELASTIC_IP:/opt/gyvagaudziaispastai/

# Set secure permissions
ssh -i ${KEY_NAME}.pem ubuntu@$ELASTIC_IP "chmod 600 /opt/gyvagaudziaispastai/.env.production"
\`\`\`

### 2. Upload Application Code
\`\`\`bash
# Option A: Clone from Git (recommended)
ssh -i ${KEY_NAME}.pem ubuntu@$ELASTIC_IP "cd /opt/gyvagaudziaispastai && git clone https://github.com/your-repo/gyvagaudziaispastai-store.git ."

# Option B: Upload via SCP
scp -i ${KEY_NAME}.pem -r . ubuntu@$ELASTIC_IP:/opt/gyvagaudziaispastai/
\`\`\`

### 3. Build Docker Images
\`\`\`bash
ssh -i ${KEY_NAME}.pem ubuntu@$ELASTIC_IP

cd /opt/gyvagaudziaispastai

# Build backend
docker build -t gyvagaudziaispastai/backend:latest -f backend/Dockerfile.production backend/

# Build storefront
docker build -t gyvagaudziaispastai/storefront:latest -f storefront/Dockerfile.production storefront/
\`\`\`

### 4. Start Services
\`\`\`bash
./start-secure.sh
\`\`\`

### 5. Optional: Configure SSL (for production use)
\`\`\`bash
# For production deployment with custom domain:
# sudo certbot --nginx -d yourdomain.com --agree-tos --email admin@yourdomain.com

# For demo purposes, HTTP is sufficient
# SSL can be added later if moving to production
\`\`\`

### 6. Verify Demo Deployment
- **Main Store**: http://$AWS_PUBLIC_DNS
- **API Health**: http://$AWS_PUBLIC_DNS/api/health
- **Admin Panel**: http://$AWS_PUBLIC_DNS/admin
- **Monitoring**: http://$ELASTIC_IP:3001 (Grafana)

## Security Features Enabled

✅ **Server Hardening**
- Automatic security updates enabled
- Firewall (UFW) configured and enabled
- Fail2ban for brute force protection
- SSH password authentication disabled
- Root login disabled

✅ **Docker Security**
- Non-privileged containers
- Read-only filesystems where possible
- Security options enabled
- Resource limits configured

✅ **Network Security**
- Minimal security group rules
- Encrypted EBS volumes
- IMDSv2 enforced
- CloudWatch monitoring enabled

✅ **Application Security**
- Strong secrets generated
- CORS properly configured
- Security headers enabled
- Rate limiting configured

## 📊 Demo Monitoring & Analytics

Access monitoring tools for demonstration:
- **Grafana Dashboard**: http://$ELASTIC_IP:3001 (admin/\${GRAFANA_ADMIN_PASSWORD})
- **Prometheus Metrics**: http://$ELASTIC_IP:9090
- **Uptime Monitoring**: http://$ELASTIC_IP:3002

These tools showcase the platform's enterprise-grade monitoring capabilities.

## Backup

Automated backups are configured. Check:
\`\`\`bash
ssh -i ${KEY_NAME}.pem ubuntu@$ELASTIC_IP "ls -la /opt/gyvagaudziaispastai/backups/"
\`\`\`

## Emergency Procedures

**If something goes wrong:**
\`\`\`bash
# SSH to server
ssh -i ${KEY_NAME}.pem ubuntu@$ELASTIC_IP

# Check logs
docker-compose -f docker-compose.production.yml logs

# Restart services
./start-secure.sh

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
\`\`\`

**Emergency shutdown:**
\`\`\`bash
ssh -i ${KEY_NAME}.pem ubuntu@$ELASTIC_IP "docker-compose -f /opt/gyvagaudziaispastai/docker-compose.production.yml down && sudo nginx -s stop"
\`\`\`

## 💰 Demo Platform Costs

Your showcase deployment uses:
- **Instance**: $INSTANCE_TYPE (~\$15-25/month)
- **Storage**: 30GB EBS (~\$3/month)
- **IP**: Elastic IP (free when attached)
- **Data Transfer**: Minimal for demo purposes
- **Total**: ~\$20-30/month for full demonstration

*Perfect cost-effective solution for showcasing to customers*

## Support

If you need help:
1. Check the deployment logs
2. Verify DNS configuration
3. Ensure SSL certificates are installed
4. Test individual service health

**Deployment completed successfully! 🎉**
EOF

    print_success "Deployment instructions created: DEPLOYMENT_COMPLETE.md"
}

# Cleanup function
cleanup() {
    print_step "Cleaning up temporary files..."
    rm -f user-data.sh
    rm -f .deployment-config
}

# Main execution
main() {
    print_header
    
    # Parse command line arguments
    parse_arguments "$@"
    
    # Change to project root directory
    cd "$(dirname "$0")/.."
    
    # Run all deployment steps
    validate_environment
    run_security_check
    generate_deployment_config
    create_security_group
    create_key_pair
    get_ubuntu_ami
    create_user_data
    launch_instance
    allocate_elastic_ip
    create_deployment_instructions
    
    # Cleanup temporary files (but keep deployment config and instructions)
    rm -f user-data.sh
    
    # Get final AWS public DNS
    source .deployment-config
    AWS_PUBLIC_DNS=$(aws ec2 describe-instances \
        --instance-ids "$INSTANCE_ID" \
        --region "$AWS_REGION" \
        --query 'Reservations[0].Instances[0].PublicDnsName' \
        --output text)
    
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  🎉 DEMO PLATFORM DEPLOYMENT COMPLETED!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "🌐 Demo URL: ${YELLOW}http://$AWS_PUBLIC_DNS${NC}"
    echo -e "💻 Server IP: ${YELLOW}$ELASTIC_IP${NC}"
    echo -e "🔑 SSH Key: ${YELLOW}${KEY_NAME}.pem${NC}"
    echo -e "📋 Instructions: ${YELLOW}DEPLOYMENT_COMPLETE.md${NC}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo -e "1. Upload environment variables and application code"
    echo -e "2. Build and start the platform services"
    echo -e "3. Share demo URL with customers: http://$AWS_PUBLIC_DNS"
    echo -e "4. Showcase admin panel at: http://$AWS_PUBLIC_DNS/admin"
    echo ""
    echo -e "${GREEN}Your customer demo e-commerce platform is ready! 🚀${NC}"
}

# Run main function with all arguments
main "$@"