#!/usr/bin/env node

/**
 * Zaymazone Payment Flow Test Script
 * Tests the complete payment flow including mock payments
 */

import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'http://localhost:4000';
const FRONTEND_URL = 'http://localhost:8081';

class PaymentTester {
  constructor() {
    this.authToken = null;
    this.testUser = {
      email: 'test@example.com',
      password: 'test123',
      name: 'Test User'
    };
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` })
      }
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error(`❌ Request failed: ${endpoint}`, error.message);
      return { status: 0, data: { error: error.message } };
    }
  }

  async testHealth() {
    console.log('\n🔍 Testing Backend Health...');
    const result = await this.makeRequest('/health');
    if (result.status === 200) {
      console.log('✅ Backend is healthy');
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  }

  async testUserRegistration() {
    console.log('\n👤 Testing User Registration...');
    const result = await this.makeRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(this.testUser)
    });

    if (result.status === 201) {
      console.log('✅ User registration successful');
      return true;
    } else {
      console.log('⚠️ User registration failed (might already exist):', result.data.error);
      return true; // Continue testing
    }
  }

  async testUserLogin() {
    console.log('\n🔐 Testing User Login...');
    const result = await this.makeRequest('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: this.testUser.email,
        password: this.testUser.password
      })
    });

    if (result.status === 200 && result.data.token) {
      this.authToken = result.data.token;
      console.log('✅ User login successful');
      return true;
    } else {
      console.log('❌ User login failed:', result.data.error);
      return false;
    }
  }

  async testProductsAPI() {
    console.log('\n📦 Testing Products API...');
    const result = await this.makeRequest('/api/products');

    if (result.status === 200 && result.data.products) {
      console.log(`✅ Products API working: ${result.data.products.length} products found`);
      this.sampleProduct = result.data.products[0];
      return true;
    } else {
      console.log('❌ Products API failed:', result.data.error);
      return false;
    }
  }

  async testAddToCart() {
    console.log('\n🛒 Testing Add to Cart...');
    if (!this.sampleProduct) {
      console.log('❌ No sample product available');
      return false;
    }

    const result = await this.makeRequest('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        productId: this.sampleProduct._id,
        quantity: 1
      })
    });

    if (result.status === 200) {
      console.log('✅ Add to cart successful');
      return true;
    } else {
      console.log('❌ Add to cart failed:', result.data.error);
      return false;
    }
  }

  async testCreateOrder() {
    console.log('\n📋 Testing Order Creation...');
    const result = await this.makeRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        shippingAddress: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '9876543210',
          address: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          pincode: '123456'
        },
        paymentMethod: 'cod'
      })
    });

    if (result.status === 201 && result.data.order) {
      console.log('✅ Order creation successful');
      this.testOrder = result.data.order;
      return true;
    } else {
      console.log('❌ Order creation failed:', result.data.error);
      return false;
    }
  }

  async testPaymentOrderCreation() {
    console.log('\n💳 Testing Payment Order Creation...');
    if (!this.testOrder) {
      console.log('❌ No test order available');
      return false;
    }

    const result = await this.makeRequest('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({
        orderId: this.testOrder._id
      })
    });

    if (result.status === 200 && result.data.paymentOrder) {
      console.log('✅ Payment order creation successful');
      console.log('🎭 Mock payment URL:', result.data.paymentOrder.paymentUrl);
      this.paymentOrder = result.data.paymentOrder;
      return true;
    } else {
      console.log('❌ Payment order creation failed:', result.data.error);
      return false;
    }
  }

  async testMockPaymentFlow() {
    console.log('\n🎭 Testing Mock Payment Flow...');
    if (!this.paymentOrder) {
      console.log('❌ No payment order available');
      return false;
    }

    // Simulate visiting the mock payment URL
    const mockUrl = this.paymentOrder.paymentUrl;
    console.log('🌐 Mock payment URL:', mockUrl);

    // Extract parameters from URL
    const url = new URL(mockUrl);
    const orderId = url.searchParams.get('orderId');
    const mockOrderId = url.searchParams.get('mockOrderId');
    const amount = url.searchParams.get('amount');

    if (!orderId || !mockOrderId || !amount) {
      console.log('❌ Invalid mock payment URL parameters');
      return false;
    }

    console.log('✅ Mock payment parameters extracted successfully');
    console.log('   Order ID:', orderId);
    console.log('   Mock Order ID:', mockOrderId);
    console.log('   Amount:', amount);

    return true;
  }

  async testPaymentVerification() {
    console.log('\n🔍 Testing Payment Verification...');
    if (!this.paymentOrder) {
      console.log('❌ No payment order available');
      return false;
    }

    const result = await this.makeRequest('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify({
        zohoPaymentId: this.paymentOrder.zohoOrderId,
        zohoOrderId: this.paymentOrder.zohoOrderId,
        paymentStatus: 'captured'
      })
    });

    if (result.status === 200 && result.data.success) {
      console.log('✅ Payment verification successful');
      return true;
    } else {
      console.log('❌ Payment verification failed:', result.data.error);
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Zaymazone Payment Flow Tests');
    console.log('=====================================');

    const tests = [
      { name: 'Backend Health', fn: this.testHealth.bind(this) },
      { name: 'User Registration', fn: this.testUserRegistration.bind(this) },
      { name: 'User Login', fn: this.testUserLogin.bind(this) },
      { name: 'Products API', fn: this.testProductsAPI.bind(this) },
      { name: 'Add to Cart', fn: this.testAddToCart.bind(this) },
      { name: 'Create Order', fn: this.testCreateOrder.bind(this) },
      { name: 'Payment Order Creation', fn: this.testPaymentOrderCreation.bind(this) },
      { name: 'Mock Payment Flow', fn: this.testMockPaymentFlow.bind(this) },
      { name: 'Payment Verification', fn: this.testPaymentVerification.bind(this) }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        const success = await test.fn();
        if (success) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${test.name} crashed:`, error.message);
        failed++;
      }
    }

    console.log('\n📊 Test Results Summary');
    console.log('======================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

    if (failed === 0) {
      console.log('\n🎉 All tests passed! Payment flow is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the implementation.');
    }

    return failed === 0;
  }
}

// Run the tests
const tester = new PaymentTester();
tester.runAllTests().catch(console.error);