# 🚀 Developer Setup Guide - Rakshaayan Platform

## Quick Start (5 minutes)

### 1. Clone and Setup
```bash
# Clone the repository
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform

# Setup environment files automatically
./setup-env.sh
```

### 2. Configure Environment
Edit these files with your actual values:
- `.env` (root)
- `services/auth_service/.env`
- `services/patient_service/.env`
- `services/hospital_service/.env`
- `services/manufacturer_service/.env`
- `services/gov_service/.env`
- `services/coordinator_service/.env`
- `services/media_service/.env`
- `services/ai_service/.env`
- `frontend/.env`

**Important:** Use the same `SECRET_KEY` and `JWT_SECRET_KEY` values across all Django services for simplicity.

### 3. Start Development
```bash
# Start all services
docker-compose -f infrastructure/docker-compose.yml up -d

# Check if all services are running
docker-compose -f infrastructure/docker-compose.yml ps
```

### 4. Access Services
- **Frontend**: http://localhost:3000
- **Auth Service**: http://localhost:8001
- **Patient Service**: http://localhost:8002
- **Hospital Service**: http://localhost:8003
- **Manufacturer Service**: http://localhost:8004
- **Government Service**: http://localhost:8005
- **Coordinator Service**: http://localhost:8006
- **Media Service**: http://localhost:8007
- **AI Service**: http://localhost:8010

## Development Workflow

### Start Work
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### Make Changes
```bash
# Make your changes
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### Create Pull Request
1. Go to GitHub: https://github.com/rakshaayanplatform/mvpi-regulatory-platform
2. Create PR from your feature branch to `dev`
3. Wait for CI/CD to pass
4. Get code review approval
5. Merge to `dev`

## Environment Variables Explained

### Common Variables (All Services)
- `POSTGRES_HOST`: Database host (use Tailscale IP)
- `POSTGRES_PORT`: Database port (5432)
- `POSTGRES_DB`: Database name (rakshaayan)
- `POSTGRES_USER`: Database user (rakshaayan)
- `POSTGRES_PASSWORD`: Database password

### Django Services
- `SECRET_KEY`: Django secret key (same for all Django services)
- `JWT_SECRET_KEY`: JWT signing key (can be same as SECRET_KEY)
- `EMAIL_HOST_USER`: Your Gmail address
- `EMAIL_HOST_PASSWORD`: Gmail app password

### Frontend
- `NEXT_PUBLIC_*`: Public API URLs for each service

## Troubleshooting

### Services Not Starting
```bash
# Check logs
docker-compose -f infrastructure/docker-compose.yml logs

# Restart services
docker-compose -f infrastructure/docker-compose.yml restart
```

### Database Issues
```bash
# Reset database
docker-compose -f infrastructure/docker-compose.yml down -v
docker-compose -f infrastructure/docker-compose.yml up -d
```

### Environment Issues
```bash
# Re-run setup
./setup-env.sh
```

## Team Responsibilities

- **Tejus**: Backend services, database, DevOps
- **Vaishali**: UI/UX design, frontend components
- **Mausam**: Frontend development, API integration
- **Swathiga**: AI service, ML models

## Support

- **GitHub Issues**: For bugs and feature requests
- **Discord**: For real-time team communication
- **Daily Standup**: 10:00 AM IST

---

**Ready to build India's medical device safety platform! 🇮🇳** 