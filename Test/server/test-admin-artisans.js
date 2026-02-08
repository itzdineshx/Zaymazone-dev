import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:4000/api';

async function testAdminArtisans() {
  try {
    // First login as admin to get token
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@zaymazone.com', password: 'admin123' })
    });

    if (!loginResponse.ok) {
      console.log('Admin login failed, trying to create admin user first...');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('Admin logged in successfully');

    // Now fetch artisans with pending status
    const artisansResponse = await fetch(`${API_BASE_URL}/admin/artisans?status=pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!artisansResponse.ok) {
      console.log('Failed to fetch artisans:', artisansResponse.status);
      return;
    }

    const artisansData = await artisansResponse.json();
    console.log('Pending artisans:');
    console.log(JSON.stringify(artisansData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAdminArtisans();