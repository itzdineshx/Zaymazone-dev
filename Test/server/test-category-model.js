import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';

dotenv.config();

async function testCategoryModel() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone');
    console.log('✅ Connected to MongoDB');
    
    console.log('🔍 Testing Category model...');
    const categories = await Category.find({ isActive: true }).limit(5);
    console.log(`✅ Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('First category:', {
        name: categories[0].name,
        slug: categories[0].slug,
        featured: categories[0].featured
      });
    }
    
    console.log('🔍 Testing updateCounts method...');
    await Category.updateCounts();
    console.log('✅ updateCounts completed successfully');
    
  } catch (error) {
    console.error('❌ Error testing Category model:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testCategoryModel();