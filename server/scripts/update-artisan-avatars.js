import 'dotenv/config'
import mongoose from 'mongoose'
import Artisan from '../src/models/Artisan.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

// Function to convert asset paths to frontend URLs
function convertImagePath(path) {
  if (path.startsWith('/assets/')) {
    // Remove the leading slash to make it a relative path that works from frontend
    return path.substring(1)
  }
  return path
}

async function updateArtisanAvatars() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Get all artisans
    const artisans = await Artisan.find({})
    console.log(`Found ${artisans.length} artisans to update`)

    let updatedCount = 0

    for (const artisan of artisans) {
      // Update avatar path
      const updatedAvatar = convertImagePath(artisan.avatar)
      
      // Check if avatar was actually changed
      if (artisan.avatar !== updatedAvatar) {
        await Artisan.findByIdAndUpdate(artisan._id, {
          avatar: updatedAvatar
        })
        updatedCount++
        console.log(`Updated avatar for artisan: ${artisan.name}`)
        console.log(`  Old: ${artisan.avatar}`)
        console.log(`  New: ${updatedAvatar}`)
      }
    }

    console.log(`\nArtisan avatar update complete!`)
    console.log(`Updated ${updatedCount} artisans`)
    
  } catch (error) {
    console.error('Error updating artisan avatars:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

updateArtisanAvatars()