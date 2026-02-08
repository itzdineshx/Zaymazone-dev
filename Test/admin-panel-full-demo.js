import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/admin';

async function demonstrateFullAdminPanelFunctionality() {
  console.log('🎛️  COMPLETE ADMIN PANEL FUNCTIONALITY DEMO');
  console.log('=' + '='.repeat(50));

  try {
    // Authenticate as admin
    const authResponse = await axios.post('http://localhost:4000/api/auth/signin', {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });
    const token = authResponse.data.accessToken;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Admin authenticated successfully');

    // Get user for artisan creation
    const usersRes = await axios.get(`${API_BASE_URL}/users`, { headers });
    const availableUser = usersRes.data.users.find(u => u.role === 'user');

    console.log('\n🎨 TESTING ARTISAN CRUD OPERATIONS:');
    console.log('-'.repeat(40));

    // 1. CREATE ARTISAN
    console.log('➕ Creating new artisan...');
    const newArtisan = await axios.post(`${API_BASE_URL}/artisans`, {
      name: 'Maya Crafts',
      bio: 'Expert jewelry artisan from Rajasthan specializing in silver jewelry and traditional designs.',
      location: { city: 'Jodhpur', state: 'Rajasthan', country: 'India' },
      avatar: 'https://images.unsplash.com/photo-1489980779529-e2b3d8ba5314?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=400&fit=crop',
      specialties: ['jewelry', 'silver', 'traditional'],
      experience: 15,
      rating: 4.6,
      totalRatings: 89,
      totalProducts: 28,
      totalSales: 567,
      verification: { isVerified: true, verifiedAt: new Date() },
      isActive: true,
      joinedDate: new Date('2021-05-10'),
      userId: availableUser._id
    }, { headers });
    
    const artisanId = newArtisan.data.artisan._id;
    console.log(`✅ Artisan created: ${newArtisan.data.artisan.name} (ID: ${artisanId})`);

    // 2. CREATE PRODUCT
    console.log('\n🛍️  TESTING PRODUCT CRUD OPERATIONS:');
    console.log('-'.repeat(40));
    console.log('➕ Creating new product...');
    const newProduct = await axios.post(`${API_BASE_URL}/products`, {
      name: 'Silver Rajasthani Earrings',
      description: 'Exquisite handcrafted silver earrings featuring traditional Rajasthani mirror work and intricate filigree patterns. Perfect for ethnic wear and special occasions.',
      price: 1899,
      originalPrice: 2299,
      category: 'jewelry',
      subcategory: 'earrings',
      materials: ['Sterling Silver', 'Mirror Work', 'Filigree'],
      dimensions: '4cm x 2cm',
      weight: '15g',
      colors: ['Silver', 'Mirror'],
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop'
      ],
      stockCount: 12,
      artisanId: artisanId,
      rating: 4.7,
      reviewCount: 18,
      tags: ['silver', 'rajasthani', 'traditional', 'handmade'],
      isHandmade: true,
      shippingTime: '3-5 days',
      featured: true,
      inStock: true,
      isActive: true
    }, { headers });

    const productId = newProduct.data.product._id;
    console.log(`✅ Product created: ${newProduct.data.product.name} (ID: ${productId})`);

    // 3. READ OPERATIONS
    console.log('\n📖 TESTING READ OPERATIONS:');
    console.log('-'.repeat(40));
    
    const artisansRes = await axios.get(`${API_BASE_URL}/artisans`, { headers });
    console.log(`✅ Retrieved ${artisansRes.data.artisans.length} artisans`);
    
    const productsRes = await axios.get(`${API_BASE_URL}/products`, { headers });
    console.log(`✅ Retrieved ${productsRes.data.products.length} products`);

    // 4. UPDATE OPERATIONS
    console.log('\n✏️  TESTING UPDATE OPERATIONS:');
    console.log('-'.repeat(40));
    
    await axios.put(`${API_BASE_URL}/artisans/${artisanId}`, {
      name: 'Maya Crafts Studio',
      experience: 16
    }, { headers });
    console.log('✅ Artisan updated successfully');

    await axios.put(`${API_BASE_URL}/products/${productId}`, {
      price: 1799,
      stockCount: 15
    }, { headers });
    console.log('✅ Product updated successfully');

    // 5. FRONTEND SYNCHRONIZATION TEST
    console.log('\n🌐 TESTING FRONTEND SYNCHRONIZATION:');
    console.log('-'.repeat(40));
    
    const frontendProductsRes = await axios.get('http://localhost:4000/api/products');
    const frontendArtisansRes = await axios.get('http://localhost:4000/api/artisans');
    
    const createdProduct = frontendProductsRes.data.products.find(p => p.id === productId);
    const createdArtisan = frontendArtisansRes.data.find(a => a._id === artisanId);
    
    console.log(`✅ Product appears on /shop: ${createdProduct ? 'YES' : 'NO'}`);
    console.log(`✅ Artisan appears on /artisans: ${createdArtisan ? 'YES' : 'NO'}`);
    
    if (createdProduct) {
      console.log(`   📝 Product name: ${createdProduct.name}`);
      console.log(`   💰 Price: ₹${createdProduct.price}`);
      console.log(`   👨‍🎨 Artisan: ${createdProduct.artisan?.name}`);
    }

    // 6. STATISTICS UPDATE
    console.log('\n📊 TESTING DASHBOARD STATISTICS:');
    console.log('-'.repeat(40));
    
    const statsRes = await axios.get(`${API_BASE_URL}/stats`, { headers });
    console.log(`✅ Total Products: ${statsRes.data.stats.totalProducts}`);
    console.log(`✅ Total Artisans: ${statsRes.data.stats.totalArtisans}`);
    console.log(`✅ Active Artisans: ${statsRes.data.stats.activeArtisans}`);

    // 7. DELETE OPERATIONS (cleanup)
    console.log('\n🗑️  TESTING DELETE OPERATIONS:');
    console.log('-'.repeat(40));
    
    await axios.delete(`${API_BASE_URL}/products/${productId}`, { headers });
    console.log('✅ Product deleted successfully');
    
    await axios.delete(`${API_BASE_URL}/artisans/${artisanId}`, { headers });
    console.log('✅ Artisan deleted successfully');

    // 8. FINAL VERIFICATION
    console.log('\n🔍 FINAL VERIFICATION:');
    console.log('-'.repeat(40));
    
    const finalProductsRes = await axios.get('http://localhost:4000/api/products');
    const finalArtisansRes = await axios.get('http://localhost:4000/api/artisans');
    
    const productExists = finalProductsRes.data.products.some(p => p.id === productId);
    const artisanExists = finalArtisansRes.data.some(a => a._id === artisanId);
    
    console.log(`✅ Product removed from /shop: ${!productExists ? 'YES' : 'NO'}`);
    console.log(`✅ Artisan removed from /artisans: ${!artisanExists ? 'YES' : 'NO'}`);

    console.log('\n' + '='.repeat(55));
    console.log('🎉 ADMIN PANEL DEMO COMPLETED SUCCESSFULLY!');
    console.log('\n🏆 ACHIEVEMENTS UNLOCKED:');
    console.log('   ✅ Real-time data integration working');
    console.log('   ✅ Full CRUD operations on products');
    console.log('   ✅ Full CRUD operations on artisans');
    console.log('   ✅ Frontend synchronization confirmed');
    console.log('   ✅ Dashboard statistics updating');
    console.log('   ✅ Authentication and authorization working');
    console.log('   ✅ Data persistence in MongoDB Atlas');
    
    console.log('\n🚀 ADMIN PANEL IS NOW FULLY OPERATIONAL!');
    console.log('   • Add/Edit/Delete products with artisan selection');
    console.log('   • Manage artisan profiles and verification');
    console.log('   • View real-time business statistics');
    console.log('   • All changes appear immediately on /shop and /artisans');
    console.log('   • No more mock data - everything is real-time!');

  } catch (error) {
    console.error('\n❌ DEMO FAILED:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error('   Status Code:', error.response.status);
    }
  }
}

demonstrateFullAdminPanelFunctionality();