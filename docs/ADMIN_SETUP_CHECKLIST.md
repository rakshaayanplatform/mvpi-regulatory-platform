# 🛠️ Admin Setup Checklist for Rakshaayan Platform

> **For: vmtejus.sisail@gmail.com (Repository Admin)**
> 
> Complete these steps before team members start development work.

## 📋 Pre-Team Setup Checklist

### ✅ 1. GitHub Repository Settings

#### Repository Visibility & Permissions
- [ ] **Repository is Private** (for security during development)
- [ ] **Admin access** granted to vmtejus.sisail@gmail.com
- [ ] **Write access** granted to team members:
  - [ ] vaishalibhosle.sisail@gmail.com
  - [ ] mausam.sisial@gmail.com  
  - [ ] swathiga.sisail@gmail.com

#### Repository Settings (Settings → General)
- [ ] **Repository name**: `mvpi-regulatory-platform`
- [ ] **Description**: "India's National Medical Device Adverse Event Reporting Platform"
- [ ] **Topics**: `medical-devices`, `adverse-events`, `healthcare`, `india`, `regulatory`, `ai`, `django`, `nextjs`
- [ ] **Default branch**: `main`
- [ ] **Allow auto-merge**: ✅ Enabled
- [ ] **Allow squash merging**: ✅ Enabled
- [ ] **Allow rebase merging**: ✅ Enabled

### ✅ 2. Branch Protection Rules

#### Main Branch Protection
**Path**: Settings → Branches → Add rule for `main`

- [ ] **Require a pull request before merging**: ✅
  - [ ] **Require approvals**: 2 (minimum)
  - [ ] **Dismiss stale PR approvals when new commits are pushed**: ✅
  - [ ] **Require review from code owners**: ✅
- [ ] **Require status checks to pass before merging**: ✅
  - [ ] **Require branches to be up to date before merging**: ✅
  - [ ] **Status checks that are required**:
    - [ ] `backend-tests`
    - [ ] `frontend-tests`
    - [ ] `ai-service-tests`
    - [ ] `security-scan`
    - [ ] `build-check`
- [ ] **Require conversation resolution before merging**: ✅
- [ ] **Require signed commits**: ✅ (if GPG keys are set up)
- [ ] **Require linear history**: ✅
- [ ] **Include administrators**: ✅
- [ ] **Restrict pushes that create files that are larger than 100 MB**: ✅

#### Dev Branch Protection
**Path**: Settings → Branches → Add rule for `dev`

- [ ] **Require a pull request before merging**: ✅
  - [ ] **Require approvals**: 1 (minimum)
  - [ ] **Dismiss stale PR approvals when new commits are pushed**: ✅
- [ ] **Require status checks to pass before merging**: ✅
  - [ ] **Status checks that are required**:
    - [ ] `backend-tests`
    - [ ] `frontend-tests`
    - [ ] `build-check`
- [ ] **Require conversation resolution before merging**: ✅
- [ ] **Include administrators**: ✅

#### Staging Branch Protection
**Path**: Settings → Branches → Add rule for `staging`

- [ ] **Require a pull request before merging**: ✅
  - [ ] **Require approvals**: 2 (minimum)
  - [ ] **Require review from code owners**: ✅
- [ ] **Require status checks to pass before merging**: ✅
  - [ ] **Status checks that are required**:
    - [ ] `backend-tests`
    - [ ] `frontend-tests`
    - [ ] `ai-service-tests`
    - [ ] `security-scan`
    - [ ] `build-check`
    - [ ] `deployment-check`
- [ ] **Require conversation resolution before merging**: ✅
- [ ] **Include administrators**: ✅

### ✅ 3. GitHub Environments Setup

#### Development Environment
**Path**: Settings → Environments → New environment: `development`

- [ ] **Environment name**: `development`
- [ ] **Protection rules**:
  - [ ] **Required reviewers**: Add team members
  - [ ] **Wait timer**: 0 minutes
  - [ ] **Deployment branches**: `dev` branch only
- [ ] **Environment secrets**:
  - [ ] `DATABASE_URL`
  - [ ] `DJANGO_SECRET_KEY`
  - [ ] `JWT_SECRET_KEY`
  - [ ] `EMAIL_HOST_PASSWORD`

#### Staging Environment
**Path**: Settings → Environments → New environment: `staging`

- [ ] **Environment name**: `staging`
- [ ] **Protection rules**:
  - [ ] **Required reviewers**: Add admin (vmtejus.sisail@gmail.com)
  - [ ] **Wait timer**: 5 minutes
  - [ ] **Deployment branches**: `staging` branch only
- [ ] **Environment secrets**:
  - [ ] `DATABASE_URL`
  - [ ] `DJANGO_SECRET_KEY`
  - [ ] `JWT_SECRET_KEY`
  - [ ] `EMAIL_HOST_PASSWORD`
  - [ ] `AI_SERVICE_API_KEY`

#### Production Environment
**Path**: Settings → Environments → New environment: `production`

- [ ] **Environment name**: `production`
- [ ] **Protection rules**:
  - [ ] **Required reviewers**: Add admin (vmtejus.sisail@gmail.com)
  - [ ] **Wait timer**: 10 minutes
  - [ ] **Deployment branches**: `main` branch only
- [ ] **Environment secrets**:
  - [ ] `DATABASE_URL`
  - [ ] `DJANGO_SECRET_KEY`
  - [ ] `JWT_SECRET_KEY`
  - [ ] `EMAIL_HOST_PASSWORD`
  - [ ] `AI_SERVICE_API_KEY`
  - [ ] `CDSCO_API_KEY`

