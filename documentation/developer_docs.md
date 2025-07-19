# Developer Documentation - Rakshaayan Platform

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform
```

2. **Set up environment variables**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Start services with Docker**
```bash
docker-compose -f infrastructure/docker-compose.yml up -d
```

4. **Run migrations**
```bash
# For each Django service
docker-compose exec auth_service python manage.py migrate
docker-compose exec patient_service python manage.py migrate
# ... repeat for other services
```

## 🏗️ Architecture

### Microservices Overview
- **Auth Service** (Port 8001): Authentication & authorization
- **Patient Service** (Port 8002): Patient AE submissions
- **Hospital Service** (Port 8003): Hospital dashboard
- **Manufacturer Service** (Port 8004): Manufacturer workflows
- **Government Service** (Port 8005): CDSCO dashboard
- **Coordinator Service** (Port 8006): MDMC coordination
- **Media Service** (Port 8007): File storage
- **AI Service** (Port 8010): ML/AI processing
- **Frontend** (Port 3000): Next.js application

### Database Schema
- Shared PostgreSQL database
- Service-specific tables with prefixes
- Audit logging for all operations

### API Documentation
- Swagger/OpenAPI docs available at `/docs` for each service
- Interactive API testing at `/redoc`

## 🛠️ Development Guidelines

### Code Standards
- **Python**: Black formatting, flake8 linting, mypy type checking
- **JavaScript/TypeScript**: ESLint, Prettier, TypeScript strict mode
- **Git**: Conventional commits, feature branches

### Testing
```bash
# Backend tests
python manage.py test

# Frontend tests
npm test

# Integration tests
pytest tests/
```

### Database Migrations
```bash
# Create migration
python manage.py makemigrations

# Apply migration
python manage.py migrate

# Generate SQL
python manage.py sqlmigrate app_name migration_number
```

## 🔧 Service Development

### Adding a New Service
1. Create service directory in `services/`
2. Add Django project structure
3. Create `requirements.txt` and `Dockerfile`
4. Add service to `docker-compose.yml`
5. Update API gateway configuration

### Frontend Development
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Internationalization support

### AI Service Development
- FastAPI for high-performance APIs
- Async operations for ML processing
- Model versioning and deployment
- Multi-language support

## 🔒 Security

### Authentication
- JWT tokens with refresh mechanism
- Role-based access control
- OTP verification for sensitive operations

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security
- Rate limiting
- Request validation
- Error handling without information leakage

## 📊 Monitoring & Logging

### Application Monitoring
- Prometheus metrics
- Grafana dashboards
- Sentry for error tracking

### Logging
- Structured JSON logging
- Log levels: DEBUG, INFO, WARNING, ERROR
- Centralized log aggregation

## 🚀 Deployment

### Production Setup
1. Configure environment variables
2. Set up SSL certificates
3. Configure database backups
4. Set up monitoring and alerting

### CI/CD Pipeline
- GitHub Actions for automated testing
- Docker image building
- Automated deployment to staging/production

## 📚 API Reference

### Authentication Endpoints
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
```

### Patient Endpoints
```
POST /api/v1/patient/reports
GET /api/v1/patient/reports
GET /api/v1/patient/reports/{id}
PUT /api/v1/patient/reports/{id}
```

### AI Service Endpoints
```
POST /api/v1/speech/transcribe
POST /api/v1/ocr/extract-text
POST /api/v1/nlp/analyze
POST /api/v1/medical/extract
```

## 🐛 Troubleshooting

### Common Issues
1. **Database connection errors**: Check PostgreSQL service and credentials
2. **Port conflicts**: Verify no other services using required ports
3. **Permission errors**: Check file permissions and Docker volumes
4. **Memory issues**: Increase Docker memory limits for ML services

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG

# Run services in debug mode
docker-compose -f infrastructure/docker-compose.yml up --build
```

## 📞 Support

### Team Contacts
- **Tejus**: Backend/DevOps issues
- **Vaishali**: Design/UX questions
- **Mausam**: Frontend problems
- **Swathiga**: AI/ML integration

### Communication
- **GitHub**: Issues and PRs
- **Discord**: Real-time chat
- **Email**: Formal communications

---

**Happy coding! 🚀** 