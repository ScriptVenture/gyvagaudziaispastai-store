#!/bin/bash

# =================================================================
# SIMPLE AWS DEPLOYMENT SCRIPT for Gyvagaudziaispastai Store
# Uses AWS App Runner for easy container deployment
# =================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
PROJECT_NAME="gyvagaudziaispastai"
ECR_BACKEND_REPO="${PROJECT_NAME}/backend"
ECR_STOREFRONT_REPO="${PROJECT_NAME}/storefront"

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

# Check if AWS CLI is configured
check_aws_config() {
    print_step "Checking AWS configuration..."
    
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        print_error "AWS CLI not configured. Run 'aws configure' first."
        exit 1
    fi
    
    print_success "AWS CLI configured"
}

# Create key pair
create_key_pair() {
    print_step "Creating EC2 key pair..."
    
    if aws ec2 describe-key-pairs --key-names $KEY_NAME > /dev/null 2>&1; then
        print_warning "Key pair $KEY_NAME already exists"
    else
        aws ec2 create-key-pair --key-name $KEY_NAME --query 'KeyMaterial' --output text > $KEY_NAME.pem
        chmod 400 $KEY_NAME.pem
        print_success "Key pair created: $KEY_NAME.pem"
    fi
}

# Create security group
create_security_group() {
    print_step "Creating security group..."
    
    if aws ec2 describe-security-groups --group-names $SECURITY_GROUP > /dev/null 2>&1; then
        SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --group-names $SECURITY_GROUP --query 'SecurityGroups[0].GroupId' --output text)
        print_warning "Security group $SECURITY_GROUP already exists"
    else
        SECURITY_GROUP_ID=$(aws ec2 create-security-group \
            --group-name $SECURITY_GROUP \
            --description "Gyvagaudziaispastai security group" \
            --query 'GroupId' --output text)
        
        # Add rules
        aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
        aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
        aws ec2 authorize-security-group-ingress --group-id $SECURITY_GROUP_ID --protocol tcp --port 443 --cidr 0.0.0.0/0
        
        print_success "Security group created: $SECURITY_GROUP_ID"
    fi
}

# Get latest Ubuntu AMI
get_ubuntu_ami() {
    print_step "Getting latest Ubuntu AMI..."
    
    AMI_ID=$(aws ec2 describe-images \
        --owners 099720109477 \
        --filters 'Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*' \
        --query 'Images[*].[ImageId,CreationDate]' --output text | sort -k2 -r | head -n1 | cut -f1)
    
    print_success "Ubuntu AMI: $AMI_ID"
}

# Create user data script
create_user_data() {
    print_step "Creating user data script..."
    
    cat > user-data.sh << 'EOF'
#!/bin/bash
set -e

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
apt-get install -y nginx certbot python3-certbot-nginx

# Install Git and Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y git nodejs

# Create app directory
mkdir -p /opt/gyvagaudziaispastai
chown -R ubuntu:ubuntu /opt/gyvagaudziaispastai

# Create Docker Compose file
cat > /opt/gyvagaudziaispastai/docker-compose.yml << 'COMPOSE_EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: gyvagaudziaispastai-postgres
    environment:
      POSTGRES_DB: gyvagaudziaispastai
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: gyvagaudziaispastai-redis
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    command: redis-server --appendonly yes

  backend:
    image: gyvagaudziaispastai/backend:latest
    container_name: gyvagaudziaispastai-backend
    depends_on:
      - postgres
      - redis
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://medusa:${POSTGRES_PASSWORD}@postgres:5432/gyvagaudziaispastai
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      PAYSERA_PROJECT_ID: ${PAYSERA_PROJECT_ID}
      PAYSERA_SIGN_PASSWORD: ${PAYSERA_SIGN_PASSWORD}
      VENIPAK_API_KEY: ${VENIPAK_API_KEY}
      VENIPAK_USERNAME: ${VENIPAK_USERNAME}
      VENIPAK_PASSWORD: ${VENIPAK_PASSWORD}
      STORE_CORS: https://${DOMAIN}
      ADMIN_CORS: https://${DOMAIN}
      AUTH_CORS: https://${DOMAIN}
      MEDUSA_BACKEND_URL: https://${DOMAIN}
      FRONTEND_URL: https://${DOMAIN}
    ports:
      - "9000:9000"
    restart: unless-stopped

  storefront:
    image: gyvagaudziaispastai/storefront:latest
    container_name: gyvagaudziaispastai-storefront
    depends_on:
      - backend
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: https://${DOMAIN}
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: ${MEDUSA_PUBLISHABLE_KEY}
      MEDUSA_BACKEND_URL: http://backend:9000
    ports:
      - "3000:3000"
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
COMPOSE_EOF

# Create Nginx config
cat > /etc/nginx/sites-available/gyvagaudziaispastai << 'NGINX_EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name DOMAIN_PLACEHOLDER;

    # SSL configuration will be handled by certbot

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy strict-origin-when-cross-origin;

    # Storefront
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin panel
    location /admin {
        proxy_pass http://localhost:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

# Create startup script
cat > /opt/gyvagaudziaispastai/start.sh << 'START_EOF'
#!/bin/bash
set -e

cd /opt/gyvagaudziaispastai

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Start services
docker-compose up -d

echo "Services started successfully!"
echo "Backend: http://localhost:9000"
echo "Storefront: http://localhost:3000"
START_EOF

chmod +x /opt/gyvagaudziaispastai/start.sh

# Create backup script
cat > /opt/gyvagaudziaispastai/backup.sh << 'BACKUP_EOF'
#!/bin/bash
set -e

BACKUP_DIR="/opt/gyvagaudziaispastai/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker exec gyvagaudziaispastai-postgres pg_dump -U medusa gyvagaudziaispastai | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Backup Redis
docker exec gyvagaudziaispastai-redis redis-cli BGSAVE
docker cp gyvagaudziaispastai-redis:/data/dump.rdb $BACKUP_DIR/redis_backup_$DATE.rdb

# Keep only last 7 backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
BACKUP_EOF

chmod +x /opt/gyvagaudziaispastai/backup.sh

# Setup cron for daily backups
echo "0 2 * * * /opt/gyvagaudziaispastai/backup.sh" | crontab -

# Start Docker service
systemctl enable docker
systemctl start docker

echo "Server setup completed!"
echo "Next steps:"
echo "1. Copy your application code to /opt/gyvagaudziaispastai/"
echo "2. Create .env file with production secrets"
echo "3. Build and tag Docker images"
echo "4. Run ./start.sh to start services"
echo "5. Configure SSL with: certbot --nginx -d your-domain.com"
EOF

    print_success "User data script created"
}

# Launch EC2 instance
launch_instance() {
    print_step "Launching EC2 instance..."
    
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id $AMI_ID \
        --count 1 \
        --instance-type $INSTANCE_TYPE \
        --key-name $KEY_NAME \
        --security-group-ids $SECURITY_GROUP_ID \
        --user-data file://user-data.sh \
        --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=30,VolumeType=gp3,Encrypted=true}' \
        --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=gyvagaudziaispastai-server}]' \
        --query 'Instances[0].InstanceId' --output text)
    
    print_success "Instance launched: $INSTANCE_ID"
    
    print_step "Waiting for instance to be running..."
    aws ec2 wait instance-running --instance-ids $INSTANCE_ID
    
    # Get public IP
    PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID \
        --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
    
    print_success "Instance is running at: $PUBLIC_IP"
}

# Allocate and associate Elastic IP
allocate_elastic_ip() {
    print_step "Allocating Elastic IP..."
    
    ALLOCATION_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
    aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOCATION_ID
    
    ELASTIC_IP=$(aws ec2 describe-addresses --allocation-ids $ALLOCATION_ID \
        --query 'Addresses[0].PublicIp' --output text)
    
    print_success "Elastic IP allocated and associated: $ELASTIC_IP"
}

# Create deployment instructions
create_deployment_guide() {
    print_step "Creating deployment guide..."
    
    cat > DEPLOYMENT_INSTRUCTIONS.md << EOF
# Deployment Instructions

## Server Details
- **Instance ID**: $INSTANCE_ID
- **Public IP**: $ELASTIC_IP
- **Instance Type**: $INSTANCE_TYPE
- **Region**: $AWS_REGION

## Next Steps

### 1. Connect to Server
\`\`\`bash
ssh -i $KEY_NAME.pem ubuntu@$ELASTIC_IP
\`\`\`

### 2. Create Environment File
\`\`\`bash
cd /opt/gyvagaudziaispastai
sudo nano .env
\`\`\`

Add the following (replace with your values):
\`\`\`env
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_jwt_secret_256_bits_minimum
COOKIE_SECRET=your_cookie_secret_256_bits_minimum
PAYSERA_PROJECT_ID=your_paysera_project_id
PAYSERA_SIGN_PASSWORD=your_paysera_sign_password
VENIPAK_API_KEY=your_venipak_api_key
VENIPAK_USERNAME=your_venipak_username
VENIPAK_PASSWORD=your_venipak_password
MEDUSA_PUBLISHABLE_KEY=your_medusa_publishable_key
DOMAIN=$DOMAIN
\`\`\`

### 3. Update DNS Records
Point your domain to: **$ELASTIC_IP**

### 4. Upload Application Code
\`\`\`bash
# Clone your repository or upload files
git clone https://github.com/your-repo/gyvagaudziaispastai-store.git /tmp/app
sudo cp -r /tmp/app/* /opt/gyvagaudziaispastai/
sudo chown -R ubuntu:ubuntu /opt/gyvagaudziaispastai/
\`\`\`

### 5. Build Docker Images
\`\`\`bash
cd /opt/gyvagaudziaispastai
docker build -t gyvagaudziaispastai/backend:latest -f backend/Dockerfile.production backend/
docker build -t gyvagaudziaispastai/storefront:latest -f storefront/Dockerfile.production storefront/
\`\`\`

### 6. Start Services
\`\`\`bash
cd /opt/gyvagaudziaispastai
./start.sh
\`\`\`

### 7. Configure SSL
\`\`\`bash
sudo sed -i 's/DOMAIN_PLACEHOLDER/$DOMAIN/g' /etc/nginx/sites-available/gyvagaudziaispastai
sudo ln -sf /etc/nginx/sites-available/gyvagaudziaispastai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d $DOMAIN
\`\`\`

### 8. Verify Deployment
- Visit: https://$DOMAIN
- Check backend: https://$DOMAIN/api/health
- Admin panel: https://$DOMAIN/admin

## Monitoring
- Check logs: \`docker-compose logs -f\`
- System stats: \`htop\` or \`docker stats\`
- Backups run daily at 2 AM

## Estimated Monthly Cost: $15-25
EOF

    print_success "Deployment guide created: DEPLOYMENT_INSTRUCTIONS.md"
}

# Main execution
main() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  AWS Low-Cost Deployment for Gyvagaudziaispastai${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    
    check_aws_config
    create_key_pair
    create_security_group
    get_ubuntu_ami
    create_user_data
    launch_instance
    allocate_elastic_ip
    create_deployment_guide
    
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}  Deployment Infrastructure Ready!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo -e "📋 Next steps in: ${YELLOW}DEPLOYMENT_INSTRUCTIONS.md${NC}"
    echo -e "🔑 SSH key saved as: ${YELLOW}$KEY_NAME.pem${NC}"
    echo -e "🌐 Server IP: ${YELLOW}$ELASTIC_IP${NC}"
    echo -e "💰 Estimated cost: ${YELLOW}$15-25/month${NC}"
    echo ""
}

# Run main function
main "$@"