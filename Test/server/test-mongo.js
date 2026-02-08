import 'dotenv/config'
import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

console.log('Testing MongoDB connection...')
console.log('Using URI:', mongoUri ? 'SET' : 'NOT SET')

try {
  await mongoose.connect(mongoUri)
  console.log('✅ MongoDB connected successfully!')
  console.log('Database:', mongoose.connection.name)
  
  // Close the connection
  await mongoose.connection.close()
  console.log('Connection closed')
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message)
  console.error('Full error:', error)
}