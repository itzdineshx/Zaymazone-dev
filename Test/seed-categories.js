import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: 'server/.env' });

// Import models
import Category from './server/src/models/Category.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone';

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    console.log(`Found ${existingCount} existing categories`);

    if (existingCount > 0) {
      console.log('Categories already exist. Skipping seed.');
      return;
    }

    // Sample categories data
    const categories = [
      {
        name: 'Pottery & Ceramics',
        description: 'Hand-thrown pottery, decorative ceramics, and traditional clay items crafted by master potters.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        icon: 'Gift',
        subcategories: ['Vases', 'Dinnerware', 'Tea Sets', 'Decorative Items'],
        featured: true,
        displayOrder: 1
      },
      {
        name: 'Handwoven Textiles',
        description: 'Traditional fabrics, sarees, scarves, and clothing created using ancient weaving techniques.',
        image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
        icon: 'ShirtIcon',
        subcategories: ['Sarees', 'Shawls', 'Scarves', 'Bedding', 'Bags'],
        featured: true,
        displayOrder: 2
      },
      {
        name: 'Traditional Crafts',
        description: 'Unique handmade crafts representing various regional traditions and artistic styles.',
        image: 'https://images.unsplash.com/photo-1542318151-b26f4e76dd95?w=500',
        icon: 'Sparkles',
        subcategories: ['Woodwork', 'Metalwork', 'Paintings', 'Sculptures'],
        featured: true,
        displayOrder: 3
      },
      {
        name: 'Jewelry & Accessories',
        description: 'Traditional and contemporary jewelry pieces crafted with precious and semi-precious materials.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
        icon: 'Crown',
        subcategories: ['Necklaces', 'Earrings', 'Bracelets', 'Rings'],
        featured: false,
        displayOrder: 4
      },
      {
        name: 'Home Decor',
        description: 'Beautiful handcrafted items to decorate and enhance your living spaces.',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
        icon: 'Palette',
        subcategories: ['Wall Art', 'Sculptures', 'Candles', 'Cushions'],
        featured: false,
        displayOrder: 5
      }
    ];

    // Insert categories
    console.log('Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Successfully inserted ${insertedCategories.length} categories`);

    // Update counts
    console.log('Updating category counts...');
    await Category.updateCounts();
    console.log('✅ Category counts updated');

    // Verify the data
    const allCategories = await Category.find().sort({ displayOrder: 1 });
    console.log('\n📋 Inserted Categories:');
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - Featured: ${cat.featured}`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

seedCategories();