#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function checkArtisans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    const allArtisans = await Artisan.find({});
    console.log(`Total artisans in database: ${allArtisans.length}`);

    const activeArtisans = await Artisan.find({ isActive: true });
    console.log(`Active artisans: ${activeArtisans.length}`);

    const approvedArtisans = await Artisan.find({ approvalStatus: 'approved' });
    console.log(`Approved artisans: ${approvedArtisans.length}`);

    const verifiedArtisans = await Artisan.find({ 'verification.isVerified': true });
    console.log(`Verified artisans: ${verifiedArtisans.length}`);

    if (approvedArtisans.length > 0) {
      console.log('First approved artisan:', JSON.stringify(approvedArtisans[0], null, 2));
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkArtisans();