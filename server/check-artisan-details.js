#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function checkArtisanStatuses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    const allArtisans = await Artisan.find({});
    console.log(`Total artisans: ${allArtisans.length}`);

    for (const artisan of allArtisans) {
      console.log(`\nArtisan: ${artisan.name}`);
      console.log(`  Status: ${artisan.approvalStatus}`);
      console.log(`  Active: ${artisan.isActive}`);
      console.log(`  Verified: ${artisan.verification?.isVerified}`);
      console.log(`  Avatar: ${artisan.avatar}`);
      console.log(`  Cover Image: ${artisan.coverImage}`);
      console.log(`  Specialties: ${artisan.specialties?.join(', ')}`);
      console.log(`  Location: ${artisan.location?.city}, ${artisan.location?.state}`);
      console.log(`  Rating: ${artisan.rating}`);
      console.log(`  Total Products: ${artisan.totalProducts}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkArtisanStatuses();