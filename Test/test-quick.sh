#!/bin/bash

# Admin & Seller Panel - Quick Start Testing Guide
# Run this script to test all functionality

echo "================================"
echo "Admin & Seller Panel Test Suite"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if servers are running
echo -e "${BLUE}Checking server status...${NC}"

# Try to connect to backend
if curl -s http://localhost:4000/health > /dev/null; then
    echo -e "${GREEN}✓ Backend server running on port 4000${NC}"
else
    echo -e "${RED}✗ Backend server not running${NC}"
    echo "Start backend with: cd server && npm run dev"
    exit 1
fi

# Try to connect to frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Frontend server running on port 5173${NC}"
else
    echo -e "${YELLOW}⚠ Frontend not running - that's OK, you can access via browser${NC}"
fi

echo ""
echo -e "${BLUE}Testing Admin & Seller Panel Endpoints${NC}"
echo ""

# Test 1: Admin Login
echo -e "${YELLOW}Test 1: Admin Login${NC}"
ADMIN_LOGIN=$(curl -s -X POST http://localhost:4000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zaymazone.com","password":"admin123"}')

if echo "$ADMIN_LOGIN" | grep -q "accessToken"; then
    echo -e "${GREEN}✓ Admin login successful${NC}"
    ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//' | head -1)
    echo "Token: ${ADMIN_TOKEN:0:20}..."
else
    echo -e "${RED}✗ Admin login failed${NC}"
    echo "Response: $ADMIN_LOGIN"
fi

echo ""

# Test 2: Get Pending Artisans
echo -e "${YELLOW}Test 2: Get Pending Artisans${NC}"
if [ ! -z "$ADMIN_TOKEN" ]; then
    ARTISANS=$(curl -s -X GET "http://localhost:4000/api/admin-approvals/pending-artisans" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if echo "$ARTISANS" | grep -q "artisans\|pending"; then
        echo -e "${GREEN}✓ Pending artisans retrieved${NC}"
        echo "Response: $ARTISANS" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ Failed to get pending artisans${NC}"
        echo "Response: $ARTISANS"
    fi
else
    echo -e "${YELLOW}⚠ Skipped (no admin token)${NC}"
fi

echo ""

# Test 3: Get Pending Products
echo -e "${YELLOW}Test 3: Get Pending Products${NC}"
if [ ! -z "$ADMIN_TOKEN" ]; then
    PRODUCTS=$(curl -s -X GET "http://localhost:4000/api/admin-approvals/pending-products" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if echo "$PRODUCTS" | grep -q "products\|pending"; then
        echo -e "${GREEN}✓ Pending products retrieved${NC}"
        echo "Response: $PRODUCTS" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ Failed to get pending products${NC}"
        echo "Response: $PRODUCTS"
    fi
else
    echo -e "${YELLOW}⚠ Skipped (no admin token)${NC}"
fi

echo ""

# Test 4: Get Pending Blogs
echo -e "${YELLOW}Test 4: Get Pending Blogs${NC}"
if [ ! -z "$ADMIN_TOKEN" ]; then
    BLOGS=$(curl -s -X GET "http://localhost:4000/api/admin-approvals/pending-blogs" \
      -H "Authorization: Bearer $ADMIN_TOKEN")
    
    if echo "$BLOGS" | grep -q "blogs\|pending"; then
        echo -e "${GREEN}✓ Pending blogs retrieved${NC}"
        echo "Response: $BLOGS" | head -c 200
        echo "..."
    else
        echo -e "${RED}✗ Failed to get pending blogs${NC}"
        echo "Response: $BLOGS"
    fi
else
    echo -e "${YELLOW}⚠ Skipped (no admin token)${NC}"
fi

echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Testing Summary${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo "Next Steps:"
echo "1. Open http://localhost:5173/admin in your browser"
echo "2. Login with credentials: admin@zaymazone.com / admin123"
echo "3. Test the approval workflows"
echo "4. Check seller panel at http://localhost:5173/seller-dashboard"
echo ""

echo -e "${GREEN}Testing complete!${NC}"
