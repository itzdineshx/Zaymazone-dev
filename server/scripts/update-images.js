import 'dotenv/config'
import mongoose from 'mongoose'
import Product from '../src/models/Product.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

// Function to convert asset paths to frontend URLs
function convertImagePath(path) {
  if (path.startsWith('/assets/')) {
    // Remove the leading slash to make it a relative path that works from frontend
    return path.substring(1)
  }
  return path
}

async function updateImagePaths() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Get all products
    const products = await Product.find({})
    console.log(`Found ${products.length} products to update`)

    let updatedCount = 0

    for (const product of products) {
      // Update image paths
      const updatedImages = product.images.map(convertImagePath)
      
      // Check if any images were actually changed
      const hasChanges = product.images.some((img, index) => img !== updatedImages[index])
      
      if (hasChanges) {
        await Product.findByIdAndUpdate(product._id, {
          images: updatedImages
        })
        updatedCount++
        console.log(`Updated images for product: ${product.name}`)
        console.log(`  Old: ${product.images[0]}`)
        console.log(`  New: ${updatedImages[0]}`)
      }
    }

    console.log(`\nImage update complete!`)
    console.log(`Updated ${updatedCount} products`)
    
  } catch (error) {
    console.error('Error updating image paths:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

updateImagePaths()
