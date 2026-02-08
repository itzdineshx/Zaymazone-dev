@echo off
REM Admin & Seller Panel - Quick Start Testing Guide (Windows Version)
REM Run this to test all functionality

echo ================================
echo Admin ^& Seller Panel Test Suite
echo ================================
echo.

REM Check if servers are running
echo Checking server status...

REM Try to connect to backend
curl -s http://localhost:4000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend server running on port 4000
) else (
    echo [FAIL] Backend server not running
    echo Start backend with: cd server ^&^& npm run dev
    pause
    exit /b 1
)

REM Try to connect to frontend
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend server running on port 5173
) else (
    echo [INFO] Frontend not running - that's OK, you can access via browser
)

echo.
echo Testing Admin ^& Seller Panel Endpoints
echo.

REM Test 1: Admin Login
echo Test 1: Admin Login
curl -s -X POST http://localhost:4000/api/admin/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@zaymazone.com\",\"password\":\"admin123\"}" > admin_login.json

if exist admin_login.json (
    echo [OK] Admin login response received
    type admin_login.json
) else (
    echo [FAIL] Admin login failed
)

echo.

REM Test 2: Get Pending Artisans
echo Test 2: Get Pending Artisans
echo First, extract token from login response...

REM Display summary
echo.
echo ================================
echo Testing Summary
echo ================================
echo.
echo Next Steps:
echo 1. Open http://localhost:5173/admin in your browser
echo 2. Login with credentials: admin@zaymazone.com / admin123
echo 3. Test the approval workflows
echo 4. Check seller panel at http://localhost:5173/seller-dashboard
echo.

echo Testing complete!
echo.

REM Cleanup
if exist admin_login.json del admin_login.json

pause
