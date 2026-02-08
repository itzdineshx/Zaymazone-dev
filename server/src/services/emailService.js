/**
 * Email notification service for order updates
 * This is a basic template - integrate with your preferred email service
 * (SendGrid, AWS SES, Nodemailer, etc.)
 */

class EmailService {
  constructor() {
    this.isEnabled = process.env.EMAIL_ENABLED === 'true';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@zaymazone.com';
    this.companyName = 'Zaymazone';
  }

  /**
   * Send order confirmation email
   * @param {Object} order - Order details
   * @param {Object} user - User details
   */
  async sendOrderConfirmation(order, user) {
    if (!this.isEnabled) {
      console.log('Email service disabled - Order confirmation:', {
        to: user.email,
        orderNumber: order.orderNumber,
        total: order.total
      });
      return;
    }

    const subject = `Order Confirmation - ${order.orderNumber}`;
    const template = this.getOrderConfirmationTemplate(order, user);

    await this.sendEmail({
      to: user.email,
      subject,
      html: template,
      data: {
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.items
      }
    });
  }

  /**
   * Send order status update email
   * @param {Object} order - Order details
   * @param {Object} user - User details
   * @param {string} newStatus - New order status
   * @param {Object} trackingInfo - Tracking information
   */
  async sendOrderStatusUpdate(order, user, newStatus, trackingInfo = {}) {
    if (!this.isEnabled) {
      console.log('Email service disabled - Status update:', {
        to: user.email,
        orderNumber: order.orderNumber,
        status: newStatus,
        trackingNumber: trackingInfo.trackingNumber
      });
      return;
    }

    const subject = `Order ${newStatus} - ${order.orderNumber}`;
    const template = this.getOrderStatusTemplate(order, user, newStatus, trackingInfo);

    await this.sendEmail({
      to: user.email,
      subject,
      html: template,
      data: {
        orderNumber: order.orderNumber,
        status: newStatus,
        trackingNumber: trackingInfo.trackingNumber,
        courierService: trackingInfo.courierService
      }
    });
  }

  /**
   * Send payment confirmation email
   * @param {Object} order - Order details
   * @param {Object} user - User details
   * @param {Object} paymentDetails - Payment details
   */
  async sendPaymentConfirmation(order, user, paymentDetails) {
    if (!this.isEnabled) {
      console.log('Email service disabled - Payment confirmation:', {
        to: user.email,
        orderNumber: order.orderNumber,
        paymentId: paymentDetails.paymentId
      });
      return;
    }

    const subject = `Payment Received - ${order.orderNumber}`;
    const template = this.getPaymentConfirmationTemplate(order, user, paymentDetails);

    await this.sendEmail({
      to: user.email,
      subject,
      html: template,
      data: {
        orderNumber: order.orderNumber,
        paymentId: paymentDetails.paymentId,
        amount: order.total
      }
    });
  }

  /**
   * Send refund notification email
   * @param {Object} order - Order details
   * @param {Object} user - User details
   * @param {Object} refundDetails - Refund details
   */
  async sendRefundNotification(order, user, refundDetails) {
    if (!this.isEnabled) {
      console.log('Email service disabled - Refund notification:', {
        to: user.email,
        orderNumber: order.orderNumber,
        refundAmount: refundDetails.amount
      });
      return;
    }

    const subject = `Refund Processed - ${order.orderNumber}`;
    const template = this.getRefundNotificationTemplate(order, user, refundDetails);

    await this.sendEmail({
      to: user.email,
      subject,
      html: template,
      data: {
        orderNumber: order.orderNumber,
        refundAmount: refundDetails.amount,
        refundId: refundDetails.refundId
      }
    });
  }

  /**
   * Core email sending method - implement with your email service
   * @param {Object} emailData - Email data
   */
  async sendEmail(emailData) {
    try {
      // TODO: Implement with your preferred email service
      // Examples:
      
      // SendGrid:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send(emailData);

      // AWS SES:
      // const AWS = require('aws-sdk');
      // const ses = new AWS.SES({ region: 'us-east-1' });
      // await ses.sendEmail(emailData).promise();

      // Nodemailer:
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransporter({ ... });
      // await transporter.sendMail(emailData);

      console.log('Email sent successfully:', {
        to: emailData.to,
        subject: emailData.subject
      });

    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Get order confirmation email template
   */
  getOrderConfirmationTemplate(order, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.companyName}</h1>
            <h2>Order Confirmation</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! We've received your order and it's being processed.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹${order.total.toLocaleString()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
              
              <h4>Items Ordered:</h4>
              ${order.items.map(item => `
                <p>• ${item.name} - Qty: ${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}</p>
              `).join('')}
              
              <h4>Shipping Address:</h4>
              <p>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.addressLine1 || order.shippingAddress.street}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                ${order.shippingAddress.country}
              </p>
            </div>
            
            <p>We'll send you another email when your order ships.</p>
            <p>Thank you for supporting our artisans!</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get order status update email template
   */
  getOrderStatusTemplate(order, user, status, trackingInfo) {
    const statusMessages = {
      'confirmed': 'Your order has been confirmed and is being prepared.',
      'processing': 'Your order is currently being processed.',
      'packed': 'Your order has been packed and is ready to ship.',
      'shipped': 'Great news! Your order has been shipped.',
      'out_for_delivery': 'Your order is out for delivery.',
      'delivered': 'Your order has been delivered successfully!',
      'cancelled': 'Your order has been cancelled.',
      'returned': 'Your order has been returned.',
      'refunded': 'Your refund has been processed.'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B4513; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status-update { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #8B4513; }
          .tracking { background: #e8f5e8; padding: 10px; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.companyName}</h1>
            <h2>Order Update</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            
            <div class="status-update">
              <h3>Order ${order.orderNumber} - ${status.replace('_', ' ').toUpperCase()}</h3>
              <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
            </div>
            
            ${trackingInfo.trackingNumber ? `
              <div class="tracking">
                <h4>Tracking Information</h4>
                <p><strong>Tracking Number:</strong> ${trackingInfo.trackingNumber}</p>
                ${trackingInfo.courierService ? `<p><strong>Courier:</strong> ${trackingInfo.courierService}</p>` : ''}
              </div>
            ` : ''}
            
            <p>You can track your order status anytime by visiting your orders page.</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get payment confirmation email template
   */
  getPaymentConfirmationTemplate(order, user, paymentDetails) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .payment-details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.companyName}</h1>
            <h2>Payment Received</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>We've successfully received your payment for order ${order.orderNumber}.</p>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Payment ID:</strong> ${paymentDetails.paymentId}</p>
              <p><strong>Amount:</strong> ₹${order.total.toLocaleString()}</p>
              <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>Your order is now confirmed and will be processed soon.</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get refund notification email template
   */
  getRefundNotificationTemplate(order, user, refundDetails) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Refund Processed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6c757d; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .refund-details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${this.companyName}</h1>
            <h2>Refund Processed</h2>
          </div>
          
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Your refund for order ${order.orderNumber} has been processed.</p>
            
            <div class="refund-details">
              <h3>Refund Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Refund ID:</strong> ${refundDetails.refundId}</p>
              <p><strong>Refund Amount:</strong> ₹${refundDetails.amount.toLocaleString()}</p>
              <p><strong>Refund Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <p>The refund will be credited to your original payment method within 5-7 business days.</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2024 ${this.companyName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();