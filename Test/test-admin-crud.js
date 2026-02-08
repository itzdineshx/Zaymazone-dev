import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/admin';

// Test admin authentication
async function testAdminAuth() {
  console.log('Testing admin authentication...');
  try {
    const response = await axios.post('http://localhost:4000/api/auth/signin', {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });

    console.log('Admin login successful');
    return response.data.accessToken;
  } catch (error) {
    console.error('Admin auth failed:', error.message);
    return null;
  }
}

// Test products CRUD
async function testProductsCRUD(token) {
  console.log('\nTesting Products CRUD...');

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // First, get an existing artisan ID
    const artisansResponse = await axios.get(`${API_BASE_URL}/artisans`, { headers });
    if (!artisansResponse.data.artisans || artisansResponse.data.artisans.length === 0) {
      console.log('No artisans found, creating one first...');
      const artisanResponse = await axios.post(`${API_BASE_URL}/artisans`, {
        name: 'Test Artisan',
        bio: 'A test artisan for CRUD operations',
        location: { city: 'Test City', state: 'Test State' },
        userId: '507f1f77bcf86cd799439011' // dummy user ID for testing
      }, { headers });
      var artisanId = artisanResponse.data.artisan._id;
    } else {
      var artisanId = artisansResponse.data.artisans[0]._id;
    }

    // Create product
    console.log('Creating product...');
    const createResponse = await axios.post(`${API_BASE_URL}/products`, {
      name: 'Test Product',
      description: 'A test product for CRUD operations',
      price: 29.99,
      category: 'pottery',
      images: ['test-image.jpg'],
      stockCount: 10,
      artisanId: artisanId
    }, { headers });

    const productId = createResponse.data.product._id;
    console.log('Product created:', productId);

    // Read product
    console.log('Reading product...');
    const readResponse = await axios.get(`${API_BASE_URL}/products/${productId}`, { headers });
    console.log('Product read:', readResponse.data.name);

    // Update product
    console.log('Updating product...');
    await axios.put(`${API_BASE_URL}/products/${productId}`, {
      name: 'Updated Test Product',
      price: 39.99
    }, { headers });
    console.log('Product updated');

    // Delete product
    console.log('Deleting product...');
    await axios.delete(`${API_BASE_URL}/products/${productId}`, { headers });
    console.log('Product deleted');

  } catch (error) {
    console.error('Products CRUD test failed:', error.message);
  }
}

// Test artisans CRUD
async function testArtisansCRUD(token) {
  console.log('\nTesting Artisans CRUD...');

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // Create artisan
    console.log('Creating artisan...');
    const createResponse = await axios.post(`${API_BASE_URL}/artisans`, {
      name: 'Test Artisan',
      bio: 'A test artisan for CRUD operations',
      location: { city: 'Test City', state: 'Test State' },
      userId: '68ee044442bba60f24f45ec9' // real user ID from database
    }, { headers });

    const artisanId = createResponse.data.artisan._id;
    console.log('Artisan created:', artisanId);

    // Read artisan
    console.log('Reading artisan...');
    const readResponse = await axios.get(`${API_BASE_URL}/artisans/${artisanId}`, { headers });
    console.log('Artisan read:', readResponse.data.name);

    // Update artisan
    console.log('Updating artisan...');
    await axios.put(`${API_BASE_URL}/artisans/${artisanId}`, {
      name: 'Updated Test Artisan',
      specialty: 'advanced testing'
    }, { headers });
    console.log('Artisan updated');

    // Delete artisan
    console.log('Deleting artisan...');
    await axios.delete(`${API_BASE_URL}/artisans/${artisanId}`, { headers });
    console.log('Artisan deleted');

  } catch (error) {
    console.error('Artisans CRUD test failed:', error.message);
  }
}

// Main test function
async function runTests() {
  console.log('Starting Admin CRUD Tests...\n');

  // Check if server is running
  try {
    await axios.get('http://localhost:4000/health');
    console.log('Server is running ✓');
  } catch (error) {
    console.error('Server is not running. Please start the server first.');
    return;
  }

  // Test admin authentication
  const token = await testAdminAuth();
  if (!token) {
    console.log('Skipping CRUD tests due to auth failure');
    return;
  }

  // Test CRUD operations
  await testProductsCRUD(token);
  await testArtisansCRUD(token);

  console.log('\nAdmin CRUD Tests completed!');
}

// Run the tests
runTests().catch(console.error);
