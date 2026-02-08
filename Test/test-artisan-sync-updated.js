import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:4000/api';

async function testArtisanSync() {
  console.log('Testing artisan creation and synchronization...\n');

  // First login as admin
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
  console.log('✅ Admin login successful');

  // Create an artisan
  const artisanData = {
    name: 'Test Artisan',
    bio: 'A test artisan for synchronization testing',
    location: { city: 'Test City', state: 'Test State', country: 'India' },
    avatar: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/400x200',
    specialties: ['Pottery', 'Handicrafts'],
    experience: 5,
    userId: '68f2a6301dffceacd3e3bbf5', // John Doe user ID
    phone: '+91-9876543210',
    email: 'test@artisan.com',
    website: 'https://testartisan.com',
    socialMedia: { instagram: '@testartisan', facebook: 'testartisan' },
    businessDetails: { businessName: 'Test Crafts', gstNumber: '22AAAAA0000A1Z5' },
    verification: { isVerified: true },
    isActive: true
  };

  const createResponse = await fetch(`${API_BASE_URL}/admin/artisans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(artisanData)
  });

  const createData = await createResponse.json();
  console.log('Create artisan response:', createResponse.status);
  console.log('Create data:', JSON.stringify(createData, null, 2));

  if (createResponse.ok) {
    console.log('✅ Artisan created successfully');

    const artisanId = createData.artisan._id;

    // Approve the artisan
    const approveResponse = await fetch(`${API_BASE_URL}/admin-approvals/approve-artisan/${artisanId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ approvalNotes: 'Approved for testing' })
    });

    const approveData = await approveResponse.json();
    console.log('Approve artisan response:', approveResponse.status);
    console.log('Approve data:', JSON.stringify(approveData, null, 2));

    if (approveResponse.ok) {
      console.log('✅ Artisan approved successfully');
    } else {
      console.log('❌ Artisan approval failed');
    }

    // Check if it appears in admin artisans
    const adminArtisansResponse = await fetch(`${API_BASE_URL}/admin/artisans`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const adminArtisans = await adminArtisansResponse.json();
    console.log('Admin artisans count:', adminArtisans.artisans?.length || 0);

    // Check if it appears in public artisans
    const publicArtisansResponse = await fetch(`${API_BASE_URL}/products/artisans`);
    const publicArtisans = await publicArtisansResponse.json();
    console.log('Public artisans count:', publicArtisans.artisans?.length || 0);

    if (publicArtisans.artisans?.length > 0) {
      console.log('✅ Synchronization working!');
    } else {
      console.log('❌ Synchronization NOT working - artisan not visible in public API');
    }
  } else {
    console.log('❌ Artisan creation failed');
  }
}

testArtisanSync().catch(console.error);