#!/bin/bash

# =================================================================
# SIMPLE AWS DEPLOYMENT SCRIPT for Gyvagaudziaispastai Store
# Uses AWS App Runner for easy, secure container deployment
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
    echo -e "${BLUE}===> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Run 'aws configure' first."
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Create ECR repositories
create_ecr_repos() {
    print_step "Creating ECR repositories..."
    
    # Create backend repository
    aws ecr describe-repositories --repository-names $ECR_BACKEND_REPO --region $AWS_REGION 2>/dev/null || {
        print_step "Creating backend ECR repository..."
        aws ecr create-repository \
            --repository-name $ECR_BACKEND_REPO \
            --region $AWS_REGION \
            --image-scanning-configuration scanOnPush=true
        print_success "Backend ECR repository created"
    }
    
    # Create storefront repository
    aws ecr describe-repositories --repository-names $ECR_STOREFRONT_REPO --region $AWS_REGION 2>/dev/null || {
        print_step "Creating storefront ECR repository..."
        aws ecr create-repository \
            --repository-name $ECR_STOREFRONT_REPO \
            --region $AWS_REGION \
            --image-scanning-configuration scanOnPush=true
        print_success "Storefront ECR repository created"
    }
}

# Build and push Docker images
build_and_push_images() {
    print_step "Building and pushing Docker images..."
    
    # Get ECR login token
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    # Build and push backend
    print_step "Building backend image..."
    docker build -f backend/Dockerfile.production -t ${ECR_REGISTRY}/${ECR_BACKEND_REPO}:latest backend/
    docker push ${ECR_REGISTRY}/${ECR_BACKEND_REPO}:latest
    print_success "Backend image pushed to ECR"
    
    # Build and push storefront
    print_step "Building storefront image..."
    docker build -f storefront/Dockerfile.production -t ${ECR_REGISTRY}/${ECR_STOREFRONT_REPO}:latest storefront/
    docker push ${ECR_REGISTRY}/${ECR_STOREFRONT_REPO}:latest
    print_success "Storefront image pushed to ECR"
}

# Create RDS database
create_rds() {
    print_step "Setting up RDS PostgreSQL database..."
    
    DB_NAME="${PROJECT_NAME}-prod-db"
    DB_INSTANCE_ID="${PROJECT_NAME}-prod"
    
    # Check if database already exists
    if aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --region $AWS_REGION 2>/dev/null; then
        print_warning "RDS database already exists"
        return 0
    fi
    
    # Create DB subnet group if it doesn't exist
    aws rds create-db-subnet-group \
        --db-subnet-group-name ${PROJECT_NAME}-subnet-group \
        --db-subnet-group-description "Subnet group for ${PROJECT_NAME}" \
        --subnet-ids $(aws ec2 describe-subnets --query 'Subnets[?State==`available`].SubnetId' --output text --region $AWS_REGION | head -n 2 | tr '\t' ' ') \
        --region $AWS_REGION 2>/dev/null || print_warning "DB subnet group already exists"
    
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    print_step "Creating RDS PostgreSQL instance (this will take ~10 minutes)..."
    aws rds create-db-instance \
        --db-instance-identifier $DB_INSTANCE_ID \
        --db-instance-class db.t3.micro \
        --engine postgres \
        --engine-version 15.3 \
        --master-username postgres \
        --master-user-password $DB_PASSWORD \
        --allocated-storage 20 \
        --storage-type gp2 \
        --db-name medusastore \
        --db-subnet-group-name ${PROJECT_NAME}-subnet-group \
        --publicly-accessible \
        --backup-retention-period 7 \
        --storage-encrypted \
        --region $AWS_REGION
    
    # Store password in AWS Secrets Manager
    aws secretsmanager create-secret \
        --name "${PROJECT_NAME}/database/password" \
        --description "Database password for ${PROJECT_NAME}" \
        --secret-string $DB_PASSWORD \
        --region $AWS_REGION 2>/dev/null || {
        aws secretsmanager update-secret \
            --secret-id "${PROJECT_NAME}/database/password" \
            --secret-string $DB_PASSWORD \
            --region $AWS_REGION
    }
    
    print_success "RDS database creation initiated"
    echo "Database password stored in AWS Secrets Manager: ${PROJECT_NAME}/database/password"
}

# Create ElastiCache Redis
create_redis() {
    print_step "Setting up ElastiCache Redis..."
    
    CACHE_CLUSTER_ID="${PROJECT_NAME}-redis"
    
    # Check if Redis cluster already exists
    if aws elasticache describe-cache-clusters --cache-cluster-id $CACHE_CLUSTER_ID --region $AWS_REGION 2>/dev/null; then
        print_warning "Redis cluster already exists"
        return 0
    fi
    
    print_step "Creating ElastiCache Redis instance..."
    aws elasticache create-cache-cluster \
        --cache-cluster-id $CACHE_CLUSTER_ID \
        --engine redis \
        --cache-node-type cache.t3.micro \
        --num-cache-nodes 1 \
        --region $AWS_REGION
    
    print_success "Redis cluster creation initiated"
}

# Wait for RDS to be available
wait_for_rds() {
    print_step "Waiting for RDS database to be available..."
    
    DB_INSTANCE_ID="${PROJECT_NAME}-prod"
    
    while true; do
        STATUS=$(aws rds describe-db-instances --db-instance-identifier $DB_INSTANCE_ID --query 'DBInstances[0].DBInstanceStatus' --output text --region $AWS_REGION)
        if [ "$STATUS" = "available" ]; then
            print_success "RDS database is now available"
            break
        fi
        echo "Database status: $STATUS. Waiting..."
        sleep 30
    done
}

# Create App Runner services
create_app_runner_services() {
    print_step "Creating App Runner services..."
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    # Get database endpoint
    DB_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "${PROJECT_NAME}-prod" --query 'DBInstances[0].Endpoint.Address' --output text --region $AWS_REGION)
    
    # Get Redis endpoint
    REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters --cache-cluster-id "${PROJECT_NAME}-redis" --show-cache-node-info --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' --output text --region $AWS_REGION)
    
    # Get database password from Secrets Manager
    DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id "${PROJECT_NAME}/database/password" --query SecretString --output text --region $AWS_REGION)
    
    # Generate JWT and Cookie secrets
    JWT_SECRET=$(openssl rand -base64 32)
    COOKIE_SECRET=$(openssl rand -base64 32)
    
    # Create backend App Runner service
    print_step "Creating backend App Runner service..."
    cat > /tmp/backend-apprunner.json << EOF
{
    "ServiceName": "${PROJECT_NAME}-backend",
    "SourceConfiguration": {
        "ImageRepository": {
            "ImageIdentifier": "${ECR_REGISTRY}/${ECR_BACKEND_REPO}:latest",
            "ImageConfiguration": {
                "Port": "9000",
                "RuntimeEnvironmentVariables": {
                    "NODE_ENV": "production",
                    "DATABASE_URL": "postgresql://postgres:${DB_PASSWORD}@${DB_ENDPOINT}:5432/medusastore",
                    "REDIS_URL": "redis://${REDIS_ENDPOINT}:6379",
                    "JWT_SECRET": "${JWT_SECRET}",
                    "COOKIE_SECRET": "${COOKIE_SECRET}",
                    "STORE_CORS": "https://${PROJECT_NAME}-storefront.${AWS_REGION}.awsapprunner.com",
                    "ADMIN_CORS": "https://${PROJECT_NAME}-backend.${AWS_REGION}.awsapprunner.com",
                    "AUTH_CORS": "https://${PROJECT_NAME}-backend.${AWS_REGION}.awsapprunner.com,https://${PROJECT_NAME}-storefront.${AWS_REGION}.awsapprunner.com",
                    "MEDUSA_BACKEND_URL": "https://${PROJECT_NAME}-backend.${AWS_REGION}.awsapprunner.com",
                    "FRONTEND_URL": "https://${PROJECT_NAME}-storefront.${AWS_REGION}.awsapprunner.com",
                    "PAYSERA_PROJECT_ID": "252103",
                    "PAYSERA_SIGN_PASSWORD": "feb5e1c0c06a4737a6896b65f99808cd"
                },
                "StartCommand": "npm run start"
            },
            "ImageRepositoryType": "ECR"
        },
        "AutoDeploymentsEnabled": false
    },
    "InstanceConfiguration": {
        "Cpu": "0.25 vCPU",
        "Memory": "0.5 GB"
    },
    "HealthCheckConfiguration": {
        "Protocol": "HTTP",
        "Path": "/health",
        "Interval": 20,
        "Timeout": 5,
        "HealthyThreshold": 2,
        "UnhealthyThreshold": 5
    }
}
EOF
    
    aws apprunner create-service --cli-input-json file:///tmp/backend-apprunner.json --region $AWS_REGION
    print_success "Backend App Runner service created"
    
    # Wait a moment before creating storefront
    sleep 10
    
    # Create storefront App Runner service
    print_step "Creating storefront App Runner service..."
    cat > /tmp/storefront-apprunner.json << EOF
{
    "ServiceName": "${PROJECT_NAME}-storefront",
    "SourceConfiguration": {
        "ImageRepository": {
            "ImageIdentifier": "${ECR_REGISTRY}/${ECR_STOREFRONT_REPO}:latest",
            "ImageConfiguration": {
                "Port": "3000",
                "RuntimeEnvironmentVariables": {
                    "NODE_ENV": "production",
                    "NEXT_PUBLIC_MEDUSA_BACKEND_URL": "https://${PROJECT_NAME}-backend.${AWS_REGION}.awsapprunner.com",
                    "MEDUSA_BACKEND_URL": "https://${PROJECT_NAME}-backend.${AWS_REGION}.awsapprunner.com",
                    "NEXT_PUBLIC_BASE_URL": "https://${PROJECT_NAME}-storefront.${AWS_REGION}.awsapprunner.com",
                    "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY": "pk_ffe2341af0aa127aa05b4354cc290b002495e3b46c21e62721339d32af07c074",
                    "NEXT_TELEMETRY_DISABLED": "1"
                },
                "StartCommand": "npm run start"
            },
            "ImageRepositoryType": "ECR"
        },
        "AutoDeploymentsEnabled": false
    },
    "InstanceConfiguration": {
        "Cpu": "0.25 vCPU",
        "Memory": "0.5 GB"
    },
    "HealthCheckConfiguration": {
        "Protocol": "HTTP",
        "Path": "/",
        "Interval": 20,
        "Timeout": 5,
        "HealthyThreshold": 2,
        "UnhealthyThreshold": 5
    }
}
EOF
    
    aws apprunner create-service --cli-input-json file:///tmp/storefront-apprunner.json --region $AWS_REGION
    print_success "Storefront App Runner service created"
    
    # Clean up temporary files
    rm /tmp/backend-apprunner.json /tmp/storefront-apprunner.json
}

