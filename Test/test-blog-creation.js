import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Test admin blog post creation
async function testBlogPostCreation() {
  try {
    // First, login as admin
    console.log('Logging in as admin...');
    const loginResponse = await axios.post(`${BASE_URL}/api/admin/auth/login`, {
      email: 'admin@zaymazone.com',
      password: 'admin123'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Admin login successful');

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    // Create a blog post with image URL
    console.log('Creating blog post...');
    const blogPost = {
      title: 'Test Blog Post with Image',
      excerpt: 'This is a test blog post created via API with an image',
      content: 'This is the full content of the test blog post. It includes some test content to verify that the blog post creation works properly with image URLs.',
      featuredImage: 'https://example.com/test-image.jpg', // Test with a URL
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      author: {
        name: 'Test Author',
        bio: 'A test author for blog posts',
        role: 'Content Creator'
      },
      category: 'Traditional Crafts',
      tags: ['test', 'blog', 'image'],
      status: 'draft',
      featured: false,
      readTime: '5 min read'
    };

    const createResponse = await axios.post(`${BASE_URL}/api/admin/blog-posts`, blogPost, { headers });
    console.log('✅ Blog post created successfully:', createResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
  }
}

testBlogPostCreation();