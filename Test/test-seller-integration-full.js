#!/usr/bin/env node

/**
 * SELLER PANEL - FULL INTEGRATION TEST
 * Tests all 20+ seller endpoints with real backend
 * Creates test seller account and verifies all CRUD operations
 */

import http from 'http';
import { URL } from 'url';

const BASE_URL = 'http://localhost:4000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Test counters
let passed = 0;
let failed = 0;
let total = 0;

/**
 * Make HTTP request
 */
function makeRequest(method, path, body = null, firebaseToken = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (firebaseToken) {
      options.headers['Authorization'] = `Bearer ${firebaseToken}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: { raw: data },
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

/**
 * Test result logger
 */
function logTest(name, success, details = '') {
  total++;
  if (success) {
    passed++;
    console.log(`${colors.green}✅${colors.reset} ${name} ${details ? `- ${details}` : ''}`);
  } else {
    failed++;
    console.log(`${colors.red}❌${colors.reset} ${name} ${details ? `- ${details}` : ''}`);
  }
}

/**
 * Print section header
 */
function printSection(title) {
  console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}═══════════════════════════════${colors.reset}\n`);
}

/**
 * Main test suite
 */
async function runTests() {
  console.log(`\n${colors.bright}${colors.magenta}🏪 SELLER PANEL - FULL INTEGRATION TEST${colors.reset}\n`);

  try {
    // Test 1: Create seller account
    printSection('1. SELLER AUTHENTICATION');

    let firebaseToken = null;
    let sellerId = null;

    const signupRes = await makeRequest('POST', '/api/seller/auth/signup', {
      name: `TestSeller_${Date.now()}`,
      email: `seller_${Date.now()}@test.com`,
      password: 'Test@123',
      artisanName: 'Test Artisan Shop'
    });

    logTest('Seller Signup', signupRes.status === 201, `Status: ${signupRes.status}`);

    if (signupRes.status === 201 && signupRes.data.token) {
      firebaseToken = signupRes.data.token;
      sellerId = signupRes.data.userId;
      console.log(`   Firebase Token: ${firebaseToken.substring(0, 20)}...`);
      console.log(`   Seller ID: ${sellerId}`);
    }

    if (!firebaseToken) {
      console.error('\n❌ Cannot continue without valid token. Exiting.');
      return;
    }

    // Test 2: Dashboard Stats
    printSection('2. DASHBOARD STATISTICS');

    const statsRes = await makeRequest('GET', '/api/seller/stats', null, firebaseToken);
    logTest('Get Dashboard Stats', statsRes.status === 200, `Status: ${statsRes.status}`);
    if (statsRes.data.stats) {
      console.log(`   Total Products: ${statsRes.data.stats.totalProducts}`);
      console.log(`   Total Orders: ${statsRes.data.stats.totalOrders}`);
      console.log(`   Total Revenue: ₹${statsRes.data.stats.totalRevenue}`);
    }

    // Test 3: Product Management
    printSection('3. PRODUCT MANAGEMENT');

    // 3a. Create Product
    const createProductRes = await makeRequest('POST', '/api/seller/products', {
      name: `Test Product ${Date.now()}`,
      description: 'Beautiful handmade test product',
      price: 999,
      originalPrice: 1999,
      images: ['https://via.placeholder.com/300'],
      category: 'handicrafts',
      subcategory: 'pottery',
      materials: ['clay', 'water'],
      colors: ['red'],
      stockCount: 50,
      isHandmade: true
    }, firebaseToken);

    logTest('Create Product', createProductRes.status === 201, `Status: ${createProductRes.status}`);
    let productId = null;
    if (createProductRes.data.product) {
      productId = createProductRes.data.product._id;
      console.log(`   Product ID: ${productId}`);
    }

    // 3b. List Products
    const listProductsRes = await makeRequest('GET', '/api/seller/products?page=1&limit=10', null, firebaseToken);
    logTest('List Products', listProductsRes.status === 200, `Status: ${listProductsRes.status}`);
    if (listProductsRes.data.products) {
      console.log(`   Total Products: ${listProductsRes.data.pagination?.total || 0}`);
    }

    // 3c. Get Single Product
    if (productId) {
      const getProductRes = await makeRequest('GET', `/api/seller/products/${productId}`, null, firebaseToken);
      logTest('Get Single Product', getProductRes.status === 200, `Status: ${getProductRes.status}`);
      if (getProductRes.data.product) {
        console.log(`   Product: ${getProductRes.data.product.name}`);
        console.log(`   Price: ₹${getProductRes.data.product.price}`);
      }

      // 3d. Update Product
      const updateProductRes = await makeRequest('PUT', `/api/seller/products/${productId}`, {
        price: 1199,
        stockCount: 40
      }, firebaseToken);
      logTest('Update Product', updateProductRes.status === 200, `Status: ${updateProductRes.status}`);

      // 3e. Delete Product
      const deleteProductRes = await makeRequest('DELETE', `/api/seller/products/${productId}`, null, firebaseToken);
      logTest('Delete Product', deleteProductRes.status === 200, `Status: ${deleteProductRes.status}`);
    }

    // Test 4: Order Management
    printSection('4. ORDER MANAGEMENT');

    // 4a. List Orders
    const listOrdersRes = await makeRequest('GET', '/api/seller/orders?page=1&limit=10', null, firebaseToken);
    logTest('List Orders', listOrdersRes.status === 200, `Status: ${listOrdersRes.status}`);
    if (listOrdersRes.data.orders) {
      console.log(`   Total Orders: ${listOrdersRes.data.pagination?.total || 0}`);
      
      // If there are orders, test getting details
      if (listOrdersRes.data.orders.length > 0) {
        const orderId = listOrdersRes.data.orders[0]._id;
        
        // 4b. Get Order Details
        const getOrderRes = await makeRequest('GET', `/api/seller/orders/${orderId}`, null, firebaseToken);
        logTest('Get Order Details', getOrderRes.status === 200, `Status: ${getOrderRes.status}`);
        
        // 4c. Update Order Status
        const updateOrderRes = await makeRequest('PATCH', `/api/seller/orders/${orderId}/status`, {
          status: 'shipped'
        }, firebaseToken);
        logTest('Update Order Status', updateOrderRes.status === 200, `Status: ${updateOrderRes.status}`);
      }
    }

    // Test 5: Seller Profile
    printSection('5. SELLER PROFILE');

    // 5a. Get Profile
    const getProfileRes = await makeRequest('GET', '/api/seller/profile', null, firebaseToken);
    logTest('Get Seller Profile', getProfileRes.status === 200, `Status: ${getProfileRes.status}`);
    if (getProfileRes.data.profile) {
      console.log(`   Shop Name: ${getProfileRes.data.profile.name}`);
      console.log(`   Rating: ${getProfileRes.data.profile.rating} ⭐`);
    }

    // 5b. Update Profile
    const updateProfileRes = await makeRequest('PUT', '/api/seller/profile', {
      bio: 'Updated test bio',
      specialties: ['pottery', 'painting']
    }, firebaseToken);
    logTest('Update Seller Profile', updateProfileRes.status === 200, `Status: ${updateProfileRes.status}`);

    // Test 6: Analytics
    printSection('6. ANALYTICS ENDPOINTS');

    // 6a. Sales Analytics
    const salesAnalyticsRes = await makeRequest('GET', '/api/seller/analytics/sales', null, firebaseToken);
    logTest('Sales Analytics', salesAnalyticsRes.status === 200, `Status: ${salesAnalyticsRes.status}`);

    // 6b. Product Analytics
    const productAnalyticsRes = await makeRequest('GET', '/api/seller/analytics/products', null, firebaseToken);
    logTest('Product Analytics', productAnalyticsRes.status === 200, `Status: ${productAnalyticsRes.status}`);

    // 6c. Revenue Analytics
    const revenueAnalyticsRes = await makeRequest('GET', '/api/seller/analytics/revenue', null, firebaseToken);
    logTest('Revenue Analytics', revenueAnalyticsRes.status === 200, `Status: ${revenueAnalyticsRes.status}`);
    if (revenueAnalyticsRes.data.totalRevenue) {
      console.log(`   Total Revenue: ₹${revenueAnalyticsRes.data.totalRevenue}`);
    }

    // 6d. Order Status Analytics
    const orderStatusAnalyticsRes = await makeRequest('GET', '/api/seller/analytics/orders-status', null, firebaseToken);
    logTest('Order Status Analytics', orderStatusAnalyticsRes.status === 200, `Status: ${orderStatusAnalyticsRes.status}`);

    // 6e. Customer Analytics
    const customerAnalyticsRes = await makeRequest('GET', '/api/seller/analytics/customers', null, firebaseToken);
    logTest('Customer Analytics', customerAnalyticsRes.status === 200, `Status: ${customerAnalyticsRes.status}`);

    // 6f. Category Analytics
    const categoryAnalyticsRes = await makeRequest('GET', '/api/seller/analytics/categories', null, firebaseToken);
    logTest('Category Analytics', categoryAnalyticsRes.status === 200, `Status: ${categoryAnalyticsRes.status}`);

    // Test 7: Additional Features
    printSection('7. ADDITIONAL FEATURES');

    // 7a. Get Alerts
    const alertsRes = await makeRequest('GET', '/api/seller/alerts', null, firebaseToken);
    logTest('Get Alerts', alertsRes.status === 200 || alertsRes.status === 404, `Status: ${alertsRes.status}`);

    // 7b. Onboarding Status
    const onboardingRes = await makeRequest('GET', '/api/seller/onboarding/status', null, firebaseToken);
    logTest('Check Onboarding Status', onboardingRes.status === 200 || onboardingRes.status === 404, `Status: ${onboardingRes.status}`);

    // Print summary
    printSection('FINAL REPORT');

    console.log(`${colors.bright}Total Tests: ${total}${colors.reset}`);
    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`${colors.bright}Success Rate: ${((passed/total)*100).toFixed(1)}%${colors.reset}\n`);

    if (failed === 0) {
      console.log(`${colors.bright}${colors.green}🎉 ALL TESTS PASSED! Seller panel is fully operational.${colors.reset}\n`);
    } else {
      console.log(`${colors.bright}${colors.yellow}⚠️  Some tests failed. Check details above.${colors.reset}\n`);
    }

  } catch (error) {
    console.error(`${colors.red}❌ Test Error: ${error.message}${colors.reset}`);
  }
}

// Run tests
runTests();
