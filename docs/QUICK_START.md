# ⚡ Quick Start - Rakshaayan Platform

> **5-minute setup guide for new team members**

---

## 🚀 One-Command Setup

```bash
# 1. Clone repository
git clone https://github.com/rakshaayanplatform/mvpi-regulatory-platform.git
cd mvpi-regulatory-platform

# 2. Setup environment files
./setup-env.sh

# 3. Edit database IP in all .env files
# Replace 100.x.x.x with Vaishali's laptop Tailscale IP

# 4. Start all services
docker-compose -f infrastructure/docker-compose.yml up -d

# 5. Access the platform
# Frontend: http://localhost:3000
# Auth API: http://localhost:8001
# Patient API: http://localhost:8002
# AI API: http://localhost:8010
```

---

## 📋 Prerequisites Checklist

- [ ] **Python 3.11+** installed
- [ ] **Node.js 18+** installed  
- [ ] **Docker Desktop** installed and running
- [ ] **Git** installed
- [ ] **VS Code/Cursor** installed
- [ ] **Tailscale** connected to network

---

## 🔧 Team-Specific Quick Commands

### **Vaishali (UI/UX Designer)**
```bash
cd frontend
npm install
npm run dev
# Access: http://localhost:3000
```

### **Mausam (Frontend Developer)**
```bash
cd frontend
npm install
npm run dev
# Work on: frontend/components/, frontend/app/
```

### **Tejus (Backend Developer)**
```bash
cd services/auth_service
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8001
# Work on: services/*/views.py, models.py
```

### **Swathiga (AI/ML Engineer)**
```bash
cd services/ai_service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8010
# Work on: services/ai_service/routers/
```

---

## 🆘 Common Issues

### **Services not starting?**
```bash
docker-compose -f infrastructure/docker-compose.yml logs
docker-compose -f infrastructure/docker-compose.yml down && docker-compose -f infrastructure/docker-compose.yml up -d
```

### **Database connection failed?**
```bash
# Check Tailscale connection
tailscale status
# Verify database IP in .env files
```

### **Frontend not loading?**
```bash
cd frontend
npm install
npm run dev
```

---

## 📞 Need Help?

- **Detailed Guide**: [DEVELOPER_GUIDELINES.md](DEVELOPER_GUIDELINES.md)
- **Team Chat**: Discord
- **Issues**: GitHub Issues
- **Emergency**: Contact Tejus

---

**🎉 You're ready to build India's medical device safety platform!** 