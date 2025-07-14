# Comprehensive Setup Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Developer Setup](#developer-setup)
3. [Admin Setup Checklist](#admin-setup-checklist)
4. [Organization Setup](#organization-setup)
5. [Setup Summary](#setup-summary)

---

## Quick Start

### Prerequisites
- Git
- Docker
- Node.js 18+
- Python 3.11+
- WSL (Windows users)

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform

# Run setup script
./setup-env.sh

# Verify environment
./verify-env-setup.sh
```

### Quick Commands
```bash
# Start development environment
docker-compose up -d

# Run tests
npm test          # Frontend tests
python -m pytest  # Backend tests

# Build Docker images
docker build -t rakshaayan-frontend ./frontend
docker build -t rakshaayan-auth ./services/auth_service
```

---

## Developer Setup

### Environment Setup

#### 1. Install Dependencies
```bash
# System dependencies
sudo apt update
sudo apt install -y python3.11 python3.11-pip nodejs npm docker.io

# Python virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install Python dependencies
for service in services/*; do
    if [ -f "$service/requirements.txt" ]; then
        pip install -r "$service/requirements.txt"
    fi
done
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 3. Backend Setup
```bash
# For each service
cd services/auth_service
python manage.py migrate
python manage.py runserver
```

### Development Workflow

#### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 2. Make Changes
- Follow coding standards in `DEVELOPER_GUIDELINES.md`
- Write tests for new functionality
- Update documentation

#### 3. Test Locally
```bash
# Run linting
npm run lint          # Frontend
flake8 services/      # Backend

# Run tests
npm test              # Frontend
python -m pytest      # Backend
```

#### 4. Commit and Push
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

#### 5. Create Pull Request
- Target `dev` branch
- Add description of changes
- Request review from team

---

## Admin Setup Checklist

### Pre-requisites
- [ ] GitHub repository created
- [ ] Team members added with appropriate permissions
- [ ] GitHub Actions enabled
- [ ] Environment secrets configured

### Repository Setup
- [ ] Branch protection rules configured
- [ ] Required status checks enabled
- [ ] Code review requirements set
- [ ] Dependabot alerts enabled

### CI/CD Setup
- [ ] GitHub Actions workflow files in place
- [ ] Environment secrets configured:
  - `DOCKER_REGISTRY`
  - `STAGING_DEPLOY_KEY`
  - `PRODUCTION_DEPLOY_KEY`
- [ ] Deployment environments created:
  - `staging`
  - `production`

### Monitoring Setup
- [ ] Application monitoring configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Alert notifications configured

### Security Setup
- [ ] Security scanning enabled
- [ ] Dependency vulnerability monitoring
- [ ] Secret scanning configured
- [ ] Code signing setup (if required)

---

## Organization Setup

### Team Structure
```
Project Lead
├── Frontend Team
│   ├── UI/UX Developer
│   └── Frontend Developer
├── Backend Team
│   ├── API Developer
│   └── Database Developer
├── DevOps Team
│   ├── Infrastructure Engineer
│   └── CI/CD Engineer
└── QA Team
    ├── Manual Tester
    └── Automation Tester
```

### Communication Channels
- **Slack**: General communication
- **GitHub**: Code reviews and issues
- **Email**: Formal communications
- **Video Calls**: Weekly standups

### Development Process
1. **Planning**: Feature requests and bug reports
2. **Development**: Feature branches and local testing
3. **Review**: Code reviews and testing
4. **Integration**: Merge to dev branch
5. **Staging**: QA testing and validation
6. **Production**: Deployment and monitoring

### Tools and Services
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions
- **Container Registry**: Docker Hub
- **Monitoring**: Application Insights
- **Error Tracking**: Sentry
- **Documentation**: GitHub Wiki

---

## Setup Summary

### Environment Variables
```bash
# Required for development
NODE_ENV=development
PYTHON_ENV=development

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mvpi

# API Keys
OPENAI_API_KEY=your_openai_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret

# Docker
DOCKER_REGISTRY=your_registry
```

### Common Issues and Solutions

#### Issue: Docker build fails
**Solution**: Check Dockerfile syntax and dependencies
```bash
docker build --no-cache -t test-image .
```

#### Issue: Tests fail locally but pass in CI
**Solution**: Ensure same Python/Node versions
```bash
# Use exact versions from CI
python --version  # Should be 3.11.x
node --version   # Should be 18.x.x
```

#### Issue: Database connection fails
**Solution**: Check database service and credentials
```bash
# Test database connection
psql -h localhost -U username -d database_name
```

#### Issue: Frontend build fails
**Solution**: Clear cache and reinstall dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization
- Use Docker layer caching
- Implement parallel job execution
- Cache dependencies between runs
- Optimize Docker images
- Use multi-stage builds

### Security Best Practices
- Never commit secrets to repository
- Use environment variables for sensitive data
- Regularly update dependencies
- Scan for vulnerabilities
- Implement proper access controls

---

## Quick Reference

### Git Commands
```bash
# Create feature branch
git checkout -b feature/name

# Update from main
git checkout main
git pull origin main
git checkout feature/name
git merge main

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
```

### Docker Commands
```bash
# Build image
docker build -t image-name .

# Run container
docker run -p 3000:3000 image-name

# View logs
docker logs container-name

# Stop container
docker stop container-name
```

### CI/CD Commands
```bash
# Check workflow status
gh run list

# View workflow logs
gh run view --log

# Rerun failed workflow
gh run rerun run-id
```

---

**Last Updated**: 2024-07-14  
**Version**: 2.0 - Comprehensive Setup Guide 