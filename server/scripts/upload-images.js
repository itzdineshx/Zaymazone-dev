import 'dotenv/config'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { uploadImageToGridFS, initGridFS } from '../src/services/imageService.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

// Path to assets folder (relative to server directory)
const assetsPath = path.join(process.cwd(), '..', 'public', 'assets')

async function uploadAllImages() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
    
    // Initialize GridFS
    initGridFS()
    
    // Wait a moment for GridFS to initialize
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(`Looking for images in: ${assetsPath}`)
    
    // Check if assets directory exists
    if (!fs.existsSync(assetsPath)) {
      console.error(`Assets directory not found: ${assetsPath}`)
      return
    }

    // Get all image files from assets folder
    const files = fs.readdirSync(assetsPath)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)
    })

    console.log(`Found ${imageFiles.length} image files`)

    let uploadedCount = 0
    let skippedCount = 0

    for (const filename of imageFiles) {
      const filePath = path.join(assetsPath, filename)
      
      try {
        // Determine category based on filename
        let category = 'other'
        if (filename.includes('artisan-avatar')) {
          category = 'artisan'
        } else if (filename.includes('blog-')) {
          category = 'blog'
        } else if (!filename.includes('hero') && !filename.includes('category') && !filename.includes('team') && !filename.includes('author')) {
          category = 'product'
        }

        console.log(`Uploading ${filename} (${category})...`)
        
        const result = await uploadImageToGridFS(filePath, filename, category)
        uploadedCount++
        
        console.log(`✅ Uploaded: ${filename} (ID: ${result.id})`)
        
      } catch (error) {
        console.error(`❌ Error uploading ${filename}:`, error.message)
        skippedCount++
      }
    }

    console.log(`\n🎉 Upload complete!`)
    console.log(`✅ Uploaded: ${uploadedCount} images`)
    console.log(`❌ Skipped: ${skippedCount} images`)
    
  } catch (error) {
    console.error('Error uploading images:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

uploadAllImages()