#!/usr/bin/env node
/**
 * Test Admin Panel Integration with Real Database
 * Verifies that all admin endpoints are working with real data
 */

import axios from 'axios';

const API_URL = 'http://localhost:4000/api';
let adminToken = null;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAdminLogin() {
  log('\n=== Testing Admin Login ===', 'cyan');
  
  try {
    const response = await axios.post(`${API_URL}/admin/auth/login`, {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.accessToken) {
      adminToken = response.data.accessToken;
      log('✅ Admin login successful!', 'green');
      log(`   Token: ${adminToken.substring(0, 20)}...`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Admin login failed: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testAdminStats() {
  if (!adminToken) {
    log('⚠️  Skipping stats test - not authenticated', 'yellow');
    return false;
  }
  
  log('\n=== Testing Admin Stats Endpoint ===', 'cyan');
  
  try {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.stats) {
      log('✅ Admin stats retrieved successfully!', 'green');
      log(`   Total Products: ${response.data.stats.totalProducts}`, 'green');
      log(`   Active Artisans: ${response.data.stats.activeArtisans}`, 'green');
      log(`   Total Orders: ${response.data.stats.totalOrders}`, 'green');
      log(`   Total Revenue: $${response.data.stats.totalRevenue}`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Stats endpoint failed: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testGetSellers() {
  if (!adminToken) {
    log('⚠️  Skipping sellers test - not authenticated', 'yellow');
    return false;
  }
  
  log('\n=== Testing Get Sellers Endpoint ===', 'cyan');
  
  try {
    const response = await axios.get(`${API_URL}/admin/sellers?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.sellers) {
      log('✅ Sellers retrieved successfully!', 'green');
      log(`   Total Sellers: ${response.data.pagination?.total || 0}`, 'green');
      log(`   Sellers Found: ${response.data.sellers.length}`, 'green');
      
      if (response.data.sellers.length > 0) {
        log(`   First Seller: ${response.data.sellers[0].name || response.data.sellers[0].email}`, 'green');
      }
      return true;
    }
  } catch (error) {
    log(`❌ Sellers endpoint failed: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testGetProducts() {
  if (!adminToken) {
    log('⚠️  Skipping products test - not authenticated', 'yellow');
    return false;
  }
  
  log('\n=== Testing Get Products Endpoint ===', 'cyan');
  
  try {
    const response = await axios.get(`${API_URL}/admin/products?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.products) {
      log('✅ Products retrieved successfully!', 'green');
      log(`   Total Products: ${response.data.pagination?.total || 0}`, 'green');
      log(`   Products Found: ${response.data.products.length}`, 'green');
      
      if (response.data.products.length > 0) {
        log(`   First Product: ${response.data.products[0].name}`, 'green');
      }
      return true;
    }
  } catch (error) {
    log(`❌ Products endpoint failed: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testGetOrders() {
  if (!adminToken) {
    log('⚠️  Skipping orders test - not authenticated', 'yellow');
    return false;
  }
  
  log('\n=== Testing Get Orders Endpoint ===', 'cyan');
  
  try {
    const response = await axios.get(`${API_URL}/admin/orders?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (response.data.orders) {
      log('✅ Orders retrieved successfully!', 'green');
      log(`   Total Orders: ${response.data.pagination?.total || 0}`, 'green');
      log(`   Orders Found: ${response.data.orders.length}`, 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Orders endpoint failed: ${error.response?.data?.error || error.message}`, 'red');
    return false;
  }
}

async function testHealthCheck() {
  log('\n=== Testing Backend Health ===', 'cyan');
  
  try {
    const response = await axios.get(`http://localhost:4000/health`);
    
    if (response.data.ok) {
      log('✅ Backend server is healthy!', 'green');
      return true;
    }
  } catch (error) {
    log(`❌ Backend health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║  Admin Panel - Real Database Integration   ║', 'blue');
  log('║              Test Suite                    ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');
  
  log(`\n🔗 API URL: ${API_URL}`, 'cyan');
  log(`⏰ Started at: ${new Date().toISOString()}`, 'cyan');
  
  const results = {};
  
  results.health = await testHealthCheck();
  results.login = await testAdminLogin();
  results.stats = await testAdminStats();
  results.sellers = await testGetSellers();
  results.products = await testGetProducts();
  results.orders = await testGetOrders();
  
  // Summary
  log('\n╔════════════════════════════════════════════╗', 'blue');
  log('║              Test Summary                  ║', 'blue');
  log('╚════════════════════════════════════════════╝', 'blue');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  log(`\n✅ Tests Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    log(`   ${status} ${test.charAt(0).toUpperCase() + test.slice(1)}`, result ? 'green' : 'red');
  });
  
  log(`\n📊 Success Rate: ${Math.round((passed / total) * 100)}%`, passed === total ? 'green' : 'yellow');
  log(`⏰ Completed at: ${new Date().toISOString()}\n`, 'cyan');
  
  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
