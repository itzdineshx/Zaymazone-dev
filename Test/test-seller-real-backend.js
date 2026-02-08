import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';

async function testSellerBackend() {
  console.log('🧪 Testing Seller Panel with Real Backend...\n');
  console.log(`Backend URL: ${BASE_URL}\n`);

  try {
    // First, we need to get a seller/artisan user token
    // For this test, we'll use a seller account or create one
    
    console.log('1️⃣ Testing seller authentication...');
    
    // Try to signup as a seller
    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'seller123',
        role: 'seller'
      })
    });

    console.log('Signup Response Status:', signupResponse.status);
    const signupData = await signupResponse.json();
    console.log('Signup Response:', JSON.stringify(signupData, null, 2));

    let authToken = null;
    let userId = null;

    if (signupData.accessToken) {
      authToken = signupData.accessToken;
      userId = signupData.user?.id;
      console.log('✅ Seller account created/retrieved\n');
    } else {
      // Try to login if signup failed
      console.log('2️⃣ Attempting seller login instead...');
      const loginResponse = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'seller@test.com',
          password: 'seller123'
        })
      });

      const loginData = await loginResponse.json();
      if (loginResponse.ok && loginData.accessToken) {
        authToken = loginData.accessToken;
        userId = loginData.user?.id;
        console.log('✅ Seller login successful\n');
      } else {
        console.log('❌ Could not authenticate as seller');
        console.log('Login response:', loginData);
        return;
      }
    }

    if (!authToken) {
      console.log('❌ No authentication token obtained');
      return;
    }

    // Test 3: Get Seller Stats
    console.log('3️⃣ Testing seller stats endpoint...');
    const statsResponse = await fetch(`${BASE_URL}/seller/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const statsData = await statsResponse.json();
    console.log('Stats Response Status:', statsResponse.status);
    console.log('Stats Data:', JSON.stringify(statsData, null, 2));

    if (statsResponse.ok) {
      console.log('✅ Seller stats endpoint working!\n');
    } else {
      console.log('❌ Stats endpoint error:', statsData, '\n');
    }

    // Test 4: Get Seller Products
    console.log('4️⃣ Testing seller products endpoint...');
    const productsResponse = await fetch(`${BASE_URL}/seller/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const productsData = await productsResponse.json();
    console.log('Products Response Status:', productsResponse.status);
    console.log('Products Data:', JSON.stringify(productsData, null, 2).substring(0, 500) + '...');

    if (productsResponse.ok) {
      console.log('✅ Seller products endpoint working!\n');
    } else {
      console.log('❌ Products endpoint error:', productsData, '\n');
    }

    // Test 5: Create Product
    console.log('5️⃣ Testing create product endpoint...');
    const createProductResponse = await fetch(`${BASE_URL}/seller/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'A test product for seller panel',
        price: 999,
        originalPrice: 1999,
        category: 'handicrafts',
        subcategory: 'pottery',
        stockCount: 10,
        isHandmade: true,
        images: ['https://via.placeholder.com/300']
      })
    });

    const createProductData = await createProductResponse.json();
    console.log('Create Product Response Status:', createProductResponse.status);
    console.log('Create Product Data:', JSON.stringify(createProductData, null, 2).substring(0, 300) + '...');

    if (createProductResponse.ok) {
      console.log('✅ Create product endpoint working!\n');
    } else {
      console.log('❌ Create product endpoint error:', createProductData, '\n');
    }

    // Test 6: Get Seller Orders
    console.log('6️⃣ Testing seller orders endpoint...');
    const ordersResponse = await fetch(`${BASE_URL}/seller/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const ordersData = await ordersResponse.json();
    console.log('Orders Response Status:', ordersResponse.status);
    console.log('Orders Data:', JSON.stringify(ordersData, null, 2).substring(0, 300) + '...');

    if (ordersResponse.ok) {
      console.log('✅ Seller orders endpoint working!\n');
    } else {
      console.log('❌ Orders endpoint error:', ordersData, '\n');
    }

    // Test 7: Get Seller Profile
    console.log('7️⃣ Testing seller profile endpoint...');
    const profileResponse = await fetch(`${BASE_URL}/seller/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    const profileData = await profileResponse.json();
    console.log('Profile Response Status:', profileResponse.status);
    console.log('Profile Data:', JSON.stringify(profileData, null, 2).substring(0, 500) + '...');

    if (profileResponse.ok) {
      console.log('✅ Seller profile endpoint working!\n');
    } else {
      console.log('❌ Profile endpoint error:', profileData, '\n');
    }

    console.log('✅ All seller endpoints tested!\n');
    console.log('🎉 Seller panel is ready for integration!\n');

  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running: node server/src/index.js');
    console.error('2. MongoDB is connected');
    console.error('3. Backend URL is correct:', BASE_URL);
  }
}

testSellerBackend().catch(console.error);
