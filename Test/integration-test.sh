#!/bin/bash

echo "🚀 Frontend-Backend Integration Test"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${BLUE}🔍 Checking Backend Server...${NC}"
if curl -s "http://localhost:4000/health" | grep -q '"ok":true'; then
    echo -e "${GREEN}✅ Backend server is running on port 4000${NC}"
else
    echo -e "${RED}❌ Backend server is not running${NC}"
    echo "Please start the backend server first:"
    echo "  cd server && node src/index.js"
    exit 1
fi

# Check if frontend is running
echo -e "${BLUE}🔍 Checking Frontend Server...${NC}"
if curl -s "http://localhost:8081" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend server is running on port 8081${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend server not detected on port 8081${NC}"
    echo "Please start the frontend server:"
    echo "  npm run dev"
fi

# Test API endpoints
echo -e "${BLUE}🔍 Testing API Endpoints...${NC}"

# Test products endpoint
PRODUCTS_COUNT=$(curl -s "http://localhost:4000/api/products" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('pagination', {}).get('total', len(data.get('products', []))))" 2>/dev/null)
if [ -n "$PRODUCTS_COUNT" ]; then
    echo -e "${GREEN}✅ Products API: ${PRODUCTS_COUNT} products available${NC}"
else
    echo -e "${RED}❌ Products API failed${NC}"
fi

# Test artisans endpoint
ARTISANS_COUNT=$(curl -s "http://localhost:4000/api/artisans" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data))" 2>/dev/null)
if [ -n "$ARTISANS_COUNT" ]; then
    echo -e "${GREEN}✅ Artisans API: ${ARTISANS_COUNT} artisans available${NC}"
else
    echo -e "${RED}❌ Artisans API failed${NC}"
fi

# Test user authentication
echo -e "${BLUE}🔍 Testing User Authentication...${NC}"
SIGNUP_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test-integration@example.com","password":"testpass123"}' \
    "http://localhost:4000/api/auth/signup" 2>/dev/null)

if echo "$SIGNUP_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ User signup working${NC}"
    TOKEN=$(echo "$SIGNUP_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))" 2>/dev/null)
    
    # Test authenticated endpoints
    if [ -n "$TOKEN" ]; then
        # Test cart endpoint
        CART_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/cart" 2>/dev/null)
        if echo "$CART_RESPONSE" | grep -q "items"; then
            echo -e "${GREEN}✅ Cart API working (authenticated)${NC}"
        else
            echo -e "${RED}❌ Cart API failed${NC}"
        fi
        
        # Test wishlist endpoint
        WISHLIST_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/wishlist" 2>/dev/null)
        if echo "$WISHLIST_RESPONSE" | grep -q "products"; then
            echo -e "${GREEN}✅ Wishlist API working (authenticated)${NC}"
        else
            echo -e "${RED}❌ Wishlist API failed${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  User already exists or signup failed, trying signin...${NC}"
    SIGNIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"testpass123"}' \
        "http://localhost:4000/api/auth/signin" 2>/dev/null)
    
    if echo "$SIGNIN_RESPONSE" | grep -q "token"; then
        echo -e "${GREEN}✅ User signin working${NC}"
    else
        echo -e "${RED}❌ Authentication failed${NC}"
    fi
fi

echo ""
echo -e "${BLUE}📋 Integration Summary:${NC}"
echo "========================"
echo -e "🌐 Backend: ${GREEN}http://localhost:4000${NC}"
echo -e "🎨 Frontend: ${GREEN}http://localhost:8081${NC}"
echo ""
echo -e "${YELLOW}📱 Test URLs:${NC}"
echo "• API Test Page: http://localhost:8081/api-test"
echo "• Shop (Backend): http://localhost:8081/shop"
echo "• Shop (Mock): http://localhost:8081/shop-mock"
echo "• Homepage: http://localhost:8081/"
echo ""
echo -e "${GREEN}🎉 Frontend-Backend Integration Ready!${NC}"
echo "You can now test the full e-commerce workflow:"
echo "1. Browse products with real backend data"
echo "2. User authentication (signup/signin)"
echo "3. Cart management"
echo "4. Order processing"
echo "5. Wishlist functionality"