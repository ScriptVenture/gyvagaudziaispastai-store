# Git Branching Strategy

## Branch Structure

```
main (production)
├── staging (pre-production testing)
├── develop (integration branch)
├── feature/feature-name (feature development)
├── hotfix/fix-name (urgent production fixes)
└── release/version-number (release preparation)
```

## Branch Purposes

### `main` 
- **Production-ready code only**
- Protected branch (no direct pushes)
- Automatically deploys to production
- Tagged with version numbers

### `staging`
- **Pre-production testing**
- Mirrors production environment
- Used for final testing before release
- Automatically deploys to staging environment

### `develop`
- **Integration branch**
- Where feature branches are merged
- Continuous integration testing
- Base for new features

### `feature/feature-name`
- **Individual feature development**
- Branched from `develop`
- Merged back to `develop` via PR
- Deleted after merge

### `hotfix/fix-name`
- **Urgent production fixes**
- Branched from `main`
- Merged to both `main` and `develop`
- For critical bugs in production

### `release/version-number`
- **Release preparation**
- Branched from `develop`
- Bug fixes and final preparations
- Merged to `main` and `develop`

## Workflow

### Feature Development
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on feature
# ... make commits ...

# Push and create PR to develop
git push origin feature/user-authentication
```

### Release Process
```bash
# Create release branch
git checkout develop
git checkout -b release/v1.2.0

# Final preparations, bug fixes
# ... commits ...

# Merge to staging for testing
git checkout staging
git merge release/v1.2.0

# After testing, merge to main
git checkout main
git merge release/v1.2.0
git tag v1.2.0

# Merge back to develop
git checkout develop
git merge release/v1.2.0
```

### Hotfix Process
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-security-fix

# Fix the issue
# ... commits ...

# Merge to main
git checkout main
git merge hotfix/critical-security-fix
git tag v1.2.1

# Merge to develop
git checkout develop  
git merge hotfix/critical-security-fix
```

## Environment Mapping

| Branch | Environment | URL | Deploy Trigger |
|--------|-------------|-----|----------------|
| `main` | Production | https://gyvagaudziaispastai.com | Automatic on merge |
| `staging` | Staging | https://staging.gyvagaudziaispastai.com | Automatic on push |
| `develop` | Development | https://dev.gyvagaudziaispastai.com | Automatic on push |
| `feature/*` | Local | http://localhost:3000 | Manual |

## Environment Configuration Files

- **Development**: `.env.development` (committed)
- **Staging**: `.env.staging` (not committed, created from .example)
- **Production**: `.env.production` (not committed, created from .example)

## Protection Rules

### `main` branch
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict force pushes
- Require signed commits

### `staging` branch
- Require pull request reviews
- Require status checks to pass
- Allow force pushes (for quick fixes during testing)

### `develop` branch
- Require status checks to pass
- Allow direct pushes for team leads

## Docker Commands by Branch

### Development
```bash
./dev.sh up development  # or just ./dev.sh up
```

### Staging
```bash
# First time setup
cp .env.staging.example .env.staging
# Edit .env.staging with staging values

./dev.sh up staging
```

### Production
```bash
# First time setup  
cp .env.production.example .env.production
# Edit .env.production with production values

./dev.sh up production
```