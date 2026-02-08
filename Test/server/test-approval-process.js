import mongoose from 'mongoose';
import Artisan from './src/models/Artisan.js';
import Product from './src/models/Product.js';
import User from './src/models/User.js';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:4000/api';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone';

async function testApprovalProcess() {
  try {
    console.log('🧪 Testing approval process...');

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('📊 Connected to database');

    // Create a test user
    let testUser = await User.findOne({ email: 'test-artisan@example.com' });
    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      testUser = new User({
        name: 'Test Artisan',
        email: 'test-artisan@example.com',
        password: hashedPassword,
        role: 'user'
      });
      await testUser.save();
      console.log('👤 Created test user');
    }

    // Create a pending artisan
    let testArtisan = await Artisan.findOne({ userId: testUser._id });
    if (!testArtisan) {
      testArtisan = new Artisan({
        userId: testUser._id,
        name: 'Test Artisan',
        businessInfo: {
          businessName: 'Test Crafts',
          sellerType: 'gst',
          gstNumber: '22AAAAA0000A1Z5',
          contact: {
            email: 'test-artisan@example.com',
            phone: '+91-9876543210',
            address: {
              village: 'Test Village',
              district: 'Test District',
              state: 'Test State',
              pincode: '123456'
            }
          }
        },
        location: {
          city: 'Test City',
          state: 'Test State',
          country: 'India'
        },
        specialties: ['Test Crafts'],
        experience: 5,
        bio: 'Test artisan bio',
        avatar: 'test-avatar.jpg',
        approvalStatus: 'pending',
        isActive: false
      });
      await testArtisan.save();
      console.log('🎨 Created pending artisan');
    }

    // Create a pending product
    let testProduct = await Product.findOne({ name: 'Test Product' });
    if (!testProduct) {
      testProduct = new Product({
        name: 'Test Product',
        description: 'Test product description',
        price: 100,
        images: ['test-image.jpg'],
        category: 'Test Category',
        artisanId: testArtisan._id,
        isActive: false,
        approvalStatus: 'pending'
      });
      await testProduct.save();
      console.log('📦 Created pending product');
    }

    // Login as admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@zaymazone.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Admin login failed');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;
    console.log('✅ Admin logged in successfully');

    // Approve the artisan
    console.log('✅ Approving artisan...');
    const artisanApproveResponse = await fetch(`${API_BASE_URL}/admin/sellers/${testArtisan._id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ approvalNotes: 'Approved via test' })
    });

    if (artisanApproveResponse.ok) {
      console.log('✅ Artisan approved successfully');
    } else {
      console.log('❌ Failed to approve artisan:', artisanApproveResponse.status);
    }

    // Approve the product
    console.log('📦 Approving product...');
    const productApproveResponse = await fetch(`${API_BASE_URL}/admin/approvals/products/${testProduct._id}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ approvalNotes: 'Approved via test' })
    });

    if (productApproveResponse.ok) {
      console.log('✅ Product approved successfully');
    } else {
      console.log('❌ Failed to approve product:', productApproveResponse.status);
    }

    // Check if artisan appears in frontend
    console.log('🔍 Checking if artisan appears in frontend...');
    const artisansResponse = await fetch(`${API_BASE_URL}/products/artisans`);
    if (artisansResponse.ok) {
      const artisans = await artisansResponse.json();
      const foundArtisan = artisans.find(a => a._id === testArtisan._id.toString());
      if (foundArtisan) {
        console.log('✅ Artisan appears in frontend!');
        console.log('Artisan status:', foundArtisan.approvalStatus, 'Active:', foundArtisan.isActive);
      } else {
        console.log('❌ Artisan not found in frontend');
      }
    }

    // Check if product appears in frontend
    console.log('🔍 Checking if product appears in frontend...');
    const productsResponse = await fetch(`${API_BASE_URL}/products`);
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const foundProduct = productsData.products?.find(p => p.id === testProduct._id.toString());
      if (foundProduct) {
        console.log('✅ Product appears in frontend!');
        console.log('Product status:', foundProduct.approvalStatus, 'Active:', foundProduct.isActive);
      } else {
        console.log('❌ Product not found in frontend');
        console.log('Available products:', productsData.products?.length || 0);
      }
    }

    console.log('🎉 Approval process test completed!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testApprovalProcess();