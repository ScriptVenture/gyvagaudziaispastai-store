# Security Analysis Report - Gyvagaudziaispastai Store

## Analysis Date: January 14, 2025

## Critical Security Issues Found

### 1. PRODUCTION CREDENTIALS IN .ENV FILE ✅ PROPERLY SECURED
**Severity: LOW (Properly Managed)**
**Location**: `.env` file in root directory

**Current Status:**
✅ **GOOD**: `.env` file is properly excluded from Git repository
✅ **GOOD**: File is listed in `.gitignore`
✅ **GOOD**: No history of `.env` in Git commits

**Found Credentials (on EC2 server only):**
- Production database password
- JWT_SECRET and COOKIE_SECRET
- PAYSERA_SIGN_PASSWORD
- VENIPAK API credentials

**Recommendations for VPS Migration:**
- Use environment variables directly on the VPS
- Consider using a secrets management solution (HashiCorp Vault, AWS Secrets Manager)
- Ensure proper file permissions (600) for any .env files
- Rotate credentials after migration
- Use different credentials for staging vs production

### 2. HARDCODED FALLBACK SECRETS ⚠️ PARTIALLY FIXED
**Severity: MEDIUM (Reduced from HIGH)**
**Location**: `backend/medusa-config.ts`

**Current Status:**
⚠️ **PARTIALLY FIXED**: Main config updated but issues remain
- Lines 17-18: Changed from "supersecret" to env var names as strings
- Line 54: **STILL HAS "supersecret"** in user module config

**Remaining Issues:**
```typescript
// Line 54 - Still vulnerable:
jwt_secret: process.env.JWT_SECRET || "supersecret",

// Lines 17-18 - Better but not ideal:
jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
cookieSecret: process.env.COOKIE_SECRET || "COOKIE_SECRET",
```

**Recommendations:**
1. **Fix Line 54**: Change `|| "supersecret"` to remove fallback entirely
2. **Consider removing all fallbacks**: Better to fail fast if env vars are missing
3. **Alternative approach**: Use a config validation function that throws errors for missing required env vars

### 3. EXPOSED CREDENTIALS IN DOCKER-COMPOSE
**Severity: HIGH**
**Location**: `docker-compose.yml`

**Issues Found:**
- Hardcoded weak credentials in development compose file:
  - JWT_SECRET: `supersecret-jwt-key-change-in-production`
  - COOKIE_SECRET: `supersecret-cookie-key-change-in-production`
  - PAYSERA_SIGN_PASSWORD exposed: `feb5e1c0c06a4737a6896b65f99808cd`
  - Medusa publishable key exposed: `pk_ffe2341af0aa127aa05b4354cc290b002495e3b46c21e62721339d32af07c074`
  - Default postgres credentials: `postgres:postgres`

**Risk**: Development credentials might accidentally be used in production if wrong compose file is deployed.

### 4. NGINX SECURITY CONFIGURATION
**Severity: MEDIUM**
**Location**: `nginx/nginx.conf`

**Positive Security Measures Found:**
✅ Security headers implemented (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, HSTS)
✅ Rate limiting configured (30r/s for API and storefront)
✅ Server tokens hidden
✅ Gzip compression enabled

**Issues Found:**
- Backend servers referenced by hardcoded IP addresses (`172.18.0.4`, `172.18.0.5`)
  - Should use Docker service names for better flexibility
- No WAF (Web Application Firewall) rules
- Missing Content-Security-Policy header
- No request body inspection for malicious payloads

### 5. AWS IAM POLICY - OVERLY PERMISSIVE
**Severity: MEDIUM**
**Location**: `deployment-policy.json`

**Issues Found:**
- EC2 permissions are too broad with `"Resource": "*"`
  - Can terminate ANY EC2 instance
  - Can create security groups without restrictions
  - Can access all snapshots and volumes
- No resource tagging enforcement
- No IP restrictions
- No MFA requirement for destructive actions

