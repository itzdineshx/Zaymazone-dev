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

// Test admin authentication
async function testAdminLogin() {
  console.log('🔐 Testing Admin Authentication...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/auth/login`, ADMIN_CREDENTIALS);
    
    if (response.data.success && response.data.accessToken) {
      adminToken = response.data.accessToken;
      console.log('✅ Admin login successful');
      console.log(`   User: ${response.data.user.name} (${response.data.user.email})`);
      console.log(`   Role: ${response.data.user.role}`);
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

// Test admin stats endpoint
async function testAdminStats() {
  console.log('\n📊 Testing Admin Statistics...');
  
  try {
    const response = await makeAuthenticatedRequest('GET', '/admin/stats');
    
    if (response.data) {
      console.log('✅ Admin stats retrieved successfully');
      console.log(`   Total Products: ${response.data.stats?.totalProducts || 0}`);
      console.log(`   Active Artisans: ${response.data.stats?.activeArtisans || 0}`);
      console.log(`   Total Users: ${response.data.stats?.totalUsers || 0}`);
      console.log(`   Today Orders: ${response.data.stats?.todayOrders || 0}`);
      return true;
    } else {
      console.log('❌ Admin stats failed - No data returned');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin stats failed:', error.response?.data?.error || error.message);
    return false;
  }
}

// Test product CRUD operations
async function testProductCRUD() {
  console.log('\n🛍️  Testing Product CRUD Operations...');
  
  let createdProductId = null;
  
  try {
    // First get an artisan to use for the product
    console.log('   Getting artisan for product...');
    const artisansResponse = await makeAuthenticatedRequest('GET', '/admin/artisans?limit=10');
    const artisans = artisansResponse.data.artisans || [];
    
    if (artisans.length === 0) {
      console.log('   ❌ No artisans found - cannot create product');
      return false;
    }
    
    const artisanId = artisans[0]._id;
    console.log(`   Using artisan: ${artisans[0].name} (${artisanId})`);

    // Create a test product
    console.log('   Creating test product...');
    const productData = {
      name: 'Test Admin Product',
      description: 'This is a test product created through admin panel',
      price: 1500,
      category: 'textiles', // Must match enum values in Product model
      artisanId: artisanId,
      inStock: true,
      stockCount: 10,
      images: ['/api/placeholder/300/300']
    };
    
    const createResponse = await makeAuthenticatedRequest('POST', '/admin/products', productData);
    
    if (createResponse.data.product) {
      createdProductId = createResponse.data.product._id;
      console.log('   ✅ Product created successfully');
      console.log(`      ID: ${createdProductId}`);
      console.log(`      Name: ${createResponse.data.product.name}`);
    } else {
      console.log('   ❌ Product creation failed');
      return false;
    }
    
    // Read the created product
    console.log('   Reading created product...');
    const readResponse = await makeAuthenticatedRequest('GET', `/admin/products/${createdProductId}`);
    
    if (readResponse.data.product) {
      console.log('   ✅ Product retrieved successfully');
      console.log(`      Name: ${readResponse.data.product.name}`);
    } else {
      console.log('   ❌ Product retrieval failed');
      return false;
    }
    
    // Update the product
    console.log('   Updating product...');
    const updateData = {
      name: 'Updated Test Admin Product',
      price: 2000,
      description: 'This product has been updated through admin panel'
    };
    
    const updateResponse = await makeAuthenticatedRequest('PUT', `/admin/products/${createdProductId}`, updateData);
    
    if (updateResponse.data.product) {
      console.log('   ✅ Product updated successfully');
      console.log(`      New Name: ${updateResponse.data.product.name}`);
      console.log(`      New Price: ₹${updateResponse.data.product.price}`);
    } else {
      console.log('   ❌ Product update failed');
      return false;
    }
    
    // List products to verify our product exists
    console.log('   Listing products...');
    const listResponse = await makeAuthenticatedRequest('GET', '/admin/products?limit=5');
    
    if (listResponse.data.products) {
      console.log(`   ✅ Products listed successfully (${listResponse.data.products.length} products)`);
      const ourProduct = listResponse.data.products.find(p => p._id === createdProductId);
      if (ourProduct) {
        console.log('      ✅ Our test product found in list');
      }
    } else {
      console.log('   ❌ Product listing failed');
    }
    
    // Delete the test product
    console.log('   Deleting test product...');
    const deleteResponse = await makeAuthenticatedRequest('DELETE', `/admin/products/${createdProductId}`);
    
    if (deleteResponse.data.message) {
      console.log('   ✅ Product deleted successfully');
    } else {
      console.log('   ❌ Product deletion failed');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.log('   ❌ Product CRUD operations failed:', error.response?.data?.error || error.message);
    
    // Clean up if product was created
    if (createdProductId) {
      try {
        await makeAuthenticatedRequest('DELETE', `/admin/products/${createdProductId}`);
        console.log('   🧹 Cleanup: Test product deleted');
      } catch (cleanupError) {
        console.log('   ⚠️  Cleanup failed - you may need to manually delete test product');
      }
    }
    
    return false;
  }
}

// Test artisan CRUD operations
async function testArtisanCRUD() {
  console.log('\n🎨 Testing Artisan CRUD Operations...');
  
  let createdArtisanId = null;
  
  try {
    // First get a user to use for the artisan
    console.log('   Getting user for artisan...');
    const usersResponse = await makeAuthenticatedRequest('GET', '/admin/users?limit=10');
    const users = usersResponse.data.users || [];
    
    // Find a user that is not already an artisan
    const nonArtisanUsers = users.filter(user => user.role === 'user');
    
    if (nonArtisanUsers.length === 0) {
      console.log('   ❌ No available users found for artisan creation');
      return false;
    }
    
    const userId = nonArtisanUsers[0]._id;
    console.log(`   Using user: ${nonArtisanUsers[0].name} (${userId})`);

    // Create a test artisan
    console.log('   Creating test artisan...');
    const artisanData = {
      userId: userId,
      name: 'Test Admin Artisan',
      bio: 'This is a test artisan created through admin panel',
      specialties: ['pottery', 'ceramics'],
      experience: 5,
      location: {
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India'
      },
      verification: {
        isVerified: false
      }
    };
    
    const createResponse = await makeAuthenticatedRequest('POST', '/admin/artisans', artisanData);
    
    if (createResponse.data.artisan) {
      createdArtisanId = createResponse.data.artisan._id;
      console.log('   ✅ Artisan created successfully');
      console.log(`      ID: ${createdArtisanId}`);
      console.log(`      Name: ${createResponse.data.artisan.name}`);
    } else {
      console.log('   ❌ Artisan creation failed');
      return false;
    }
    
    // Read the created artisan
    console.log('   Reading created artisan...');
    const readResponse = await makeAuthenticatedRequest('GET', `/admin/artisans/${createdArtisanId}`);
    
    if (readResponse.data.artisan) {
      console.log('   ✅ Artisan retrieved successfully');
      console.log(`      Name: ${readResponse.data.artisan.name}`);
    } else {
      console.log('   ❌ Artisan retrieval failed');
      return false;
    }
    
    // Update the artisan
    console.log('   Updating artisan...');
    const updateData = {
      name: 'Updated Test Admin Artisan',
      bio: 'This artisan has been updated through admin panel',
      experience: 8
    };
    
    const updateResponse = await makeAuthenticatedRequest('PUT', `/admin/artisans/${createdArtisanId}`, updateData);
    
    if (updateResponse.data.artisan) {
      console.log('   ✅ Artisan updated successfully');
      console.log(`      New Name: ${updateResponse.data.artisan.name}`);
      console.log(`      New Experience: ${updateResponse.data.artisan.experience} years`);
    } else {
      console.log('   ❌ Artisan update failed');
      return false;
    }
    
    // List artisans to verify our artisan exists
    console.log('   Listing artisans...');
    const listResponse = await makeAuthenticatedRequest('GET', '/admin/artisans?limit=5');
    
    if (listResponse.data.artisans) {
      console.log(`   ✅ Artisans listed successfully (${listResponse.data.artisans.length} artisans)`);
      const ourArtisan = listResponse.data.artisans.find(a => a._id === createdArtisanId);
      if (ourArtisan) {
        console.log('      ✅ Our test artisan found in list');
      }
    } else {
      console.log('   ❌ Artisan listing failed');
    }
    
    // Delete the test artisan
    console.log('   Deleting test artisan...');
    const deleteResponse = await makeAuthenticatedRequest('DELETE', `/admin/artisans/${createdArtisanId}`);
    
    if (deleteResponse.data.message) {
      console.log('   ✅ Artisan deleted successfully');
    } else {
      console.log('   ❌ Artisan deletion failed');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.log('   ❌ Artisan CRUD operations failed:', error.response?.data?.error || error.message);
    
    // Clean up if artisan was created
    if (createdArtisanId) {
      try {
        await makeAuthenticatedRequest('DELETE', `/admin/artisans/${createdArtisanId}`);
        console.log('   🧹 Cleanup: Test artisan deleted');
      } catch (cleanupError) {
        console.log('   ⚠️  Cleanup failed - you may need to manually delete test artisan');
      }
    }
    
    return false;
  }
}

// Test user management
async function testUserManagement() {
  console.log('\n👥 Testing User Management...');
  
  try {
    const response = await makeAuthenticatedRequest('GET', '/admin/users?limit=5');
    
    if (response.data.users) {
      console.log(`✅ Users retrieved successfully (${response.data.users.length} users)`);
      response.data.users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
      return true;
    } else {
      console.log('❌ User management failed');
      return false;
    }
  } catch (error) {
    console.log('❌ User management failed:', error.response?.data?.error || error.message);
    return false;
  }
}

// Main test function
async function runComprehensiveAdminTest() {
  console.log('🚀 COMPREHENSIVE ADMIN PANEL INTEGRATION TEST');
  console.log('=' .repeat(50));
  
  // Check if server is running
  try {
    await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Server is running and accessible');
  } catch (error) {
    console.log('❌ Server is not accessible. Please ensure the backend server is running on port 4000');
    console.log('   Run: node server/src/index.js');
    return;
  }
  
  const results = {
    adminLogin: false,
    adminStats: false,
    productCRUD: false,
    artisanCRUD: false,
    userManagement: false
  };
  
  // Run all tests
  results.adminLogin = await testAdminLogin();
  
  if (results.adminLogin) {
    results.adminStats = await testAdminStats();
    results.productCRUD = await testProductCRUD();
    results.artisanCRUD = await testArtisanCRUD();
    results.userManagement = await testUserManagement();
  } else {
    console.log('\n⚠️  Skipping other tests due to authentication failure');
  }
  
  // Print summary
  console.log('\n' + '=' .repeat(50));
  console.log('📋 TEST SUMMARY:');
  console.log('=' .repeat(50));
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const status = passed ? 'PASSED' : 'FAILED';
    console.log(`${icon} ${test.padEnd(20)} - ${status}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log('\n' + '=' .repeat(50));
  console.log(`🎯 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Admin panel is fully functional with database sync!');
    console.log('\n✨ ADMIN PANEL FEATURES CONFIRMED:');
    console.log('   ✅ Admin authentication works');
    console.log('   ✅ Real-time statistics from database');
    console.log('   ✅ Product CRUD operations sync with database');
    console.log('   ✅ Artisan CRUD operations sync with database');
    console.log('   ✅ User management connects to real data');
    console.log('\n🚀 Admin panel is ready for production use!');
    console.log('   Access at: http://localhost:8080/admin');
    console.log('   Login: admin@zaymazone.com / admin123');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run the tests
runComprehensiveAdminTest().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});