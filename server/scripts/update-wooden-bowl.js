import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone';

async function updateWoodenBowlProduct() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find the wooden bowl product
    const product = await Product.findOne({ name: 'Handcrafted Wooden Bowl by DINESH S' });

    if (!product) {
      console.log('❌ Product not found');
      return;
    }

    console.log('📝 Updating product with enhanced features...');

    // Update the product with new features
    product.images360 = [
      {
        angle: 0,
        url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl front view - Handcrafted artisan piece'
      },
      {
        angle: 45,
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl 45° view - Natural wood grain visible'
      },
      {
        angle: 90,
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl side view - Smooth curved edges'
      },
      {
        angle: 135,
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl 135° view - Artisan craftsmanship details'
      },
      {
        angle: 180,
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl back view - Natural wood texture'
      },
      {
        angle: 225,
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl 225° view - Hand-finished surface'
      },
      {
        angle: 270,
        url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl 270° view - Premium quality wood'
      },
      {
        angle: 315,
        url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop&crop=center',
        alt: 'Wooden bowl 315° view - Traditional artisan work'
      }
    ];

    product.has360View = true;

    product.videos = [
      {
        type: 'demonstration',
        title: 'Wooden Bowl Crafting Process',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=225&fit=crop&crop=center',
        duration: 180, // 3 minutes
        fileSize: 15728640, // 15MB
        uploadedAt: new Date('2024-10-19')
      },
      {
        type: 'making-of',
        title: 'From Tree to Table - Artisan Journey',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop&crop=center',
        duration: 240, // 4 minutes
        fileSize: 20971520, // 20MB
        uploadedAt: new Date('2024-10-19')
      },
      {
        type: 'usage',
        title: 'How to Use and Care for Your Wooden Bowl',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=225&fit=crop&crop=center',
        duration: 120, // 2 minutes
        fileSize: 10485760, // 10MB
        uploadedAt: new Date('2024-10-19')
      }
    ];

    product.sizeGuide = {
      category: 'home-decor',
      measurements: [
        {
          name: 'Diameter',
          unit: 'cm',
          description: 'Width of the bowl at its widest point',
          howToMeasure: 'Measure across the top opening of the bowl'
        },
        {
          name: 'Height',
          unit: 'cm',
          description: 'Total height of the bowl',
          howToMeasure: 'Measure from the bottom to the top rim'
        },
        {
          name: 'Depth',
          unit: 'cm',
          description: 'Internal depth of the bowl',
          howToMeasure: 'Measure from the bottom to the top inside edge'
        }
      ],
      sizeChart: [
        {
          size: 'Small',
          measurements: { Diameter: 15, Height: 8, Depth: 6 },
          bodyType: 'regular'
        },
        {
          size: 'Medium',
          measurements: { Diameter: 20, Height: 10, Depth: 8 },
          bodyType: 'regular'
        },
        {
          size: 'Large',
          measurements: { Diameter: 25, Height: 12, Depth: 10 },
          bodyType: 'regular'
        }
      ],
      visualGuide: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center'
    };

    product.careInstructions = {
      materials: ['Premium Teak Wood', 'Natural Beeswax Finish', 'Food-Safe Coating'],
      washing: {
        method: 'Hand wash only with mild soap',
        temperature: 'Use lukewarm water only',
        detergent: 'Mild dish soap or wood cleaner',
        specialNotes: 'Avoid soaking. Dry immediately after washing.'
      },
      drying: {
        method: 'Air dry completely',
        temperature: 'Room temperature',
        specialNotes: 'Never use heat to dry. Wipe with soft cloth.'
      },
      ironing: null,
      storage: 'Store in a cool, dry place away from direct sunlight. Stack carefully to avoid scratches.',
      cleaning: 'Wipe with damp cloth and mild soap. Occasionally apply mineral oil to maintain wood moisture.',
      warnings: [
        'Not dishwasher safe',
        'Avoid extreme temperature changes',
        'Do not use abrasive cleaners',
        'Keep away from heat sources'
      ],
      icons: ['hand-wash', 'no-dryer', 'no-iron', 'cool-storage'],
      videoTutorial: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    };

    // Add 3D model support
    product.model3d = {
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      format: 'glb',
      thumbnail: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=300&fit=crop&crop=center',
      title: 'Interactive 3D Model',
      description: 'Explore the wooden bowl in 3D'
    };

    await product.save();

    console.log('✅ Product updated successfully with all enhanced features!');
    console.log('📊 Features added:');
    console.log('  • 360° View: 8 angles');
    console.log('  • Videos: 3 demonstration videos');
    console.log('  • Size Guide: 3 measurements, 3 sizes');
    console.log('  • Care Instructions: Complete care guide with warnings');

  } catch (error) {
    console.error('❌ Error updating product:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the update
updateWoodenBowlProduct();