import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadImageToGridFS, initGridFS, deleteImageFromGridFS } from '../services/imageService.js'
import Image from '../models/Image.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function replaceLogoWithAssets() {
  try {
    console.log('Starting logo replacement...')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Initialize GridFS
    initGridFS()
    console.log('GridFS initialized')

    // Find all existing logo.png entries
    const existingLogos = await Image.find({ filename: 'logo.png' })
    console.log(`Found ${existingLogos.length} existing logo entries`)

    // Delete all existing logo entries
    for (const logo of existingLogos) {
      try {
        await deleteImageFromGridFS(logo.gridfsId)
        console.log(`Deleted logo with GridFS ID: ${logo.gridfsId}`)
      } catch (error) {
        console.error(`Failed to delete logo ${logo.gridfsId}:`, error.message)
      }
    }

    // Upload the new logo from public/assets/
    const logoPath = path.join(__dirname, '../../../public/assets/logo.png')
    console.log('New logo path:', logoPath)

    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found at:', logoPath)
      return
    }

    console.log('Uploading new logo.png...')
    const result = await uploadImageToGridFS(logoPath, 'logo.png', 'other')
    console.log('✅ New logo uploaded successfully!')
    console.log('Upload result:', result)

  } catch (error) {
    console.error('Logo replacement failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

replaceLogoWithAssets()