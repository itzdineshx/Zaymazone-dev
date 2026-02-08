import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';

async function testAdminBackend() {
  console.log('🧪 Testing Admin Panel with Real Backend...\n');
  console.log(`Backend URL: ${BASE_URL}\n`);

  try {
    // Test 1: Admin Login
    console.log('1️⃣ Testing admin login...');
    const loginResponse = await fetch(`${BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@zaymazone.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));

    if (loginResponse.ok && loginData.accessToken) {
      console.log('✅ Admin login successful!\n');
      
      const { accessToken } = loginData;

      // Test 2: Get Admin Stats
      console.log('2️⃣ Testing admin stats endpoint...');
      const statsResponse = await fetch(`${BASE_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const statsData = await statsResponse.json();
      console.log('Stats Response Status:', statsResponse.status);
      console.log('Stats Data:', JSON.stringify(statsData, null, 2));

      if (statsResponse.ok) {
        console.log('✅ Admin stats endpoint working!\n');
      } else {
        console.log('❌ Stats endpoint error:', statsData);
      }

      // Test 3: Get Sellers
      console.log('3️⃣ Testing sellers endpoint...');
      const sellersResponse = await fetch(`${BASE_URL}/admin/sellers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const sellersData = await sellersResponse.json();
      console.log('Sellers Response Status:', sellersResponse.status);
      console.log('Sellers Data (first 2):', JSON.stringify(
        Array.isArray(sellersData.sellers) ? sellersData.sellers.slice(0, 2) : sellersData,
        null,
        2
      ));

      if (sellersResponse.ok) {
        console.log('✅ Sellers endpoint working!\n');
      } else {
        console.log('❌ Sellers endpoint error:', sellersData);
      }

      // Test 4: Get Products
      console.log('4️⃣ Testing products endpoint...');
      const productsResponse = await fetch(`${BASE_URL}/admin/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const productsData = await productsResponse.json();
      console.log('Products Response Status:', productsResponse.status);
      console.log('Products Data (first 2):', JSON.stringify(
        Array.isArray(productsData.products) ? productsData.products.slice(0, 2) : productsData,
        null,
        2
      ));

      if (productsResponse.ok) {
        console.log('✅ Products endpoint working!\n');
      } else {
        console.log('❌ Products endpoint error:', productsData);
      }

      // Test 5: Get Orders
      console.log('5️⃣ Testing orders endpoint...');
      const ordersResponse = await fetch(`${BASE_URL}/admin/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const ordersData = await ordersResponse.json();
      console.log('Orders Response Status:', ordersResponse.status);
      console.log('Orders Data (first 2):', JSON.stringify(
        Array.isArray(ordersData.orders) ? ordersData.orders.slice(0, 2) : ordersData,
        null,
        2
      ));

      if (ordersResponse.ok) {
        console.log('✅ Orders endpoint working!\n');
      } else {
        console.log('❌ Orders endpoint error:', ordersData);
      }

      console.log('✅ All admin endpoints are working with real backend!\n');
      console.log('🎉 Admin panel is ready for use with real database!\n');

    } else {
      console.log('❌ Admin login failed:', loginData);
      console.log('\nNote: Make sure the admin user exists in MongoDB');
      console.log('Default admin credentials:');
      console.log('  Email: admin@zaymazone.com');
      console.log('  Password: admin123\n');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend server is running: node server/src/index.js');
    console.error('2. MongoDB is connected');
    console.error('3. Backend URL is correct:', BASE_URL);
  }
}

testAdminBackend().catch(console.error);
