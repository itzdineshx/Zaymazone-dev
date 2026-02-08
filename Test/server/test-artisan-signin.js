// server/test-artisan-signin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Artisan from './src/models/Artisan.js';
import 'dotenv/config';

async function testArtisanSignin() {
  try {
    console.log('Testing artisan signin setup...');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test artisan exists
    let artisan = await Artisan.findOne({ email: 'test@artisan.com' });

    if (!artisan) {
      console.log('Creating test artisan...');
      const hashedPassword = await bcrypt.hash('testpass123', 12);

      artisan = new Artisan({
        userId: new mongoose.Types.ObjectId(), // Dummy user ID
        name: 'Test Artisan',
        email: 'test@artisan.com',
        password: hashedPassword,
        businessInfo: {
          businessName: 'Test Crafts',
          sellerType: 'non-gst',
          contact: {
            email: 'test@artisan.com',
            phone: '9876543210',
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
        specialties: ['pottery'],
        experience: 5,
        bio: 'Test artisan bio',
        approvalStatus: 'approved', // Pre-approve for testing
        isActive: true
      });

      await artisan.save();
      console.log('✅ Test artisan created and approved');
    } else {
      console.log('Test artisan already exists');
      console.log('Approval status:', artisan.approvalStatus);
    }

    // Test password verification
    const isValid = await bcrypt.compare('testpass123', artisan.password);
    console.log('Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');

    await mongoose.disconnect();
    console.log('Test completed');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testArtisanSignin();