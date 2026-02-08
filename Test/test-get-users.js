import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:4000/api';

async function getUsers() {
  const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@zaymazone.com',
      password: 'admin123'
    })
  });

  const loginData = await loginResponse.json();
  if (!loginData.accessToken) {
    console.log('Admin login failed');
    return;
  }

  const token = loginData.accessToken;

  // Try to get users
  const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  console.log('Users response status:', usersResponse.status);
  const usersData = await usersResponse.json();
  console.log('Users data:', JSON.stringify(usersData, null, 2));
}

getUsers().catch(console.error);