import crypto from 'crypto';
import fetch from 'node-fetch';

/**
 * Paytm Payment Gateway Integration Service
 * 
 * Features:
 * - Initiate Payment Transaction
 * - Verify Payment Status
 * - Process Refunds
 * - Webhook Handling
 * - Checksum Generation & Verification
 * 
 * Paytm Payment Flow:
 * 1. Create payment order and generate checksum
 * 2. Redirect customer to Paytm payment page
 * 3. Customer completes payment
 * 4. Paytm sends webhook notification
 * 5. Verify payment status and update order
 */

class PaytmPaymentsService {
  constructor() {
    // Paytm Configuration
    this.merchantId = process.env.PAYTM_MERCHANT_ID || 'MERCHANT_ID_PLACEHOLDER';
    this.merchantKey = process.env.PAYTM_MERCHANT_KEY || 'MERCHANT_KEY_PLACEHOLDER';
    this.websiteName = process.env.PAYTM_WEBSITE || 'WEBSTAGING'; // WEBSTAGING for staging, DEFAULT for production
    this.channelId = process.env.PAYTM_CHANNEL_ID || 'WEB';
    this.industryType = process.env.PAYTM_INDUSTRY_TYPE || 'Retail';
    
    // Environment-based URLs
    const isProduction = process.env.NODE_ENV === 'production' && process.env.PAYTM_MERCHANT_ID;
    
    // Staging URLs (for testing without API keys)
    this.stagingUrl = 'https://securegw-stage.paytm.in';
    
    // Production URLs (use when you have real credentials)
    this.productionUrl = 'https://securegw.paytm.in';
    
    // Current base URL
    this.baseURL = isProduction ? this.productionUrl : this.stagingUrl;
    
    // API endpoints
    this.endpoints = {
      initiateTransaction: '/theia/api/v1/initiateTransaction',
      transactionStatus: '/v3/order/status',
      refund: '/refund/apply',
      refundStatus: '/v2/refund/status'
    };
    
    // Callback URLs
    this.callbackUrl = process.env.PAYTM_CALLBACK_URL || `${process.env.SERVER_URL}/api/payments/paytm/callback`;
    
    // Mock mode indicator
    this.isMockMode = !process.env.PAYTM_MERCHANT_ID || process.env.PAYTM_MERCHANT_ID === 'MERCHANT_ID_PLACEHOLDER';
    
    if (this.isMockMode) {
      console.log('⚠️  Paytm Payments running in MOCK MODE (no API keys configured)');
    }
  }

  /**
   * Generate Paytm checksum
   * @param {Object} params - Payment parameters
   * @param {string} merchantKey - Merchant key
   * @returns {string} - Generated checksum
   */
  generateChecksum(params, merchantKey) {
    try {
      // Sort parameters
      const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = params[key];
          return acc;
        }, {});

