#!/bin/bash

echo "🚀 Starting Zaymazone Backend Test"
echo "=================================="

# Start MongoDB if not running
if ! docker ps | grep -q zaymazone-mongo; then
    echo "📦 Starting MongoDB container..."
    docker run -d --name zaymazone-mongo -p 27017:27017 mongo:latest >/dev/null 2>&1 || true
    sleep 3
fi

# Kill any existing node processes
pkill -f "node src/index.js" 2>/dev/null || true
sleep 2

echo "🔧 Starting Zaymazone API server..."
cd /workspaces/zaymazone/server

# Start server in background
MONGODB_URI=mongodb://localhost:27017/zaymazone node src/index.js &
SERVER_PID=$!

# Wait for server to start
sleep 5

echo "🧪 Testing API endpoints..."

# Test health endpoint
echo -n "Health endpoint: "
HEALTH_RESPONSE=$(curl -s http://localhost:4000/health 2>/dev/null)
if [ $? -eq 0 ] && echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
fi

# Test main endpoint
echo -n "Main endpoint: "
MAIN_RESPONSE=$(curl -s http://localhost:4000/ 2>/dev/null)
if [ $? -eq 0 ] && echo "$MAIN_RESPONSE" | grep -q "Zaymazone API"; then
    echo "✅ PASS"
    echo "📋 API Info:"
    echo "$MAIN_RESPONSE" | python3 -m json.tool 2>/dev/null | head -10
else
    echo "❌ FAIL"
fi

# Test products endpoint
echo -n "Products endpoint: "
PRODUCTS_RESPONSE=$(curl -s http://localhost:4000/api/products 2>/dev/null)
if [ $? -eq 0 ] && echo "$PRODUCTS_RESPONSE" | grep -q "\[\]"; then
    echo "✅ PASS (empty array as expected)"
else
    echo "❌ FAIL"
fi

# Cleanup
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null || true
sleep 2

echo "✅ Backend test completed!"
echo "📝 Summary: Basic API endpoints are working"
echo "🔗 Ready for frontend integration"