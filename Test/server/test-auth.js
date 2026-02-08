import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication System...\n');

  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing user registration...');
    const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const signupData = await signupResponse.json();
    console.log('Signup Response:', signupData);

    if (signupResponse.ok) {
      console.log('✅ User registration successful\n');
      
      // Test 2: User Login
      console.log('2️⃣ Testing user login...');
      const signinResponse = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const signinData = await signinResponse.json();
      console.log('Signin Response:', signinData);

      if (signinResponse.ok) {
        console.log('✅ User login successful\n');
        
        const { accessToken, refreshToken } = signinData;

        // Test 3: Get Current User
        console.log('3️⃣ Testing get current user...');
        const meResponse = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const meData = await meResponse.json();
        console.log('Me Response:', meData);

        if (meResponse.ok) {
          console.log('✅ Get current user successful\n');
        } else {
          console.log('❌ Get current user failed\n');
        }

        // Test 4: Get User Profile
        console.log('4️⃣ Testing get user profile...');
        const profileResponse = await fetch(`${BASE_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const profileData = await profileResponse.json();
        console.log('Profile Response:', profileData);

        if (profileResponse.ok) {
          console.log('✅ Get user profile successful\n');
        } else {
          console.log('❌ Get user profile failed\n');
        }

        // Test 5: Refresh Token
        console.log('5️⃣ Testing token refresh...');
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken
          })
        });

        const refreshData = await refreshResponse.json();
        console.log('Refresh Response:', refreshData);

        if (refreshResponse.ok) {
          console.log('✅ Token refresh successful\n');
        } else {
          console.log('❌ Token refresh failed\n');
        }

      } else {
        console.log('❌ User login failed\n');
      }
    } else {
      console.log('❌ User registration failed\n');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();