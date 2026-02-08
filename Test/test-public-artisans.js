import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

async function testPublicArtisansEndpoint() {
  try {
    console.log('Testing public /products/artisans endpoint...');
    
    const response = await axios.get(`${API_BASE_URL}/products/artisans`);
    
    console.log('Status:', response.status);
    console.log('Artisans count:', response.data.artisans?.length || 0);
    
    if (response.data.artisans?.length > 0) {
      console.log('Sample artisan:', response.data.artisans[0]);
    } else {
      console.log('No artisans returned');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }
}

testPublicArtisansEndpoint();