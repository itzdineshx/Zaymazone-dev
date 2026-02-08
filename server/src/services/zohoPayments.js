/**
 * Zoho Payments Integration Service
 * Handles payment processing with Zoho Payments Gateway
 */

class ZohoPaymentsService {
  constructor() {
    this.baseURL = process.env.ZOHO_PAYMENTS_BASE_URL || 'https://payments.zoho.com/api/v1';
    this.clientId = process.env.ZOHO_PAYMENTS_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_PAYMENTS_CLIENT_SECRET;
    this.webhookSecret = process.env.ZOHO_PAYMENTS_WEBHOOK_SECRET;

    // Environment check
    this.isProduction = process.env.NODE_ENV === 'production';
    if (!this.isProduction) {
      this.baseURL = process.env.ZOHO_PAYMENTS_SANDBOX_URL || 'https://payments-sandbox.zoho.com/api/v1';
    }

    // Check if we have real credentials or should use mock mode
    this.useMock = !this.clientId || !this.clientSecret || process.env.USE_MOCK_PAYMENTS === 'true';
    if (this.useMock) {
      console.log('🔧 Using Mock Zoho Payments for development/testing');
    }
  }

  /**
   * Generate access token for Zoho Payments API
   */
  async getAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/oauth/v2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
          scope: 'ZohoPayments.payments.CREATE,ZohoPayments.payments.READ'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Zoho Payments token error:', error);
      throw new Error('Failed to authenticate with Zoho Payments');
    }
  }

  /**
   * Create a payment order in Zoho Payments (with mock support)
   */
  async createPaymentOrder(orderData) {
    if (this.useMock) {
      return this.createMockPaymentOrder(orderData);
    }

    try {
      const accessToken = await this.getAccessToken();

      const paymentOrderData = {
        amount: orderData.amount * 100, // Convert to paisa/cents
        currency: orderData.currency || 'INR',
        receipt: orderData.orderNumber,
        payment_capture: true,
        notes: {
          order_id: orderData.orderId,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone
        },
        theme: {
          color: '#3399cc'
        },
        customer: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          contact: orderData.customerPhone
        },
        notify: {
          sms: true,
          email: true
        },
        reminder_enable: true,
        callback_url: `${process.env.CLIENT_URL}/payment/callback`,
        callback_method: 'get'
      };

      const response = await fetch(`${this.baseURL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentOrderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Zoho Payments API error: ${errorData.message || response.statusText}`);
      }

      const responseData = await response.json();

      return {
        zohoOrderId: responseData.id,
        amount: responseData.amount,
        currency: responseData.currency,
        status: responseData.status,
        paymentUrl: responseData.short_url || responseData.payment_url,
        receipt: responseData.receipt
      };

    } catch (error) {
      console.error('Create Zoho payment order error:', error);
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  /**
   * Create a mock payment order for development/testing
   */
  createMockPaymentOrder(orderData) {
    console.log('🎭 Creating mock payment order:', orderData);

    // Generate a mock order ID
    const mockOrderId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mock payment URL that simulates the payment flow
    const mockPaymentUrl = `${process.env.CLIENT_URL || 'http://localhost:8080'}/mock-payment?orderId=${orderData.orderId}&mockOrderId=${mockOrderId}&amount=${orderData.amount}`;

    return {
      zohoOrderId: mockOrderId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      status: 'created',
      paymentUrl: mockPaymentUrl,
      receipt: orderData.orderNumber,
      isMock: true
    };
  }

  /**
   * Verify payment signature from Zoho webhook
   */
  verifyPaymentSignature(payload, signature) {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      );
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  /**
   * Get payment details from Zoho
   */
  async getPaymentDetails(paymentId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseURL}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment details: ${response.statusText}`);
      }

      const paymentData = await response.json();
      
      return {
        id: paymentData.id,
        amount: paymentData.amount / 100, // Convert back to rupees
        currency: paymentData.currency,
        status: paymentData.status,
        method: paymentData.method,
        orderId: paymentData.order_id,
        receipt: paymentData.receipt,
        createdAt: paymentData.created_at,
        fee: paymentData.fee / 100,
        tax: paymentData.tax / 100
      };

    } catch (error) {
      console.error('Get payment details error:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  /**
   * Process refund through Zoho Payments
   */
  async processRefund(paymentId, refundData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const refundPayload = {
        amount: refundData.amount * 100, // Convert to paisa
        receipt: refundData.receipt || `refund_${Date.now()}`,
        notes: {
          reason: refundData.reason || 'Order cancellation',
          order_id: refundData.orderId
        }
      };

      const response = await fetch(`${this.baseURL}/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refundPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Refund failed: ${errorData.message || response.statusText}`);
      }

      const refundResponse = await response.json();
      
      return {
        refundId: refundResponse.id,
        amount: refundResponse.amount / 100,
        status: refundResponse.status,
        receipt: refundResponse.receipt,
        createdAt: refundResponse.created_at
      };

    } catch (error) {
      console.error('Process refund error:', error);
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  /**
   * Get supported payment methods
   */
  getPaymentMethods() {
    return [
      {
        id: 'zoho_card',
        name: 'Credit/Debit Card',
        description: 'Pay using Visa, MasterCard, RuPay',
        fees: '2.9% + ₹3'
      },
      {
        id: 'zoho_upi',
        name: 'UPI',
        description: 'Pay using Google Pay, PhonePe, Paytm',
        fees: '₹2 per transaction'
      },
      {
        id: 'zoho_netbanking',
        name: 'Net Banking',
        description: 'Pay directly from your bank account',
        fees: '₹15 per transaction'
      },
      {
        id: 'zoho_wallet',
        name: 'Wallet',
        description: 'Pay using digital wallets',
        fees: '2.4% + ₹3'
      }
    ];
  }

  /**
   * Validate webhook payload
   */
  validateWebhookPayload(payload) {
    const requiredFields = ['event', 'payment_id', 'order_id', 'status'];
    
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return true;
  }
}

export default new ZohoPaymentsService();