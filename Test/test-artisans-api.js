import axios from 'axios';

async function testArtisansAPI() {
  try {
    console.log('Testing artisans API...');
    const response = await axios.get('http://localhost:4000/api/products/artisans');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.artisans && response.data.artisans.length > 0) {
      console.log('First artisan:', JSON.stringify(response.data.artisans[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testArtisansAPI();