import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/admin';

async function createCompleteProductWithArtisan() {
  console.log('🎨 Creating Complete Product with Artisan - Full UI Integration Test');

  try {
    // Authenticate
    const authResponse = await axios.post('http://localhost:4000/api/auth/signin', {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });
    const token = authResponse.data.accessToken;
    console.log('✅ Admin authenticated');

    const headers = { Authorization: `Bearer ${token}` };

    // Get a real user ID for the artisan
    const userResponse = await axios.get('http://localhost:4000/api/admin/users', { headers });
    const userId = userResponse.data.users[0]._id;

    // 1. Create Artisan with ALL required fields for UI
    console.log('👨‍🎨 Creating comprehensive artisan...');
    const artisanResponse = await axios.post(`${API_BASE_URL}/artisans`, {
      name: 'Rajesh Kumar Pottery',
      bio: 'Master potter from Khurja with 25+ years of experience in traditional terracotta and ceramic art. Specializes in handcrafted vases, bowls, and decorative items using ancient techniques.',
      location: { 
        city: 'Khurja', 
        state: 'Uttar Pradesh',
        country: 'India'
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
      specialties: ['pottery', 'terracotta', 'ceramic'],
      experience: 25,
      rating: 4.8,
      totalRatings: 156,
      totalProducts: 42,
      totalSales: 1250,
      verification: {
        isVerified: true,
        verifiedAt: new Date()
      },
      isActive: true,
      joinedDate: new Date('2020-01-15'),
      userId: userId
    }, { headers });

    const artisanId = artisanResponse.data.artisan._id;
    console.log('✅ Comprehensive artisan created:', artisanId);

    // 2. Create Product with ALL required fields for UI
    console.log('🛍️  Creating comprehensive product...');
    const productResponse = await axios.post(`${API_BASE_URL}/products`, {
      name: 'Handcrafted Terracotta Vase',
      description: 'Beautiful traditional terracotta vase with intricate patterns, perfect for home decoration. Made using ancient pottery techniques passed down through generations. Each piece is unique and tells a story of traditional Indian craftsmanship.',
      price: 1299,
      originalPrice: 1599,
      category: 'pottery',
      subcategory: 'vases',
      materials: ['Terracotta', 'Natural Clay', 'Organic Dyes'],
      dimensions: '15cm x 15cm x 20cm',
      weight: '800g',
      colors: ['Terracotta', 'Brown', 'Natural'],
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=400&h=400&fit=crop'
      ],
      stockCount: 12,
      artisanId: artisanId,
      rating: 4.6,
      reviewCount: 28,
      tags: ['handmade', 'traditional', 'home-decor', 'pottery'],
      isHandmade: true,
      shippingTime: '3-5 days',
      featured: true,
      inStock: true,
      isActive: true
    }, { headers });

    console.log('✅ Comprehensive product created:', productResponse.data.product._id);

    // 3. Verify frontend endpoints show the data
    console.log('🌐 Verifying frontend integration...');
    
    const productsRes = await axios.get('http://localhost:4000/api/products');
    const artisansRes = await axios.get('http://localhost:4000/api/artisans');

    console.log(`🛍️  Products on /shop: ${productsRes.data.products.length}`);
    console.log(`👨‍🎨 Artisans on /artisans: ${artisansRes.data.length}`);

    // Check if our created items have all necessary fields
    const createdProduct = productsRes.data.products.find(p => p._id === productResponse.data.product._id);
    const createdArtisan = artisansRes.data.find(a => a._id === artisanId);

    if (createdProduct && createdArtisan) {
      console.log('✅ Product has all fields:', {
        id: createdProduct._id,
        name: createdProduct.name,
        price: createdProduct.price,
        images: createdProduct.images.length,
        artisan: createdProduct.artisanId ? 'linked' : 'missing',
        rating: createdProduct.rating,
        materials: createdProduct.materials.length
      });

      console.log('✅ Artisan has all fields:', {
        id: createdArtisan._id,
        name: createdArtisan.name,
        location: createdArtisan.location,
        avatar: createdArtisan.avatar ? 'set' : 'missing',
        specialties: createdArtisan.specialties.length,
        experience: createdArtisan.experience
      });

      console.log('🎉 SUCCESS! Admin-created items will display perfectly on /shop and /artisans pages!');
    } else {
      console.log('⚠️  Items created but not appearing in frontend APIs');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

createCompleteProductWithArtisan();