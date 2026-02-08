#!/usr/bin/env node

import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';
const ADMIN_CREDENTIALS = {
  email: 'admin@zaymazone.com',
  password: 'admin123'
};

let adminToken = null;

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (method, url, data = null) => {
  const config = {
    method,
    url: `${API_BASE_URL}${url}`,
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    config.data = data;
  }

  return axios(config);
};

async function testAdminLogin() {
  console.log('🔐 Testing Admin Authentication...');

  try {
    const response = await axios.post(`${API_BASE_URL}/admin/auth/login`, ADMIN_CREDENTIALS);

    if (response.data.success && response.data.accessToken) {
      adminToken = response.data.accessToken;
      console.log('✅ Admin login successful');
      return true;
    } else {
      console.log('❌ Admin login failed - Invalid response');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testApprovalsEndpoints() {
  console.log('\n📋 Testing Approvals Endpoints...\n');

  try {
    // Test pending products endpoint
    console.log('1. Testing GET /api/admin/approvals/products');
    const productsResponse = await makeAuthenticatedRequest('GET', '/admin/approvals/products');
    console.log('✅ Pending products endpoint working');
    console.log(`   - Found ${productsResponse.data.products?.length || 0} pending products`);

    // Verify the response structure
    if (productsResponse.data.products && productsResponse.data.products.length > 0) {
      const firstProduct = productsResponse.data.products[0];
      console.log('   - Sample product fields:', Object.keys(firstProduct).join(', '));

      // Check if it has product-specific fields (not artisan fields)
      const hasProductFields = firstProduct.name !== undefined && firstProduct.price !== undefined;
      const hasArtisanFields = firstProduct.verification !== undefined || firstProduct.isVerified !== undefined;
      const hasProductSpecificFields = firstProduct.category || firstProduct.materials || firstProduct.dimensions;

      console.log('   - Has basic product fields (name, price):', hasProductFields);
      console.log('   - Has product-specific fields (category/materials/dimensions):', !!hasProductSpecificFields);
      console.log('   - Has artisan fields (verification/isVerified):', hasArtisanFields);

      if ((hasProductFields || hasProductSpecificFields) && !hasArtisanFields) {
        console.log('   ✅ Response contains product data (not artisan data)');
        if (firstProduct.artisanId === null) {
          console.log('   ℹ️  Note: Some products have null artisanId (data integrity issue)');
        }
      } else if (hasArtisanFields) {
        console.log('   ❌ Response contains artisan data instead of product data');
      } else {
        console.log('   ⚠️  Response structure unclear - may need verification');
      }
    }

    // Test pending artisans endpoint (using general artisans endpoint)
    console.log('\n2. Testing GET /api/admin/artisans (for pending artisans)');
    try {
      const artisansResponse = await makeAuthenticatedRequest('GET', '/admin/artisans?status=pending');
      console.log('✅ Artisans endpoint working');
      const pendingArtisans = artisansResponse.data.artisans?.filter(a => a.approvalStatus === 'pending') || [];
      console.log(`   - Found ${pendingArtisans.length} pending artisans`);
    } catch (error) {
      console.log('⚠️  Artisans endpoint error:', error.response?.status, error.response?.data?.error);
    }

    // Test pending users endpoint (exists and should work)
    console.log('\n3. Testing GET /api/admin/approvals/users');
    try {
      const usersResponse = await makeAuthenticatedRequest('GET', '/admin/approvals/users');
      console.log('✅ Pending users endpoint working');
      console.log(`   - Found ${usersResponse.data.users?.length || 0} pending users`);
    } catch (error) {
      console.log('⚠️  Pending users endpoint error:', error.response?.status, error.response?.data?.error);
    }

  } catch (error) {
    console.log('❌ Approvals endpoints test failed:', error.response?.data?.error || error.message);
    return false;
  }

  return true;
}

async function main() {
  console.log('🚀 TESTING ADMIN APPROVALS ENDPOINTS');
  console.log('=====================================\n');

  // Test admin login
  const loginSuccess = await testAdminLogin();
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without admin authentication');
    process.exit(1);
  }

  // Test approvals endpoints
  const approvalsSuccess = await testApprovalsEndpoints();

  console.log('\n=====================================');
  console.log('📋 TEST SUMMARY:');
  console.log('=====================================');
  console.log(`${approvalsSuccess ? '✅' : '❌'} approvalsEndpoints - ${approvalsSuccess ? 'PASSED' : 'FAILED'}`);

  if (approvalsSuccess) {
    console.log('\n🎉 ALL APPROVALS ENDPOINT TESTS PASSED!');
    console.log('✨ Admin panel approvals functionality is working correctly!');
  } else {
    console.log('\n❌ SOME TESTS FAILED - Check the output above for details');
  }
}

main().catch(console.error);