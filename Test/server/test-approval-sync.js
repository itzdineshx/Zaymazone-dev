import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Artisan from './src/models/Artisan.js'
import Product from './src/models/Product.js'
import BlogPost from './src/models/BlogPost.js'
import User from './src/models/User.js'

dotenv.config()

async function testApprovalSync() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zaymazone')
    console.log('Connected to MongoDB')

    const timestamp = Date.now()

    // Create a test user
    const testUser = await User.create({
      name: 'Test User Sync',
      email: `test-artisan-sync-${timestamp}@example.com`,
      firebaseUID: `test-firebase-uid-sync-${timestamp}`
    })
    console.log('Created test user:', testUser._id)

    // Create a test artisan
    const testArtisan = await Artisan.create({
      userId: testUser._id,
      name: 'Test Artisan Sync',
      location: {
        city: 'Test City',
        state: 'Test State',
        country: 'India'
      },
      businessInfo: {
        businessName: 'Test Business Sync'
      },
      approvalStatus: 'pending'
    })
    console.log('Created test artisan:', testArtisan._id)

    // Create some test products
    const product1 = await Product.create({
      name: 'Test Product 1',
      description: 'Test product for sync testing',
      price: 50,
      artisanId: testArtisan._id,
      category: 'pottery',
      approvalStatus: 'pending',
      isActive: false
    })

    const product2 = await Product.create({
      name: 'Test Product 2',
      description: 'Another test product for sync testing',
      price: 75,
      artisanId: testArtisan._id,
      category: 'textiles',
      approvalStatus: 'pending',
      isActive: false
    })
    console.log('Created test products:', product1._id, product2._id)

    // Create some test blogs
    const blog1 = await BlogPost.create({
      title: 'Test Blog 1',
      slug: `test-blog-1-${timestamp}`,
      excerpt: 'Test blog excerpt',
      content: 'Test blog content',
      featuredImage: 'https://example.com/image.jpg',
      author: {
        name: 'Test Artisan Sync'
      },
      category: 'Traditional Crafts',
      authorId: testUser._id,
      approvalStatus: 'pending',
      isActive: false
    })

    const blog2 = await BlogPost.create({
      title: 'Test Blog 2',
      slug: `test-blog-2-${timestamp}`,
      excerpt: 'Another test blog excerpt',
      content: 'Another test blog content',
      featuredImage: 'https://example.com/image2.jpg',
      author: {
        name: 'Test Artisan Sync'
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
    console.log('Products approval status:', initialProducts.map(p => ({ id: p._id, status: p.approvalStatus, isActive: p.isActive })))
    console.log('Blogs approval status:', initialBlogs.map(b => ({ id: b._id, status: b.approvalStatus, isActive: b.isActive })))

    // Simulate artisan approval (what the admin route does)
    console.log('\n=== Simulating Artisan Approval ===')
    const approvedArtisan = await Artisan.findByIdAndUpdate(
      testArtisan._id,
      {
        approvalStatus: 'approved',
        approvalNotes: 'Test approval',
        approvedBy: testUser._id,
        approvedAt: new Date()
      },
      { new: true }
    )

    // Auto-approve products
    const productsUpdateResult = await Product.updateMany(
      { artisanId: testArtisan._id, approvalStatus: { $ne: 'approved' } },
      {
        approvalStatus: 'approved',
        approvalNotes: `Auto-approved when artisan ${approvedArtisan.name} was approved`,
        approvedBy: testUser._id,
        approvedAt: new Date(),
        isActive: true
      }
    )

    // Auto-approve blogs
    const blogsUpdateResult = await BlogPost.updateMany(
      { authorId: testUser._id, approvalStatus: { $ne: 'approved' } },
      {
        approvalStatus: 'approved',
        status: 'published',
        approvalNotes: `Auto-approved when artisan ${approvedArtisan.name} was approved`,
        approvedBy: testUser._id,
        approvedAt: new Date(),
        publishedAt: new Date()
      }
    )

    console.log(`Auto-approved ${productsUpdateResult.modifiedCount} products and ${blogsUpdateResult.modifiedCount} blogs`)

    // Verify final state
    console.log('\n=== Final State After Approval ===')
    const finalArtisan = await Artisan.findById(testArtisan._id)
    const finalProducts = await Product.find({ artisanId: testArtisan._id })
    const finalBlogs = await BlogPost.find({ authorId: testUser._id })

    console.log('Artisan approval status:', finalArtisan.approvalStatus)
    console.log('Products approval status:', finalProducts.map(p => ({ id: p._id, status: p.approvalStatus, isActive: p.isActive })))
    console.log('Blogs approval status:', finalBlogs.map(b => ({ id: b._id, status: b.approvalStatus, isActive: b.isActive })))

    // Test new product creation from approved artisan
    console.log('\n=== Testing New Product Creation from Approved Artisan ===')
    const newProduct = await Product.create({
      name: 'New Product from Approved Artisan',
      description: 'This should be auto-approved',
      price: 100,
      artisanId: testArtisan._id,
      category: 'jewelry'
    })
    console.log('New product approval status:', newProduct.approvalStatus, 'isActive:', newProduct.isActive)

    // Test new blog creation from approved artisan
    console.log('\n=== Testing New Blog Creation from Approved Artisan ===')
    const newBlog = await BlogPost.create({
      title: 'New Blog from Approved Artisan',
      slug: `new-blog-from-approved-artisan-${timestamp}`,
      excerpt: 'This should be auto-approved',
      content: 'Blog content',
      featuredImage: 'https://example.com/new-image.jpg',
      author: {
        name: 'Test Artisan Sync'
      },
      category: 'Business',
      authorId: testUser._id
    })
    console.log('New blog approval status:', newBlog.approvalStatus, 'isActive:', newBlog.isActive)

    // Clean up
    await BlogPost.deleteMany({ authorId: testUser._id })
    await Product.deleteMany({ artisanId: testArtisan._id })
    await Artisan.deleteOne({ _id: testArtisan._id })
    await User.deleteOne({ _id: testUser._id })

    console.log('\n=== Test completed successfully! ===')

  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await mongoose.disconnect()
  }
}

testApprovalSync()