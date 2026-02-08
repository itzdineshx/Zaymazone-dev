// Quick test to check if artisans have pending changes
import mongoose from 'mongoose';
import Artisan from './src/models/Artisan.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkPendingChanges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all approved artisans
    const artisans = await Artisan.find({ approvalStatus: 'approved' });
    console.log(`\n📊 Found ${artisans.length} approved artisans\n`);

    // Check for pending changes
    const artisansWithChanges = artisans.filter(a => a.pendingChanges?.hasChanges);
    console.log(`🔔 Artisans with pending changes: ${artisansWithChanges.length}\n`);

    if (artisansWithChanges.length > 0) {
      artisansWithChanges.forEach(artisan => {
        console.log(`---`);
        console.log(`Name: ${artisan.name}`);
        console.log(`Email: ${artisan.email}`);
        console.log(`Changed Fields: ${artisan.pendingChanges.changedFields.join(', ')}`);
        console.log(`Changed At: ${artisan.pendingChanges.changedAt}`);
        console.log(`Changes:`, artisan.pendingChanges.changes);
      });
    } else {
      console.log('ℹ️  No artisans with pending changes found.');
      console.log('\n💡 To test:');
      console.log('1. Log in as an approved artisan');
      console.log('2. Edit your profile (email, mobile, or shipping details)');
      console.log('3. Save changes');
      console.log('4. Run this script again');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPendingChanges();
