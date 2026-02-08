#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function approveAllArtisans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    const result = await Artisan.updateMany(
      { approvalStatus: 'pending' },
      {
        approvalStatus: 'approved',
        approvedAt: new Date(),
        approvalNotes: 'Auto-approved for testing'
      }
    );

    console.log(`Approved ${result.modifiedCount} artisans`);

    // Verify the changes
    const approvedArtisans = await Artisan.find({ approvalStatus: 'approved' });
    console.log(`Total approved artisans: ${approvedArtisans.length}`);

    for (const artisan of approvedArtisans) {
      console.log(`- ${artisan.name} (${artisan.location?.city}, ${artisan.location?.state})`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

approveAllArtisans();