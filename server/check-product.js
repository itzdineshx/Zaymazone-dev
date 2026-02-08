import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './src/models/Product.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone';

async function checkProduct() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const product = await Product.findOne({ name: 'Handcrafted Wooden Bowl by DINESH S' });
    console.log('Product found:', !!product);

    if (product) {
      console.log('Product ID:', product._id);
      console.log('Has 360 images:', product.images360?.length || 0);
      console.log('Has videos:', product.videos?.length || 0);
      console.log('Has size guide:', !!product.sizeGuide);
      console.log('Has care instructions:', !!product.careInstructions);

      if (product.images360?.length > 0) {
        console.log('Sample 360 image:', product.images360[0]);
      }
      if (product.videos?.length > 0) {
        console.log('Sample video:', product.videos[0]);
      }
    } else {
      console.log('Product not found. Available products:');
      const allProducts = await Product.find({}, 'name').limit(5);
      allProducts.forEach(p => console.log('-', p.name));
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkProduct();