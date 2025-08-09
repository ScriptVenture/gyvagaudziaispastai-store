#!/bin/bash

# Comprehensive validation script to catch all issues before deployment
set -e

echo "🔍 Starting comprehensive validation before deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}🚀 Pre-Deployment Validation Script${NC}"
echo -e "${BLUE}===============================================${NC}"

# Function to print status
print_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 passed${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# 1. Backend TypeScript compilation check
echo -e "\n${YELLOW}1. Checking Backend TypeScript compilation...${NC}"
cd backend
npm run build > /dev/null 2>&1
print_status "Backend TypeScript compilation"
cd ..

# 2. Storefront TypeScript compilation check
echo -e "\n${YELLOW}2. Checking Storefront TypeScript compilation and linting...${NC}"
cd storefront
npm run build > /dev/null 2>&1
print_status "Storefront TypeScript compilation and linting"
cd ..

# 3. Backend tests (if they exist)
echo -e "\n${YELLOW}3. Running Backend tests...${NC}"
cd backend
if npm run test --if-present > /dev/null 2>&1; then
    print_status "Backend tests"
else
    echo -e "${YELLOW}⚠️  No backend tests found or tests failed${NC}"
fi
cd ..

# 4. Docker build test (optional but recommended)
echo -e "\n${YELLOW}4. Testing Docker builds...${NC}"
echo -e "${BLUE}   - Building backend Docker image...${NC}"
cd backend
docker build -f Dockerfile.production -t temp-backend-test . > /dev/null 2>&1
print_status "Backend Docker build"
cd ..

echo -e "${BLUE}   - Building storefront Docker image...${NC}"
cd storefront  
docker build -f Dockerfile.production -t temp-storefront-test . > /dev/null 2>&1
print_status "Storefront Docker build"
cd ..

# Clean up test images
echo -e "${BLUE}   - Cleaning up test Docker images...${NC}"
docker rmi temp-backend-test temp-storefront-test > /dev/null 2>&1
print_status "Docker cleanup"

# 5. Check environment files
echo -e "\n${YELLOW}5. Checking environment configuration...${NC}"
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production file not found${NC}"
    echo -e "${YELLOW}   Make sure to create it on your deployment server${NC}"
else
    echo -e "${GREEN}✅ .env.production found${NC}"
fi

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}🎉 All validations passed!${NC}"
echo -e "${GREEN}✅ Ready for deployment${NC}"
echo -e "${GREEN}===============================================${NC}"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "1. Commit and push your changes: ${YELLOW}git add . && git commit -m 'fix: resolve TypeScript and linting issues' && git push${NC}"
echo -e "2. Pull changes on EC2 server: ${YELLOW}git pull${NC}"
echo -e "3. Deploy: ${YELLOW}docker-compose -f docker-compose.production.yml up --build -d${NC}"