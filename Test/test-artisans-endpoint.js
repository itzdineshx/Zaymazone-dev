import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

async function testArtisansEndpoint() {
  try {
    console.log('Testing /admin/artisans endpoint...');

    // First login as admin
    const loginResponse = await axios.post(`${API_BASE_URL}/admin/auth/login`, {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });

    const token = loginResponse.data.accessToken;
    console.log('Admin login successful');

    // Now test artisans endpoint
    const artisansResponse = await axios.get(`${API_BASE_URL}/admin/artisans`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Artisans endpoint response:');
    console.log('Status:', artisansResponse.status);
    console.log('Artisans count:', artisansResponse.data.artisans?.length || 0);
    console.log('Pagination:', artisansResponse.data.pagination);

    if (artisansResponse.data.artisans?.length > 0) {
      console.log('Sample artisan:', artisansResponse.data.artisans[0]);
    }

  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

testArtisansEndpoint();