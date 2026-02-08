#!/bin/bash

# Seller Panel Integration Test Script
# Tests all seller endpoints with real data

BASE_URL="http://localhost:4000"
TOKEN="${SELLER_TOKEN:-your_test_token_here}"

echo "🧪 Seller Panel Integration Tests"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Helper function to make requests
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    echo -e "${YELLOW}Testing:${NC} $description"
    echo "  $method $endpoint"

    if [ -z "$data" ]; then
        response=$(curl -s -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -X $method \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    fi

    echo "  Response: $response"
    echo ""
}

# Test 1: Check server health
echo -e "${YELLOW}1. Server Health Check${NC}"
test_endpoint "GET" "/health" "" "Check if server is running"

# Test 2: Get dashboard stats
echo -e "${YELLOW}2. Dashboard Statistics${NC}"
test_endpoint "GET" "/api/seller/stats" "" "Get seller dashboard stats"

# Test 3: List products
echo -e "${YELLOW}3. List Products${NC}"
test_endpoint "GET" "/api/seller/products?page=1&limit=10" "" "Get seller products"

# Test 4: Create product
echo -e "${YELLOW}4. Create Product${NC}"
product_data='{
  "name": "Test Handicraft Item",
  "description": "Beautiful handmade item",
  "price": 1500,
  "originalPrice": 2000,
  "stockCount": 20,
  "category": "Handicrafts",
  "images": ["https://example.com/image.jpg"]
}'
test_endpoint "POST" "/api/seller/products" "$product_data" "Create new product"

# Test 5: List orders
echo -e "${YELLOW}5. List Orders${NC}"
test_endpoint "GET" "/api/seller/orders?page=1&limit=10" "" "Get seller orders"

# Test 6: Get analytics - sales data
echo -e "${YELLOW}6. Sales Analytics (30 days)${NC}"
test_endpoint "GET" "/api/seller/analytics/sales?period=30days" "" "Get sales analytics"

# Test 7: Get analytics - revenue
echo -e "${YELLOW}7. Revenue Analytics${NC}"
test_endpoint "GET" "/api/seller/analytics/revenue" "" "Get revenue summary"

# Test 8: Get analytics - order status
echo -e "${YELLOW}8. Order Status Breakdown${NC}"
test_endpoint "GET" "/api/seller/analytics/orders-status" "" "Get order status breakdown"

# Test 9: Get analytics - customers
echo -e "${YELLOW}9. Customer Analytics${NC}"
test_endpoint "GET" "/api/seller/analytics/customers" "" "Get customer insights"

# Test 10: Get analytics - categories
echo -e "${YELLOW}10. Category Performance${NC}"
test_endpoint "GET" "/api/seller/analytics/categories" "" "Get category analytics"

# Test 11: Get product analytics
echo -e "${YELLOW}11. Product Performance${NC}"
test_endpoint "GET" "/api/seller/analytics/products" "" "Get product performance"

# Test 12: Get alerts
echo -e "${YELLOW}12. Real-time Alerts${NC}"
test_endpoint "GET" "/api/seller/alerts" "" "Get seller alerts"

# Test 13: Get profile
echo -e "${YELLOW}13. Seller Profile${NC}"
test_endpoint "GET" "/api/seller/profile" "" "Get seller profile"

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Note: Tests require valid TOKEN and running server"
echo "Set TOKEN: export SELLER_TOKEN='your_token_here'"
