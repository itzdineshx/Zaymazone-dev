import axios from 'axios';

async function testAndCreateProduct() {
  try {
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:4000/api/admin/auth/login', {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });

    const token = loginResponse.data.accessToken;
    console.log('Admin logged in, token:', token ? 'received' : 'not received');

    if (!token) {
      console.log('No token received, trying with stored token...');
      // Try to get from localStorage simulation or use a default
      return;
    }

    console.log('Testing artisans API...');
    const artisansResponse = await axios.get('http://localhost:4000/api/admin/artisans', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Artisans found:', artisansResponse.data.artisans?.length || 0);
    console.log('Artisan names:', artisansResponse.data.artisans?.map(a => a.name));

    // Find DINESH S artisan
    const dineshArtisan = artisansResponse.data.artisans?.find(a => a.name === 'DINESH S');
    if (dineshArtisan) {
      console.log('Found DINESH S artisan:', dineshArtisan._id);

      // Create a product for this artisan
      const productData = {
        name: 'Handcrafted Wooden Bowl by DINESH S',
        description: 'Beautiful handcrafted wooden bowl made by master artisan DINESH S using traditional woodworking techniques.',
        price: 899,
        category: 'woodwork',
        subcategory: 'bowls',
        materials: ['Wood', 'Natural Finish'],
        stockCount: 5,
        artisanId: dineshArtisan._id,
        images: ['/assets/wooden-bowl.jpg']
      };

      console.log('Creating product...');
      const createResponse = await axios.post('http://localhost:4000/api/admin/products', productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Product created successfully:', createResponse.data);

      // Check if product appears in regular products API
      console.log('Checking regular products API...');
      const productsResponse = await axios.get('http://localhost:4000/api/products');
      console.log('Products found:', productsResponse.data.products?.length || 0);
      if (productsResponse.data.products?.length > 0) {
        console.log('First product:', productsResponse.data.products[0].name);
      }

      // Check artisans API
      console.log('Checking artisans API...');
      const artisansPublicResponse = await axios.get('http://localhost:4000/api/products/artisans');
      console.log('Public artisans found:', artisansPublicResponse.data?.artisans?.length || 0);
      if (artisansPublicResponse.data?.artisans?.length > 0) {
        console.log('Artisan names:', artisansPublicResponse.data.artisans.map(a => a.name));
      } else {
        console.log('No artisans returned. Checking artisan details...');
        // Check detailed artisan info from admin endpoint
        const detailedArtisansResponse = await axios.get('http://localhost:4000/api/admin/artisans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Admin artisans found:', detailedArtisansResponse.data.artisans?.length || 0);
        detailedArtisansResponse.data.artisans?.forEach(artisan => {
          console.log(`Artisan: ${artisan.name}, isActive: ${artisan.isActive}, approvalStatus: ${artisan.approvalStatus}, verified: ${artisan.verification?.isVerified}`);
        });
      }

    } else {
      console.log('DINESH S artisan not found. Available artisans:');
      artisansResponse.data.artisans?.forEach(a => console.log(`- ${a.name} (${a._id})`));
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAndCreateProduct();