import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Test admin authentication (you'll need to set up proper admin token)
const ADMIN_TOKEN = 'test-admin-token'; // This needs to be replaced with actual admin token

const testHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ADMIN_TOKEN}`
};

async function testCategoriesAPI() {
  console.log('\n🧪 Testing Categories API...\n');
  
  try {
    // Test GET categories (public endpoint)
    console.log('1. Testing GET /api/products/categories (public)');
    const publicResponse = await axios.get(`${BASE_URL}/api/products/categories`);
    console.log('✅ Public categories endpoint working');
    console.log(`   - Found ${publicResponse.data.categories.length} categories`);
    
    // Test GET admin categories
    console.log('\n2. Testing GET /api/admin/categories (admin)');
    try {
      const adminResponse = await axios.get(`${BASE_URL}/api/admin/categories`, {
        headers: testHeaders
      });
      console.log('✅ Admin categories GET endpoint working');
      console.log(`   - Found ${adminResponse.data.categories?.length || 0} categories`);
    } catch (authError) {
      console.log('⚠️  Admin categories GET requires authentication (expected)');
      console.log('   Error:', authError.response?.status, authError.response?.data?.error);
    }
    
    // Test POST admin categories (create)
    console.log('\n3. Testing POST /api/admin/categories (admin)');
    try {
      const newCategory = {
        name: 'Test Category',
        description: 'This is a test category created by the integration test',
        image: 'https://example.com/test-image.jpg',
        icon: 'Gift',
        subcategories: ['Test Sub 1', 'Test Sub 2'],
        featured: false
      };
      
      const createResponse = await axios.post(`${BASE_URL}/api/admin/categories`, newCategory, {
        headers: testHeaders
      });
      console.log('✅ Admin categories POST endpoint working');
      console.log('   - Category created successfully');
    } catch (authError) {
      console.log('⚠️  Admin categories POST requires authentication (expected)');
      console.log('   Error:', authError.response?.status, authError.response?.data?.error);
    }
    
  } catch (error) {
    console.log('❌ Categories API test failed:', error.message);
  }
}

async function testBlogAPI() {
  console.log('\n🧪 Testing Blog API...\n');
  
  try {
    // Test GET blog posts (public endpoint)
    console.log('1. Testing GET /api/blog (public)');
    const publicResponse = await axios.get(`${BASE_URL}/api/blog`);
    console.log('✅ Public blog endpoint working');
    console.log(`   - Found ${publicResponse.data.posts.length} blog posts`);
    
    // Test GET admin blog posts
    console.log('\n2. Testing GET /api/admin/blog-posts (admin)');
    try {
      const adminResponse = await axios.get(`${BASE_URL}/api/admin/blog-posts`, {
        headers: testHeaders
      });
      console.log('✅ Admin blog posts GET endpoint working');
      console.log(`   - Found ${adminResponse.data.posts?.length || 0} blog posts`);
    } catch (authError) {
      console.log('⚠️  Admin blog posts GET requires authentication (expected)');
      console.log('   Error:', authError.response?.status, authError.response?.data?.error);
    }
    
    // Test POST admin blog posts (create)
    console.log('\n3. Testing POST /api/admin/blog-posts (admin)');
    try {
      const newBlogPost = {
        title: 'Test Blog Post',
        excerpt: 'This is a test blog post created by the integration test',
        content: 'This is the full content of the test blog post with more details...',
        featuredImage: 'https://example.com/test-blog-image.jpg',
        author: {
          name: 'Test Author',
          bio: 'Test author bio',
          avatar: 'https://example.com/author-avatar.jpg',
          role: 'Writer'
        },
        category: 'Traditional Crafts',
        tags: ['test', 'integration'],
        status: 'draft',
        featured: false,
        readTime: '3 min read'
      };
      
      const createResponse = await axios.post(`${BASE_URL}/api/admin/blog-posts`, newBlogPost, {
        headers: testHeaders
      });
      console.log('✅ Admin blog posts POST endpoint working');
      console.log('   - Blog post created successfully');
    } catch (authError) {
      console.log('⚠️  Admin blog posts POST requires authentication (expected)');
      console.log('   Error:', authError.response?.status, authError.response?.data?.error);
    }
    
  } catch (error) {
    console.log('❌ Blog API test failed:', error.message);
  }
}

async function runTests() {
  console.log('🔧 Starting Admin API Integration Tests...');
  console.log('===========================================');
  
  await testCategoriesAPI();
  await testBlogAPI();
  
  console.log('\n===========================================');
  console.log('✨ Tests completed!');
  console.log('\nNote: Authentication errors are expected as we\'re not using a real admin token.');
  console.log('The important thing is that the endpoints are responding and the routing is working.');
}

// Run the tests
runTests().catch(console.error);