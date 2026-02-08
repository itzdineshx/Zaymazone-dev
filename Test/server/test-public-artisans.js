#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testPublicArtisans() {
  try {
    console.log('Testing public artisans endpoint...');
    const response = await fetch(`${API_BASE}/products/artisans`);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    if (response.ok) {
      console.log(`Found ${data.length} artisans`);
      if (data.length > 0) {
        console.log('First artisan:', JSON.stringify(data[0], null, 2));
      }
    } else {
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPublicArtisans();