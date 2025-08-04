# Gyvagaudziaispastai Store - Docker Deployment Guide

This guide will help you deploy the complete Gyvagaudziaispastai e-commerce stack using Docker.

## 🏗️ Architecture

The application consists of:
- **Medusa Backend**: Node.js API server with admin panel
- **Next.js Storefront**: Custom designed storefront with your beautiful UI
- **PostgreSQL**: Database
- **Redis**: Caching and session storage
- **Nginx**: Reverse proxy (production only)

## 🚀 Quick Start

### 1. Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- Git

### 2. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd gyvagaudziaispastai-store

# Copy environment variables
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 3. Development Deployment

```bash
# Build and start all services
docker-compose up --build -d

# Check logs
docker-compose logs -f

# Services will be available at:
# - Storefront: http://localhost:8000
# - Backend API: http://localhost:9000
# - Admin Panel: http://localhost:7001
```

### 4. Production Deployment

```bash
# Use production profile with Nginx
docker-compose --profile production up --build -d

# Services will be available at:
# - Main site: http://localhost (port 80)
# - HTTPS: https://localhost (port 443, requires SSL setup)
```

## 🔧 Configuration

### Environment Variables

Edit `.env` file with your specific configuration:

```bash
# Database
DB_PASSWORD=your_secure_database_password

# Security
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
COOKIE_SECRET=your_super_secure_cookie_secret_minimum_32_characters

# Paysera Payment
PAYSERA_PROJECT_ID=123456
PAYSERA_SIGN_PASSWORD=your_paysera_signing_password

# Domain (Production)
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
ADMIN_CORS=https://admin.yourdomain.com
STORE_CORS=https://yourdomain.com
```

### SSL Configuration (Production)

1. Create SSL certificates directory:
```bash
mkdir -p nginx/ssl
```

2. Add your SSL certificates:
```bash
# Copy your certificates
cp your-domain.crt nginx/ssl/
cp your-domain.key nginx/ssl/
```

3. Update nginx configuration in `nginx/nginx.conf`

## 📊 Database Setup

### Initial Setup

The database will be automatically initialized on first run. To seed with sample data:

```bash
# Access backend container
docker-compose exec backend bash

# Run migrations and seed data
npm run migration:run
npm run seed
```

### Backup and Restore

```bash
# Backup database
docker-compose exec postgres pg_dump -U medusa_user medusa_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U medusa_user medusa_db < backup.sql
```

## 🔍 Monitoring and Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f storefront
docker-compose logs -f backend
docker-compose logs -f postgres

# Monitor resource usage
docker stats
```

## 🛠️ Maintenance

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart services
docker-compose up --build -d
```

### Scale Services

```bash
# Scale storefront for high traffic
docker-compose up -d --scale storefront=3
```

### Health Checks

All services include health checks. Check status:

```bash
# View service health
docker-compose ps

# Manual health check
curl http://localhost:8000/health
curl http://localhost:9000/health
```

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Update JWT and Cookie secrets
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Monitor logs for suspicious activity
- [ ] Keep Docker images updated

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   docker-compose logs postgres
   docker-compose restart postgres backend
   ```

2. **Storefront Build Fails**
   ```bash
   docker-compose logs storefront
   # Check Node.js memory limits
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Performance Optimization

1. **Database Performance**
   - Increase PostgreSQL memory settings
   - Add database indexes for frequently queried fields

2. **Storefront Performance**
   - Enable CDN for static assets
   - Configure Redis caching
   - Optimize images

3. **Docker Performance**
   - Use multi-stage builds
   - Implement proper layer caching
   - Use Docker build cache

## 📈 VPS Deployment

### Recommended VPS Specifications

- **Minimum**: 2 CPU cores, 4GB RAM, 20GB SSD
- **Recommended**: 4 CPU cores, 8GB RAM, 40GB SSD
- **High Traffic**: 8 CPU cores, 16GB RAM, 80GB SSD

### VPS Setup Script

```bash
#!/bin/bash
# VPS deployment script

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone <your-repo-url>
cd gyvagaudziaispastai-store
cp .env.example .env

# Edit .env file with production values
# Then run:
docker-compose --profile production up --build -d
```

## 📞 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions

## 🔄 Backup Strategy

### Automated Backups

Create a backup script:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U medusa_user medusa_db | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Backup uploaded files
docker run --rm -v gyvagaudziaispastai-store_medusa_uploads:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/uploads_backup_$DATE.tar.gz -C /data .

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Add to crontab for daily backups:
```bash
0 2 * * * /path/to/backup.sh
```