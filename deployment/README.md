# 🚀 AWS Demo Platform Deployment

Quick deployment guide for showcasing the Gyvagaudziaispastai e-commerce platform to customers using AWS auto-assigned domains.

## 🎯 Purpose

This deployment creates a professional demonstration platform perfect for:
- Customer showcases
- Portfolio demonstrations  
- Proof of concept presentations
- Testing platform capabilities

**Uses AWS auto-assigned domain** - No custom domain purchase required!

## ⚡ Quick Start

### 1. Generate Secure Environment
```bash
./deployment/generate-secrets.sh
```
- Creates production-ready secrets
- Generates `.env.production` template
- Configures for AWS auto-assigned domain

### 2. Run Security Validation  
```bash
./deployment/validate-security.sh
```
- Validates environment security
- Checks for hardcoded secrets
- Ensures proper configuration

### 3. Deploy to AWS
```bash
./deployment/deploy-secure.sh
```
- Creates secure EC2 instance
- Configures security groups
- Sets up Nginx with security headers
- Allocates Elastic IP
- Provides deployment instructions

### 4. Update AWS Domain
```bash
./deployment/update-aws-domain.sh
```
- Auto-detects AWS public DNS
- Updates environment variables
- Uploads to server
- Restarts services

## 🌐 Access Your Demo

After deployment, access at:
- **Main Store**: `http://your-aws-public-dns.compute.amazonaws.com`
- **Admin Panel**: `http://your-aws-public-dns.compute.amazonaws.com/admin`
- **Monitoring**: `http://your-elastic-ip:3001` (Grafana)

## 💰 Cost

- **Instance**: t3.small (~$20/month)
- **Storage**: 30GB EBS (~$3/month)  
- **IP**: Elastic IP (free when attached)
- **Total**: ~$25/month

Perfect for customer demonstrations!

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `generate-secrets.sh` | Creates secure production secrets |
| `validate-security.sh` | Validates deployment security |
| `deploy-secure.sh` | Full AWS deployment automation |
| `update-aws-domain.sh` | Updates environment with AWS domain |
| `SECURITY_DEPLOYMENT_GUIDE.md` | Detailed step-by-step guide |

## 🛡️ Security Features

- ✅ **Server Hardening**: UFW firewall, fail2ban, SSH security
- ✅ **Container Security**: Non-privileged containers, security options  
- ✅ **Network Security**: Minimal ports, encrypted storage
- ✅ **Application Security**: CORS, security headers, rate limiting
- ✅ **Monitoring**: Grafana, Prometheus, structured logging

## 📖 Need More Details?

See `SECURITY_DEPLOYMENT_GUIDE.md` for comprehensive deployment instructions.

## 🆘 Quick Help

**Check deployment status:**
```bash
ssh -i your-key.pem ubuntu@YOUR_IP "docker-compose logs --tail=50"
```

**Restart services:**
```bash
ssh -i your-key.pem ubuntu@YOUR_IP "cd /opt/gyvagaudziaispastai && ./start-secure.sh"
```

**Update domain:**
```bash
./deployment/update-aws-domain.sh
```

---

**🎉 Ready to showcase your e-commerce platform to customers!**