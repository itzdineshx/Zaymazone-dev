import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Artisan from './src/models/Artisan.js'
import Product from './src/models/Product.js'
import BlogPost from './src/models/BlogPost.js'
import User from './src/models/User.js'

dotenv.config()

async function testRejectionSync() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone')
    console.log('Connected to MongoDB')

    const timestamp = Date.now()

    // Create a test user
    const testUser = await User.create({
      name: 'Test User Reject',
      email: `test-artisan-reject-${timestamp}@example.com`,
      firebaseUID: `test-firebase-uid-reject-${timestamp}`
    })
    console.log('Created test user:', testUser._id)

    // Create a test artisan
    const testArtisan = await Artisan.create({
      userId: testUser._id,
      name: 'Test Artisan Reject',
      location: {
        city: 'Test City',
        state: 'Test State',
        country: 'India'
      },
      businessInfo: {
        businessName: 'Test Business Reject'
      },
      approvalStatus: 'pending'
    })
    console.log('Created test artisan:', testArtisan._id)

    // Create some test products
    const product1 = await Product.create({
      name: 'Test Product Reject 1',
      description: 'Test product for rejection sync testing',
      price: 50,
      artisanId: testArtisan._id,
      category: 'pottery',
      approvalStatus: 'pending',
      isActive: false
    })

    const product2 = await Product.create({
      name: 'Test Product Reject 2',
      description: 'Another test product for rejection sync testing',
      price: 75,
      artisanId: testArtisan._id,
      category: 'textiles',
      approvalStatus: 'pending',
      isActive: false
    })
    console.log('Created test products:', product1._id, product2._id)

    // Create some test blogs
    const blog1 = await BlogPost.create({
      title: 'Test Blog Reject 1',
      slug: `test-blog-reject-1-${timestamp}`,
      excerpt: 'Test blog excerpt',
      content: 'Test blog content',
      featuredImage: 'https://example.com/image.jpg',
      author: {
        name: 'Test Artisan Reject'
      },
      category: 'Traditional Crafts',
      authorId: testUser._id,
      approvalStatus: 'pending',
      isActive: false
    })

    const blog2 = await BlogPost.create({
      title: 'Test Blog Reject 2',
      slug: `test-blog-reject-2-${timestamp}`,
      excerpt: 'Another test blog excerpt',
      content: 'Another test blog content',
      featuredImage: 'https://example.com/image2.jpg',
      author: {
        name: 'Test Artisan Reject'
      },
      category: 'Innovation',
      authorId: testUser._id,
      approvalStatus: 'pending',
      isActive: false
    })
    console.log('Created test blogs:', blog1._id, blog2._id)

    // Verify initial state
    console.log('\n=== Initial State ===')
    const initialArtisan = await Artisan.findById(testArtisan._id)
    const initialProducts = await Product.find({ artisanId: testArtisan._id })
    const initialBlogs = await BlogPost.find({ authorId: testUser._id })

    console.log('Artisan approval status:', initialArtisan.approvalStatus)
    console.log('Products approval status:', initialProducts.map(p => ({ name: p.name, status: p.approvalStatus, isActive: p.isActive })))
    console.log('Blogs approval status:', initialBlogs.map(b => ({ title: b.title, status: b.approvalStatus, isActive: b.isActive })))

    // Simulate artisan rejection (what the admin route does)
    console.log('\n=== Simulating Artisan Rejection ===')
    const rejectedArtisan = await Artisan.findByIdAndUpdate(
      testArtisan._id,
      {
        approvalStatus: 'rejected',
        rejectionReason: 'Test rejection for sync testing',
        approvedBy: testUser._id,
        approvedAt: new Date()
      },
      { new: true }
    )

    // Auto-reject all pending products belonging to this artisan
    const productsUpdateResult = await Product.updateMany(
      { artisanId: testArtisan._id, approvalStatus: 'pending' },
      {
        approvalStatus: 'rejected',
        rejectionReason: `Rejected because artisan ${rejectedArtisan.name} was rejected: Test rejection for sync testing`,
        approvedBy: testUser._id,
        approvedAt: new Date(),
        isActive: false
      }
    )

    // Auto-reject all pending blogs belonging to this artisan
    const blogsUpdateResult = await BlogPost.updateMany(
      { authorId: testUser._id, approvalStatus: 'pending' },
      {
        approvalStatus: 'rejected',
        status: 'draft',
        rejectionReason: `Rejected because artisan ${rejectedArtisan.name} was rejected: Test rejection for sync testing`,
        approvedBy: testUser._id,
        approvedAt: new Date()
      }
    )

    console.log(`Auto-rejected ${productsUpdateResult.modifiedCount} pending products and ${blogsUpdateResult.modifiedCount} pending blogs`)

    // Verify final state
    console.log('\n=== Final State After Rejection ===')
    const finalArtisan = await Artisan.findById(testArtisan._id)
    const finalProducts = await Product.find({ artisanId: testArtisan._id })
    const finalBlogs = await BlogPost.find({ authorId: testUser._id })

    console.log('Artisan approval status:', finalArtisan.approvalStatus)
    console.log('Products approval status:', finalProducts.map(p => ({ name: p.name, status: p.approvalStatus, isActive: p.isActive })))
    console.log('Blogs approval status:', finalBlogs.map(b => ({ title: b.title, status: b.approvalStatus, isActive: b.isActive })))

    // Clean up
    await BlogPost.deleteMany({ authorId: testUser._id })
    await Product.deleteMany({ artisanId: testArtisan._id })
    await Artisan.deleteOne({ _id: testArtisan._id })
    await User.deleteOne({ _id: testUser._id })

    console.log('\n=== Rejection sync test completed successfully! ===')

  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await mongoose.disconnect()
  }
}

testRejectionSync()