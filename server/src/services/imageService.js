import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
import fs from 'fs'
import path from 'path'
import Image from '../models/Image.js'

let gfsBucket

// Initialize GridFS bucket
export function initGridFS() {
  if (mongoose.connection.readyState === 1) {
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'images'
    })
    console.log('GridFS initialized')
  } else {
    mongoose.connection.once('open', () => {
      gfsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'images'
      })
      console.log('GridFS initialized')
    })
  }
}

// Upload image file to GridFS
export async function uploadImageToGridFS(filePath, filename, category = 'other') {
  return new Promise((resolve, reject) => {
    if (!gfsBucket) {
      return reject(new Error('GridFS not initialized'))
    }

    const readStream = fs.createReadStream(filePath)
    const uploadStream = gfsBucket.openUploadStream(filename, {
      metadata: { category, uploadDate: new Date() }
    })

    readStream.pipe(uploadStream)

    uploadStream.on('error', reject)
    uploadStream.on('finish', async () => {
      try {
        // Get file stats
        const stats = fs.statSync(filePath)
        const contentType = getContentType(filename)

        // Save image metadata
        const imageDoc = await Image.create({
          filename,
          originalName: path.basename(filePath),
          contentType,
          size: stats.size,
          gridfsId: uploadStream.id,
          category
        })

        resolve({
          id: imageDoc._id,
          gridfsId: uploadStream.id,
          filename,
          contentType,
          size: stats.size
        })
      } catch (error) {
        reject(error)
      }
    })

    readStream.on('error', reject)
  })
}

// Get image stream from GridFS
export function getImageStream(gridfsId) {
  if (!gfsBucket) {
    throw new Error('GridFS not initialized')
  }
  return gfsBucket.openDownloadStream(new mongoose.Types.ObjectId(gridfsId))
}

// Get image by filename
export async function getImageByFilename(filename) {
  const image = await Image.findOne({ filename, isActive: true }).sort({ uploadDate: -1 })
  return image
}

// Delete image from GridFS
export async function deleteImageFromGridFS(gridfsId) {
  if (!gfsBucket) {
    throw new Error('GridFS not initialized')
  }
  
  await gfsBucket.delete(new mongoose.Types.ObjectId(gridfsId))
  await Image.findOneAndUpdate(
    { gridfsId },
    { isActive: false }
  )
}

// Helper function to determine content type
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }
  return contentTypes[ext] || 'application/octet-stream'
}

export { gfsBucket }