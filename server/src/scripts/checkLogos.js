import 'dotenv/config'
import mongoose from 'mongoose'
import Image from '../models/Image.js'

async function checkLogos() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    const logos = await Image.find({ filename: 'logo.png' }).sort({ uploadDate: -1 })
    console.log('Found logo entries:', logos.length)
    logos.forEach((logo, index) => {
      console.log(`${index + 1}. Size: ${logo.size} bytes, Category: ${logo.category}, Upload Date: ${logo.uploadDate}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
  }
}

checkLogos()