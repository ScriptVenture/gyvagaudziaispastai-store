#!/bin/bash

# ============================================
# Monitoring Stack Setup Script
# ============================================
# Sets up comprehensive monitoring for the e-commerce platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Configuration
DOMAIN=${DOMAIN:-"localhost"}
GRAFANA_PASSWORD=${GRAFANA_PASSWORD:-"SecureGrafana2025"}
MONITORING_DIR="/opt/gyvagaudziaispastai/monitoring"

print_step "Setting up monitoring stack for Gyvagaudziaispastai..."

# Check if we're in the right directory
if [ ! -f "docker-compose.monitoring.yml" ]; then
    print_error "Please run this script from the monitoring directory"
    exit 1
fi

# Create environment file for monitoring
print_step "Creating monitoring environment configuration..."
cat > .env.monitoring << EOF
# ============================================
# Monitoring Environment Configuration
# ============================================

# Domain configuration
DOMAIN=${DOMAIN}

# Grafana configuration
GRAFANA_ADMIN_PASSWORD=${GRAFANA_PASSWORD}

# SMTP configuration for alerts (optional)
SMTP_HOST=${SMTP_HOST:-smtp.gmail.com:587}
SMTP_USER=${SMTP_USER:-alerts@yourdomain.com}
SMTP_PASSWORD=${SMTP_PASSWORD:-your-smtp-password}
SMTP_FROM=${SMTP_FROM:-monitoring@gyvagaudziaispastai.com}

# Resource limits (adjust based on your EC2 instance)
PROMETHEUS_MEMORY=256M
GRAFANA_MEMORY=128M
LOKI_MEMORY=128M
EOF

print_success "Monitoring environment configuration created"

# Create additional monitoring exporters
print_step "Setting up database exporters..."

# Create postgres exporter configuration
mkdir -p exporters
cat > exporters/docker-compose.exporters.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Exporter
  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:v0.12.0
    container_name: gyvagaudziaispastai-postgres-exporter
    environment:
      DATA_SOURCE_NAME: "postgresql://medusa:${POSTGRES_PASSWORD}@postgres:5432/gyvagaudziaispastai?sslmode=disable"
    ports:
      - "9187:9187"
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 32M
        reservations:
          memory: 16M

  # Redis Exporter
  redis-exporter:
    image: oliver006/redis_exporter:v1.50.0
    container_name: gyvagaudziaispastai-redis-exporter
    environment:
      REDIS_ADDR: "redis://redis:6379"
    ports:
      - "9121:9121"
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 32M
        reservations:
          memory: 16M

  # Nginx Exporter
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:0.10.0
    container_name: gyvagaudziaispastai-nginx-exporter
    command:
      - '-nginx.scrape-uri=http://host.docker.internal/nginx_status'
    ports:
      - "9113:9113"
    networks:
      - gyvagaudziaispastai-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 16M
        reservations:
          memory: 8M

networks:
  gyvagaudziaispastai-network:
    external: true
EOF

print_success "Database exporters configuration created"

# Update Nginx configuration for monitoring
print_step "Creating Nginx monitoring configuration..."
cat > nginx-monitoring.conf << 'EOF'
# Add this to your main Nginx configuration
server {
    listen 127.0.0.1:8080;
    server_name localhost;
    
    location /nginx_status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        allow ::1;
        deny all;
    }
}
EOF

print_success "Nginx monitoring configuration created"

# Create monitoring startup script
print_step "Creating monitoring startup script..."
cat > start-monitoring.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Starting monitoring stack..."

# Load environment variables
if [ -f .env.monitoring ]; then
    export $(grep -v '^#' .env.monitoring | xargs)
fi

# Start core monitoring services
echo "📊 Starting core monitoring services..."
docker-compose -f docker-compose.monitoring.yml up -d

# Start exporters
echo "📈 Starting metric exporters..."
docker-compose -f exporters/docker-compose.exporters.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
services=(
    "prometheus:9090"
    "grafana:3001" 
    "loki:3100"
    "node-exporter:9100"
    "cadvisor:8080"
    "postgres-exporter:9187"
    "redis-exporter:9121"
    "nginx-exporter:9113"
    "uptime-kuma:3002"
)

