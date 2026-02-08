#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function testRouteLogic() {
  try {
    console.log('Testing route logic...');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Simulate the route logic
    console.log('Fetching artisans from database...');
    console.log('Artisan model:', typeof Artisan);

    const artisans = await Artisan.find({
      isActive: true,
      approvalStatus: 'approved'
    }).limit(20);

    console.log(`Found ${artisans.length} artisans`);

    console.log('Test completed successfully');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }
}

testRouteLogic();