import express from 'express';
import Order from '../models/Order.js';
import zohoPayments from '../services/zohoPayments.js';
import { authenticateToken } from '../middleware/firebase-auth.js';

const router = express.Router();

/**
 * POST /api/payments/create-order
 * Create payment order for Zoho Payments
 */
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    // Get the order
    const order = await Order.findOne({ _id: orderId, userId })
      .populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ error: 'Payment already processed' });
    }

    // Create payment order in Zoho
    const paymentOrderData = {
      amount: order.total,
      currency: 'INR',
      orderNumber: order.orderNumber,
      orderId: order._id.toString(),
      customerName: order.shippingAddress.fullName,
      customerEmail: order.shippingAddress.email,
      customerPhone: order.shippingAddress.phone
    };

    const zohoOrder = await zohoPayments.createPaymentOrder(paymentOrderData);

    // Update order with Zoho order details
    order.zohoOrderId = zohoOrder.zohoOrderId;
    order.paymentStatus = 'processing';
    await order.save();

    res.json({
      success: true,
      paymentOrder: {
        zohoOrderId: zohoOrder.zohoOrderId,
        amount: zohoOrder.amount,
        currency: zohoOrder.currency,
        paymentUrl: zohoOrder.paymentUrl,
        orderNumber: order.orderNumber
      }
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment order',
      message: error.message 
    });
  }
});

/**
 * POST /api/payments/verify
 * Verify payment completion
 */
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { zohoPaymentId, zohoOrderId, paymentStatus } = req.body;
    const userId = req.user._id;

    if (!zohoPaymentId || !zohoOrderId) {
      return res.status(400).json({ error: 'Payment ID and Order ID are required' });
    }

    // Find the order
    const order = await Order.findOne({ zohoOrderId, userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get payment details from Zoho
    const paymentDetails = await zohoPayments.getPaymentDetails(zohoPaymentId);

    // Update order with payment information
    order.zohoPaymentId = zohoPaymentId;
    order.paymentGatewayResponse = paymentDetails;

    if (paymentDetails.status === 'captured' || paymentDetails.status === 'authorized') {
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
      await order.updateStatus('confirmed', 'Payment successful');
    } else if (paymentDetails.status === 'failed') {
      order.paymentStatus = 'failed';
    } else {
      order.paymentStatus = 'processing';
    }

    await order.save();

    res.json({
      success: true,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      message: order.paymentStatus === 'paid' ? 'Payment successful' : 'Payment verification completed'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      message: error.message 
    });
  }
});

/**
 * POST /api/payments/webhook
 * Handle Zoho Payments webhooks
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-zoho-signature'];
    const payload = JSON.parse(req.body.toString());

    // Verify webhook signature
    if (!zohoPayments.verifyPaymentSignature(payload, signature)) {
      console.warn('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Validate payload
    zohoPayments.validateWebhookPayload(payload);

    const { event, payment_id, order_id, status } = payload;

    // Find the order
    const order = await Order.findOne({ zohoOrderId: order_id });
    if (!order) {
      console.warn(`Order not found for Zoho order ID: ${order_id}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    // Process different webhook events
    switch (event) {
      case 'payment.captured':
        order.paymentStatus = 'paid';
        order.zohoPaymentId = payment_id;
        order.paidAt = new Date();
        order.paymentGatewayResponse = payload;
        await order.updateStatus('confirmed', 'Payment captured successfully');
        break;

      case 'payment.failed':
        order.paymentStatus = 'failed';
        order.paymentGatewayResponse = payload;
        await order.updateStatus('cancelled', 'Payment failed');
        break;

      case 'payment.authorized':
        order.paymentStatus = 'processing';
        order.zohoPaymentId = payment_id;
        order.paymentGatewayResponse = payload;
        break;

      case 'refund.processed':
        order.paymentStatus = 'refunded';
        order.refundedAt = new Date();
        order.refundAmount = payload.refund_amount / 100; // Convert from paisa
        order.refundReason = payload.notes?.reason || 'Refund processed';
        await order.updateStatus('refunded', 'Refund processed successfully');
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    await order.save();

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process webhook',
      message: error.message 
    });
  }
});

/**
 * POST /api/payments/refund
 * Process refund through Zoho Payments
 */
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { orderId, refundAmount, reason } = req.body;
    const userId = req.user._id;

    // Admin role check would go here
    // For now, only allow refunds on user's own orders

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Order is not paid or already refunded' });
    }

    if (!order.zohoPaymentId) {
      return res.status(400).json({ error: 'No payment ID found for refund' });
    }

    const refundData = {
      amount: refundAmount || order.total,
      reason: reason || 'Customer requested refund',
      orderId: order._id.toString(),
      receipt: `refund_${order.orderNumber}_${Date.now()}`
    };

    // Process refund through Zoho
    const refundResult = await zohoPayments.processRefund(order.zohoPaymentId, refundData);

    // Update order
    order.paymentStatus = 'refunded';
    order.refundedAt = new Date();
    order.refundAmount = refundResult.amount;
    order.refundReason = reason || 'Customer requested refund';
    await order.updateStatus('refunded', `Refund processed: ₹${refundResult.amount}`);

    res.json({
      success: true,
      refund: refundResult,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Refund processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process refund',
      message: error.message 
    });
  }
});

/**
 * GET /api/payments/methods
 * Get available payment methods
 */
router.get('/methods', (req, res) => {
  try {
    const paymentMethods = zohoPayments.getPaymentMethods();
    
    // Add Cash on Delivery
    paymentMethods.push({
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      fees: '₹25 handling fee'
    });

    res.json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

/**
 * GET /api/payments/order/:orderId/status
 * Get payment status for an order
 */
router.get('/order/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId })
      .select('paymentStatus paymentMethod zohoPaymentId zohoOrderId paidAt refundedAt refundAmount');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const paymentInfo = {
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      zohoPaymentId: order.zohoPaymentId,
      zohoOrderId: order.zohoOrderId,
      paidAt: order.paidAt,
      refundedAt: order.refundedAt,
      refundAmount: order.refundAmount
    };

    res.json({
      success: true,
      payment: paymentInfo
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

export default router;