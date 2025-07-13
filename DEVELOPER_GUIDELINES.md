# 🚀 Developer Guidelines - Rakshaayan Platform

> **Complete step-by-step guide for new developers (Vaishali, Mausam, etc.)**

---

## 📋 Table of Contents
- [Prerequisites Setup](#prerequisites-setup)
- [Repository Setup](#repository-setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Service-Specific Development](#service-specific-development)
- [Testing & Debugging](#testing--debugging)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🛠️ Prerequisites Setup

### Step 1: Install Required Software

#### **Windows Users (Vaishali, Mausam)**
```bash
# 1. Install Python 3.11+
# Download from: https://www.python.org/downloads/
# Make sure to check "Add Python to PATH"

# 2. Install Node.js 18+
# Download from: https://nodejs.org/

# 3. Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop/

# 4. Install Git
# Download from: https://git-scm.com/download/win

# 5. Install VS Code or Cursor
# Download from: https://code.visualstudio.com/ or https://cursor.sh/
```

#### **macOS Users**
```bash
# Install Homebrew first: https://brew.sh
brew install python@3.11 git node postgresql
brew install --cask docker tailscale
```

#### **Linux Users**
```bash
sudo apt update && sudo apt install python3-pip docker.io docker-compose git postgresql-client
sudo systemctl enable docker
sudo usermod -a -G docker $USER
```

### Step 2: Install VS Code Extensions
```json
{
  "recommendations": [
    "ms-python.python",
    "esbenp.prettier-vscode", 
    "ms-vscode.vscode-eslint",
    "ms-azuretools.vscode-docker",
    "eamodio.gitlens",
    "bradlc.vscode-tailwindcss",
    "humao.rest-client"
  ]
}
```

### Step 3: Setup Tailscale Network
```bash
# Install Tailscale on your device
# Login with shared account credentials
tailscale up
tailscale status  # Verify connection
```

---

## 📥 Repository Setup

### Step 1: Clone the Repository
```bash
# Clone the monorepo
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform

# Verify you're on the dev branch
git checkout dev
git pull origin dev
```

### Step 2: Verify Repository Structure
```bash
# You should see this structure:
ls -la
# - services/          # Backend microservices
# - frontend/          # Next.js frontend
# - infrastructure/    # Docker & deployment
# - documentation/     # User guides
# - setup-env.sh      # Environment setup script
# - README.md         # Main documentation
```

---

## ⚙️ Environment Configuration

### Step 1: Setup Environment Files
```bash
# Run the automated setup script
./setup-env.sh

# This creates .env files for all services:
# - services/auth_service/.env
# - services/patient_service/.env
# - services/hospital_service/.env
# - services/manufacturer_service/.env
# - services/gov_service/.env
# - services/coordinator_service/.env
# - services/media_service/.env
# - services/ai_service/.env
# - frontend/.env
```

### Step 2: Configure Database Settings
```bash
# Edit each service's .env file with your database IP
# Replace 100.x.x.x with Vaishali's laptop Tailscale IP

# Example for auth_service/.env:
POSTGRES_HOST=100.x.x.x  # Get this from Vaishali
POSTGRES_PORT=5432
POSTGRES_DB=rakshaayan
POSTGRES_USER=rakshaayan
POSTGRES_PASSWORD=secure-password
```

### Step 3: Configure Email Settings
```bash
# Update EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in all .env files
EMAIL_HOST_USER=rakshaayanplatform@gmail.com
EMAIL_HOST_PASSWORD=bnwx btfx rmku gqrq
```

### Step 4: Generate Secret Keys
```bash
# Generate unique SECRET_KEY for each service
# You can use: python -c "import secrets; print(secrets.token_urlsafe(50))"

# Update each service's .env file:
SECRET_KEY=your-unique-secret-key-here
JWT_SECRET_KEY=your-shared-jwt-secret-here
```

---

## 🚀 Development Workflow

### Step 1: Start All Services
```bash
# Start all services using Docker Compose
docker-compose -f infrastructure/docker-compose.yml up -d

# Verify services are running
docker-compose -f infrastructure/docker-compose.yml ps
```

### Step 2: Access Services
```bash
# Frontend (Next.js)
http://localhost:3000

# Backend Services
http://localhost:8001  # Auth Service
http://localhost:8002  # Patient Service
http://localhost:8003  # Hospital Service
http://localhost:8004  # Manufacturer Service
http://localhost:8005  # Government Service
http://localhost:8006  # Coordinator Service
http://localhost:8007  # Media Service
http://localhost:8010  # AI Service
```

### Step 3: Check Service Health
```bash
# Test each service endpoint
curl http://localhost:8001/api/health/  # Auth Service
curl http://localhost:8002/api/health/  # Patient Service
curl http://localhost:8010/health       # AI Service
```

---

## 👨‍💻 Service-Specific Development

### **For Vaishali (UI/UX Designer)**

#### Step 1: Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

#### Step 2: Design System Development
```bash
# Work on components in:
frontend/components/ui/          # UI components
frontend/components/forms/       # Form components
frontend/components/layouts/     # Layout components

# Update styles in:
frontend/tailwind.config.js      # Tailwind configuration
frontend/app/globals.css         # Global styles
```

#### Step 3: Figma Integration
```bash
# Export designs from Figma
# Implement in frontend/components/
# Test responsiveness on different screen sizes
```

### **For Mausam (Frontend Developer)**

#### Step 1: Next.js Development
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build
```

#### Step 2: API Integration
```bash
# API client configuration
frontend/lib/api.ts              # API client setup
frontend/lib/auth.ts             # Authentication helpers
frontend/app/api/                # API routes
```

#### Step 3: Component Development
```bash
# Create new components
frontend/components/             # Reusable components
frontend/app/[locale]/          # Internationalized pages
frontend/locales/               # Translation files
```

### **For Tejus (Backend Developer)**

#### Step 1: Django Service Development
```bash
# Navigate to any Django service
cd services/auth_service

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver 0.0.0.0:8001
```

#### Step 2: API Development
```bash
# Work on API endpoints
services/auth_service/auth_service/views.py
services/auth_service/auth_service/serializers.py
services/auth_service/auth_service/urls.py
```

#### Step 3: Database Management
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### **For Swathiga (AI/ML Engineer)**

#### Step 1: AI Service Development
```bash
# Navigate to AI service
cd services/ai_service

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8010
```

#### Step 2: ML Model Integration
```bash
# Work on AI components
services/ai_service/routers/     # API routes
services/ai_service/services/    # ML services
services/ai_service/models.py    # Model loading
```

#### Step 3: Model Testing
```bash
# Test AI endpoints
curl -X POST http://localhost:8010/speech-to-text \
  -F "file=@audio.mp3"

curl -X POST http://localhost:8010/ocr \
  -F "file=@image.jpg"
```

---

## 🧪 Testing & Debugging

### Step 1: Backend Testing
```bash
# Test Django services
cd services/auth_service
python manage.py test

# Test AI service
cd services/ai_service
pytest tests/
```

### Step 2: Frontend Testing
```bash
# Test Next.js frontend
cd frontend
npm test
npm run lint
npm run type-check
```

### Step 3: Integration Testing
```bash
# Test service communication
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Step 4: Debugging
```bash
# View service logs
docker-compose -f infrastructure/docker-compose.yml logs auth_service
docker-compose -f infrastructure/docker-compose.yml logs frontend

# Access service shells
docker-compose -f infrastructure/docker-compose.yml exec auth_service bash
docker-compose -f infrastructure/docker-compose.yml exec frontend sh
```

---

## 🔄 Git Workflow

### Step 1: Create Feature Branch
```bash
# Start from dev branch
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/your-feature-name

# Example branches:
git checkout -b feature/auth-otp-system
git checkout -b feature/patient-voice-input
git checkout -b feature/hospital-dashboard
```

### Step 2: Make Changes
```bash
# Make your changes
# Test thoroughly
# Commit with descriptive messages

git add .
git commit -m "feat: implement voice input for AE reporting"
git push origin feature/your-feature-name
```

### Step 3: Create Pull Request
```bash
# Go to GitHub: https://github.com/rakshaayanplatform/mvpi-regulatory-platform
# Click "New Pull Request"
# Select: feature/your-feature-name → dev
# Add description and request review
```

### Step 4: Code Review Process
```bash
# Tejus will review and merge to dev
# After testing, dev → main for releases
```

---

## 🚀 Deployment

### Step 1: Local Production Test
```bash
# Build production images
docker-compose -f infrastructure/docker-compose.prod.yml build

# Start production stack
docker-compose -f infrastructure/docker-compose.prod.yml up -d
```

### Step 2: Environment Variables
```bash
# Update production .env files
# Set DEBUG=False
# Use production database
# Configure proper secrets
```

### Step 3: Database Migration
```bash
# Run migrations on production
docker-compose -f infrastructure/docker-compose.prod.yml exec auth_service python manage.py migrate
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue 1: Services Not Starting
```bash
# Check if Docker is running
docker --version
docker-compose --version

# Check service logs
docker-compose -f infrastructure/docker-compose.yml logs

# Restart services
docker-compose -f infrastructure/docker-compose.yml down
docker-compose -f infrastructure/docker-compose.yml up -d
```

#### Issue 2: Database Connection Failed
```bash
# Check database settings in .env files
# Verify Tailscale connection
tailscale status

# Test database connection
psql -h 100.x.x.x -U rakshaayan -d rakshaayan
```

#### Issue 3: Frontend Not Loading
```bash
# Check if Node.js is installed
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Issue 4: AI Service Not Responding
```bash
# Check AI service logs
docker-compose -f infrastructure/docker-compose.yml logs ai_service

# Test AI endpoints directly
curl http://localhost:8010/health

# Check model files
docker-compose -f infrastructure/docker-compose.yml exec ai_service ls /app/models
```

#### Issue 5: Environment Variables Not Loading
```bash
# Verify .env files exist
ls -la services/*/.env
ls -la frontend/.env

# Check environment variable loading
docker-compose -f infrastructure/docker-compose.yml exec auth_service env | grep POSTGRES
```

---

## 📞 Team Communication

### Daily Standup (10:00 AM IST)
```bash
# Format: Progress, Blockers, Next Tasks
# Duration: 15 minutes
# Platform: Discord/Teams
```

### Communication Channels
- **GitHub**: Issues, PRs, discussions
- **Discord**: Real-time chat
- **Email**: Formal communications

### Emergency Contacts
- **Tejus**: Backend/DevOps issues
- **Vaishali**: Design/UX questions  
- **Mausam**: Frontend problems
- **Swathiga**: AI/ML integration

---

## 🎯 Success Checklist

### Before Starting Development
- [ ] All software installed (Python, Node.js, Docker, Git)
- [ ] Repository cloned and on dev branch
- [ ] Environment files created with `./setup-env.sh`
- [ ] Database connection configured
- [ ] All services running (`docker-compose up -d`)
- [ ] Frontend accessible at http://localhost:3000
- [ ] Backend services responding to health checks

### Before Committing Code
- [ ] Code follows project standards
- [ ] Tests pass locally
- [ ] No sensitive data in commits
- [ ] Descriptive commit message
- [ ] Feature branch created from dev

### Before Creating PR
- [ ] All tests pass
- [ ] Code reviewed by self
- [ ] Documentation updated
- [ ] Screenshots/videos if UI changes
- [ ] Description of changes included

---

## 🚀 Quick Start Commands

```bash
# Complete setup for new developer
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform
./setup-env.sh
# Edit .env files with your values
docker-compose -f infrastructure/docker-compose.yml up -d
# Access http://localhost:3000
```

---

**Happy coding! 🎉**

*Remember: When in doubt, ask the team. We're here to help each other succeed!* 