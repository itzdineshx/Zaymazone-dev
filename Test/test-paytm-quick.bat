@echo off
REM Quick Paytm Integration Test Script for Windows
REM Tests basic Paytm endpoints without authentication

setlocal enabledelayedexpansion

set API_URL=http://localhost:4000
if not "%~1"=="" set API_URL=%~1

echo ╔════════════════════════════════════════════════════════════╗
echo ║        PAYTM PAYMENT GATEWAY - QUICK TEST SCRIPT          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🔗 Testing API: %API_URL%
echo.

set PASSED=0
set FAILED=0

REM Test 1: Server Health
echo 🏥 Server Health Check
echo Testing Health Endpoint...
curl -s -o nul -w "HTTP %%{http_code}" "%API_URL%/health"
if %ERRORLEVEL% EQU 0 (
    echo ✅ PASSED
    set /a PASSED+=1
) else (
    echo ❌ FAILED
    set /a FAILED+=1
)
echo.

REM Test 2: Paytm Status
echo 📊 Paytm Configuration
echo Testing Paytm Status...
curl -s -o nul -w "HTTP %%{http_code}" "%API_URL%/api/payments/paytm/status"
if %ERRORLEVEL% EQU 0 (
    echo ✅ PASSED
    set /a PASSED+=1
) else (
    echo ❌ FAILED
    set /a FAILED+=1
)
echo.

REM Test 3: Payment Methods
echo 💳 Payment Methods
echo Testing Get Payment Methods...
curl -s -o nul -w "HTTP %%{http_code}" "%API_URL%/api/payments/paytm/methods"
if %ERRORLEVEL% EQU 0 (
    echo ✅ PASSED
    set /a PASSED+=1
) else (
    echo ❌ FAILED
    set /a FAILED+=1
)
echo.

REM Summary
set /a TOTAL=PASSED+FAILED
set /a SUCCESS_RATE=(PASSED*100)/TOTAL

echo ╔════════════════════════════════════════════════════════════╗
echo ║                        TEST SUMMARY                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📊 Results:
echo    Total Tests: %TOTAL%
echo    ✅ Passed: %PASSED%
echo    ❌ Failed: %FAILED%
echo    📈 Success Rate: %SUCCESS_RATE%%%
echo.

if %FAILED% EQU 0 (
    echo 🎉 All tests passed!
    echo.
    echo Next steps:
    echo 1. Run full test suite: node Test\test-paytm-integration.js
    echo 2. Test with authentication for order creation
    echo 3. Test mock payment flow in browser
    exit /b 0
) else (
    echo ❌ Some tests failed. Please check server logs.
    exit /b 1
)
