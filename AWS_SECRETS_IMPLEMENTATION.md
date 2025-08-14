# 🔐 AWS Secrets Manager - Step-by-Step Implementation Guide

## For Gyvagaudziaispastai Store on EC2/VPS

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] AWS Account
- [ ] AWS CLI installed on your local machine
- [ ] Your production secrets ready
- [ ] Access to your EC2/VPS server

---

## 🚀 STEP 1: Install AWS CLI (On Your Local Machine)

```bash
# On Ubuntu/Debian
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

---

## 🔑 STEP 2: Configure AWS Credentials

```bash
# Configure AWS CLI with your credentials
aws configure

# Enter when prompted:
AWS Access Key ID: YOUR_ACCESS_KEY
AWS Secret Access Key: YOUR_SECRET_KEY
Default region name: eu-central-1
Default output format: json
```

---

## 📦 STEP 3: Create Your Secrets in AWS

### Option A: Using AWS CLI (Recommended)

```bash
# First, create a JSON file with your secrets
cat > secrets.json << 'EOF'
{
  "NODE_ENV": "production",
  "DATABASE_URL": "postgresql://medusa:YOUR_PASSWORD@postgres:5432/gyvagaudziaispastai",
  "REDIS_URL": "redis://redis:6379",
  "JWT_SECRET": "your-64-character-jwt-secret-here",
  "COOKIE_SECRET": "your-64-character-cookie-secret-here",
  "POSTGRES_USER": "medusa",
  "POSTGRES_PASSWORD": "your-secure-postgres-password",
  "POSTGRES_DB": "gyvagaudziaispastai",
  "MEDUSA_BACKEND_URL": "https://gyva.appiolabs.com",
  "FRONTEND_URL": "https://gyva.appiolabs.com",
  "NEXT_PUBLIC_MEDUSA_BACKEND_URL": "https://gyva.appiolabs.com",
  "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY": "your-publishable-key",
  "PAYSERA_PROJECT_ID": "your-paysera-id",
  "PAYSERA_SIGN_PASSWORD": "your-paysera-password",
  "VENIPAK_API_KEY": "your-venipak-key",
  "VENIPAK_USERNAME": "your-venipak-username",
  "VENIPAK_PASSWORD": "your-venipak-password"
}
EOF

# Create the secret in AWS
aws secretsmanager create-secret \
  --name gyvagaudziaispastai/production \
  --description "Production secrets for Gyvagaudziaispastai Store" \
  --secret-string file://secrets.json \
  --region eu-central-1

