# 🚀 Rakshaayan - India's National Medical Device Adverse Event Reporting Platform

> **रक्षायान** (Vehicle of Protection) - Inspired by Chandrayaan, Mangalyaan, Gaganyaan
> 
> A mission-mode platform to protect every Indian patient by unifying medical device safety, AI insight, and transparency.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Project Vision](#project-vision)
- [Architecture Overview](#architecture-overview)
- [Development Setup](#development-setup)
- [File Structure](#file-structure)
- [Development Workflow](#development-workflow)
- [AI Assistant Prompts](#ai-assistant-prompts)
- [Team Responsibilities](#team-responsibilities)
- [Daily Execution Plan](#daily-execution-plan)

---

## 🚀 Quick Start

### Prerequisites
- **Windows/macOS/Linux** compatibility ensured
- **Python 3.11+**, **Node.js 18+**, **PostgreSQL**, **Docker & Docker Compose**
- **Git**, **VS Code/Cursor**, **Tailscale**

### One-Command Setup
```bash
# Clone the monorepo
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform

# Setup environment files (automated)
./setup-env.sh

# Edit environment files with your values
# Then start all services
docker-compose -f infrastructure/docker-compose.yml up -d
```

### Environment Setup

Each service has its own complete `.env` file with all necessary variables:

```bash
# Setup environment files
./setup-env.sh

# Edit each service's .env file with your values:
# - services/auth_service/.env
# - services/patient_service/.env  
# - services/ai_service/.env
# - frontend/.env
```

**Key variables to update in each service:**
- `POSTGRES_HOST` - Your database IP
- `EMAIL_HOST_USER` - Your email
- `EMAIL_HOST_PASSWORD` - Your app password
- `SECRET_KEY` - Unique secret for each service
- `JWT_SECRET_KEY` - Shared JWT secret

---

## 🎯 Project Vision

### Core Mission
Build a **corruption-proof**, **AI-enabled**, **MvPI-compliant** Medical Device Adverse Event Reporting Portal that:

- ✅ Serves **Patients**, **Hospitals**, **Manufacturers**, and **Government (CDSCO/MvPI)**
- ✅ Prioritizes **patient safety** and **regulatory compliance**
- ✅ Supports **accessibility**: blind, deaf, mute, elderly, multilingual users
- ✅ Outperforms global benchmarks (USFDA MedSun)
- ✅ Built for **50+ years** of Indian medical device manufacturing growth

### Key Features
- **Multi-modal input**: Voice, text, images, documents
- **AI-powered**: Speech-to-text, OCR, NLP summarization
- **Multilingual**: Hindi, English, regional languages
- **Real-time**: WhatsApp bot integration
- **Secure**: JWT auth, role-based access, audit logging
- **Compliant**: MvPI format mapping, CDSCO workflows

---

## 🏗️ Architecture Overview

### Microservices Architecture
```
Frontend (Next.js) → API Gateway → Backend Services → Shared Database
                                       ↓
                            AI Service (FastAPI)
                                       ↓
                            Media Service (File Storage)
```

### Service Ports
| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| Frontend | 3000 | Next.js | User interface |
| Auth Service | 8001 | Django | Authentication & authorization |
| Patient Service | 8002 | Django | Patient AE submissions |
| Hospital Service | 8003 | Django | Hospital dashboard & review |
| Manufacturer Service | 8004 | Django | Manufacturer workflows |
| Government Service | 8005 | Django | CDSCO regulatory dashboard |
| Coordinator Service | 8006 | Django | MDMC coordination |
| Media Service | 8007 | Django | File storage & processing |
| AI Service | 8010 | FastAPI | ML/AI processing |

---

## 🛠️ Development Setup

> **📖 For detailed step-by-step instructions, see [DEVELOPER_GUIDELINES.md](DEVELOPER_GUIDELINES.md)**

### 1. GitHub Organization Setup
```bash
# Organization: rakshaayanplatform
# Repository: mvpi-regulatory-platform (monorepo)
# Team members with Write access:
# - vmtejus.sisail@gmail.com
# - vaishalibhosle.sisail@gmail.com  
# - mausam.sisial@gmail.com
# - swathiga.sisail@gmail.com
```

### 2. Development Tools

#### VS Code Extensions
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

#### Browser Setup
- **Recommended**: Chrome or Brave
- **Extensions**: React DevTools, Redux DevTools, Lighthouse

### 3. Platform-Specific Setup

#### 🐧 Ubuntu/Linux
```bash
sudo apt update && sudo apt install python3-pip docker.io docker-compose git postgresql-client
sudo systemctl enable docker
sudo usermod -a -G docker $USER
```

#### 🍎 macOS
```bash
# Install Homebrew first: https://brew.sh
brew install python3 git postgresql node
brew install --cask docker tailscale
```

#### 🪟 Windows
```powershell
# Install via chocolatey or manual downloads:
# - Python: https://www.python.org/downloads/
# - Node.js: https://nodejs.org/
# - Docker Desktop: https://www.docker.com/products/docker-desktop/
# - Git: https://git-scm.com/download/win
# - Tailscale: https://tailscale.com/download

# Use PowerShell or Git Bash for development
```

### 4. Tailscale Network Setup
```bash
# Install Tailscale on all devices
# Login with shared account
tailscale up
tailscale status  # Verify connection
```

---

## 📁 File Structure (Monorepo)

```
mvpi-regulatory-platform/
├── 📁 services/                          # Backend microservices
│   ├── 📁 auth_service/                   # Django - JWT auth & user management
│   │   ├── 📁 auth_service/
│   │   │   ├── 📄 models.py              # User, Role, Permission models
│   │   │   ├── 📄 serializers.py         # DRF serializers
│   │   │   ├── 📄 views.py               # API endpoints
│   │   │   ├── 📄 urls.py                # URL routing
│   │   │   └── 📄 permissions.py         # Custom permissions
│   │   ├── 📁 tests/                     # Unit tests
│   │   ├── 📄 Dockerfile                 # Container config
│   │   ├── 📄 requirements.txt           # Python dependencies
│   │   ├── 📄 .env.example               # Environment template
│   │   └── 📄 manage.py                  # Django management
│   ├── 📁 patient_service/               # Django - Patient AE submissions
│   ├── 📁 hospital_service/              # Django - Hospital dashboard
│   ├── 📁 manufacturer_service/          # Django - Manufacturer workflows
│   ├── 📁 gov_service/                   # Django - CDSCO dashboard
│   ├── 📁 coordinator_service/           # Django - MDMC coordination
│   ├── 📁 media_service/                 # Django - File storage
│   └── 📁 ai_service/                    # FastAPI - ML/AI processing
│       ├── 📄 main.py                    # FastAPI app
│       ├── 📄 models.py                  # ML model loading
│       ├── 📄 routers/                   # API routes
│       ├── 📄 services/                  # ML services
│       └── 📄 requirements.txt           # Python ML dependencies
├── 📁 frontend/                          # Next.js frontend
│   ├── 📁 app/                           # Next.js app router
│   │   ├── 📁 [locale]/                  # Internationalization
│   │   ├── 📁 auth/                      # Auth pages
│   │   ├── 📁 patient/                   # Patient portal
│   │   ├── 📁 hospital/                  # Hospital dashboard
│   │   └── 📁 api/                       # API routes
│   ├── 📁 components/                    # Reusable components
│   │   ├── 📁 ui/                        # UI components
│   │   ├── 📁 forms/                     # Form components
│   │   └── 📁 layouts/                   # Layout components
│   ├── 📁 lib/                           # Utilities
│   │   ├── 📄 auth.ts                    # Auth helpers
│   │   ├── 📄 api.ts                     # API client
│   │   └── 📄 utils.ts                   # Common utilities
│   ├── 📁 public/                        # Static assets
│   ├── 📁 locales/                       # Translation files
│   │   ├── 📄 en.json                    # English
│   │   ├── 📄 hi.json                    # Hindi
│   │   └── 📄 ta.json                    # Tamil
│   ├── 📄 next.config.js                 # Next.js config
│   ├── 📄 tailwind.config.js             # Tailwind CSS config
│   └── 📄 package.json                   # Node.js dependencies
├── 📁 shared_libs/                       # Shared code
│   ├── 📁 models/                        # Common Django models
│   ├── 📁 permissions/                   # Shared permissions
│   ├── 📁 utils/                         # Common utilities
│   └── 📁 serializers/                   # Shared serializers
├── 📁 infrastructure/                    # DevOps & deployment
│   ├── 📄 docker-compose.yml             # Local development
│   ├── 📄 docker-compose.prod.yml        # Production
│   ├── 📁 nginx/                         # Reverse proxy config
│   ├── 📁 kubernetes/                    # K8s manifests
│   └── 📁 monitoring/                    # Prometheus, Grafana
├── 📁 documentation/                     # User & developer docs
│   ├── 📄 patient_guide.md               # Patient user guide
│   ├── 📄 hospital_manual.md             # Hospital staff manual
│   ├── 📄 manufacturer_guide.md          # Manufacturer guide
│   ├── 📄 gov_dashboard_guide.md         # CDSCO user guide
│   ├── 📄 developer_docs.md              # Technical documentation
│   └── 📄 api_reference.md               # API documentation
├── 📁 tests/                             # Integration tests
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.example                       # Environment template
├── 📄 README.md                          # This file
└── 📄 LICENSE                            # License file
```

---

## 🔄 Development Workflow

### Git Branching Strategy
```bash
# Main branches
main              # Production-ready code
dev               # Integration branch
feature/*         # Feature development
docs/*            # Documentation updates
hotfix/*          # Emergency fixes

# Example feature branches
feature/auth-otp-system
feature/patient-voice-input
feature/hospital-dashboard
feature/ai-ocr-processing
```

### Daily Development Cycle
```bash
# 1. Start work on feature branch
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: implement voice input for AE reporting"

# 3. Push and create PR
git push origin feature/your-feature-name
# Create PR to dev branch on GitHub

# 4. After approval, merge to dev
# Tejus merges dev to main for releases
```

### Testing Before Commit
```bash
# Backend services
cd services/auth_service
python manage.py test
flake8 .

# Frontend
cd frontend
npm test
npm run lint

# AI Service
cd services/ai_service
pytest tests/
```

---

## 🐳 Docker Configuration

### Development (docker-compose.yml)
```yaml
version: '3.9'

services:
  # Database
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: rakshaayan
      POSTGRES_USER: rakshaayan
      POSTGRES_PASSWORD: secure-password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Authentication Service
  auth_service:
    build: ./services/auth_service
    ports:
      - "8001:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://rakshaayan:secure-password@db:5432/rakshaayan
    volumes:
      - ./services/auth_service:/app

  # Patient Service
  patient_service:
    build: ./services/patient_service
    ports:
      - "8002:8000"
    depends_on:
      - db
      - auth_service
    environment:
      - DATABASE_URL=postgresql://rakshaayan:secure-password@db:5432/rakshaayan
      - AUTH_SERVICE_URL=http://auth_service:8000

  # AI Service
  ai_service:
    build: ./services/ai_service
    ports:
      - "8010:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://rakshaayan:secure-password@db:5432/rakshaayan
    volumes:
      - ./services/ai_service:/app
      - ./uploads:/app/uploads

  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - auth_service
      - patient_service
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001
      - NEXT_PUBLIC_PATIENT_API_URL=http://localhost:8002

volumes:
  postgres_data:
```

### Service Dockerfile Templates

#### Django Services
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "wsgi:application", "--bind", "0.0.0.0:8000"]
```

#### FastAPI AI Service
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for ML
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libsndfile1 \
    ffmpeg \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Next.js Frontend
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
```

---

## 📅 10-Day Development Sprint

### Day 0-1: Foundation Setup
- [x] GitHub organization and repository setup
- [x] Development environment configuration
- [x] Database schema design
- [x] Authentication service implementation
- [x] Basic frontend structure

### Day 2-3: Core Features
- [x] Patient AE reporting forms
- [x] Voice input integration
- [x] File upload handling
- [x] Hospital dashboard basics
- [x] AI service foundation

### Day 4-5: Advanced Features
- [x] OCR and document processing
- [x] Multi-language support
- [x] WhatsApp bot integration
- [x] Manufacturer workflows
- [x] Government dashboard

### Day 6-7: Integration & Testing
- [x] Service integration testing
- [x] End-to-end workflow testing
- [x] Performance optimization
- [x] Security testing
- [x] Accessibility testing

### Day 8-9: Documentation & Polish
- [x] User documentation
- [x] API documentation
- [x] Developer guides
- [x] Video demonstrations
- [x] Final testing

### Day 10: Deployment & Demo
- [x] Production deployment
- [x] Final presentation
- [x] Demo video creation
- [x] Submission preparation

---

## 🤖 AI Assistant Prompts

### 👨‍💻 Tejus (Backend Lead)
```
I'm building the backend microservices for Rakshaayan, India's medical device adverse event reporting platform. 

Context: We're using Django with DRF for most services, PostgreSQL database, JWT authentication, and Docker containers. The system needs to be MvPI-compliant and handle multi-modal inputs.

Help me implement:
1. Authentication service with JWT and OTP
2. Patient service for AE submissions
3. Hospital service for review workflows
4. Shared models and permissions
5. Docker containerization
6. Database migrations and relationships

Please provide production-ready code with proper error handling, logging, and security measures.
```

### 🎨 Vaishali (UI/UX Designer)
```
I'm designing the user interface for Rakshaayan, a medical device adverse event reporting platform for India.

Context: The platform serves patients, hospitals, manufacturers, and government officials. It must be accessible to users with disabilities, support multiple languages (Hindi, English, regional), and work on all devices.

Help me create:
1. Figma design system with accessibility-first approach
2. Component library for forms, dashboards, and navigation
3. User journey flows for each user type
4. Color schemes and typography that meet WCAG standards
5. Mobile-responsive layouts
6. Voice and touch interaction patterns

Focus on Indian design preferences, government portal aesthetics, and medical industry standards.
```

### 🧑‍💻 Mausam (Frontend Developer)
```
I'm building the frontend for Rakshaayan using Next.js 14 with TypeScript, Tailwind CSS, and app router.

Context: The platform needs to support multiple languages, handle real-time data, integrate with voice input, and provide dashboards for different user roles.

Help me implement:
1. Next.js app structure with internationalization
2. Authentication with JWT and protected routes
3. Voice input components using Web Speech API
4. File upload with drag-and-drop and preview
5. Dashboard layouts with charts and data visualization
6. Form components with validation and accessibility
7. Real-time notifications and updates

Please provide TypeScript code with proper error handling and responsive design.
```

### 🧠 Swathiga (AI/ML Engineer)
```
I'm building the AI service for Rakshaayan using FastAPI and various ML models.

Context: The service needs to process voice recordings, extract text from images/documents, and provide intelligent form filling suggestions for medical device adverse events.

Help me implement:
1. Speech-to-text using OpenAI Whisper
2. OCR using PaddleOCR or Tesseract
3. NLP for text summarization and classification
4. Multi-language support for Indian languages
5. Medical terminology extraction and validation
6. API endpoints with proper error handling
7. Model optimization for production deployment

Please provide FastAPI code with async operations, proper logging, and scalable architecture.
```

---

## 👥 Team Responsibilities

### 👨‍💻 Tejus (Backend Lead & DevOps)
- **Primary**: Backend microservices architecture
- **Secondary**: Database design, Docker, CI/CD
- **Daily tasks**: API development, testing, deployment
- **Time commitment**: 8+ hours daily

### 🎨 Vaishali (UI/UX Designer)
- **Primary**: Design system, user experience
- **Secondary**: Frontend component design
- **Daily tasks**: Figma designs, user research, accessibility
- **Time commitment**: 6+ hours daily

### 🧑‍💻 Mausam (Frontend Developer)
- **Primary**: Next.js frontend development
- **Secondary**: Integration with backend APIs
- **Daily tasks**: Component development, responsive design
- **Time commitment**: 8+ hours daily

### 🧠 Swathiga (AI/ML Engineer)
- **Primary**: AI service development
- **Secondary**: ML model integration
- **Daily tasks**: Model training, API development
- **Time commitment**: 6+ hours daily (evening focus)

---

## 🔧 Development Guidelines

### Code Quality Standards
```bash
# Python (Backend)
black .                    # Code formatting
flake8 .                  # Linting
mypy .                    # Type checking
pytest                    # Testing

# JavaScript/TypeScript (Frontend)
npm run lint              # ESLint
npm run format            # Prettier
npm run type-check        # TypeScript
npm test                  # Jest testing
```

### API Development Standards
- **REST API**: Follow RESTful conventions
- **Documentation**: Auto-generate with Swagger/OpenAPI
- **Versioning**: Use URL versioning (`/api/v1/`)
- **Error Handling**: Consistent error response format
- **Authentication**: JWT with refresh tokens
- **Rate Limiting**: Implement for all public endpoints

### Database Standards
- **Migrations**: Always use Django migrations
- **Naming**: Use snake_case for tables and columns
- **Indexes**: Add appropriate indexes for queries
- **Constraints**: Use database constraints for data integrity
- **Backup**: Regular automated backups

### Security Best Practices
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Protection**: Sanitize output
- **CSRF Protection**: Enable CSRF middleware
- **HTTPS**: Use HTTPS in production
- **Secrets**: Use environment variables for secrets

---

## 🚀 Getting Started Checklist

### Prerequisites Setup
- [ ] Install Python 3.11+
- [ ] Install Node.js 18+
- [ ] Install Docker and Docker Compose
- [ ] Install Git
- [ ] Setup VS Code with extensions
- [ ] Install Tailscale and join network

### Repository Setup
- [ ] Clone the repository
- [ ] Copy environment files
- [ ] Install dependencies
- [ ] Run database migrations
- [ ] Start development servers
- [ ] Verify all services are running

### Development Environment
- [ ] Configure IDE settings
- [ ] Setup pre-commit hooks
- [ ] Test API endpoints
- [ ] Verify frontend rendering
- [ ] Check AI service integration

### Team Collaboration
- [ ] Join GitHub organization
- [ ] Setup branch protection
- [ ] Configure issue templates
- [ ] Setup communication channels
- [ ] Review coding standards

---

## 📞 Support & Communication

### Daily Standup
- **Time**: 10:00 AM IST
- **Duration**: 15 minutes
- **Format**: Progress, blockers, next tasks

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

## 🎯 Success Metrics

### Technical Metrics
- **Code Coverage**: >80% for all services
- **API Response Time**: <500ms average
- **Uptime**: 99.9% availability
- **Security**: Zero critical vulnerabilities

### User Experience Metrics
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Lighthouse score >90
- **Multi-language**: Support for 5+ languages
- **Mobile**: Responsive on all devices

### Business Metrics
- **Compliance**: 100% MvPI format compliance
- **Integration**: WhatsApp bot functional
- **Documentation**: Complete user guides
- **Demo**: Working end-to-end demo

---

*Ready to build the future of medical device safety in India! 🇮🇳*

---

## 🏁 Final Notes

This README is optimized for:
- **Cursor AI**: Full context for code generation
- **Team collaboration**: Clear responsibilities and workflows
- **Quick onboarding**: Step-by-step setup instructions
- **Production readiness**: Security, testing, and deployment guidance

Copy this entire README into your Cursor AI sidebar for full project context, then use the role-specific prompts to start building your assigned components.

**Happy coding! 🚀**