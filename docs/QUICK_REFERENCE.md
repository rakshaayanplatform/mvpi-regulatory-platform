# 🚀 Quick Reference Guide - Team Workflow

## 📋 Daily Workflow Summary

### For New Features:
1. **Create Issue** → 2. **Branch from dev** → 3. **Develop** → 4. **PR to dev** → 5. **PR to staging** → 6. **PR to main**

### For Bug Fixes:
1. **Create Issue** → 2. **Branch from dev** → 3. **Fix** → 4. **PR to dev** → 5. **Hotfix to staging/main**

---

## 🛠️ Essential Commands

### Setup (First Time)
```bash
# Clone repository
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform

# Setup environment
cp .env.example .env
cp services/*/env.example services/*/.env

# Start services
docker-compose -f infrastructure/docker-compose.yml up -d
```

### Daily Development
```bash
# Update your local dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
# Go to GitHub and create PR to dev
```

### Testing Locally
```bash
# Test frontend
cd frontend && npm test

# Test backend services
cd services/auth_service && python -m pytest
cd services/patient_service && python -m pytest
# ... repeat for other services

# Test all services
docker-compose -f infrastructure/docker-compose.yml up -d
# Run your tests against running services
```

---

## 🌿 Branch Strategy Quick Reference

| Branch | Purpose | Protection | Required Checks |
|--------|---------|------------|-----------------|
| `main` | Production | ✅ Full | lint, test-changed, build |
| `staging` | QA/Testing | ✅ Full | lint, test-changed, build |
| `dev` | Development | ✅ Partial | lint, test-changed |
| `feature/*` | Features | ❌ None | None |

### Branch Flow:
```
feature/xyz → dev → staging → main
```

---

## ⚡ GitHub Actions Optimization

### What Runs When:

| Event | Lint | Test | Security | Build | Deploy |
|-------|------|------|----------|-------|--------|
| **PR to dev** | ✅ | ✅ (changed only) | ✅ | ❌ | ❌ |
| **Push to dev** | ✅ | ✅ (changed only) | ❌ | ❌ | ❌ |
| **PR to staging** | ✅ | ✅ (changed only) | ✅ | ✅ | ❌ |
| **Push to staging** | ✅ | ✅ (changed only) | ❌ | ✅ | ✅ (staging) |
| **PR to main** | ✅ | ✅ (changed only) | ✅ | ✅ | ❌ |
| **Push to main** | ✅ | ✅ (changed only) | ❌ | ✅ | ✅ (production) |

### Time Estimates:
- **Lint**: ~2-3 minutes
- **Test**: ~5-8 minutes (only changed services)
- **Security**: ~3-5 minutes (PRs only)
- **Build**: ~8-12 minutes (staging/main only)
- **Deploy**: ~5-10 minutes (staging/main only)

**Total per PR**: ~10-15 minutes (vs 30+ minutes in unoptimized workflow)

---

## 🚨 Common Issues & Solutions

### 1. Branch Protection Error
```bash
# Error: "Changes must be made through a pull request"
# Solution: Create PR instead of direct push
git push origin feature/your-branch
# Then create PR on GitHub UI
```

### 2. CI/CD Timeout
```bash
# Check what's running
# Usually caused by:
# - Large dependency downloads
# - Slow tests
# - Network issues
# Solution: Wait and retry, or optimize locally first
```

### 3. Test Failures
```bash
# Run tests locally first
cd frontend && npm test
cd services/auth_service && python -m pytest

# Check environment setup
docker-compose -f infrastructure/docker-compose.yml up -d
```

### 4. Merge Conflicts
```bash
# Update your branch
git fetch origin
git rebase origin/dev

# Resolve conflicts
# Then push
git push --force-with-lease origin feature/your-branch
```

---

## 📊 Status Check Requirements

### For dev branch:
- ✅ `lint` - Code formatting and style
- ✅ `test-changed` - Tests for modified services

### For staging branch:
- ✅ `lint` - Code formatting and style
- ✅ `test-changed` - Tests for modified services
- ✅ `build` - Docker image builds

### For main branch:
- ✅ `lint` - Code formatting and style
- ✅ `test-changed` - Tests for modified services
- ✅ `build` - Docker image builds

---

## 🎯 Best Practices

### 1. **Commit Messages**
```
✅ Good:
feat: add patient dashboard
fix: resolve authentication issue
docs: update API documentation
test: add unit tests for auth service

❌ Bad:
updated code
fixed bug
changes
```

### 2. **Branch Naming**
```
✅ Good:
feature/patient-dashboard
fix/auth-login-issue
hotfix/critical-security-fix
docs/update-readme

❌ Bad:
feature1
fix
new-feature
```

### 3. **PR Descriptions**
```
## What does this PR do?
- Add patient dashboard with real-time data
- Implement authentication flow
- Add unit tests

## Testing
- [x] Local tests pass
- [x] Manual testing completed
- [x] No breaking changes

## Screenshots
[Add screenshots if UI changes]
```

### 4. **Code Review Checklist**
- [ ] Code follows project standards
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered

---

## 📞 Quick Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| **Lead Developer** | vmtejus.sisail@gmail.com | Code reviews, architecture |
| **QA Lead** | vaishalibhosle.sisail@gmail.com | Testing, quality assurance |
| **DevOps** | mausam.sisial@gmail.com | CI/CD, deployment |
| **Design** | swathiga.sisail@gmail.com | UI/UX, design reviews |

---

## 🚀 Monthly Limits Tracking

### GitHub Actions Free Tier:
- **2,000 minutes/month**
- **20 concurrent jobs**

### Estimated Usage:
- **Small PR**: ~10-15 minutes
- **Medium PR**: ~15-25 minutes
- **Large PR**: ~25-40 minutes

### Optimization Tips:
1. **Test locally first** - avoid re-running failed tests
2. **Use `[skip ci]`** in commit message for docs-only changes
3. **Use `[skip security]`** for non-code changes
4. **Batch changes** - fewer PRs = fewer CI runs

---

## 📅 Weekly Schedule

### Monday:
- Team standup (9:00 AM IST)
- Review week's goals
- Assign new tasks

### Tuesday-Thursday:
- Feature development
- Code reviews
- Testing

### Friday:
- Week review
- Plan next week
- Deploy to staging (if ready)

### Weekend:
- Production deployment (if staging is stable)
- Monitoring and support

---

*Last updated: December 2024*
*For detailed workflow, see: `TEAM_WORKFLOW_GUIDE.md`* 