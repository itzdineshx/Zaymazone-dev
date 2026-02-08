import axios from 'axios';

async function testServerHealth() {
  try {
    console.log('Testing server health...');
    
    // Test if server is responding at all
    const response = await axios.get('http://localhost:4000/api/products');
    console.log('✅ Products endpoint reachable');
    console.log('Status:', response.status);
    console.log('Data length:', JSON.stringify(response.data).length);
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
  }
}

testServerHealth();