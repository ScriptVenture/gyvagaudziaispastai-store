# 🚀 GitHub Actions CI/CD Setup Guide

This guide will help you configure the complete CI/CD pipeline for your Gyvagaudziaispastai e-commerce platform.

## 📋 Prerequisites

- GitHub repository set up
- AWS account with appropriate permissions
- Domain name registered
- EC2 instance deployed (using `./deploy-low-cost.sh`)

---

## 🔐 Required GitHub Secrets

### Repository Settings → Secrets and Variables → Actions

### **Environment Secrets**
```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=eu-central-1

# EC2 Instance Connection
AWS_EC2_HOST=your-ec2-ip-address
AWS_SSH_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----...

# Backup Configuration (Optional)
BACKUP_S3_BUCKET=gyvagaudziaispastai-backups

# Notification Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFICATION_EMAIL=admin@yourdomain.com
SECURITY_EMAIL=security@yourdomain.com

# Slack Notifications (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
SECURITY_SLACK_WEBHOOK=https://hooks.slack.com/services/...

# Security Scanning (Optional)
SOCKET_SECURITY_API_TOKEN=your-socket-token
```

### **Environment Variables**
```bash
# Production Domain
PRODUCTION_DOMAIN=yourdomain.com
```

---

## 🔧 Step-by-Step Setup

### 1. **AWS IAM User Setup**

Create an IAM user with the following permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:PutBucketLifecycleConfiguration"
            ],
            "Resource": [
                "arn:aws:s3:::your-backup-bucket",
                "arn:aws:s3:::your-backup-bucket/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeInstances"
            ],
            "Resource": "*"
        }
    ]
}
```

### 2. **SSH Key Generation**

If you don't have the SSH private key from deployment:

```bash
# Extract from your existing key pair
aws ec2 describe-key-pairs --key-names gyvagaudziaispastai-key
# Use the private key you saved during deployment
```

### 3. **S3 Backup Bucket (Optional)**

Create an S3 bucket for automated backups:

```bash
aws s3 mb s3://gyvagaudziaispastai-backups-$(date +%s)
aws s3api put-bucket-versioning \
    --bucket your-backup-bucket \
    --versioning-configuration Status=Enabled
```

### 4. **Email Configuration**

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate app password: Google Account → Security → App passwords
3. Use the app password as `SMTP_PASSWORD`

### 5. **Slack Integration (Optional)**

Create Slack webhooks:
1. Go to https://api.slack.com/apps
2. Create new app → Incoming Webhooks
3. Add webhook URL to secrets

---

## 🔄 Workflow Overview

### **CI Pipeline** (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main`

**Jobs:**
1. **Code Quality** - Linting, security audit
2. **Backend Tests** - Unit, integration, module tests
3. **Frontend Tests** - Unit tests with coverage
4. **Docker Build** - Production image builds
5. **E2E Tests** - Full application testing (PR only)
6. **Security Scan** - Vulnerability analysis

### **CD Pipeline** (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` (after CI passes)
- Manual deployment

**Jobs:**
1. **Validation** - Pre-deployment checks
2. **Build** - Create production Docker images
3. **Deploy** - Deploy to EC2 instance
4. **Smoke Tests** - Production health checks
5. **Notifications** - Success/failure alerts

### **Backup Pipeline** (`.github/workflows/backup.yml`)

**Triggers:**
- Daily at 2:30 AM UTC
- Manual trigger

**Jobs:**
1. **System Backup** - Database, Redis, config files
2. **S3 Upload** - Cloud backup storage
3. **Maintenance** - System cleanup and optimization
4. **Health Report** - Daily system status

### **Security Pipeline** (`.github/workflows/security-scan.yml`)

**Triggers:**
- Weekly on Sundays
- Dependency file changes

**Jobs:**
1. **Dependency Scan** - NPM audit, Socket Security
2. **Container Scan** - Trivy vulnerability scanning
3. **Code Security** - CodeQL, Semgrep analysis
4. **Infrastructure** - Docker/compose security
5. **Production Scan** - SSL/TLS, security headers

---

## 🎯 Testing Your Setup

### 1. **Test CI Pipeline**
```bash
# Create a test branch
git checkout -b test-ci-setup
echo "# Test CI" >> README.md
git add README.md
git commit -m "test: trigger CI pipeline"
git push origin test-ci-setup

# Create PR to main branch
```

### 2. **Test Deployment** (Manual)
```bash
# Go to GitHub Actions
# Select "Production Deployment"
# Click "Run workflow"
# Select "main" branch
```

### 3. **Test Backup** (Manual)
```bash
# Go to GitHub Actions
# Select "Automated Backup & Maintenance"
# Click "Run workflow"
```

---

## 🔧 Customization Options

### **Modify Deployment Strategy**

Edit `.github/workflows/deploy.yml`:

```yaml
# Change deployment conditions
if: github.ref == 'refs/heads/production'  # Deploy from 'production' branch

# Add staging environment
environment: 
  name: staging
  url: https://staging.${{ vars.PRODUCTION_DOMAIN }}
```

### **Add Environment-Specific Configurations**

```yaml
# In deploy.yml, add environment matrix
strategy:
  matrix:
    environment: [staging, production]
```

### **Custom Notifications**

```yaml
# Add Discord, Microsoft Teams, etc.
- name: Discord notification
  uses: Ilshidur/action-discord@master
  with:
    args: 'Deployment completed! 🚀'
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## 🚨 Troubleshooting

### **Common Issues**

1. **SSH Connection Failed**
   - Verify EC2 security group allows SSH (port 22)
   - Check SSH key format (no extra spaces/newlines)
   - Ensure EC2 instance is running

2. **Docker Commands Fail**
   - SSH into server and check Docker status: `sudo systemctl status docker`
   - Verify disk space: `df -h`
   - Check Docker logs: `docker-compose logs`

3. **Tests Failing**
   - Review test logs in GitHub Actions
   - Check environment variables in test jobs
   - Verify database/Redis connections in CI

4. **Deployment Rollback**
   ```bash
   # SSH into server
   ssh -i your-key.pem ubuntu@your-server-ip
   
   # Check container status
   docker ps
   
   # Rollback using backups
   cd /opt/gyvagaudziaispastai
   # Restore from backup (implement based on your strategy)
   ```

### **Monitoring Commands**

```bash
# Check deployment status
ssh -i your-key.pem ubuntu@your-server-ip 'docker-compose ps'

# View application logs
ssh -i your-key.pem ubuntu@your-server-ip 'docker-compose logs --tail=50'

# Check system resources
ssh -i your-key.pem ubuntu@your-server-ip 'free -h && df -h'
```

---

## 🎉 Success Verification

After setup, you should see:

✅ **CI Pipeline** - Running on every push/PR
✅ **Automated Deployments** - Deploying to production on main branch
✅ **Daily Backups** - Database and system backups
✅ **Security Scans** - Weekly vulnerability checks
✅ **Health Monitoring** - Daily system reports
✅ **Notifications** - Slack/email alerts

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**🔧 Need Help?**

1. Check GitHub Actions logs for detailed error messages
2. Review EC2 system logs: `/var/log/syslog`
3. Verify all secrets are correctly set in GitHub repository settings
4. Ensure EC2 instance has sufficient resources (CPU, memory, disk)

This CI/CD pipeline provides **enterprise-grade automation** at startup costs, ensuring reliable deployments, comprehensive testing, and proactive monitoring for your e-commerce platform.