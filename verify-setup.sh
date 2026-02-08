#!/bin/bash

# Verification Script for Artisan Onboarding System
# This script checks that all components are properly set up

echo "======================================"
echo "Zaymazone Artisan Onboarding System"
echo "Verification Script"
echo "======================================"
echo ""

# Track results
ERRORS=0
WARNINGS=0
SUCCESS=0

# Helper functions
check_success() {
  echo "✅ $1"
  ((SUCCESS++))
}

check_error() {
  echo "❌ $1"
  ((ERRORS++))
}

check_warning() {
  echo "⚠️  $1"
  ((WARNINGS++))
}

# 1. Check Backend Files
echo "1. Checking Backend Files..."
echo "---"

if [ -f "server/src/routes/onboarding.js" ]; then
  check_success "onboarding.js exists"
else
  check_error "onboarding.js missing"
fi

if [ -f "server/src/routes/admin-approvals.js" ]; then
  check_success "admin-approvals.js exists"
else
  check_error "admin-approvals.js missing"
fi

if [ -f "server/src/index.js" ]; then
  check_success "index.js exists"
else
  check_error "index.js missing"
fi

echo ""

# 2. Check Frontend Components
echo "2. Checking Frontend Components..."
echo "---"

if [ -f "src/components/AdminArtisanApprovals.tsx" ]; then
  check_success "AdminArtisanApprovals.tsx exists"
else
  check_error "AdminArtisanApprovals.tsx missing"
fi

if [ -f "src/components/AdminProductApprovals.tsx" ]; then
  check_success "AdminProductApprovals.tsx exists"
else
  check_error "AdminProductApprovals.tsx missing"
fi

if [ -f "src/components/AdminBlogApprovals.tsx" ]; then
  check_success "AdminBlogApprovals.tsx exists"
else
  check_error "AdminBlogApprovals.tsx missing"
fi

echo ""

# 3. Check Database Models
echo "3. Checking Database Models..."
echo "---"

if grep -q "approvalStatus" server/src/models/Artisan.js 2>/dev/null; then
  check_success "Artisan model updated with approval fields"
else
  check_error "Artisan model missing approval fields"
fi

if grep -q "approvalStatus" server/src/models/Product.js 2>/dev/null; then
  check_success "Product model updated with approval fields"
else
  check_error "Product model missing approval fields"
fi

if grep -q "approvalStatus" server/src/models/BlogPost.js 2>/dev/null; then
  check_success "BlogPost model updated with approval fields"
else
  check_error "BlogPost model missing approval fields"
fi

echo ""

# 4. Check Documentation
echo "4. Checking Documentation..."
echo "---"

DOCS=(
  "ARTISAN_ONBOARDING_SYSTEM.md"
  "ARTISAN_ONBOARDING_QUICK_START.md"
  "ADMIN_INTEGRATION_GUIDE.md"
  "API_REFERENCE.md"
  "IMPLEMENTATION_SUMMARY.md"
  "DEPLOYMENT_TESTING_GUIDE.md"
  "IMPLEMENTATION_CHECKLIST.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    check_success "$doc exists"
  else
    check_error "$doc missing"
  fi
done

echo ""

# 5. Check Node Dependencies
echo "5. Checking Dependencies..."
echo "---"

if [ -d "node_modules" ]; then
  check_success "Frontend node_modules exists"
else
  check_warning "Frontend node_modules not installed (run: npm install)"
fi

if [ -d "server/node_modules" ]; then
  check_success "Backend node_modules exists"
else
  check_warning "Backend node_modules not installed (run: cd server && npm install)"
fi

echo ""

# 6. Check Environment Files
echo "6. Checking Environment Files..."
echo "---"

if [ -f ".env.local" ] || [ -f ".env" ]; then
  check_success "Frontend environment file exists"
else
  check_warning "No .env.local or .env in frontend (needed for API_BASE_URL)"
fi

if [ -f "server/.env" ]; then
  check_success "Backend environment file exists"
else
  check_warning "No .env in server (needed for database connection)"
fi

echo ""

# 7. Check Server Status
echo "7. Checking Server Status..."
echo "---"

if command -v curl &> /dev/null; then
  if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    check_success "Backend server is running on port 4000"
  else
    check_warning "Backend server not running on port 4000"
  fi
  
  if curl -s http://localhost:5173 > /dev/null 2>&1; then
    check_success "Frontend dev server is running on port 5173"
  else
    check_warning "Frontend dev server not running on port 5173"
  fi
else
  check_warning "curl not found - cannot check server status"
fi

echo ""

# 8. Summary
echo "======================================"
echo "VERIFICATION SUMMARY"
echo "======================================"
echo "✅ Successful: $SUCCESS"
echo "❌ Errors: $ERRORS"
echo "⚠️  Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo "✅ All critical checks passed!"
  echo ""
  echo "Next steps:"
  echo "1. Install dependencies: npm install && cd server && npm install"
  echo "2. Configure environment variables (.env files)"
  echo "3. Start backend: npm run dev (from server/)"
  echo "4. Start frontend: npm run dev (from root)"
  echo "5. Run tests: npm run test"
  echo "6. Review documentation in root directory"
else
  echo "❌ Some critical checks failed. Please review above."
fi

echo ""
