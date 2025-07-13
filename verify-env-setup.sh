#!/bin/bash

echo "🔍 Verifying Environment Setup for Rakshaayan Platform..."
echo ""

# Check if all required services have env.example files
services=("auth_service" "patient_service" "hospital_service" "manufacturer_service" "gov_service" "coordinator_service" "media_service" "ai_service")

echo "📋 Checking service env.example files:"
echo ""

all_good=true

for service in "${services[@]}"; do
    if [ -f "services/$service/env.example" ]; then
        # Check if it has the proper structure
        if grep -q "Service Environment Configuration" "services/$service/env.example"; then
            echo "✅ services/$service/env.example - OK"
        else
            echo "❌ services/$service/env.example - Missing proper header"
            all_good=false
        fi
    else
        echo "❌ services/$service/env.example - MISSING"
        all_good=false
    fi
done

echo ""
echo "📋 Checking frontend env.example:"
if [ -f "frontend/env.example" ]; then
    if grep -q "Frontend Specific Configuration" "frontend/env.example"; then
        echo "✅ frontend/env.example - OK"
    else
        echo "❌ frontend/env.example - Missing proper header"
        all_good=false
    fi
else
    echo "❌ frontend/env.example - MISSING"
    all_good=false
fi

echo ""
echo "📋 Checking setup script:"
if [ -f "setup-env.sh" ]; then
    echo "✅ setup-env.sh - OK"
else
    echo "❌ setup-env.sh - MISSING"
    all_good=false
fi

echo ""
echo "📋 Checking docker-compose configuration:"
if [ -f "infrastructure/docker-compose.yml" ]; then
    echo "✅ infrastructure/docker-compose.yml - OK"
else
    echo "❌ infrastructure/docker-compose.yml - MISSING"
    all_good=false
fi

echo ""
if [ "$all_good" = true ]; then
    echo "🎉 All environment files are properly configured!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Run: ./setup-env.sh"
    echo "2. Edit each service's .env file with your actual values"
    echo "3. Start services: docker-compose -f infrastructure/docker-compose.yml up -d"
    echo ""
    echo "🔗 Each service now has its own complete .env file with:"
    echo "   - Database configuration"
    echo "   - Django/FastAPI settings"
    echo "   - JWT configuration"
    echo "   - Email settings"
    echo "   - Service-specific settings"
    echo "   - Integration URLs"
else
    echo "❌ Some environment files are missing or improperly configured!"
    echo "Please check the errors above and fix them."
fi 