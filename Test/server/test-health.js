#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000';

async function testHealth() {
  try {
    console.log('Testing health endpoint...');
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();

    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testHealth();