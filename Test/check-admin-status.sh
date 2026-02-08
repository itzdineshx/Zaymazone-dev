#!/bin/bash
# Admin Panel System Status Script
# Run this to verify everything is working

echo "🔍 Checking Admin Panel System Status..."
echo ""

# Check if backend is running
echo "1️⃣ Checking Backend Server..."
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
  echo "   ✅ Backend server is running (http://localhost:4000)"
else
  echo "   ❌ Backend server is NOT running"
  echo "   Start it with: cd server && node src/index.js"
fi

# Check if frontend is running
echo ""
echo "2️⃣ Checking Frontend Application..."
if curl -s http://localhost:8081 > /dev/null 2>&1; then
  echo "   ✅ Frontend app is running (http://localhost:8081)"
else
  echo "   ❌ Frontend app is NOT running"
  echo "   Start it with: npm run dev"
fi

# Check if admin panel is accessible
echo ""
echo "3️⃣ Checking Admin Panel..."
if curl -s http://localhost:8081/admin > /dev/null 2>&1; then
  echo "   ✅ Admin panel is accessible (http://localhost:8081/admin)"
else
  echo "   ❌ Admin panel is NOT accessible"
fi

echo ""
echo "📊 System Status Summary:"
echo ""
echo "Backend:     http://localhost:4000"
echo "Frontend:    http://localhost:8081"
echo "Admin Panel: http://localhost:8081/admin"
echo ""
echo "Login Credentials:"
echo "  Email:    admin@zaymazone.com"
echo "  Password: admin123"
echo ""
echo "🧪 To test all endpoints:"
echo "   node test-admin-real-backend.js"
echo ""
echo "📚 Documentation:"
echo "   - ADMIN_PANEL_QUICKSTART.md"
echo "   - ADMIN_PANEL_REAL_DATABASE_READY.md"
echo "   - ADMIN_PANEL_IMPLEMENTATION_COMPLETE.md"
