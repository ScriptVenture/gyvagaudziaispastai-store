# AWS Production Architecture
## Gyvagaudziaispastai E-commerce Platform

### Executive Summary
**Simple, Secure, Fast AWS deployment** using containerized microservices with managed services for scalability and reliability.

**Estimated Monthly Cost: $25-50** (low-traffic startup optimized)

---

## Architecture Overview

### **Low-Cost Startup Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │    │     Single       │    │      EC2       │
│ (Optional CDN)  │───▶│   EC2 Instance   │───▶│   t3.small      │
└─────────────────┘    │   + Nginx        │    │  (All Services) │
                       └──────────────────┘    └─────────────────┘
                                                          │
                              ┌───────────────────────────┼───────────────────────────┐
                              │                           │                           │
                    ┌─────────▼─────────┐    ┌───────────▼───────────┐    ┌─────────▼─────────┐
                    │   Storefront      │    │      Backend        │    │    PostgreSQL    │
                    │   (Next.js)       │    │    (Medusa.js)      │    │   (Local Docker)  │
                    │   Port: 3000      │    │    Port: 9000       │    │   Port: 5432      │
                    └───────────────────┘    └─────────────────────┘    └───────────────────┘
                              │                           │                           │
                              │                           │                           │
                    ┌─────────▼─────────┐    ┌───────────▼───────────┐    ┌─────────▼─────────┐
                    │       S3          │    │      Redis          │    │    Nginx         │
                    │  Static Assets    │    │  (Local Docker)     │    │ Reverse Proxy    │
                    │     (Optional)    │    │   Port: 6379        │    │   Port: 80/443   │
                    └───────────────────┘    └─────────────────────┘    └───────────────────┘
```

---

## Low-Cost Service Components

### 1. **Single EC2 Instance** (Primary Cost Saver)

#### **Amazon EC2 t3.small**
- **vCPUs:** 2 vCPUs (burstable performance)
- **RAM:** 2 GB
- **Storage:** 30 GB gp3 EBS
- **Network:** Up to 5 Gbps
- **Cost:** ~$15-18/month

**Services Running:**
- Docker containers for all services
- Nginx reverse proxy
- PostgreSQL container
- Redis container
- Automated backups via scripts

**Why Single Instance?**
- Minimal operational overhead
- One point of management
- Significant cost savings
- Easy to scale up later

### 2. **Load Balancing & SSL**

#### **Nginx Reverse Proxy** (On EC2)
```nginx
# Cost: $0 (included in EC2)
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;  # Storefront
    }
    
    location /api/ {
        proxy_pass http://localhost:9000;  # Backend
    }
}
```

#### **Let's Encrypt SSL** (Free)
- Automated certificate renewal
- Certbot integration
- Zero SSL costs

### 3. **Database & Caching** (Containerized)

#### **PostgreSQL Docker Container**
- **Resource Allocation:** 512MB RAM, 0.5 CPU
- **Storage:** EBS volume (included in EC2 storage)
- **Backup:** Daily automated dumps to S3
- **Cost:** $0 (included in EC2)

#### **Redis Docker Container**
- **Resource Allocation:** 256MB RAM
- **Persistence:** Redis AOF for data durability
- **Cost:** $0 (included in EC2)

### 4. **Storage & CDN** (Optional for Ultra Low-Cost)

#### **Local Storage + Optional S3**
- **Primary Storage:** Local EBS (included in EC2)
- **Backup Storage:** S3 Standard-IA (backup only)
  - Database dumps
  - Static file backups
  - **Cost:** ~$1-3/month

#### **CloudFront** (Optional)
- **Phase 1:** Direct serving from EC2 (No CDN cost)
- **Phase 2:** Add CloudFront when traffic increases
- **Initial Cost:** $0

### 5. **Security & Monitoring** (Low-Cost Options)

#### **Security Groups** (Free)
- Minimal required ports (22, 80, 443)
- Source IP restrictions
- **Cost:** $0

#### **Simple VPC Setup**
```
Default VPC: Use existing (free)
Single Public Subnet: EC2 in public subnet
Security Groups: Restrictive rules
Elastic IP: $0 (when attached to running instance)
```

#### **Environment Variables** (EC2 Based)
- `.env` files with proper permissions
- Encrypted EBS volume for sensitive data
- **Cost:** $0

#### **Basic Monitoring**
- CloudWatch basic metrics (free tier)
- EC2 system logs
- Application logs via Docker
- **Cost:** $0 (within free tier)

---

## Deployment Pipeline

### AWS Services Used:
1. **ECR (Elastic Container Registry)** - Docker images
2. **CodeBuild** - Container builds  
3. **CodeDeploy** - ECS deployments
4. **CloudWatch** - Logging & monitoring

### Deployment Flow:
```
GitHub Push → GitHub Actions → Build Images → Push to ECR → Update ECS Services
```

---

## Infrastructure as Code

### Terraform Configuration Structure:
```
aws-infrastructure/
├── main.tf              # Main configuration
├── variables.tf         # Variables
├── outputs.tf           # Outputs  
├── modules/
│   ├── vpc/            # VPC setup
│   ├── ecs/            # ECS cluster & services
│   ├── rds/            # Database setup
│   ├── redis/          # ElastiCache setup
│   ├── s3/             # Storage setup
│   └── security/       # Security groups, WAF
├── environments/
│   ├── staging.tfvars   # Staging config
│   └── production.tfvars# Production config
└── scripts/
    ├── deploy.sh        # Deployment script
    └── destroy.sh       # Cleanup script