# Delete the local secrets file for security
rm secrets.json
```

### Option B: Using AWS Console (Visual Interface)

1. Go to [AWS Secrets Manager Console](https://console.aws.amazon.com/secretsmanager)
2. Click "Store a new secret"
3. Select "Other type of secret"
4. Enter your key-value pairs
5. Name it: `gyvagaudziaispastai/production`
6. Click "Next" → "Next" → "Store"

---

## 🖥️ STEP 4: Set Up IAM Role for Your EC2/VPS

### Create IAM Policy

```bash
# Create policy file
cat > secrets-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:eu-central-1:*:secret:gyvagaudziaispastai/*"
    }
  ]
}
EOF

# Create the policy
aws iam create-policy \
  --policy-name GyvagaudziaispastaiSecretsAccess \
  --policy-document file://secrets-policy.json
```

### Create IAM Role for EC2

```bash
# Create trust policy
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create the role
aws iam create-role \
  --role-name GyvagaudziaispastaiEC2Role \
  --assume-role-policy-document file://trust-policy.json

# Attach the policy to the role
aws iam attach-role-policy \
  --role-name GyvagaudziaispastaiEC2Role \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/GyvagaudziaispastaiSecretsAccess

# Create instance profile
aws iam create-instance-profile \
  --instance-profile-name GyvagaudziaispastaiEC2Profile

# Add role to instance profile
aws iam add-role-to-instance-profile \
  --instance-profile-name GyvagaudziaispastaiEC2Profile \
  --role-name GyvagaudziaispastaiEC2Role
```

---

## 💻 STEP 5: Configure Access for Your Server

### Option A: If using AWS EC2:
```bash
# Attach the IAM role to your EC2 instance
aws ec2 associate-iam-instance-profile \
  --instance-id YOUR_INSTANCE_ID \
  --iam-instance-profile Name=GyvagaudziaispastaiEC2Profile
```

### Option B: If using Non-AWS VPS (DigitalOcean, Linode, Hetzner, etc.):

#### Create IAM User Instead of Role
```bash
# Create a dedicated IAM user for your VPS
aws iam create-user --user-name gyvagaudziaispastai-vps

# Create access keys for this user
aws iam create-access-key --user-name gyvagaudziaispastai-vps

# IMPORTANT: Save the output!
# Access Key ID: AKIAXXXXXXXXXXXXXXXX
# Secret Access Key: YYYYYYYYYYYYYYYYYYYYYYYY
```

#### Attach Policy to IAM User
```bash
# Create policy for the user
cat > user-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret"
    ],
    "Resource": "arn:aws:secretsmanager:eu-central-1:*:secret:gyvagaudziaispastai/*"
  }]
}
EOF

# Attach the policy to the user
aws iam put-user-policy \
  --user-name gyvagaudziaispastai-vps \
  --policy-name SecretsAccess \
  --policy-document file://user-policy.json
```

#### Store AWS Credentials Securely on VPS
```bash
# SSH to your VPS
ssh user@your-vps-ip

# Create secure directory for AWS credentials
sudo mkdir -p /etc/gyvagaudziaispastai
sudo chmod 700 /etc/gyvagaudziaispastai

# Store AWS credentials (replace with your actual keys)
sudo cat > /etc/gyvagaudziaispastai/aws-credentials << 'EOF'
export AWS_ACCESS_KEY_ID="AKIAXXXXXXXXXXXXXXXX"
export AWS_SECRET_ACCESS_KEY="YYYYYYYYYYYYYYYYYYYYYYYY"
export AWS_REGION="eu-central-1"
EOF

# Secure the file
sudo chmod 600 /etc/gyvagaudziaispastai/aws-credentials
sudo chown root:root /etc/gyvagaudziaispastai/aws-credentials
```

---

## 📝 STEP 6: Update Your Backend Code

### Install AWS SDK

```bash
# SSH to your server
ssh ubuntu@your-server-ip

# Navigate to backend
cd /home/ubuntu/gyvagaudziaispastai-store/backend

# Install AWS SDK
npm install @aws-sdk/client-secrets-manager
```

### Create Secrets Loader

```bash
# Create the secrets loader file
cat > src/utils/aws-secrets.ts << 'EOF'
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ 
  region: "eu-central-1" 
});

export async function loadAwsSecrets(): Promise<void> {
  // Only load in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️  Skipping AWS Secrets (not in production)');
    return;
  }

  try {
    console.log('🔐 Loading secrets from AWS Secrets Manager...');
    
    const command = new GetSecretValueCommand({
      SecretId: "gyvagaudziaispastai/production",
      VersionStage: "AWSCURRENT"
    });

    const response = await client.send(command);
    
    if (!response.SecretString) {
      throw new Error('No secret string found');
    }

    const secrets = JSON.parse(response.SecretString);
    
    // Load each secret into environment variables
    Object.keys(secrets).forEach(key => {
      process.env[key] = secrets[key];
    });

    console.log('✅ Secrets loaded successfully from AWS');
    console.log(`📦 Loaded ${Object.keys(secrets).length} secrets`);
    
  } catch (error) {
    console.error('❌ Failed to load secrets from AWS:', error);
    
    // In production, fail if we can't load secrets
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 Cannot start without secrets in production!');
      process.exit(1);
    }
  }
}

// Helper function to verify secrets are loaded
export function verifyRequiredSecrets(): boolean {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'REDIS_URL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required secrets:', missing);
    return false;
  }
  
  console.log('✅ All required secrets are present');
  return true;
}
EOF
```

---

## 🔧 STEP 7: Update Your Application Startup

### Modify your backend startup file

```bash
# Update the main application file
cat > src/index.ts << 'EOF'
import { loadAwsSecrets, verifyRequiredSecrets } from './utils/aws-secrets';

async function startApplication() {
  try {
    // Load secrets from AWS first
    await loadAwsSecrets();
    
    // Verify all required secrets are loaded
    if (!verifyRequiredSecrets()) {
      throw new Error('Required secrets are missing');
    }
    
    // Now start your Medusa application
    // ... your existing Medusa startup code ...
    
    console.log('🚀 Application started successfully');
    
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
startApplication();
EOF
```

---

## 🐳 STEP 8: Update Docker Configuration

### For AWS EC2 Instances:

```yaml
# docker-compose.production.yml
services:
  backend:
    # Remove the .env file reference
    # env_file:
    #   - .env
    
    # EC2 instances use IAM role automatically
    environment:
      - NODE_ENV=production
      - AWS_REGION=eu-central-1
```

### For Non-AWS VPS (DigitalOcean, Linode, Hetzner, etc.):

#### Option 1: Pass AWS Credentials via Environment
```yaml
# docker-compose.production.yml
services:
  backend:
    # Remove the .env file reference
    # env_file:
    #   - .env
    
    environment:
      - NODE_ENV=production
      - AWS_REGION=eu-central-1
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
```

#### Option 2: Load from Secure File
```yaml
# docker-compose.production.yml
services:
  backend:
    # Remove the .env file reference
    # env_file:
    #   - .env
    
    # Load AWS credentials from secure location
    env_file:
      - /etc/gyvagaudziaispastai/aws-credentials
    
    environment:
      - NODE_ENV=production
```

### Update production.sh for Non-AWS VPS:
```bash
# Add this to the top of production.sh
if [ -f "/etc/gyvagaudziaispastai/aws-credentials" ]; then
    source /etc/gyvagaudziaispastai/aws-credentials
    export AWS_ACCESS_KEY_ID
    export AWS_SECRET_ACCESS_KEY
    export AWS_REGION
fi
```

---

## 🚀 STEP 9: Deploy and Test

```bash
# On your server
cd /home/ubuntu/gyvagaudziaispastai-store

# Rebuild your backend
docker compose -f docker-compose.production.yml build backend

# Start services
./production.sh start

# Check logs to verify secrets are loaded
docker compose -f docker-compose.production.yml logs backend | grep "Secrets"

# You should see:
# 🔐 Loading secrets from AWS Secrets Manager...
# ✅ Secrets loaded successfully from AWS
```

---

## ✅ STEP 10: Verify Everything Works

```bash
# Test your application
curl https://gyva.appiolabs.com/health

# Check backend logs
docker logs gyvagaudziaispastai-backend-prod

# Verify no .env file is needed anymore
ls -la | grep .env  # Should show no .env file
```

---

## 🔄 STEP 11: Set Up Automatic Secret Rotation (Optional)

```bash
# Create rotation lambda function
aws secretsmanager rotate-secret \
  --secret-id gyvagaudziaispastai/production \
  --rotation-lambda-arn arn:aws:lambda:eu-central-1:YOUR_ACCOUNT:function:SecretsManagerRotation \
  --rotation-rules AutomaticallyAfterDays=30
```

---

## 📊 STEP 12: Monitor Secret Usage

```bash
# View secret access logs
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=gyvagaudziaispastai/production \
  --region eu-central-1
```

---

## 🛠️ Troubleshooting

### For AWS EC2:

#### Issue: "Access Denied" when loading secrets
```bash
# Check IAM role is attached
aws ec2 describe-instances --instance-ids YOUR_INSTANCE_ID \
  --query 'Reservations[0].Instances[0].IamInstanceProfile'
```

### For Non-AWS VPS:

#### Issue: "Invalid credentials" or "Access Denied"
```bash
# Test credentials from your VPS
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
aws sts get-caller-identity

# Check IAM user permissions
aws iam get-user-policy \
  --user-name gyvagaudziaispastai-vps \
  --policy-name SecretsAccess
```

#### Issue: "The security token included in the request is invalid"
```bash
# Verify credentials are set correctly
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY
echo $AWS_REGION

# Test direct secret access
aws secretsmanager get-secret-value \
  --secret-id gyvagaudziaispastai/production \
  --region eu-central-1
```

### Common Issues (Both EC2 and VPS):

#### Issue: "Secret not found"
```bash
# Verify secret exists
aws secretsmanager describe-secret \
  --secret-id gyvagaudziaispastai/production \
  --region eu-central-1
```

#### Issue: "Cannot connect to AWS"
```bash
# Check network connectivity
curl -I https://secretsmanager.eu-central-1.amazonaws.com

# Test with AWS CLI
AWS_REGION=eu-central-1 aws secretsmanager list-secrets
```

#### Issue: "Timeout connecting to AWS"
```bash
# May need to configure proxy if behind firewall
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
```

---

## 🎯 Quick Checklist

### For AWS EC2:
- [ ] AWS CLI installed and configured
- [ ] Secret created in AWS Secrets Manager
- [ ] IAM role created with proper permissions
- [ ] IAM role attached to EC2 instance
- [ ] AWS SDK installed in backend
- [ ] Secrets loader code added
- [ ] Application startup modified
- [ ] Docker compose updated (no credentials needed)
- [ ] Application tested and working
- [ ] Old .env file removed

### For Non-AWS VPS:
- [ ] AWS CLI installed and configured
- [ ] Secret created in AWS Secrets Manager
- [ ] IAM user created with access keys
- [ ] IAM user policy attached
- [ ] AWS credentials stored securely on VPS
- [ ] AWS SDK installed in backend
- [ ] Secrets loader code added
- [ ] Application startup modified
- [ ] Docker compose updated (with AWS credentials)
- [ ] Application tested and working
- [ ] Old .env file removed

---

## 💰 Cost Estimate

- **Secrets Storage**: $0.40/month per secret
- **API Calls**: $0.05 per 10,000 calls
- **Total for your project**: ~$2-3/month

---

## 🌍 Works on ANY Hosting Provider!

AWS Secrets Manager works with:
- ✅ **AWS EC2** - Use IAM roles (most secure)
- ✅ **DigitalOcean** - Use IAM user credentials
- ✅ **Linode** - Use IAM user credentials
- ✅ **Vultr** - Use IAM user credentials
- ✅ **Hetzner** - Use IAM user credentials
- ✅ **OVH** - Use IAM user credentials
- ✅ **Any VPS** - Use IAM user credentials

## 🎉 Success!

Once completed, your secrets are:
- ✅ Encrypted at rest and in transit
- ✅ Access controlled via IAM
- ✅ Audited via CloudTrail
- ✅ Automatically rotatable
- ✅ Version controlled
- ✅ Never stored on your server
- ✅ Works on ANY VPS provider

Your Gyvagaudziaispastai Store now has enterprise-grade secret management, regardless of where it's hosted!

### 🔒 Security Comparison:

| Hosting | Method | Security Level |
|---------|--------|---------------|
| AWS EC2 | IAM Role | ⭐⭐⭐⭐⭐ |
| Non-AWS VPS | IAM User + Keys | ⭐⭐⭐⭐ |
| Any VPS | .env file | ⭐⭐ |

Even on non-AWS VPS, you get 4-star security vs 2-star with .env files!
