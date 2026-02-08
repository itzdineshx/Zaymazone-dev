import fetch from 'node-fetch'

const API_BASE = 'http://localhost:4000/api'

// Test data
const timestamp = Date.now()
const testUser = {
  email: `test-sync-${timestamp}@example.com`,
  firebaseUID: `test-firebase-sync-uid-${timestamp}`
}

const testArtisan = {
  name: 'Test Artisan Sync',
  businessInfo: {
    businessName: 'Test Business Sync'
  }
}

const testProduct = {
  name: 'Test Product Sync',
  description: 'Product for testing approval sync',
  price: 50,
  category: 'pottery',
  images: ['https://example.com/test-image.jpg']
}

const testBlog = {
  title: 'Test Blog Sync',
  excerpt: 'Blog for testing approval sync',
  content: 'This is test blog content for approval sync testing.',
  featuredImage: 'https://example.com/test-blog-image.jpg',
  author: {
    name: 'Test Artisan Sync',
    bio: 'Test bio',
    avatar: 'https://example.com/avatar.jpg',
    role: 'Writer'
  },
  category: 'Traditional Crafts',
  tags: ['test', 'sync']
}

async function testApprovalSync() {
  try {
    console.log('🧪 Starting approval sync test...\n')

    // Step 1: Create test user
    console.log('1. Creating test user...')
    const userResponse = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testUser.email.split('@')[0],
        email: testUser.email,
        password: 'testpassword123'
      })
    })

    if (!userResponse.ok) {
      throw new Error(`Failed to create user: ${userResponse.status}`)
    }

    const userData = await userResponse.json()
    console.log('✅ User created:', userData.user?.email)

    // Step 2: Create artisan profile
    console.log('\n2. Creating artisan profile...')
    const artisanResponse = await fetch(`${API_BASE}/seller-onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify(testArtisan)
    })

    if (!artisanResponse.ok) {
      const errorText = await artisanResponse.text()
      console.log('Artisan creation error:', errorText)
      throw new Error(`Failed to create artisan: ${artisanResponse.status}`)
    }

    const artisanData = await artisanResponse.json()
    console.log('✅ Artisan created:', artisanData.artisan?.name)

    // Step 3: Create test products
    console.log('\n3. Creating test products...')
    const productResponse = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify({
        ...testProduct,
        artisanId: artisanData.artisan._id
      })
    })

    if (!productResponse.ok) {
      throw new Error(`Failed to create product: ${productResponse.status}`)
    }

    const productData = await productResponse.json()
    console.log('✅ Product created:', productData.name)

    // Step 4: Create test blog
    console.log('\n4. Creating test blog...')
    const blogResponse = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify(testBlog)
    })

    if (!blogResponse.ok) {
      const errorText = await blogResponse.text()
      console.log('Blog creation response:', errorText)
      throw new Error(`Failed to create blog: ${blogResponse.status}`)
    }

    const blogData = await blogResponse.json()
    console.log('✅ Blog created:', blogData.post?.title)

    // Step 5: Check initial approval status
    console.log('\n5. Checking initial approval status...')

    // Get artisan details
    const artisanCheckResponse = await fetch(`${API_BASE}/admin/artisan-details/${artisanData.artisan._id}`, {
      headers: {
        'Authorization': `Bearer ${userData.token}` // This should be admin token, but we'll use user token for now
      }
    })

    if (artisanCheckResponse.ok) {
      const artisanDetails = await artisanCheckResponse.json()
      console.log('Artisan status:', artisanDetails.artisan?.approvalStatus)
    }

    // Get products
    const productsResponse = await fetch(`${API_BASE}/products?artisanId=${artisanData.artisan._id}`)
    if (productsResponse.ok) {
      const products = await productsResponse.json()
      console.log('Products status:', products.data?.map(p => ({ name: p.name, status: p.approvalStatus })))
    }

    // Get blogs
    const blogsResponse = await fetch(`${API_BASE}/blog?author=${userData.user._id}`)
    if (blogsResponse.ok) {
      const blogs = await blogsResponse.json()
      console.log('Blogs status:', blogs.data?.map(b => ({ title: b.title, status: b.approvalStatus })))
    }

    console.log('\n🎯 Test setup complete!')
    console.log('To complete the test, you need to:')
    console.log('1. Go to admin panel and approve the artisan')
    console.log('2. Check that products and blogs are auto-approved')
    console.log('3. Create new products/blogs from the approved artisan')
    console.log('4. Verify they are auto-approved')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testApprovalSync()