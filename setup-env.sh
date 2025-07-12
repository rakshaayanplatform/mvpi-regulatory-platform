#!/bin/bash

echo "🚀 Setting up environment files for Rakshaayan Platform..."

# Copy root environment file
if [ ! -f ".env" ]; then
    cp env.example .env
    echo "✅ Created .env from env.example"
else
    echo "⚠️  .env already exists, skipping..."
fi

# Copy environment files for all Django services
services=("auth_service" "patient_service" "hospital_service" "manufacturer_service" "gov_service" "coordinator_service" "media_service")

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
echo "1. Edit .env files with your actual values"
echo "2. Run: docker-compose -f infrastructure/docker-compose.yml up -d"
echo "3. Start development!" 