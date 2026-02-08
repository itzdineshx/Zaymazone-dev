import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from './src/models/User.js'
import Artisan from './src/models/Artisan.js'
import Product from './src/models/Product.js'

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zaymazone'

// Clear all data and add only 3 users
async function clearAndSeedUsers() {
  try {
    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')

    // Clear all data
    console.log('Clearing all data...')
    await User.deleteMany({})
    await Artisan.deleteMany({})
    await Product.deleteMany({})
    console.log('All data cleared')

    // Add only 3 users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'user',
        avatar: '/assets/user-avatar.jpg',
        phone: '+91-9876543210',
        address: {
          street: '123 Main Street',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        },
        isEmailVerified: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        passwordHash: await bcrypt.hash('password123', 10),
        role: 'user',
        avatar: '/assets/user-avatar-2.jpg',
        phone: '+91-9876543211',
        address: {
          street: '456 Oak Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        isEmailVerified: true
      },
      {
        name: 'Admin User',
        email: 'admin@zaymazone.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'admin',
        avatar: '/assets/team-1.jpg',
        isEmailVerified: true
      }
    ]

    const createdUsers = await User.insertMany(users)
    console.log(`Created ${createdUsers.length} users:`)
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`)
    })

    await mongoose.disconnect()
    console.log('Database seeding completed')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

clearAndSeedUsers()