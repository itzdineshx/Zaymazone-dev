#!/bin/bash

# Quick Paytm Integration Test Script
# Tests basic Paytm endpoints without authentication

API_URL="${API_URL:-http://localhost:4000}"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        PAYTM PAYMENT GATEWAY - QUICK TEST SCRIPT          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🔗 Testing API: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    
    echo -n "Testing $name... "
    
    response=$(curl -s -w "\n%{http_code}" -X $method "$API_URL$endpoint" \
        -H "Content-Type: application/json" 2>/dev/null)
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        ((FAILED++))
        return 1
    fi
}

# Test 1: Server Health
echo "🏥 Server Health Check"
test_endpoint "Health Endpoint" "/health"
echo ""

# Test 2: Paytm Status
echo "📊 Paytm Configuration"
test_endpoint "Paytm Status" "/api/payments/paytm/status"
echo ""

# Test 3: Payment Methods
echo "💳 Payment Methods"
test_endpoint "Get Payment Methods" "/api/payments/paytm/methods"
echo ""

# Test 4: Invalid Endpoint (should fail gracefully)
echo "🚫 Error Handling"
echo -n "Testing Invalid Endpoint... "
response=$(curl -s -w "\n%{http_code}" "$API_URL/api/payments/paytm/invalid" 2>/dev/null)
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "404" ] || [ "$http_code" = "405" ]; then
    echo -e "${GREEN}✅ PASSED${NC} (Correctly returned $http_code)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} (Expected 404/405, got $http_code)"
    ((FAILED++))
fi
echo ""

# Summary
TOTAL=$((PASSED + FAILED))
SUCCESS_RATE=$((PASSED * 100 / TOTAL))

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                        TEST SUMMARY                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Results:"
echo "   Total Tests: $TOTAL"
echo -e "   ${GREEN}✅ Passed: $PASSED${NC}"
echo -e "   ${RED}❌ Failed: $FAILED${NC}"
echo "   📈 Success Rate: $SUCCESS_RATE%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run full test suite: node Test/test-paytm-integration.js"
    echo "2. Test with authentication for order creation"
    echo "3. Test mock payment flow in browser"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check server logs.${NC}"
    exit 1
fi
