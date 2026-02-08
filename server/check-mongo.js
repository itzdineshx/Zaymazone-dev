// server/check-mongo.js
import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log('Using URI:', uri ? uri.replace(/:(\/\/.*:).*@/, ':$1***@') : '(none)');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('✅ Connected to MongoDB');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Connection error name:', err.name);
    console.error('Connection error message:', err.message);
    console.error(err);
    process.exit(1);
  }
}
check();