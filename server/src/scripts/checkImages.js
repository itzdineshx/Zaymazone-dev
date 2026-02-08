import mongoose from 'mongoose'
import { initGridFS } from '../services/imageService.js'
import Image from '../models/Image.js'
import 'dotenv/config'

async function checkImages() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'
    await mongoose.connect(mongoUri)
    initGridFS()

    console.log('Connected to MongoDB')

    // Check all images in database
    const images = await Image.find({ isActive: true }).sort({ uploadDate: -1 })
    console.log(`Found ${images.length} images in database:`)

    images.forEach((img, index) => {
      console.log(`${index + 1}. ${img.filename} (${img.contentType}) - ${img.size} bytes`)
    })

    // Check specifically for team images
    const teamImages = images.filter(img => img.filename.startsWith('team'))
    console.log(`\nTeam images found: ${teamImages.length}`)
    teamImages.forEach(img => {
      console.log(`- ${img.filename}`)
    })

  } catch (error) {
    console.error('Error checking images:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

checkImages()