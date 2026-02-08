import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { uploadImageToGridFS } from '../services/imageService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrateAssets() {
  try {
    console.log('Starting asset migration...')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Asset directories to migrate
    const assetDirs = [
      { dir: path.join(__dirname, '../../../public/assets'), category: 'frontend' },
      { dir: path.join(__dirname, '../../../public/lovable-uploads'), category: 'upload' }
    ]

    for (const { dir, category } of assetDirs) {
      if (!fs.existsSync(dir)) {
        console.log(`Directory ${dir} does not exist, skipping...`)
        continue
      }

      const files = fs.readdirSync(dir)
      console.log(`Found ${files.length} files in ${category} directory`)

      for (const file of files) {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)

        if (stat.isFile()) {
          try {
            console.log(`Uploading ${file}...`)
            await uploadImageToGridFS(filePath, file, category)
            console.log(`✅ Uploaded ${file}`)
          } catch (error) {
            console.error(`❌ Failed to upload ${file}:`, error.message)
          }
        }
      }
    }

    console.log('Asset migration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateAssets()
}

export { migrateAssets }