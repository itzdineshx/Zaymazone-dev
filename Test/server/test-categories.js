#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testCategories() {
  try {
    console.log('Testing categories endpoint...');
    const response = await fetch(`${API_BASE}/products/categories`);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    if (response.ok) {
      console.log(`Found ${data.length} categories`);
    } else {
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testCategories();