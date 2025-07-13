# Branch Protection Rules - Rakshaayan Platform

## 🛡️ Branch Protection Setup

### Main Branch Protection
**Branch**: `main`
**Settings**:
- ✅ Require a pull request before merging
- ✅ Require approvals: **2 reviewers**
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ✅ Require signed commits
- ✅ Require linear history
- ✅ Include administrators
- ✅ Restrict pushes that create files larger than 100 MB

**Required Status Checks**:
- `test-backend`
- `test-ai-service`
- `test-frontend`
- `build-docker`
- `security-scan`
- `code-quality`

### Staging Branch Protection
**Branch**: `staging`
**Settings**:
- ✅ Require a pull request before merging
- ✅ Require approvals: **1 reviewer**
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

**Required Status Checks**:
- `test-backend`
- `test-ai-service`
- `test-frontend`
- `build-docker`

### Dev Branch Protection
**Branch**: `dev`
**Settings**:
- ✅ Require a pull request before merging
- ✅ Require approvals: **1 reviewer**
- ✅ Require status checks to pass before merging
- ✅ Include administrators

**Required Status Checks**:
- `test-backend`
- `test-ai-service`
- `test-frontend`

## 🔄 Workflow

### Development Flow
```
Feature Branch → Dev Branch → Staging Branch → Main Branch
```

### Branch Naming Convention
- **Feature branches**: `feature/description` (e.g., `feature/voice-input`)
- **Bug fixes**: `fix/description` (e.g., `fix/auth-bug`)
- **Hotfixes**: `hotfix/description` (e.g., `hotfix/security-patch`)
- **Documentation**: `docs/description` (e.g., `docs/api-update`)

### Pull Request Process
1. **Create PR** from feature branch to appropriate target branch
2. **Add reviewers** based on changes:
   - Backend changes: Tejus (required)
   - Frontend changes: Mausam (required)
   - AI/ML changes: Swathiga (required)
   - Design changes: Vaishali (required)
3. **Wait for CI/CD** to complete
4. **Address review comments**
5. **Merge** when approved

## 🚀 Deployment Strategy

### Dev Environment
- **Branch**: `dev`
- **Purpose**: Integration testing
- **Deployment**: Automatic on push to dev
- **URL**: `https://dev.rakshaayan.gov.in`

### Staging Environment
- **Branch**: `staging`
- **Purpose**: Pre-production testing
- **Deployment**: Manual approval required
- **URL**: `https://staging.rakshaayan.gov.in`

### Production Environment
- **Branch**: `main`
- **Purpose**: Live production
- **Deployment**: Manual approval required
- **URL**: `https://rakshaayan.gov.in`

## 🔧 Setup Instructions

### 1. Enable Branch Protection
1. Go to repository Settings → Branches
2. Click "Add rule" for each branch (main, staging, dev)
3. Configure settings as specified above
4. Save changes

### 2. Set Up Environments
1. Go to repository Settings → Environments
2. Create environments: `staging`, `production`
3. Add environment protection rules
4. Configure deployment secrets

### 3. Configure Required Status Checks
1. In branch protection rules
2. Add the required status checks listed above
3. Ensure they are marked as "Required"

### 4. Set Up Team Permissions
1. Go to repository Settings → Collaborators and teams
2. Add team members with appropriate permissions
3. Configure team access to specific branches

## 📋 Required Secrets

### Repository Secrets
- `SONAR_TOKEN`: SonarCloud token for code quality analysis
- `DOCKER_USERNAME`: Docker registry username
- `DOCKER_PASSWORD`: Docker registry password

### Environment Secrets
#### Staging Environment
- `STAGING_DB_URL`: Staging database connection string
- `STAGING_REDIS_URL`: Staging Redis connection string
- `STAGING_API_KEYS`: Staging API keys

#### Production Environment
- `PROD_DB_URL`: Production database connection string
- `PROD_REDIS_URL`: Production Redis connection string
- `PROD_API_KEYS`: Production API keys
- `PROD_SSL_CERT`: Production SSL certificate
- `PROD_SSL_KEY`: Production SSL private key

## 🚨 Emergency Procedures

### Hotfix Process
1. Create hotfix branch from main: `git checkout -b hotfix/emergency-fix`
2. Make minimal required changes
3. Create PR to main branch
4. Get emergency approval from team lead
5. Deploy immediately after merge

### Rollback Process
1. Identify the problematic commit
2. Create rollback branch: `git checkout -b rollback/commit-hash`
3. Revert the problematic changes
4. Create PR to main branch
5. Deploy rollback immediately

## 📊 Monitoring

### Deployment Monitoring
- Monitor deployment status in GitHub Actions
- Check application health after deployment
- Monitor error rates and performance metrics

### Security Monitoring
- Regular security scans
- Dependency vulnerability checks
- Code quality analysis
- Access log monitoring

---

**Remember**: Always test in dev before staging, and in staging before production! 