**Recommendations:**
- Restrict EC2 actions to specific regions
- Add resource tags and limit actions to tagged resources only
- Require MFA for terminate/delete operations
- Use least privilege principle

### 6. PAYMENT INTEGRATION SECURITY ISSUES
**Severity: HIGH**
**Location**: `backend/src/modules/paysera/service.ts`

**Issues Found:**
- **Weak Cryptography**: Using MD5 for signature generation (line 176, 198)
  ```typescript
  crypto.createHash('md5').update(data + this.config.sign_password).digest('hex')
  ```
  MD5 is cryptographically broken and should not be used for security purposes

- **Sensitive Data in Logs**: Console.log exposing payment details (line 55-63)
  - Logs project_id, amounts, encoded data, and signatures
  - These logs could expose sensitive payment information in production

- **No Input Validation**: Missing validation for payment amounts and currency codes
- **Callback Validation Can Be Bypassed**: Comment suggests validation might be skipped (line 147)

**Recommendations:**
- Use SHA-256 or better for signatures (if Paysera API supports it)
- Remove all console.log statements with sensitive data
- Add input validation for amounts and currency
- Ensure callback validation is always enforced

### 7. FRONTEND SECURITY CONCERNS ✅ MOSTLY FIXED
**Severity: LOW (Reduced from MEDIUM)**
**Location**: `storefront/src/app/checkout/page.tsx`

**Fixed Issues:**
✅ **Console Logs Removed**: All sensitive console.log statements have been removed
✅ **CSRF Protection Added**: Implemented CSRF token system with:
  - Token generation API (`/api/csrf`)
  - Secure token storage (httpOnly cookies + session storage)
  - Token validation hook (`useCsrf`)
  - Automatic token refresh

**Remaining Issues:**
⚠️ **Client-Side Input Validation**: Still needs implementation
⚠️ **Price Calculations on Frontend**: Still done client-side (should be server-side only)

**Implementation Details:**
- CSRF tokens expire after 1 hour
- Tokens stored in httpOnly cookies (secure in production)
- Session-based validation prevents token replay attacks

### 8. DEPLOYMENT SCRIPT SECURITY ISSUES
**Severity: HIGH**
**Location**: `deployment/deploy-secure.sh`

**Issues Found:**
- **Hardcoded Admin Credentials**: Default admin credentials in script (line 511-513)
  - Email: `admin@gyvagaudziaispastai.com`
  - Password: `Demo123!Admin`
  - These are predictable and exposed in the script

- **SSH Access Too Permissive**: SSH open to entire internet (line 219)
  ```bash
  --cidr 0.0.0.0/0
  ```
  Should be restricted to specific IPs

- **Credentials Stored in Plain Text**: Admin credentials saved to unencrypted file (line 527)
  ```bash
  cat > admin-credentials.txt
  ```

- **Weak SSL Setup**: Uses self-signed certificates initially (line 334-338)
- **Demo Email for Let's Encrypt**: Uses `demo@example.com` for SSL certificates (line 692)
- **No Secret Rotation**: No mechanism for rotating secrets after deployment
- **Unencrypted Backups**: No mention of backup encryption

**Recommendations:**
- Generate random admin passwords on deployment
- Restrict SSH to specific IP ranges
- Use AWS Secrets Manager for credentials
- Implement proper SSL from the start
- Add secret rotation capabilities
- Encrypt all backups

## Summary of Critical Issues - UPDATED

### 🔴 CRITICAL Priority (Fix Immediately)
1. ~~**Exposed production credentials in .env file**~~ ✅ Already secure - not in repository
2. **Hardcoded secrets in source code** - Remove all hardcoded values in medusa-config.ts
3. **Weak cryptography (MD5)** - Paysera module uses MD5 (may be required by their API)

### 🟠 HIGH Priority (Fix Before Production)
1. **Payment module security issues** - Remove sensitive logs, add validation
2. **Docker compose with weak credentials** - Use secure defaults
3. **Deployment script security** - Fix SSH access, credential storage

