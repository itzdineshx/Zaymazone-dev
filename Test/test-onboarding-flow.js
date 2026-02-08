import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const API_BASE_URL = 'http://localhost:4000/api';

// Connect to MongoDB
await mongoose.connect('mongodb+srv://selva_db_user:gIJyUrB3oEFPCFei@zayma-test.w2omvt0.mongodb.net/?appName=zayma-test');
console.log('Connected to MongoDB');

// User model (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  firebaseUid: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Test data for onboarding
const testOnboardingData = {
  businessName: "Test Artisan Crafts",
  ownerName: "Test Artisan",
  email: "test@artisan.com",
  password: "testpass123",
  phone: "9876543210",
  address: {
    village: "Test Village",
    district: "Test District",
    state: "Test State",
    pincode: "123456"
  },
  yearsOfExperience: "5",
  sellerType: "non-gst",
  gstNumber: "",
  aadhaarNumber: "123456789012",
  panNumber: "ABCDE1234F",
  categories: ["textiles", "pottery"],
  productDescription: "Beautiful handmade crafts",
  materials: "Cotton, clay",
  priceRange: {
    min: "100",
    max: "1000"
  },
  stockQuantity: "50",
  pickupAddress: {
    sameAsMain: true,
    address: ""
  },
  dispatchTime: "3-5 days",
  packagingType: "standard",
  bankName: "Test Bank",
  accountNumber: "1234567890",
  ifscCode: "TEST0001234",
  upiId: "test@upi",
  paymentFrequency: "monthly",
  story: "Test artisan story",
  profilePhoto: null,
  productPhotos: [],
  gstCertificate: null,
  aadhaarProof: null,
  craftVideo: null
};

async function testOnboardingFlow() {
  try {
    console.log('🔄 Testing Artisan Onboarding Flow...\n');

    // Step 1: Create or find test user
    console.log('1. Setting up test user...');
    let testUser = await User.findOne({ email: testOnboardingData.email });

    if (!testUser) {
      testUser = new User({
        email: testOnboardingData.email,
        name: testOnboardingData.ownerName,
        firebaseUid: `test-${Date.now()}`,
        isActive: true
      });
      await testUser.save();
      console.log('✅ Test user created:', testUser._id);
    } else {
      console.log('✅ Test user found:', testUser._id);
    }

    // Step 2: Generate JWT token
    const token = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
      { expiresIn: '1h' }
    );
    console.log('✅ JWT token generated');

    // Step 3: Submit onboarding form
    console.log('\n2. Submitting onboarding form...');
    console.log('Payload size estimate:', JSON.stringify(testOnboardingData).length, 'bytes');

    const onboardingResponse = await fetch(`${API_BASE_URL}/onboarding/artisan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testOnboardingData)
    });

    console.log('Response status:', onboardingResponse.status);
    console.log('Response headers:', Object.fromEntries(onboardingResponse.headers.entries()));

    if (!onboardingResponse.ok) {
      console.log('❌ Onboarding failed');
      const errorText = await onboardingResponse.text();
      console.log('Error response:', errorText);
      return;
    }

    const onboardingData = await onboardingResponse.json();
    console.log('✅ Onboarding successful!');
    console.log('Response:', JSON.stringify(onboardingData, null, 2));

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
testOnboardingFlow();