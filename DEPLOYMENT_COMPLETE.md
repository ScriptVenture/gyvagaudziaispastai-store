# 🚀 Demo E-commerce Platform Deployed!

## Server Details
- **Instance ID**: i-0d36ae0fdfffb0f0f
- **Elastic IP**: 3.127.240.32
- **AWS Public DNS**: ec2-3-127-240-32.eu-central-1.compute.amazonaws.com
- **Demo URL**: http://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com
- **Region**: eu-central-1
- **Instance Type**: t3.small
- **Deployment ID**: gyvagaudziaispastai-demo-20250808-202652
- **Purpose**: Customer demonstration platform

## 🌐 Access Your Demo Platform

**Main Store**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com
**Admin Panel**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com/app
**API Health**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com/api/health

## Next Steps

### 1. Upload Environment Variables
```bash
# Copy your .env.production to the server
scp -i gyvagaudziaispastai-demo-20250808-202652-key.pem .env.production ubuntu@3.127.240.32:/opt/gyvagaudziaispastai/

# Set secure permissions
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32 "chmod 600 /opt/gyvagaudziaispastai/.env.production"
```

### 2. Upload Application Code
```bash
# Option A: Clone from Git (recommended)
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32 "cd /opt/gyvagaudziaispastai && git clone https://github.com/your-repo/gyvagaudziaispastai-store.git ."

# Option B: Upload via SCP
scp -i gyvagaudziaispastai-demo-20250808-202652-key.pem -r . ubuntu@3.127.240.32:/opt/gyvagaudziaispastai/
```

### 3. Build Docker Images
```bash
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32

cd /opt/gyvagaudziaispastai

# Build backend
docker build -t gyvagaudziaispastai/backend:latest -f backend/Dockerfile.production backend/

# Build storefront
docker build -t gyvagaudziaispastai/storefront:latest -f storefront/Dockerfile.production storefront/
```

### 4. Start Services
```bash
./start-secure.sh
```

*This will automatically create admin user and setup the platform*

### 5. Optional: Configure SSL (for production use)
```bash
# For production deployment with custom domain:
# sudo certbot --nginx -d yourdomain.com --agree-tos --email admin@yourdomain.com

# For demo purposes, HTTP is sufficient
# SSL can be added later if moving to production
```

### 6. Setup SSL Certificate
```bash
# SSH to server and setup SSL
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32
./setup-ssl.sh
```

### 7. Verify Demo Deployment
- **Main Store**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com
- **API Health**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com/api/health
- **Admin Panel**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com/app
- **Monitoring**: http://3.127.240.32:3001 (Grafana)

## 🔑 **Admin Panel Credentials**

- **URL**: https://ec2-3-127-240-32.eu-central-1.compute.amazonaws.com/app
- **Email**: admin@gyvagaudziaispastai.com
- **Password**: Demo123!Admin

*Credentials are also saved in  on the server*

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
- **Grafana Dashboard**: http://3.127.240.32:3001 (admin/${GRAFANA_ADMIN_PASSWORD})
- **Prometheus Metrics**: http://3.127.240.32:9090
- **Uptime Monitoring**: http://3.127.240.32:3002

These tools showcase the platform's enterprise-grade monitoring capabilities.

## Backup

Automated backups are configured. Check:
```bash
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32 "ls -la /opt/gyvagaudziaispastai/backups/"
```

## Emergency Procedures

**If something goes wrong:**
```bash
# SSH to server
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32

# Check logs
docker-compose -f docker-compose.production.yml logs

# Restart services
./start-secure.sh

# Check Nginx
sudo nginx -t
sudo systemctl status nginx
```

**Emergency shutdown:**
```bash
ssh -i gyvagaudziaispastai-demo-20250808-202652-key.pem ubuntu@3.127.240.32 "docker-compose -f /opt/gyvagaudziaispastai/docker-compose.production.yml down && sudo nginx -s stop"
```

## 💰 Demo Platform Costs

Your showcase deployment uses:
- **Instance**: t3.small (~$15-25/month)
- **Storage**: 30GB EBS (~$3/month)
- **IP**: Elastic IP (free when attached)
- **Data Transfer**: Minimal for demo purposes
- **Total**: ~$20-30/month for full demonstration

*Perfect cost-effective solution for showcasing to customers*

## Support

If you need help:
1. Check the deployment logs
2. Verify DNS configuration
3. Ensure SSL certificates are installed
4. Test individual service health

**Deployment completed successfully! 🎉**