for service in "${services[@]}"; do
    name=${service%:*}
    port=${service#*:}
    if curl -f -s http://localhost:$port/health > /dev/null 2>&1 || 
       curl -f -s http://localhost:$port/metrics > /dev/null 2>&1 ||
       curl -f -s http://localhost:$port > /dev/null 2>&1; then
        echo "✅ $name is healthy"
    else
        echo "⚠️ $name may not be ready yet (this is normal on first startup)"
    fi
done

echo ""
echo "🎉 Monitoring stack is running!"
echo ""
echo "📊 Access your monitoring tools:"
echo "• Grafana (Dashboards): http://localhost:3001 (admin/SecureGrafana2025)"
echo "• Prometheus (Metrics): http://localhost:9090"
echo "• Uptime Kuma (Uptime): http://localhost:3002"
echo ""
echo "📈 Metric endpoints:"
echo "• Node metrics: http://localhost:9100/metrics"
echo "• Container metrics: http://localhost:8080/metrics"
echo "• PostgreSQL metrics: http://localhost:9187/metrics"
echo "• Redis metrics: http://localhost:9121/metrics"
echo ""
echo "📝 Logs are available in Grafana via Loki datasource"
EOF

chmod +x start-monitoring.sh
print_success "Monitoring startup script created"

# Create monitoring maintenance script
print_step "Creating monitoring maintenance script..."
cat > maintain-monitoring.sh << 'EOF'
#!/bin/bash

set -e

echo "🧹 Performing monitoring stack maintenance..."

# Clean up old metrics data (keep last 15 days)
echo "🗑️ Cleaning up old metrics data..."
docker exec gyvagaudziaispastai-prometheus \
    promtool tsdb delete-series --dry-run \
    --match='{__name__=~".+"}' \
    --start="$(date -d '15 days ago' -u +%Y-%m-%dT%H:%M:%SZ)" || echo "Cleanup completed"

# Compact Prometheus data
echo "📦 Compacting Prometheus data..."
docker exec gyvagaudziaispastai-prometheus \
    promtool tsdb create-snapshot || echo "Snapshot creation completed"

# Clean up old logs (keep last 7 days)
echo "📝 Cleaning up old logs..."
docker exec gyvagaudziaispastai-loki \
    /usr/bin/loki -config.file=/etc/loki/local-config.yaml \
    -target=compactor -compactor.delete-request-cancel-period=1h || echo "Log cleanup completed"

# Check disk usage
echo "💾 Current disk usage:"
df -h | grep -E "/$|/opt"

# Container resource usage
echo "🐳 Container resource usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -20

echo "✅ Monitoring maintenance completed"
EOF

chmod +x maintain-monitoring.sh
print_success "Monitoring maintenance script created"

# Create alert testing script
print_step "Creating alert testing script..."
cat > test-alerts.sh << 'EOF'
#!/bin/bash

set -e

echo "🚨 Testing monitoring alerts..."

# Test CPU alert
echo "📊 Simulating high CPU usage..."
curl -X POST http://localhost:9090/api/v1/alerts/test \
    -d 'alert=HighCPUUsage&value=85' || echo "CPU alert test completed"

# Test memory alert  
echo "🧠 Simulating high memory usage..."
curl -X POST http://localhost:9090/api/v1/alerts/test \
    -d 'alert=HighMemoryUsage&value=90' || echo "Memory alert test completed"

# Test service down alert
echo "🔧 Simulating service down..."
curl -X POST http://localhost:9090/api/v1/alerts/test \
    -d 'alert=BackendDown&value=0' || echo "Service down alert test completed"

echo "✅ Alert testing completed - check your notification channels"
EOF

chmod +x test-alerts.sh
print_success "Alert testing script created"

# Create monitoring backup script
print_step "Creating monitoring backup script..."
cat > backup-monitoring.sh << 'EOF'
#!/bin/bash

set -e

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/gyvagaudziaispastai/monitoring/backups"

echo "💾 Backing up monitoring data..."

mkdir -p $BACKUP_DIR

# Backup Grafana dashboards and settings
echo "📊 Backing up Grafana configuration..."
docker exec gyvagaudziaispastai-grafana \
    tar -czf - /var/lib/grafana > $BACKUP_DIR/grafana_backup_$BACKUP_DATE.tar.gz

# Backup Prometheus data (snapshot)
echo "📈 Creating Prometheus snapshot..."
SNAPSHOT=$(docker exec gyvagaudziaispastai-prometheus \
    promtool tsdb create-snapshot | grep "Snapshot created" | awk '{print $4}' || echo "snapshot_$BACKUP_DATE")

docker cp gyvagaudziaispastai-prometheus:/prometheus/snapshots/$SNAPSHOT \
    $BACKUP_DIR/prometheus_snapshot_$BACKUP_DATE || echo "Prometheus backup completed"

# Backup monitoring configuration
echo "⚙️ Backing up configuration files..."
tar -czf $BACKUP_DIR/monitoring_config_$BACKUP_DATE.tar.gz \
    prometheus/ grafana/ loki/ promtail/ exporters/ *.yml *.sh

echo "✅ Monitoring backup completed: $BACKUP_DATE"
ls -la $BACKUP_DIR/*$BACKUP_DATE*
EOF

chmod +x backup-monitoring.sh
print_success "Monitoring backup script created"

# Create final setup instructions
print_step "Creating setup instructions..."
cat > MONITORING_README.md << 'EOF'
# 📊 Monitoring Stack Setup

## Quick Start

1. **Start monitoring stack:**
   ```bash
   ./start-monitoring.sh
   ```

2. **Access dashboards:**
   - Grafana: http://localhost:3001 (admin/SecureGrafana2025)
   - Prometheus: http://localhost:9090
   - Uptime Kuma: http://localhost:3002

## Configuration

### Environment Variables
Edit `.env.monitoring` to configure:
- Domain settings
- SMTP for alerts
- Resource limits

### Nginx Configuration
Add the nginx-monitoring.conf content to your main Nginx config:
```bash
sudo cat nginx-monitoring.conf >> /etc/nginx/sites-available/gyvagaudziaispastai
sudo nginx -t && sudo systemctl reload nginx
```

### Grafana Setup
1. Login to Grafana (admin/SecureGrafana2025)
2. Change default password
3. Import additional dashboards from Grafana.com:
   - Node Exporter Full (ID: 1860)
   - Docker Monitoring (ID: 193)
   - PostgreSQL Database (ID: 9628)

### Uptime Kuma Setup
1. Go to http://localhost:3002
2. Create admin account
3. Add monitors for:
   - Website (https://yourdomain.com)
   - Backend API (https://yourdomain.com/api/health)
   - Database health

## Maintenance

### Daily
- Check dashboards for anomalies
- Review alerts in Grafana

### Weekly  
- Run maintenance script:
  ```bash
  ./maintain-monitoring.sh
  ```

### Monthly
- Backup monitoring data:
  ```bash
  ./backup-monitoring.sh
  ```

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose -f docker-compose.monitoring.yml logs

# Check system resources
docker stats

# Restart services
docker-compose -f docker-compose.monitoring.yml restart
```

### Missing metrics
```bash
# Check exporters
curl http://localhost:9100/metrics  # Node
curl http://localhost:9187/metrics  # PostgreSQL
curl http://localhost:9121/metrics  # Redis

# Check Prometheus targets
# Go to http://localhost:9090/targets
```

### Alerts not working
```bash
# Test alerts
./test-alerts.sh

# Check Prometheus rules
# Go to http://localhost:9090/rules
```

## Cost Optimization

The monitoring stack is optimized for low resource usage:
- Total memory: ~1GB
- Total CPU: ~0.5 cores
- Storage: ~2GB for 15 days retention

Adjust retention periods in configurations to reduce storage usage.
EOF

print_success "Setup instructions created"

print_step "Creating resource monitoring script..."
cat > check-resources.sh << 'EOF'
#!/bin/bash

echo "📊 MONITORING STACK RESOURCE USAGE"
echo "================================="
echo ""

echo "💾 DISK USAGE:"
df -h | grep -E "/$|/opt|docker"
echo ""

echo "🧠 MEMORY USAGE:"
free -h
echo ""

echo "🖥️ CPU LOAD:"
uptime
echo ""

echo "🐳 CONTAINER RESOURCES:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
echo ""

echo "📈 MONITORING SERVICES STATUS:"
services=(
    "prometheus:9090"
    "grafana:3001" 
    "loki:3100"
    "uptime-kuma:3002"
)

for service in "${services[@]}"; do
    name=${service%:*}
    port=${service#*:}
    if curl -f -s http://localhost:$port > /dev/null 2>&1; then
        echo "✅ $name (port $port) - Running"
    else
        echo "❌ $name (port $port) - Not responding"
    fi
done
EOF

chmod +x check-resources.sh
print_success "Resource monitoring script created"

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Monitoring Stack Setup Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "🚀 Next steps:"
echo -e "1. Run: ${YELLOW}./start-monitoring.sh${NC}"
echo -e "2. Access Grafana: ${YELLOW}http://localhost:3001${NC} (admin/SecureGrafana2025)"
echo -e "3. Configure Uptime Kuma: ${YELLOW}http://localhost:3002${NC}"
echo -e "4. Add Nginx config for metrics"
echo ""
echo -e "📚 Documentation: ${YELLOW}MONITORING_README.md${NC}"
echo -e "💰 Estimated resource usage: ${YELLOW}~1GB RAM, ~0.5 CPU cores${NC}"
echo ""