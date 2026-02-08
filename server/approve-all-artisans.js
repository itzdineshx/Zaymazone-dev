#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function approveAllPendingArtisans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    // Try updating by name
    console.log('Trying to update by name...');
    const bambooResult = await Artisan.updateOne(
      { name: 'The Bamboo Bae' },
      {
        approvalStatus: 'approved',
        approvedAt: new Date(),
        approvalNotes: 'Auto-approved for testing'
      }
    );
    console.log(`Updated Bamboo Bae: ${bambooResult.modifiedCount}`);

    const naveenResult = await Artisan.updateOne(
      { name: 'Naveen K' },
      {
        approvalStatus: 'approved',
        approvedAt: new Date(),
        approvalNotes: 'Auto-approved for testing'
      }
    );
    console.log(`Updated Naveen K: ${naveenResult.modifiedCount}`);

    for (const artisan of pendingArtisans) {
      console.log(`Approving: ${artisan.name} (ID: ${artisan._id})`);
      const updated = await Artisan.findByIdAndUpdate(artisan._id, {
        approvalStatus: 'approved',
        approvedAt: new Date(),
        approvalNotes: 'Auto-approved for testing'
      }, { new: true });
      console.log(`Updated status to: ${updated?.approvalStatus}`);
    }

    // Verify the changes
    const approvedCount = await Artisan.countDocuments({ approvalStatus: 'approved' });
    console.log(`Total approved artisans: ${approvedCount}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

approveAllPendingArtisans();