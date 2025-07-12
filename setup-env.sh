#!/bin/bash

echo "🚀 Setting up environment files for Rakshaayan Platform..."
echo ""
echo "📋 Each service has its own complete .env file with all necessary variables"
echo ""

# Copy environment files for all Django services
services=("auth_service" "patient_service" "hospital_service" "manufacturer_service" "gov_service" "coordinator_service" "media_service")

echo "🔧 Setting up service-specific .env files..."

for service in "${services[@]}"; do
    if [ -f "services/$service/env.example" ]; then
        if [ ! -f "services/$service/.env" ]; then
            cp "services/$service/env.example" "services/$service/.env"
            echo "✅ Created services/$service/.env"
        else
            echo "⚠️  services/$service/.env already exists, skipping..."
        fi
    else
        echo "❌ services/$service/env.example not found!"
    fi
done

# Copy environment file for AI service
if [ -f "services/ai_service/env.example" ]; then
    if [ ! -f "services/ai_service/.env" ]; then
        cp "services/ai_service/env.example" "services/ai_service/.env"
        echo "✅ Created services/ai_service/.env"
    else
        echo "⚠️  services/ai_service/.env already exists, skipping..."
    fi
else
    echo "❌ services/ai_service/env.example not found!"
fi

# Copy environment file for frontend
if [ -f "frontend/env.example" ]; then
    if [ ! -f "frontend/.env" ]; then
        cp "frontend/env.example" "frontend/.env"
        echo "✅ Created frontend/.env"
    else
        echo "⚠️  frontend/.env already exists, skipping..."
    fi
else
    echo "❌ frontend/env.example not found!"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit each service's .env file with your actual values:"
echo "   - POSTGRES_HOST (your database IP)"
echo "   - EMAIL_HOST_USER (your email)"
echo "   - EMAIL_HOST_PASSWORD (your app password)"
echo "   - SECRET_KEY (generate unique secrets for each service)"
echo "   - JWT_SECRET_KEY (generate a new JWT secret)"
echo ""
echo "2. Start all services:"
echo "   docker-compose -f infrastructure/docker-compose.yml up -d"
echo ""
echo "3. Verify services are running:"
echo "   - Frontend: http://localhost:3000"
echo "   - Auth Service: http://localhost:8001"
echo "   - Patient Service: http://localhost:8002"
echo "   - AI Service: http://localhost:8010"
echo ""
echo "🔗 Each service now has its own complete .env file with all necessary variables." 