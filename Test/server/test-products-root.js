#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testProductsRoot() {
  try {
    console.log('Testing products root endpoint...');
    const response = await fetch(`${API_BASE}/products/`);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testProductsRoot();