      // Create parameter string
      const paramString = Object.entries(sortedParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      // Generate checksum using SHA256
      const checksum = crypto
        .createHmac('sha256', merchantKey)
        .update(paramString)
        .digest('hex');

      return checksum;
    } catch (error) {
      console.error('Checksum generation error:', error);
      throw new Error('Failed to generate checksum');
    }
  }

  /**
   * Verify Paytm checksum
   * @param {Object} params - Payment parameters
   * @param {string} checksum - Received checksum
   * @param {string} merchantKey - Merchant key
   * @returns {boolean} - Verification result
   */
  verifyChecksum(params, checksum, merchantKey) {
    try {
      const generatedChecksum = this.generateChecksum(params, merchantKey);
      return generatedChecksum === checksum;
    } catch (error) {
      console.error('Checksum verification error:', error);
      return false;
    }
  }

  /**
   * Create a payment transaction
   * @param {Object} orderData - Order details
   * @returns {Object} - Transaction details
   */
  async createTransaction(orderData) {
    try {
      // Mock response if no API keys
      if (this.isMockMode) {
        return this.mockCreateTransaction(orderData);
      }

      const {
        orderId,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        orderNumber
      } = orderData;

      // Generate unique transaction ID
      const txnToken = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

      // Payment parameters
      const paytmParams = {
        body: {
          requestType: 'Payment',
          mid: this.merchantId,
          websiteName: this.websiteName,
          orderId: orderNumber,
          txnAmount: {
            value: amount.toString(),
            currency: 'INR'
          },
          userInfo: {
            custId: orderId,
            mobile: customerPhone,
            email: customerEmail,
            firstName: customerName.split(' ')[0],
            lastName: customerName.split(' ').slice(1).join(' ') || ''
          },
          callbackUrl: this.callbackUrl,
          channelId: this.channelId,
          industryType: this.industryType
        },
        head: {
          signature: ''
        }
      };

      // Generate checksum
      const checksumParams = {
        ...paytmParams.body,
        orderId: orderNumber,
        amount: amount.toString()
      };
      const checksum = this.generateChecksum(checksumParams, this.merchantKey);
      paytmParams.head.signature = checksum;

      // Call Paytm API to initiate transaction
      const response = await fetch(`${this.baseURL}${this.endpoints.initiateTransaction}?mid=${this.merchantId}&orderId=${orderNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paytmParams)
      });

      if (!response.ok) {
        throw new Error(`Paytm API error: ${response.statusText}`);
      }

      const responseData = await response.json();

      if (responseData.body.resultInfo.resultStatus === 'S') {
        return {
          success: true,
          txnToken: responseData.body.txnToken,
          orderId: orderNumber,
          amount: amount,
          paymentUrl: `${this.baseURL}/theia/api/v1/showPaymentPage?mid=${this.merchantId}&orderId=${orderNumber}`,
          mid: this.merchantId
        };
      } else {
        throw new Error(responseData.body.resultInfo.resultMsg);
      }

    } catch (error) {
      console.error('Paytm transaction creation error:', error);
      throw error;
    }
  }

  /**
   * Mock transaction creation (for development without API keys)
   */
  mockCreateTransaction(orderData) {
    const mockTxnToken = `MOCK_TXN_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const mockOrderId = orderData.orderNumber || `MOCK_ORD_${Date.now()}`;

    console.log('🎭 Creating MOCK Paytm transaction:', {
      orderId: mockOrderId,
      amount: orderData.amount,
      customer: orderData.customerName
    });

    return {
      success: true,
      txnToken: mockTxnToken,
      orderId: mockOrderId,
      amount: orderData.amount,
      paymentUrl: `${process.env.CLIENT_URL}/mock-payment/paytm?orderId=${orderData.orderId}&mockOrderId=${mockOrderId}&amount=${orderData.amount}&txnToken=${mockTxnToken}`,
      mid: this.merchantId,
      isMock: true
    };
  }

  /**
   * Verify transaction status
   * @param {string} orderId - Order ID
   * @returns {Object} - Transaction status
   */
  async verifyTransaction(orderId) {
    try {
      // Mock response if no API keys
      if (this.isMockMode) {
        return this.mockVerifyTransaction(orderId);
      }

      const paytmParams = {
        body: {
          mid: this.merchantId,
          orderId: orderId
        },
        head: {
          signature: ''
        }
      };

      // Generate checksum
      const checksum = this.generateChecksum(paytmParams.body, this.merchantKey);
      paytmParams.head.signature = checksum;

      const response = await fetch(`${this.baseURL}${this.endpoints.transactionStatus}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paytmParams)
      });

      if (!response.ok) {
        throw new Error(`Paytm API error: ${response.statusText}`);
      }

      const responseData = await response.json();

      return {
        success: responseData.body.resultInfo.resultStatus === 'TXN_SUCCESS',
        status: responseData.body.resultInfo.resultStatus,
        txnId: responseData.body.txnId,
        bankTxnId: responseData.body.bankTxnId,
        orderId: responseData.body.orderId,
        txnAmount: responseData.body.txnAmount,
        txnDate: responseData.body.txnDate,
        paymentMode: responseData.body.paymentMode,
        bankName: responseData.body.bankName,
        message: responseData.body.resultInfo.resultMsg,
        rawResponse: responseData.body
      };

    } catch (error) {
      console.error('Paytm transaction verification error:', error);
      throw error;
    }
  }

  /**
   * Mock transaction verification
   */
  mockVerifyTransaction(orderId) {
    console.log('🎭 Verifying MOCK Paytm transaction:', orderId);
    
    // 90% success rate for testing
    const isSuccess = Math.random() > 0.1;

    return {
      success: isSuccess,
      status: isSuccess ? 'TXN_SUCCESS' : 'TXN_FAILURE',
      txnId: `MOCK_TXN_${Date.now()}`,
      bankTxnId: `MOCK_BANK_${Date.now()}`,
      orderId: orderId,
      txnAmount: '1000.00',
      txnDate: new Date().toISOString(),
      paymentMode: 'MOCK_UPI',
      bankName: 'MOCK_BANK',
      message: isSuccess ? 'Transaction successful' : 'Transaction failed',
      isMock: true
    };
  }

  /**
   * Process refund
   * @param {string} txnId - Transaction ID
   * @param {Object} refundData - Refund details
   * @returns {Object} - Refund result
   */
  async processRefund(txnId, refundData) {
    try {
      // Mock response if no API keys
      if (this.isMockMode) {
        return this.mockProcessRefund(txnId, refundData);
      }

      const refundId = `REFUND_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const paytmParams = {
        body: {
          mid: this.merchantId,
          txnType: 'REFUND',
          orderId: refundData.orderId,
          txnId: txnId,
          refId: refundId,
          refundAmount: refundData.amount.toString()
        },
        head: {
          signature: ''
        }
      };

      // Generate checksum
      const checksum = this.generateChecksum(paytmParams.body, this.merchantKey);
      paytmParams.head.signature = checksum;

      const response = await fetch(`${this.baseURL}${this.endpoints.refund}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paytmParams)
      });

      if (!response.ok) {
        throw new Error(`Paytm API error: ${response.statusText}`);
      }

      const responseData = await response.json();

      return {
        success: responseData.body.resultInfo.resultStatus === 'TXN_SUCCESS',
        refundId: refundId,
        txnId: txnId,
        orderId: refundData.orderId,
        refundAmount: refundData.amount,
        status: responseData.body.resultInfo.resultStatus,
        message: responseData.body.resultInfo.resultMsg,
        rawResponse: responseData.body
      };

    } catch (error) {
      console.error('Paytm refund processing error:', error);
      throw error;
    }
  }

  /**
   * Mock refund processing
   */
  mockProcessRefund(txnId, refundData) {
    console.log('🎭 Processing MOCK Paytm refund:', {
      txnId,
      orderId: refundData.orderId,
      amount: refundData.amount
    });

    return {
      success: true,
      refundId: `MOCK_REFUND_${Date.now()}`,
      txnId: txnId,
      orderId: refundData.orderId,
      refundAmount: refundData.amount,
      status: 'TXN_SUCCESS',
      message: 'Refund initiated successfully',
      isMock: true
    };
  }

  /**
   * Verify webhook signature
   * @param {Object} params - Webhook parameters
   * @param {string} checksum - Received checksum
   * @returns {boolean} - Verification result
   */
  verifyWebhookSignature(params, checksum) {
    try {
      return this.verifyChecksum(params, checksum, this.merchantKey);
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  /**
   * Get available payment methods
   * @returns {Array} - List of payment methods
   */
  getPaymentMethods() {
    return [
      {
        id: 'paytm',
        name: 'Paytm',
        description: 'Pay using Paytm Wallet',
        logo: '/assets/payment-logos/paytm.png',
        enabled: !this.isMockMode
      },
      {
        id: 'paytm_upi',
        name: 'UPI via Paytm',
        description: 'Pay using UPI (Google Pay, PhonePe, Paytm)',
        logo: '/assets/payment-logos/upi.png',
        enabled: !this.isMockMode
      },
      {
        id: 'paytm_card',
        name: 'Cards via Paytm',
        description: 'Credit/Debit Cards',
        logo: '/assets/payment-logos/cards.png',
        enabled: !this.isMockMode
      },
      {
        id: 'paytm_netbanking',
        name: 'Net Banking via Paytm',
        description: 'All major banks supported',
        logo: '/assets/payment-logos/netbanking.png',
        enabled: !this.isMockMode
      }
    ];
  }

  /**
   * Validate webhook payload
   * @param {Object} payload - Webhook payload
   * @throws {Error} - If validation fails
   */
  validateWebhookPayload(payload) {
    const requiredFields = ['ORDERID', 'STATUS', 'TXNID', 'TXNAMOUNT'];
    
    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  /**
   * Check if Paytm is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return !this.isMockMode && 
           this.merchantId !== 'MERCHANT_ID_PLACEHOLDER' &&
           this.merchantKey !== 'MERCHANT_KEY_PLACEHOLDER';
  }

  /**
   * Get configuration status
   * @returns {Object}
   */
  getConfigurationStatus() {
    return {
      configured: this.isConfigured(),
      mockMode: this.isMockMode,
      environment: process.env.NODE_ENV || 'development',
      baseURL: this.baseURL,
      merchantId: this.isMockMode ? 'NOT_CONFIGURED' : this.merchantId.substring(0, 4) + '***'
    };
  }
}

// Export singleton instance
const paytmPayments = new PaytmPaymentsService();
export default paytmPayments;