### ✅ 4. Repository Secrets Setup

#### Repository Secrets (Settings → Secrets and variables → Actions)
- [ ] **DOCKER_USERNAME**: Your Docker Hub username
- [ ] **DOCKER_PASSWORD**: Your Docker Hub password/token
- [ ] **SONAR_TOKEN**: SonarCloud token (if using)
- [ ] **SLACK_WEBHOOK_URL**: For notifications (optional)
- [ ] **DEPLOY_SSH_KEY**: SSH key for server deployment
- [ ] **DEPLOY_HOST**: Deployment server hostname/IP

### ✅ 5. Issue Templates Setup

#### Bug Report Template
**Path**: Settings → General → Issues → Set up templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: ['bug']
assignees: ['vmtejus.sisail@gmail.com']
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows, macOS, Ubuntu]
 - Browser: [e.g. Chrome, Firefox, Safari]
 - Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

#### Feature Request Template
Create `.github/ISSUE_TEMPLATE/feature_request.md`:
```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: ['enhancement']
assignees: ['vmtejus.sisail@gmail.com']
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### ✅ 6. Pull Request Template

**Path**: Settings → General → Pull requests → Set up templates

Create `.github/pull_request_template.md`:
```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Backend tests pass
- [ ] Frontend tests pass
- [ ] AI service tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information or context.
```

### ✅ 7. Code Owners Setup

Create `.github/CODEOWNERS`:
```
# Global owners
* @vmtejus.sisail@gmail.com

# Backend services
/services/auth_service/ @vmtejus.sisail@gmail.com
/services/patient_service/ @vmtejus.sisail@gmail.com
/services/hospital_service/ @vmtejus.sisail@gmail.com
/services/manufacturer_service/ @vmtejus.sisail@gmail.com
/services/gov_service/ @vmtejus.sisail@gmail.com
/services/coordinator_service/ @vmtejus.sisail@gmail.com
/services/media_service/ @vmtejus.sisail@gmail.com

# AI Service
/services/ai_service/ @swathiga.sisail@gmail.com

# Frontend
/frontend/ @mausam.sisial@gmail.com

# Infrastructure
/infrastructure/ @vmtejus.sisail@gmail.com

# Documentation
/documentation/ @vaishalibhosle.sisail@gmail.com
```

### ✅ 8. GitHub Actions Permissions

**Path**: Settings → Actions → General

- [ ] **Actions permissions**: "Allow all actions and reusable workflows"
- [ ] **Workflow permissions**: "Read and write permissions"
- [ ] **Fork pull request workflows from outside collaborators**: ✅ Enabled
- [ ] **Allow GitHub Actions to create and approve pull requests**: ✅ Enabled

### ✅ 9. Security Settings

#### Security & Analysis (Settings → Security & analysis)
- [ ] **Dependency graph**: ✅ Enabled
- [ ] **Dependabot alerts**: ✅ Enabled
- [ ] **Dependabot security updates**: ✅ Enabled
- [ ] **Secret scanning**: ✅ Enabled
- [ ] **Secret scanning push protection**: ✅ Enabled

### ✅ 10. Team Communication Setup

#### Discord Server Setup (Optional)
- [ ] Create Discord server: "Rakshaayan Development"
- [ ] Channels:
  - [ ] `#general` - General discussion
  - [ ] `#backend` - Backend development
  - [ ] `#frontend` - Frontend development
  - [ ] `#ai-ml` - AI/ML development
  - [ ] `#design` - UI/UX discussions
  - [ ] `#devops` - Deployment and infrastructure
  - [ ] `#daily-standup` - Daily updates
  - [ ] `#help` - Technical help

#### Google Drive Setup (Optional)
- [ ] Create shared folder: "Rakshaayan Platform"
- [ ] Subfolders:
  - [ ] `Design Assets` - Figma files, images
  - [ ] `Documentation` - User guides, technical docs
  - [ ] `Meeting Notes` - Daily standup notes
  - [ ] `Resources` - Research papers, references

## 🚀 Post-Setup Verification

### Test the Setup
1. **Create a test issue** using the bug report template
2. **Create a test PR** from a feature branch to dev
3. **Verify branch protection** works correctly
4. **Test CI/CD pipeline** runs successfully
5. **Verify environment secrets** are accessible

### Team Onboarding Steps
1. **Share repository URL** with team members
2. **Send Discord invite** (if using)
3. **Share Google Drive access** (if using)
4. **Schedule onboarding call** to explain workflow
5. **Assign initial tasks** to each team member

## 📞 Quick Commands for Admin

```bash
# Check repository status
git status
git branch -a

# Verify CI/CD is working
# Check Actions tab on GitHub

# Test deployment
# Push to staging branch and monitor deployment

# Monitor team activity
# Check Insights → Contributors on GitHub
```

## ⚠️ Important Notes

1. **Never commit secrets** to the repository
2. **Always review PRs** before merging to main
3. **Monitor CI/CD pipeline** for failures
4. **Regular backups** of environment secrets
5. **Update documentation** as the project evolves

---

## ✅ Completion Checklist

- [ ] All branch protection rules configured
- [ ] All environments set up with secrets
- [ ] Issue and PR templates created
- [ ] Code owners file configured
- [ ] Security settings enabled
- [ ] Team members have proper access
- [ ] CI/CD pipeline tested
- [ ] Team communication channels established
- [ ] Initial tasks assigned to team members

**Once all items are checked, the team can start development! 🚀**

---

*Last updated: [Current Date]*
*Admin: vmtejus.sisail@gmail.com* 