```

---

## Cost Optimization

### **Ultra Low-Cost Monthly Breakdown:**

| Service | Configuration | Monthly Cost |
|---------|---------------|--------------|
| EC2 t3.small | 2 vCPU, 2GB RAM, 30GB storage | $15-18 |
| Elastic IP | Static IP (attached) | $0 |
| S3 Storage | Backup only, ~2GB | $0.50-2 |
| Data Transfer | First 1GB free, then $0.09/GB | $1-5 |
| Route 53 DNS | Hosted zone + queries | $0.50-1 |
| SSL Certificate | Let's Encrypt (Free) | $0 |
| Load Balancer | Nginx (included in EC2) | $0 |
| Database | PostgreSQL container | $0 |
| Redis Cache | Redis container | $0 |
| Monitoring | CloudWatch free tier | $0 |
| **Total Estimate** | | **$25-50/month** |

### **Even Lower Cost Options:**

**Micro Setup (~$15/month):**
- EC2 t3.micro (1 vCPU, 1GB) - $8-10/month
- No S3 (local backups only) - $0
- Single domain only - $0.50
- **Total: ~$15/month**

**Free Tier Eligible** (First 12 months):
- t3.micro free for 750 hours/month
- **First year cost: ~$5/month** (just DNS + data transfer)

### **Cost Optimization Strategies:**
1. **Reserved Instances** (1-year commitment): 30-40% savings
2. **Spot Instances** (for dev/test): Up to 70% savings
3. **Automated shutdown**: Stop EC2 during off-hours if acceptable
4. **Local storage first**: Use S3 only for critical backups
5. **Free tier maximization**: Use all AWS free tier benefits
6. **Resource monitoring**: Track usage to avoid overages

---

## Security Implementation

### **Network Security:**
- Private subnets for databases
- Security groups with minimal access
- WAF with rate limiting
- VPC Flow Logs enabled

### **Data Security:**
- Encryption at rest (RDS, S3)
- Encryption in transit (SSL/TLS)
- Secrets Manager for credentials
- IAM roles with minimal permissions

### **Application Security:**
- Security headers (implemented in Next.js)
- Input validation
- SQL injection protection
- XSS protection

---

## Monitoring & Alerting

### **CloudWatch Metrics:**
- ECS task CPU/Memory utilization
- ALB response times
- RDS performance metrics
- Application logs

### **Alerts:**
- High CPU usage (>80%)
- Database connection issues
- Failed health checks
- High error rates (>5%)

### **Log Aggregation:**
- Centralized logging in CloudWatch
- Structured JSON logs
- Error tracking integration

---

## Disaster Recovery

### **Backup Strategy:**
- **RDS:** Daily automated backups (7-day retention)
- **S3:** Cross-region replication
- **Configuration:** Infrastructure as Code (Terraform)

### **Recovery Procedures:**
- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour
- **Multi-AZ deployment** for database failover
- **Auto Scaling** for application resilience

---

## Performance Optimization

### **Database Optimization:**
- Connection pooling
- Read replicas (if needed)
- Query optimization
- Regular VACUUM and ANALYZE

### **Caching Strategy:**
- CloudFront for static assets (1 year TTL)
- Redis for session data (30 min TTL)
- API response caching (5 min TTL)
- Database query caching

### **Application Performance:**
- Container resource limits
- Health check optimization
- Graceful shutdown handling
- Connection pooling

---

## Deployment Checklist

### **Pre-Deployment:**
- [ ] Domain purchased and configured
- [ ] SSL certificate requested in ACM
- [ ] AWS account with appropriate permissions
- [ ] Terraform installed locally
- [ ] Environment variables prepared
- [ ] Database migration scripts ready

### **Deployment Steps:**
- [ ] Create VPC and networking
- [ ] Deploy RDS and ElastiCache
- [ ] Create ECR repositories
- [ ] Build and push container images
- [ ] Deploy ECS services
- [ ] Configure ALB and target groups
- [ ] Set up CloudFront distribution
- [ ] Configure monitoring and alerts
- [ ] Run database migrations
- [ ] Verify all services are healthy

### **Post-Deployment:**
- [ ] DNS propagation verification
- [ ] SSL certificate validation
- [ ] End-to-end testing
- [ ] Performance testing
- [ ] Security scan
- [ ] Backup verification
- [ ] Monitoring dashboard setup

---

## Scaling Strategy

### **Horizontal Scaling:**
- ECS Auto Scaling based on CPU/Memory
- Application Load Balancer for distribution
- Database read replicas for read-heavy workloads

### **Vertical Scaling:**
- Increase task CPU/Memory when needed
- Database instance type upgrades
- Cache cluster node upgrades

### **Traffic Handling:**
- CloudFront for global content delivery
- Auto Scaling policies for peak traffic
- Rate limiting for abuse protection

---

This architecture provides a **production-ready, scalable, and secure** e-commerce platform that can handle significant traffic while maintaining cost efficiency and reliability.