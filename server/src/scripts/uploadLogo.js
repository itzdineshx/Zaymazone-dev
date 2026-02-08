import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadImageToGridFS, initGridFS } from '../services/imageService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function uploadLogo() {
  try {
    console.log('Starting logo upload...')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Initialize GridFS
    initGridFS()
    console.log('GridFS initialized')

    const logoPath = path.join(__dirname, '../../../public/assets/logo.png')
    console.log('Logo path:', logoPath)

    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found at:', logoPath)
      return
    }

    console.log('Uploading logo.png...')
    await uploadImageToGridFS(logoPath, 'logo.png', 'other')
    console.log('✅ Logo uploaded successfully!')

  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

uploadLogo()