# Get service URLs
get_service_urls() {
    print_step "Getting service URLs..."
    
    sleep 10  # Wait a moment for services to initialize
    
    BACKEND_URL=$(aws apprunner describe-service --service-arn $(aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='${PROJECT_NAME}-backend'].ServiceArn" --output text --region $AWS_REGION) --query 'Service.ServiceUrl' --output text --region $AWS_REGION 2>/dev/null || echo "Not available yet")
    
    STOREFRONT_URL=$(aws apprunner describe-service --service-arn $(aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='${PROJECT_NAME}-storefront'].ServiceArn" --output text --region $AWS_REGION) --query 'Service.ServiceUrl' --output text --region $AWS_REGION 2>/dev/null || echo "Not available yet")
    
    echo ""
    echo "==================================================================="
    echo "🎉 DEPLOYMENT COMPLETE!"
    echo "==================================================================="
    echo ""
    echo "📱 STOREFRONT URL: https://$STOREFRONT_URL"
    echo "🔧 BACKEND API URL: https://$BACKEND_URL"
    echo "🛠️  ADMIN PANEL: https://$BACKEND_URL/app"
    echo ""
    echo "⏳ Services are starting up (may take 5-10 minutes to be fully available)"
    echo ""
    echo "💰 Estimated Monthly Cost: $25-40"
    echo "   - App Runner (2 services): $20-30"
    echo "   - RDS db.t3.micro: $13"
    echo "   - ElastiCache cache.t3.micro: $11"
    echo "   - ECR storage: $1"
    echo ""
    echo "🔐 Database password stored in AWS Secrets Manager:"
    echo "   aws secretsmanager get-secret-value --secret-id '${PROJECT_NAME}/database/password' --region $AWS_REGION"
    echo ""
    echo "📝 Next Steps:"
    echo "   1. Wait 5-10 minutes for services to start"
    echo "   2. Visit the storefront URL to test"
    echo "   3. Access admin panel to configure your store"
    echo "   4. Set up custom domain (optional)"
    echo ""
    echo "==================================================================="
}

# Main deployment function
main() {
    echo "==================================================================="
    echo "🚀 AWS Deployment for Gyvagaudziaispastai E-commerce Store"
    echo "   Simple, Secure & Cost-Effective with AWS App Runner"
    echo "==================================================================="
    echo ""
    
    check_prerequisites
    create_ecr_repos
    build_and_push_images
    create_rds
    create_redis
    wait_for_rds
    create_app_runner_services
    get_service_urls
}

# Run main function
main "$@"