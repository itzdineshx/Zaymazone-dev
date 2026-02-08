import express from 'express';
import Order from '../models/Order.js';
import paytmPayments from '../services/paytmPayments.js';
import { authenticateToken } from '../middleware/firebase-auth.js';

const router = express.Router();

/**
 * POST /api/payments/paytm/create-transaction
 * Create Paytm payment transaction
 */
router.post('/create-transaction', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID is required' 
      });
    }

    // Get the order
    const order = await Order.findOne({ _id: orderId, userId })
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Check if payment is already processed
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ 
        success: false,
        error: `Payment already ${order.paymentStatus}` 
      });
    }

    // Prepare transaction data
    const transactionData = {
      orderId: order._id.toString(),
      amount: order.total,
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress.fullName,
      customerEmail: order.shippingAddress.email,
      customerPhone: order.shippingAddress.phone
    };

    // Create transaction in Paytm
    const paytmTransaction = await paytmPayments.createTransaction(transactionData);

    // Update order with Paytm details
    order.paytmOrderId = paytmTransaction.orderId;
    order.paytmTxnToken = paytmTransaction.txnToken;
    order.paymentStatus = 'processing';
    order.paymentGateway = 'paytm';
    await order.save();

    res.json({
      success: true,
      transaction: {
        txnToken: paytmTransaction.txnToken,
        orderId: paytmTransaction.orderId,
        amount: paytmTransaction.amount,
        paymentUrl: paytmTransaction.paymentUrl,
        mid: paytmTransaction.mid,
        isMock: paytmTransaction.isMock || false
      },
      message: paytmTransaction.isMock 
        ? 'Mock transaction created for testing' 
        : 'Transaction created successfully'
    });

  } catch (error) {
    console.error('Create Paytm transaction error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create payment transaction',
      message: error.message 
    });
  }
});

/**
 * POST /api/payments/paytm/verify
 * Verify Paytm payment transaction
 */
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { orderId, txnId, checksum } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID is required' 
      });
    }

    // Find the order
    const order = await Order.findOne({ 
      $or: [
        { orderNumber: orderId },
        { paytmOrderId: orderId }
      ],
      userId 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Verify transaction with Paytm
    const verificationResult = await paytmPayments.verifyTransaction(orderId);

    // Update order based on verification
    order.paytmTxnId = verificationResult.txnId;
    order.paytmBankTxnId = verificationResult.bankTxnId;
    order.paymentGatewayResponse = verificationResult.rawResponse || verificationResult;

    if (verificationResult.success && verificationResult.status === 'TXN_SUCCESS') {
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
      order.paymentMethod = `paytm_${verificationResult.paymentMode?.toLowerCase() || 'wallet'}`;
      await order.updateStatus('confirmed', 'Payment successful via Paytm');
      
      res.json({
        success: true,
        paymentStatus: 'paid',
        orderStatus: order.status,
        transaction: {
          txnId: verificationResult.txnId,
          amount: verificationResult.txnAmount,
          paymentMode: verificationResult.paymentMode,
          bankName: verificationResult.bankName
        },
        message: 'Payment verified successfully'
      });
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      
      res.status(400).json({
        success: false,
        paymentStatus: 'failed',
        orderStatus: order.status,
        message: verificationResult.message || 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Paytm payment verification error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify payment',
      message: error.message 
    });
  }
});

/**
 * POST /api/payments/paytm/callback
 * Handle Paytm payment callback
 */
router.post('/callback', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const callbackData = req.body;
    const checksum = callbackData.CHECKSUMHASH;
    
    // Remove checksum from params for verification
    delete callbackData.CHECKSUMHASH;

    console.log('📥 Paytm callback received:', {
      orderId: callbackData.ORDERID,
      status: callbackData.STATUS,
      txnId: callbackData.TXNID
    });

    // Verify checksum (skip in mock mode)
    if (!paytmPayments.isMockMode) {
      const isValid = paytmPayments.verifyWebhookSignature(callbackData, checksum);
      
      if (!isValid) {
        console.warn('⚠️  Invalid Paytm callback checksum');
        return res.status(400).send('Invalid checksum');
      }
    }

    // Find the order
    const order = await Order.findOne({ 
      $or: [
        { orderNumber: callbackData.ORDERID },
        { paytmOrderId: callbackData.ORDERID }
      ]
    });

    if (!order) {
      console.warn(`⚠️  Order not found for Paytm callback: ${callbackData.ORDERID}`);
      return res.status(404).send('Order not found');
    }

    // Update order based on payment status
    order.paytmTxnId = callbackData.TXNID;
    order.paytmBankTxnId = callbackData.BANKTXNID;
    order.paymentGatewayResponse = callbackData;

    if (callbackData.STATUS === 'TXN_SUCCESS') {
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
      order.paymentMethod = `paytm_${callbackData.PAYMENTMODE?.toLowerCase() || 'wallet'}`;
      await order.updateStatus('confirmed', 'Payment successful via Paytm');
      
      // Redirect to success page
      const successUrl = `${process.env.CLIENT_URL}/payment-success?payment_id=${callbackData.TXNID}&order_id=${callbackData.ORDERID}&status=success&gateway=paytm`;
      res.redirect(successUrl);
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      
      // Redirect to failure page
      const failureUrl = `${process.env.CLIENT_URL}/payment-failed?payment_id=${callbackData.TXNID}&order_id=${callbackData.ORDERID}&status=failed&gateway=paytm`;
      res.redirect(failureUrl);
    }

  } catch (error) {
    console.error('❌ Paytm callback processing error:', error);
    res.status(500).send('Callback processing failed');
  }
});

