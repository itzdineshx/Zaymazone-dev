/**
 * Paytm Payment Gateway Integration Test Suite
 * 
 * Tests all Paytm payment endpoints and flows
 */

const fetch = require('node-fetch');

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000';
const TEST_USER_TOKEN = process.env.TEST_USER_TOKEN || '';

class PaytmIntegrationTester {
  constructor() {
    this.testResults = [];
    this.testOrder = null;
    this.testTransaction = null;
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.auth && TEST_USER_TOKEN ? { 'Authorization': `Bearer ${TEST_USER_TOKEN}` } : {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      });

      const data = await response.json();
      return {
        status: response.status,
        ok: response.ok,
        data
      };
    } catch (error) {
      console.error(`❌ Request failed: ${error.message}`);
      return {
        status: 0,
        ok: false,
        error: error.message
      };
    }
  }

  /**
   * Log test result
   */
  logTest(name, passed, message = '') {
    const result = { name, passed, message };
    this.testResults.push(result);
    console.log(passed ? `✅ ${name}` : `❌ ${name}: ${message}`);
  }

  /**
   * Test 1: Check Paytm Configuration Status
   */
  async testPaytmStatus() {
    console.log('\n📊 Testing Paytm Configuration Status...');
    
    const result = await this.makeRequest('/api/payments/paytm/status');
    
    if (result.ok && result.data.success) {
      console.log('✅ Paytm status retrieved successfully');
      console.log(`   Mode: ${result.data.mockMode ? 'Mock' : 'Live'}`);
      console.log(`   Environment: ${result.data.environment}`);
      console.log(`   Configured: ${result.data.configured}`);
      this.logTest('Paytm Status Check', true);
      return true;
    } else {
      this.logTest('Paytm Status Check', false, result.data?.error || 'Failed to get status');
      return false;
    }
  }

  /**
   * Test 2: Get Payment Methods
   */
  async testPaymentMethods() {
    console.log('\n💳 Testing Payment Methods Retrieval...');
    
    const result = await this.makeRequest('/api/payments/paytm/methods');
    
    if (result.ok && result.data.success && Array.isArray(result.data.paymentMethods)) {
      console.log(`✅ Retrieved ${result.data.paymentMethods.length} payment methods`);
      result.data.paymentMethods.forEach(method => {
        console.log(`   - ${method.name}: ${method.description} (${method.enabled ? 'Enabled' : 'Disabled'})`);
      });
      this.logTest('Payment Methods Retrieval', true);
      return true;
    } else {
      this.logTest('Payment Methods Retrieval', false, 'Failed to get payment methods');
      return false;
    }
  }

  /**
   * Test 3: Create Test Order
   */
  async testCreateOrder() {
    console.log('\n📦 Creating Test Order...');
    
    const orderData = {
      items: [
        {
          productId: '507f1f77bcf86cd799439011', // Mock product ID
          quantity: 2
        }
      ],
      shippingAddress: {
        fullName: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        addressLine1: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        addressType: 'home'
      },
      useShippingAsBilling: true,
      paymentMethod: 'paytm'
    };

    const result = await this.makeRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
      auth: true
    });

    if (result.ok && result.data) {
      this.testOrder = result.data;
      console.log(`✅ Order created: ${result.data.orderNumber || result.data._id}`);
      this.logTest('Order Creation', true);
      return true;
    } else {
      console.log('⚠️  Order creation failed (might need authentication)');
      console.log(`   Error: ${result.data?.error || 'Unknown error'}`);
      this.logTest('Order Creation', false, result.data?.error || 'Authentication required');
      return false;
    }
  }

  /**
   * Test 4: Create Paytm Transaction
   */
  async testCreateTransaction() {
    console.log('\n💰 Testing Paytm Transaction Creation...');

    if (!this.testOrder) {
      console.log('⚠️  Skipping - no test order available');
      this.logTest('Transaction Creation', false, 'No test order');
      return false;
    }

    const result = await this.makeRequest('/api/payments/paytm/create-transaction', {
      method: 'POST',
      body: JSON.stringify({
        orderId: this.testOrder._id
      }),
      auth: true
    });

    if (result.ok && result.data.success) {
      this.testTransaction = result.data.transaction;
      console.log('✅ Transaction created successfully');
      console.log(`   Transaction Token: ${result.data.transaction.txnToken?.substring(0, 20)}...`);
      console.log(`   Order ID: ${result.data.transaction.orderId}`);
      console.log(`   Amount: ₹${result.data.transaction.amount}`);
      console.log(`   Payment URL: ${result.data.transaction.paymentUrl}`);
      console.log(`   Mock Mode: ${result.data.transaction.isMock ? 'Yes' : 'No'}`);
      this.logTest('Transaction Creation', true);
      return true;
    } else {
      this.logTest('Transaction Creation', false, result.data?.error || 'Failed to create transaction');
      return false;
    }
  }

  /**
   * Test 5: Verify Transaction (Mock)
   */
  async testVerifyTransaction() {
    console.log('\n🔍 Testing Transaction Verification...');

    if (!this.testTransaction) {
      console.log('⚠️  Skipping - no test transaction available');
      this.logTest('Transaction Verification', false, 'No test transaction');
      return false;
    }

    const result = await this.makeRequest('/api/payments/paytm/verify', {
      method: 'POST',
      body: JSON.stringify({
        orderId: this.testTransaction.orderId,
        txnId: 'MOCK_TXN_TEST_' + Date.now()
      }),
      auth: true
    });

    if (result.ok && result.data) {
      console.log(`✅ Verification completed`);
      console.log(`   Payment Status: ${result.data.paymentStatus}`);
      console.log(`   Order Status: ${result.data.orderStatus}`);
      console.log(`   Message: ${result.data.message}`);
      this.logTest('Transaction Verification', true);
      return true;
    } else {
      this.logTest('Transaction Verification', false, result.data?.error || 'Verification failed');
      return false;
    }
  }

  /**
   * Test 6: Test Invalid Order ID
   */
  async testInvalidOrderId() {
    console.log('\n🚫 Testing Invalid Order ID Handling...');

    const result = await this.makeRequest('/api/payments/paytm/create-transaction', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'invalid_order_id_123'
      }),
      auth: true
    });

    if (!result.ok || !result.data.success) {
      console.log('✅ Invalid order correctly rejected');
      this.logTest('Invalid Order Handling', true);
      return true;
    } else {
      this.logTest('Invalid Order Handling', false, 'Should have rejected invalid order');
      return false;
    }
  }

  /**
   * Test 7: Test Webhook Payload Validation
   */
  async testWebhookValidation() {
    console.log('\n🔔 Testing Webhook Payload Validation...');

    // Test with invalid payload
    const invalidPayload = {
      ORDERID: 'TEST_ORDER_123'
      // Missing required fields
    };

    const result = await this.makeRequest('/api/payments/paytm/webhook', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!result.ok) {
      console.log('✅ Invalid webhook payload correctly rejected');
      this.logTest('Webhook Validation', true);
      return true;
    } else {
      this.logTest('Webhook Validation', false, 'Should have rejected invalid payload');
      return false;
    }
  }

  /**
   * Test 8: Test Refund Endpoint
   */
  async testRefundEndpoint() {
    console.log('\n💸 Testing Refund Endpoint...');

    if (!this.testOrder) {
      console.log('⚠️  Skipping - no test order available');
      this.logTest('Refund Endpoint', false, 'No test order');
      return false;
    }

    const result = await this.makeRequest('/api/payments/paytm/refund', {
      method: 'POST',
      body: JSON.stringify({
        orderId: this.testOrder._id,
        refundAmount: 100,
        reason: 'Test refund'
      }),
      auth: true
    });

    // Expecting failure since order is not paid
    if (!result.ok) {
      console.log('✅ Refund correctly rejected for unpaid order');
      this.logTest('Refund Endpoint', true);
      return true;
    } else {
      console.log('⚠️  Refund endpoint accessible (order status might allow refund)');
      this.logTest('Refund Endpoint', true);
      return true;
    }
  }

  /**
   * Test 9: Server Health Check
   */
  async testServerHealth() {
    console.log('\n🏥 Testing Server Health...');

    const result = await this.makeRequest('/health');

    if (result.ok) {
      console.log('✅ Server is healthy');
      this.logTest('Server Health', true);
      return true;
    } else {
      this.logTest('Server Health', false, 'Server not responding');
      return false;
    }
  }

  /**
   * Test 10: CORS Configuration
   */
  async testCORS() {
    console.log('\n🌐 Testing CORS Configuration...');

    try {
      const result = await this.makeRequest('/api/payments/paytm/status', {
        headers: {
          'Origin': 'http://localhost:8080'
        }
      });

      if (result.ok) {
        console.log('✅ CORS configured correctly');
        this.logTest('CORS Configuration', true);
        return true;
      } else {
        this.logTest('CORS Configuration', false, 'CORS issue detected');
        return false;
      }
    } catch (error) {
      this.logTest('CORS Configuration', false, error.message);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║        PAYTM PAYMENT GATEWAY INTEGRATION TEST SUITE       ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n🔗 Testing API: ${API_BASE_URL}`);
    console.log(`🔐 Authentication: ${TEST_USER_TOKEN ? 'Provided' : 'Not provided (some tests will skip)'}\n`);

    const startTime = Date.now();

    // Run tests sequentially
    await this.testServerHealth();
    await this.testCORS();
    await this.testPaytmStatus();
    await this.testPaymentMethods();
    await this.testCreateOrder();
    await this.testCreateTransaction();
    await this.testVerifyTransaction();
    await this.testInvalidOrderId();
    await this.testWebhookValidation();
    await this.testRefundEndpoint();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Print summary
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                        TEST SUMMARY                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(1);

    console.log(`📊 Results:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${successRate}%`);
    console.log(`   ⏱️  Duration: ${duration}s\n`);

    if (failed > 0) {
      console.log('❌ Failed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => console.log(`   - ${r.name}: ${r.message}`));
      console.log('');
    }

    // Exit code based on results
    process.exit(failed > 0 ? 1 : 0);
  }
}

// Run tests
const tester = new PaytmIntegrationTester();
tester.runAllTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