### 🟡 MEDIUM Priority (Important Improvements)
1. **Nginx configuration** - Add CSP headers, WAF rules
2. **AWS IAM overly permissive** - Apply least privilege
3. **Frontend security** - Remove console logs, add CSRF protection

### 9. API CLIENT SECURITY ISSUES
**Severity: LOW-MEDIUM**
**Location**: `storefront/src/lib/medusa.ts`

**Issues Found:**
- **Debug Information in Console Logs**: Multiple console.log statements (lines 43, 53, 59, 64, 66)
  - Logs product handles, IDs, and API responses
  - Could expose API structure and data in production

- **No Request Rate Limiting**: No client-side rate limiting implementation
- **Error Details Exposed**: Detailed error messages logged to console
- **No Request Timeout**: Missing timeout configuration for API requests
- **No Request Retry Logic**: No automatic retry for failed requests

**Recommendations:**
- Remove or conditionally disable console.log in production
- Implement client-side rate limiting
- Sanitize error messages before logging
- Add request timeout configuration
- Implement exponential backoff for retries

## Additional Security Recommendations

### Infrastructure Security
1. **Implement Web Application Firewall (WAF)**
   - Use AWS WAF or Cloudflare WAF
   - Block common attack patterns
   - Rate limit aggressive clients

2. **Enable Security Monitoring**
   - Set up AWS CloudWatch alerts
   - Monitor for suspicious activity
   - Log all authentication attempts

3. **Implement Secrets Management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Rotate secrets regularly
   - Never commit secrets to Git

4. **Database Security Hardening**
   - Enable SSL/TLS for database connections
   - Use connection pooling with limits
   - Regular automated backups with encryption
   - Implement query timeout limits

5. **Container Security**
   - Scan Docker images for vulnerabilities
   - Use minimal base images (Alpine)
   - Run containers as non-root users
   - Implement container resource limits

### Application Security
1. **Input Validation**
   - Validate all user inputs on both client and server
   - Use parameterized queries
   - Sanitize HTML content
   - Implement file upload restrictions

2. **Authentication & Authorization**
   - Implement MFA for admin accounts
   - Use secure session management
   - Implement account lockout policies
   - Regular session timeout

3. **API Security**
   - Implement API rate limiting per user/IP
   - Use API versioning
   - Validate all API inputs
   - Implement request signing for sensitive operations

## Security Checklist for Production

### Before Deployment
- [ ] Rotate all exposed credentials
- [ ] Remove .env from repository
- [ ] Remove all console.log statements
- [ ] Update all dependencies to latest versions
- [ ] Run security vulnerability scan
- [ ] Configure proper CORS policies
- [ ] Enable HTTPS everywhere
- [ ] Set up monitoring and alerting

### After Deployment
- [ ] Verify SSL certificate installation
- [ ] Test rate limiting
- [ ] Verify backup procedures
- [ ] Test disaster recovery plan
- [ ] Schedule regular security audits
- [ ] Set up automated security scanning

## Areas to Analyze Next

1. **Authentication & Authorization**
   - Check JWT implementation
   - Review session management
   - Analyze user role management

2. **API Security**
   - CORS configuration review
   - Rate limiting implementation
   - Input validation

3. **Database Security**
   - SQL injection prevention
   - Connection security (SSL/TLS)
   - Query parameterization

4. **Payment Integration Security**
   - Paysera module security
   - Payment data handling
   - PCI compliance considerations

5. **Infrastructure Security**
   - Docker configuration
   - Nginx configuration
   - SSL/TLS setup

6. **Frontend Security**
   - XSS prevention
   - CSRF protection
   - Secure cookie handling

7. **Dependency Security**
   - Outdated packages
   - Known vulnerabilities

8. **Deployment Security**
   - AWS configuration
   - Secrets management
   - CI/CD pipeline security

## Immediate Actions Required

1. **Rotate ALL exposed credentials immediately**
2. **Remove .env file from repository**
3. **Implement proper secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)**
4. **Remove hardcoded fallback secrets**

---

*Analysis in progress - more findings will be added as the review continues*
