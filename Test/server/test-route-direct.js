#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function testRouteDirectly() {
  try {
    console.log('Testing route logic directly...');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    console.log('Artisan model:', typeof Artisan);

    // Get artisans from database
    const artisans = await Artisan.find({
      isActive: true,
      approvalStatus: 'approved'
    }).limit(20);

    console.log(`Found ${artisans.length} artisans`);
    if (artisans.length > 0) {
      console.log('First artisan:', JSON.stringify(artisans[0], null, 2));
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }
}

testRouteDirectly();