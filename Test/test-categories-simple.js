import axios from 'axios';

async function testCategoriesEndpoint() {
  try {
    console.log('Testing GET /api/products/categories...');
    const response = await axios.get('http://localhost:4000/api/products/categories');
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error occurred:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data);
    console.log('Full error:', error.message);
  }
}

testCategoriesEndpoint();