/**
 * POST /api/payments/paytm/webhook
 * Handle Paytm webhook notifications
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const webhookData = req.body;
    const checksum = req.headers['x-paytm-signature'];

    console.log('📥 Paytm webhook received:', {
      orderId: webhookData.ORDERID,
      event: webhookData.EVENT
    });

    // Validate webhook payload
    paytmPayments.validateWebhookPayload(webhookData);

    // Verify signature (skip in mock mode)
    if (!paytmPayments.isMockMode) {
      const isValid = paytmPayments.verifyWebhookSignature(webhookData, checksum);
      
      if (!isValid) {
        console.warn('⚠️  Invalid Paytm webhook signature');
        return res.status(400).json({ 
          success: false,
          error: 'Invalid signature' 
        });
      }
    }

    // Find the order
    const order = await Order.findOne({ 
      $or: [
        { orderNumber: webhookData.ORDERID },
        { paytmOrderId: webhookData.ORDERID }
      ]
    });

    if (!order) {
      console.warn(`⚠️  Order not found for webhook: ${webhookData.ORDERID}`);
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Process webhook events
    switch (webhookData.STATUS) {
      case 'TXN_SUCCESS':
        order.paymentStatus = 'paid';
        order.paytmTxnId = webhookData.TXNID;
        order.paytmBankTxnId = webhookData.BANKTXNID;
        order.paidAt = new Date();
        order.paymentGatewayResponse = webhookData;
        await order.updateStatus('confirmed', 'Payment captured via Paytm webhook');
        break;

      case 'TXN_FAILURE':
        order.paymentStatus = 'failed';
        order.paymentGatewayResponse = webhookData;
        await order.updateStatus('cancelled', 'Payment failed');
        break;

      case 'PENDING':
        order.paymentStatus = 'processing';
        order.paymentGatewayResponse = webhookData;
        break;

      default:
        console.log(`ℹ️  Unhandled webhook status: ${webhookData.STATUS}`);
    }

    await order.save();

    res.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process webhook',
      message: error.message 
    });
  }
});

/**
 * POST /api/payments/paytm/refund
 * Process refund through Paytm
 */
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { orderId, refundAmount, reason } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!orderId) {
      return res.status(400).json({ 
        success: false,
        error: 'Order ID is required' 
      });
    }

    // Find order
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Validate refund eligibility
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ 
        success: false,
        error: 'Order is not paid or already refunded' 
      });
    }

    if (!order.paytmTxnId) {
      return res.status(400).json({ 
        success: false,
        error: 'No Paytm transaction ID found for refund' 
      });
    }

    // Prepare refund data
    const refundData = {
      amount: refundAmount || order.total,
      orderId: order.orderNumber || order.paytmOrderId,
      reason: reason || 'Customer requested refund'
    };

    // Process refund through Paytm
    const refundResult = await paytmPayments.processRefund(order.paytmTxnId, refundData);

    if (refundResult.success) {
      // Update order
      order.paymentStatus = 'refunded';
      order.refundedAt = new Date();
      order.refundAmount = refundData.amount;
      order.refundReason = refundData.reason;
      order.paytmRefundId = refundResult.refundId;
      await order.updateStatus('refunded', `Refund processed: ₹${refundData.amount}`);

      res.json({
        success: true,
        refund: {
          refundId: refundResult.refundId,
          amount: refundData.amount,
          status: refundResult.status
        },
        message: refundResult.isMock 
          ? 'Mock refund processed for testing' 
          : 'Refund initiated successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Refund failed',
        message: refundResult.message
      });
    }

  } catch (error) {
    console.error('Paytm refund processing error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process refund',
      message: error.message 
    });
  }
});

/**
 * GET /api/payments/paytm/status
 * Get Paytm configuration status
 */
router.get('/status', (req, res) => {
  try {
    const status = paytmPayments.getConfigurationStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Get Paytm status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get Paytm status' 
    });
  }
});

/**
 * GET /api/payments/paytm/methods
 * Get Paytm payment methods
 */
router.get('/methods', (req, res) => {
  try {
    const methods = paytmPayments.getPaymentMethods();
    res.json({
      success: true,
      paymentMethods: methods
    });
  } catch (error) {
    console.error('Get Paytm methods error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get payment methods' 
    });
  }
});

export default router;
