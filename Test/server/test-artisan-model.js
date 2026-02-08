#!/usr/bin/env node

import mongoose from 'mongoose';
import 'dotenv/config';
import Artisan from './src/models/Artisan.js';

async function testArtisanModel() {
  try {
    console.log('Testing Artisan model import...');
    console.log('Artisan model:', typeof Artisan);
    console.log('Artisan model methods:', Object.getOwnPropertyNames(Artisan));

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('Connected to MongoDB');

    console.log('Testing simple find...');
    const artisans = await Artisan.find({}).limit(1);
    console.log('Simple find worked, found:', artisans.length);

    console.log('Testing approved find...');
    const approved = await Artisan.find({ approvalStatus: 'approved' });
    console.log('Approved find worked, found:', approved.length);

    await mongoose.disconnect();
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error:', error);
    console.error('Stack:', error.stack);
  }
}

testArtisanModel();