# 🔐 AWS Demo Deployment Guide
## Gyvagaudziaispastai E-commerce Platform

🎯 **PURPOSE**: Deploy a secure demo platform using AWS auto-assigned domain for customer showcases.

⚠️ **NOTE**: This guide creates a demonstration platform perfect for showing customers your e-commerce capabilities.

---

## 📋 Pre-Deployment Security Checklist

### ✅ **STEP 1: Environment Variables Security Validation**

Run our security validation script:

```bash
./deployment/validate-security.sh
```

**🚨 NEVER commit these to Git:**
- Database passwords
- JWT secrets
- Payment API keys
- SSH private keys
- Email passwords

### ✅ **STEP 2: Required Demo Environment Variables**

**Copy and fill this template** - Save as `.env.production` (NEVER commit to Git):

*Note: Domain fields will be auto-populated after AWS deployment*

```bash
# ===========================================
# PRODUCTION ENVIRONMENT VARIABLES
# ===========================================
# 🚨 KEEP THIS FILE SECURE - NEVER COMMIT TO GIT

# ==================
# CRITICAL SECURITY SECRETS
# ==================
# Generate with: openssl rand -hex 32
JWT_SECRET=GENERATE_WITH_OPENSSL_RAND_HEX_32_EXACTLY_64_CHARS_HERE
COOKIE_SECRET=GENERATE_WITH_OPENSSL_RAND_HEX_32_EXACTLY_64_CHARS_HERE

# Strong database password (min 16 chars, mix of letters/numbers/symbols)
POSTGRES_PASSWORD=YOUR_VERY_STRONG_DB_PASSWORD_HERE

# ==================
# DATABASE CONFIGURATION
# ==================
DATABASE_URL=postgresql://medusa:${POSTGRES_PASSWORD}@postgres:5432/gyvagaudziaispastai
DATABASE_SSL=true
POSTGRES_DB=gyvagaudziaispastai
POSTGRES_USER=medusa

# ==================
# REDIS CONFIGURATION
# ==================
REDIS_URL=redis://redis:6379

# ==================
# DOMAIN & CORS (AWS Auto-assigned)
# ==================
# These will be auto-populated after deployment
DOMAIN=AUTO_ASSIGNED_FROM_AWS
STORE_CORS=http://AUTO_ASSIGNED_FROM_AWS
ADMIN_CORS=http://AUTO_ASSIGNED_FROM_AWS
AUTH_CORS=http://AUTO_ASSIGNED_FROM_AWS
MEDUSA_BACKEND_URL=http://AUTO_ASSIGNED_FROM_AWS
FRONTEND_URL=http://AUTO_ASSIGNED_FROM_AWS

# ==================
# PAYMENT CONFIGURATION (Demo/Test Keys)
# ==================
PAYSERA_PROJECT_ID=YOUR_DEMO_PAYSERA_PROJECT_ID
PAYSERA_SIGN_PASSWORD=YOUR_DEMO_PAYSERA_SIGN_PASSWORD  
PAYSERA_TEST_MODE=true  # Keep as true for demo

# ==================
# SHIPPING CONFIGURATION (Demo/Test Keys)
# ==================
VENIPAK_API_KEY=YOUR_DEMO_VENIPAK_API_KEY
VENIPAK_USERNAME=YOUR_DEMO_VENIPAK_USERNAME
VENIPAK_PASSWORD=YOUR_DEMO_VENIPAK_PASSWORD

# ==================
# NEXT.JS CONFIGURATION
# ==================
# These will be auto-populated after deployment
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
# MONITORING & ALERTS
# ==================
GRAFANA_ADMIN_PASSWORD=CHANGE_THIS_SECURE_PASSWORD
SMTP_HOST=smtp.gmail.com:587
SMTP_USER=demo@example.com
SMTP_PASSWORD=YOUR_EMAIL_APP_PASSWORD_FOR_DEMO
SMTP_FROM=monitoring@demo-platform.com

# ==================
# BACKUP CONFIGURATION
# ==================
BACKUP_S3_BUCKET=yourdomain-backups-$(date +%s)
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
```

---

## 🔧 **STEP 3: Generate Secure Secrets**

Run this script to generate production-ready secrets:

```bash
./deployment/generate-secrets.sh
```

Or manually generate:

```bash
# JWT Secret (exactly 64 characters)
echo "JWT_SECRET=$(openssl rand -hex 32)"

# Cookie Secret (exactly 64 characters) 
echo "COOKIE_SECRET=$(openssl rand -hex 32)"

# Database Password (strong password)
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d /=+ | cut -c -16)"

# Grafana Password
echo "GRAFANA_ADMIN_PASSWORD=$(openssl rand -base64 16 | tr -d /=+)"
```

