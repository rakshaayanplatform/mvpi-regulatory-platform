# 🚀 Development Workflow - Rakshaayan Platform

## 📋 Branch Strategy Overview

```
main (production) ← staging ← dev ← feature branches
```

### Branch Purposes
- **`main`**: Production-ready code only
- **`staging`**: Pre-production testing
- **`dev`**: Integration and testing
- **`feature/*`**: Individual feature development

## 🔄 Daily Development Workflow

### 1. Start Your Day
```bash
# Switch to dev branch and pull latest changes
git checkout dev
git pull origin dev

# Create your feature branch
git checkout -b feature/your-feature-name
```

### 2. Development Process
```bash
# Make your changes
# ... code, code, code ...

# Stage your changes
git add .

# Commit with conventional commit message
git commit -m "feat: implement voice input for AE reporting"
git commit -m "fix: resolve authentication bug in patient service"
git commit -m "docs: update API documentation"

# Push your feature branch
git push origin feature/your-feature-name
```

### 3. Create Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Fill in PR description:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Refactoring

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   ```

### 4. Code Review Process
1. **Add Reviewers**:
   - Backend changes: @tejus (required)
   - Frontend changes: @mausam (required)
   - AI/ML changes: @swathiga (required)
   - Design changes: @vaishali (required)

2. **Wait for CI/CD** to complete
3. **Address review comments**
4. **Merge** when approved

## 🏗️ Environment-Specific Workflows

### Development Environment (dev branch)
```bash
# Automatic deployment on push to dev
git checkout dev
git merge feature/your-feature
git push origin dev
# → Automatic deployment to dev.rakshaayan.gov.in
```

### Staging Environment (staging branch)
```bash
# Manual deployment with approval
git checkout staging
git merge dev
git push origin staging
# → Manual approval required for staging.rakshaayan.gov.in
```

### Production Environment (main branch)
```bash
# Production deployment with strict approval
git checkout main
git merge staging
git push origin main
# → Manual approval required for rakshaayan.gov.in
```

## 🧪 Testing Strategy

### Local Testing
```bash
# Backend services
cd services/auth_service
python manage.py test
flake8 .
black . --check

# Frontend
cd frontend
npm test
npm run lint
npm run type-check

# AI Service
cd services/ai_service
pytest tests/
```

### CI/CD Testing
- **Unit Tests**: Run on every PR
- **Integration Tests**: Run on staging deployment
- **E2E Tests**: Run on production deployment
- **Security Scans**: Run on every push

## 📝 Commit Message Convention

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): implement JWT token refresh"
git commit -m "fix(patient): resolve file upload issue"
git commit -m "docs(api): update authentication endpoints"
git commit -m "test(ai): add speech-to-text unit tests"
```

## 🔧 Team-Specific Workflows

### 👨‍💻 Tejus (Backend Lead)
```bash
# Working on backend services
git checkout -b feature/auth-jwt-refresh
# ... make changes to auth_service
git commit -m "feat(auth): implement JWT refresh mechanism"
git push origin feature/auth-jwt-refresh
# Create PR to dev branch
```

### 🎨 Vaishali (UI/UX Designer)
```bash
# Working on design system
git checkout -b feature/design-system-components
# ... create UI components
git commit -m "feat(ui): add accessibility-focused button components"
git push origin feature/design-system-components
# Create PR to dev branch
```

### 🧑‍💻 Mausam (Frontend Developer)
```bash
# Working on frontend features
git checkout -b feature/voice-input-component
# ... implement voice input
git commit -m "feat(frontend): implement voice recording component"
git push origin feature/voice-input-component
# Create PR to dev branch
```

### 🧠 Swathiga (AI/ML Engineer)
```bash
# Working on AI service
git checkout -b feature/whisper-integration
# ... implement speech-to-text
git commit -m "feat(ai): integrate OpenAI Whisper for speech recognition"
git push origin feature/whisper-integration
# Create PR to dev branch
```

## 🚨 Emergency Procedures

### Hotfix Process
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/security-patch

# Make minimal changes
# ... emergency fix ...

# Commit and push
git commit -m "fix(security): patch critical authentication vulnerability"
git push origin hotfix/security-patch

# Create PR to main (bypass staging)
# Get emergency approval from team lead
```

### Rollback Process
```bash
# Identify problematic commit
git log --oneline

# Create rollback branch
git checkout main
git checkout -b rollback/abc1234

# Revert the commit
git revert abc1234

# Push and create PR
git push origin rollback/abc1234
```

## 📊 Quality Gates

### Before Merging to Dev
- [ ] All unit tests pass
- [ ] Code linting passes
- [ ] Type checking passes
- [ ] Self-review completed
- [ ] Documentation updated

### Before Merging to Staging
- [ ] Integration tests pass
- [ ] Security scan clean
- [ ] Code review approved
- [ ] Performance tests pass

### Before Merging to Main
- [ ] All tests pass
- [ ] Security scan clean
- [ ] Code quality gates pass
- [ ] Manual testing completed
- [ ] Stakeholder approval

## 🔍 Monitoring and Debugging

### Check CI/CD Status
```bash
# View GitHub Actions
# Go to: https://github.com/rakshaayanplatform/mvpi-regulatory-platform/actions
```

### Debug Failed Builds
```bash
# Check logs in GitHub Actions
# Run tests locally to reproduce issues
# Check environment variables and secrets
```

### Local Development Issues
```bash
# Reset local environment
docker-compose down -v
docker-compose up -d

# Check service logs
docker-compose logs auth_service
docker-compose logs ai_service
docker-compose logs frontend
```

## 📞 Team Communication

### Daily Standup (10:00 AM IST)
- **Progress**: What you completed yesterday
- **Blockers**: What's blocking your progress
- **Next**: What you plan to do today

### Weekly Review (Friday 4:00 PM IST)
- **Code Review**: Review PRs and merge to dev
- **Planning**: Plan next week's tasks
- **Retrospective**: Discuss process improvements

### Communication Channels
- **GitHub**: Issues, PRs, discussions
- **Discord**: Real-time chat and voice calls
- **Email**: Formal communications and notifications

---

**Remember**: Quality over speed! Always test thoroughly before pushing to production. 🚀 