import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadImageToGridFS, initGridFS } from '../services/imageService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function uploadTeamImages() {
  try {
    console.log('Starting team images upload...')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Initialize GridFS
    initGridFS()
    console.log('GridFS initialized')

    // Team images to upload
    const teamImages = [
      'team1.jpg',
      'team2.png',
      'team3.jpg'
    ]

    for (const imageName of teamImages) {
      const imagePath = path.join(__dirname, '../../../public/assets', imageName)

      if (!fs.existsSync(imagePath)) {
        console.log(`❌ ${imageName} not found at ${imagePath}`)
        continue
      }

      console.log(`Uploading ${imageName}...`)
      await uploadImageToGridFS(imagePath, imageName, 'other')
      console.log(`✅ Uploaded ${imageName}`)
    }

    console.log('Team images upload completed!')

  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

uploadTeamImages()