---

## 🌍 **STEP 4: AWS Domain Setup (No Custom Domain Needed)**

### **4.1 AWS Auto-Assigned Domain**
- AWS automatically provides a public DNS name for your EC2 instance
- Format: `ec2-X-X-X-X.region.compute.amazonaws.com`
- Perfect for demonstrations and customer showcases
- No domain purchase required

### **4.2 Domain Resolution**
```bash
# AWS automatically handles DNS resolution
# Your platform will be accessible via AWS public DNS
# Example: ec2-3-120-123-45.eu-central-1.compute.amazonaws.com
```

---

## ☁️ **STEP 5: Secure AWS Setup for Demo Platform**

### **5.1 Create AWS Account & IAM User**

**🚨 NEVER use root AWS account for deployment!**

1. **Create IAM User:**
```bash
aws iam create-user --user-name gyvagaudziaispastai-deploy
```

2. **Create minimal permissions policy:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances",
                "ec2:DescribeImages",
                "ec2:DescribeKeyPairs",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSnapshots",
                "ec2:DescribeVolumes",
                "ec2:RunInstances",
                "ec2:StopInstances",
                "ec2:StartInstances",
                "ec2:RebootInstances",
                "ec2:TerminateInstances",
                "ec2:CreateKeyPair",
                "ec2:CreateSecurityGroup",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:AllocateAddress",
                "ec2:AssociateAddress",
                "ec2:CreateTags"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:PutBucketLifecycleConfiguration"
            ],
            "Resource": [
                "arn:aws:s3:::yourdomain-backups-*",
                "arn:aws:s3:::yourdomain-backups-*/*"
            ]
        }
    ]
}
```

3. **Attach policy and create access keys:**
```bash
aws iam put-user-policy --user-name gyvagaudziaispastai-deploy --policy-name DeploymentPolicy --policy-document file://deployment-policy.json
aws iam create-access-key --user-name gyvagaudziaispastai-deploy
```

### **5.2 Configure AWS CLI Securely**

```bash
aws configure --profile gyvagaudziaispastai
# Enter your IAM user credentials (NOT root account)
AWS Access Key ID: YOUR_IAM_ACCESS_KEY
AWS Secret Access Key: YOUR_IAM_SECRET_KEY
Default region: eu-central-1
Default output format: json
```

---

## 🚀 **STEP 6: Secure Deployment Process**

### **6.1 Run Security Pre-Check**

```bash
./deployment/pre-deployment-security-check.sh
```

This validates:
- ✅ No hardcoded secrets in code
- ✅ Strong passwords generated
- ✅ CORS configured for your domain only
- ✅ SSL certificates ready
- ✅ Database encryption enabled
- ✅ Secure headers configured

### **6.2 Deploy Demo Infrastructure**

```bash
# Deploy with AWS auto-assigned domain
./deployment/deploy-secure.sh --region eu-central-1

# Or simply:
./deployment/deploy-secure.sh
```

### **6.3 Update AWS Domain in Environment**

After deployment, update your environment with the AWS domain:

```bash
# Auto-update environment with AWS-assigned domain
./deployment/update-aws-domain.sh

# This will:
# 1. Get your EC2 public DNS name
# 2. Update .env.production with the correct domain
# 3. Upload to server and restart services
```

### **6.4 Optional SSL Setup**

For production use (not required for demo):

```bash
# Only if you want HTTPS for demo
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
sudo certbot --nginx -d YOUR_AWS_PUBLIC_DNS --agree-tos --no-eff-email --email demo@example.com
```

---

## 🔒 **STEP 7: Production Security Hardening**

### **7.1 Server Security**

```bash
# SSH to your server
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Secure SSH (disable password auth)
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban (brute force protection)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### **7.2 Application Security**

```bash
# Set secure file permissions
sudo chown -R ubuntu:ubuntu /opt/gyvagaudziaispastai/
sudo chmod 600 /opt/gyvagaudziaispastai/.env.production
sudo chmod 755 /opt/gyvagaudziaispastai/

# Enable Docker security features
sudo usermod -aG docker ubuntu
sudo systemctl enable docker
```

---

## 🧪 **STEP 8: Demo Platform Testing & Validation**

### **8.1 Security Testing**

```bash
# Replace YOUR_AWS_DNS with your actual AWS public DNS
export AWS_DNS="your-ec2-public-dns.compute.amazonaws.com"

# Test platform accessibility
curl -I http://$AWS_DNS

# Test security headers
curl -I http://$AWS_DNS | grep -E "(X-Frame|X-Content|X-Demo)"

# Test API endpoints
curl http://$AWS_DNS/api/health
curl http://$AWS_DNS/api/products

# Test admin access
curl -I http://$AWS_DNS/admin
```

### **8.2 Performance Testing**

```bash
# Load test (install ab first: sudo apt install apache2-utils)
ab -n 100 -c 10 http://$AWS_DNS/

# Check response times
curl -o /dev/null -s -w "Response time: %{time_total}s\n" http://$AWS_DNS/

# Test different pages
curl -o /dev/null -s -w "Products page: %{time_total}s\n" http://$AWS_DNS/products
curl -o /dev/null -s -w "Admin panel: %{time_total}s\n" http://$AWS_DNS/admin
```

### **8.3 Monitoring Validation**

```bash
# Check monitoring stack
curl http://YOUR_ELASTIC_IP:3001  # Grafana
curl http://YOUR_ELASTIC_IP:9090  # Prometheus
curl http://YOUR_ELASTIC_IP:3002  # Uptime Kuma
```

---

## 🚨 **STEP 9: Security Incident Response Plan**

### **9.1 Emergency Contacts**
- Domain registrar support
- AWS support (if you have a support plan)
- Payment processor (Paysera) support
- Your team/developer contacts

### **9.2 Emergency Procedures**

**If site is compromised:**
```bash
# 1. Take site offline immediately
sudo nginx -s stop

# 2. Create forensic backup
sudo cp -r /opt/gyvagaudziaispastai /backup/forensic-$(date +%Y%m%d)

# 3. Check for unauthorized access
sudo tail -100 /var/log/auth.log
sudo tail -100 /var/log/nginx/access.log

# 4. Reset all secrets
# Generate new JWT_SECRET, COOKIE_SECRET, database passwords

# 5. Restore from clean backup
# Only after confirming the backup is clean
```

**If payment system is compromised:**
```bash
# 1. Immediately disable payment processing
# Set PAYSERA_TEST_MODE=true in environment

# 2. Contact Paysera immediately
# Report potential security incident

# 3. Review all recent transactions
# Check for unauthorized payments
```

---

## 📊 **STEP 10: Post-Deployment Monitoring**

### **10.1 Set Up Alerts**

Configure monitoring alerts for:
- **Critical**: Site down, database down, payment failures
- **Warning**: High CPU/memory, slow response times
- **Info**: Daily backup status, SSL certificate expiry

### **10.2 Regular Security Tasks**

**Daily:**
- Check monitoring dashboards
- Review error logs
- Monitor payment transactions

**Weekly:**
- Check security scan results
- Review access logs for anomalies
- Verify backup integrity

**Monthly:**
- Update system packages
- Rotate access keys
- Review user permissions
- Security vulnerability scan

---

## ✅ **STEP 11: Final Demo Platform Checklist**

Before sharing with customers, verify:

- [ ] **No secrets in Git repository**
- [ ] **Strong, unique passwords for all services**
- [ ] **AWS domain properly configured in environment**
- [ ] **Firewall properly configured**
- [ ] **Database encryption enabled**
- [ ] **Monitoring and alerting working**
- [ ] **Backup system tested and working**
- [ ] **Payment system in test/demo mode**
- [ ] **All API endpoints accessible via AWS domain**
- [ ] **CORS configured for AWS domain**
- [ ] **Security headers properly set**
- [ ] **Demo banner/indicators showing (if enabled)**
- [ ] **Rate limiting configured**
- [ ] **Log collection working properly**
- [ ] **Platform accessible via HTTP (HTTPS optional for demo)**

---

## 🚀 **Your Demo Platform is Ready!**

Once all steps are complete, your customer showcase platform will be:
- ✅ **Secure** - Industry-standard security practices
- ✅ **Monitored** - Comprehensive observability for demos
- ✅ **Backed up** - Automated daily backups
- ✅ **Fast** - Optimized performance for customer demos
- ✅ **Professional** - Enterprise-grade demonstration platform
- ✅ **Cost-effective** - Perfect for showcasing capabilities

**Total setup time:** 1-2 hours
**Monthly cost:** $20-30 (ultra low-cost demo)
**Security level:** Enterprise-grade
**Perfect for:** Customer demonstrations, portfolio showcases

---

## 🆘 **Need Help?**

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables: `printenv | grep -E "(JWT|DATABASE|PAYSERA)"`
3. Test connectivity: `curl -I http://YOUR_AWS_DNS`
4. Verify AWS domain is correctly set: `grep -E "(DOMAIN|CORS)" .env.production`
5. Review demo checklist above

**Update domain after deployment:** `./deployment/update-aws-domain.sh`
**Emergency shutdown:** `sudo docker-compose down && sudo nginx -s stop`