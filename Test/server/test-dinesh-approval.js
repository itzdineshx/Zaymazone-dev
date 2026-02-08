import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:4000/api';

async function testDineshApproval() {
  try {
    console.log('Testing DINESH S artisan approval...');

    // First login as admin
    console.log('Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@zaymazone.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Admin login failed:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    console.log('Admin logged in successfully');

    // Fetch pending artisans
    console.log('Fetching pending artisans...');
    const artisansResponse = await fetch(`${API_BASE_URL}/admin/artisans?status=pending`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!artisansResponse.ok) {
      console.log('Failed to fetch artisans:', artisansResponse.status);
      return;
    }

    const artisansData = await artisansResponse.json();
    console.log(`Found ${artisansData.artisans?.length || 0} pending artisans`);

    // Check if DINESH S is in the list
    const dinesh = artisansData.artisans?.find(a => a.name === 'DINESH S');
    if (dinesh) {
      console.log('✅ DINESH S found in pending artisans!');
      console.log('Name:', dinesh.name);
      console.log('Business:', dinesh.businessInfo?.businessName);
      console.log('Location:', dinesh.location);
      console.log('Specialties:', dinesh.specialties);
      console.log('Approval Status:', dinesh.approvalStatus);
      console.log('ID:', dinesh._id);

      // Try to approve DINESH S
      console.log('Approving DINESH S...');
      const approveResponse = await fetch(`${API_BASE_URL}/admin/approvals/artisans/${dinesh._id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approvalNotes: 'Approved via automated test' })
      });

      if (approveResponse.ok) {
        console.log('✅ DINESH S approved successfully!');
      } else {
        console.log('❌ Failed to approve DINESH S:', approveResponse.status);
      }
    } else {
      console.log('❌ DINESH S not found in pending artisans');
      console.log('Available artisans:', artisansData.artisans?.map(a => a.name) || []);
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDineshApproval();